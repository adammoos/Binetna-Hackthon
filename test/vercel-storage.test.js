const { test } = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const http = require("node:http");
const net = require("node:net");
const path = require("node:path");
const { once } = require("node:events");

const projectRoot = path.resolve(__dirname, "..");
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function unusedPort() {
  const probe = net.createServer();
  probe.listen(0, "127.0.0.1");
  await once(probe, "listening");
  const { port } = probe.address();
  await new Promise((resolve, reject) => probe.close((error) => error ? reject(error) : resolve()));
  return port;
}

async function startApp(port, redisUrl) {
  const child = spawn(process.execPath, [path.join(projectRoot, "server.js")], {
    cwd: projectRoot,
    env: {
      ...process.env,
      PORT: String(port),
      VERCEL: "1",
      AI_PROVIDER: "local",
      UPSTASH_REDIS_REST_URL: redisUrl,
      UPSTASH_REDIS_REST_TOKEN: "synthetic-test-token",
    },
    stdio: "ignore",
  });

  for (let attempt = 0; attempt < 50; attempt++) {
    if (child.exitCode !== null) throw new Error("App process exited before becoming ready");
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/health`);
      if (response.ok) return child;
    } catch {}
    await wait(100);
  }
  child.kill();
  throw new Error("App did not become ready in time");
}

async function stopApp(child) {
  if (!child || child.exitCode !== null) return;
  child.kill();
  await Promise.race([once(child, "exit"), wait(3000)]);
}

async function jsonRequest(url, options) {
  const response = await fetch(url, options);
  return { response, body: await response.json() };
}

test("Upstash-backed account and session survive a Vercel function restart", async () => {
  const values = new Map();
  const redis = http.createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    const [command, ...args] = JSON.parse(body);
    let result;

    if (command === "PING") result = "PONG";
    else if (command === "GET") result = values.get(args[0]) ?? null;
    else if (command === "SET") {
      const [key, value, ...options] = args;
      if (options.includes("NX") && values.has(key)) result = null;
      else {
        values.set(key, value);
        result = "OK";
      }
    } else if (command === "EVAL") {
      const [, , key, token] = args;
      result = values.get(key) === token ? (values.delete(key), 1) : 0;
    } else {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Unsupported synthetic command" }));
      return;
    }

    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ result }));
  });

  redis.listen(0, "127.0.0.1");
  await once(redis, "listening");
  const redisUrl = `http://127.0.0.1:${redis.address().port}`;
  const appPort = await unusedPort();
  const baseUrl = `http://127.0.0.1:${appPort}`;
  let child;

  try {
    child = await startApp(appPort, redisUrl);
    const health = await jsonRequest(`${baseUrl}/api/health`);
    assert.equal(health.response.status, 200);
    assert.equal(health.body.storage, "upstash");

    const username = `demo_${Date.now()}`;
    const credentials = { username, password: "synthetic-password-123", name: "Demo" };
    const created = await jsonRequest(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(credentials),
    });
    assert.equal(created.response.status, 200);
    assert.ok(created.body.token);

    await stopApp(child);
    child = await startApp(appPort, redisUrl);
    const bootstrap = await jsonRequest(`${baseUrl}/api/bootstrap`, {
      headers: { authorization: `Bearer ${created.body.token}` },
    });
    assert.equal(bootstrap.response.status, 200);
    assert.equal(bootstrap.body.me.username, username);

    const login = await jsonRequest(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(credentials),
    });
    assert.equal(login.response.status, 200);
    assert.ok(login.body.token);
  } finally {
    await stopApp(child);
    await new Promise((resolve) => redis.close(resolve));
  }
});
