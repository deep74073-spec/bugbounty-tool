const axios = require("axios");

async function detectTechnologies(targetUrl) {
  const response = await axios.get(targetUrl, {
    timeout: 10000,
    maxRedirects: 5,
    validateStatus: () => true
  });

  const headers = Object.fromEntries(
    Object.entries(response.headers).map(([key, value]) => [
      key.toLowerCase(),
      String(value)
    ])
  );

  const body = typeof response.data === "string"
    ? response.data
    : "";

  const technologies = [];

  function add(name, source) {
    if (!technologies.some(item => item.name === name)) {
      technologies.push({ name, source });
    }
  }

  if (headers.server) {
    const server = headers.server.toLowerCase();

    if (server.includes("cloudflare")) {
      add("Cloudflare", "Server header");
    }

    if (server.includes("nginx")) {
      add("Nginx", "Server header");
    }

    if (server.includes("apache")) {
      add("Apache", "Server header");
    }
  }

  if (headers["x-powered-by"]) {
    add(headers["x-powered-by"], "X-Powered-By header");
  }

  const generators = body.match(
    /<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)["']/i
  );

  if (generators) {
    add(generators[1], "HTML generator meta tag");
  }

  if (/__next_data__|_next\/static/i.test(body)) {
    add("Next.js", "HTML indicator");
  }

  if (/wp-content|wp-includes/i.test(body)) {
    add("WordPress", "HTML indicator");
  }

  if (/data-reactroot|react-dom/i.test(body)) {
    add("React", "HTML indicator");
  }

  return {
    url: targetUrl,
    status: response.status,
    technologies
  };
}

module.exports = {
  detectTechnologies
};
