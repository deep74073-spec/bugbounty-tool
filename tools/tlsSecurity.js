const tls = require("tls");

function checkTlsSecurity(targetUrl) {
  return new Promise((resolve, reject) => {
    const url = new URL(targetUrl);

    if (url.protocol !== "https:") {
      return reject(new Error("TLS check requires an HTTPS target"));
    }

    const socket = tls.connect({
      host: url.hostname,
      port: 443,
      servername: url.hostname,
      rejectUnauthorized: false,
      timeout: 10000
    });

    socket.on("secureConnect", () => {
      const certificate = socket.getPeerCertificate();

      const result = {
        hostname: url.hostname,
        protocol: socket.getProtocol(),
        authorized: socket.authorized,
        authorizationError: socket.authorizationError || null,
        certificate: {
          subject: certificate.subject || null,
          issuer: certificate.issuer || null,
          validFrom: certificate.valid_from || null,
          validTo: certificate.valid_to || null,
          serialNumber: certificate.serialNumber || null
        }
      };

      socket.end();
      resolve(result);
    });

    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("TLS connection timed out"));
    });

    socket.on("error", (error) => {
      reject(error);
    });
  });
}

module.exports = {
  checkTlsSecurity
};
