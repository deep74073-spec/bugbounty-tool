# BugBounty Toolkit Report

- Target: https://example.com
- Completed: 2026-09-26T12:56:09.159Z

## Results

### httpSecurity

- Status: Success

```json
{
  "url": "https://example.com",
  "status": 200,
  "finalUrl": "https://example.com/",
  "securityHeaders": {
    "strict-transport-security": false,
    "content-security-policy": false,
    "x-content-type-options": false,
    "x-frame-options": false,
    "referrer-policy": false,
    "permissions-policy": false
  }
}
```

### tls

- Status: Success

```json
{
  "hostname": "example.com",
  "protocol": "TLSv1.3",
  "authorized": true,
  "authorizationError": null,
  "certificate": {
    "subject": {
      "CN": "example.com"
    },
    "issuer": {
      "C": "US",
      "O": "SSL Corporation",
      "CN": "Cloudflare TLS Issuing ECC CA 3"
    },
    "validFrom": "Jul 29 22:10:08 2026 GMT",
    "validTo": "Oct 27 22:17:21 2026 GMT",
    "serialNumber": "0624D0AB311558780B7D5213B9631831"
  }
}
```

### dns

- Status: Success

```json
{
  "hostname": "example.com",
  "A": [
    "172.66.147.243",
    "104.20.23.154"
  ],
  "AAAA": [
    "2606:4700:83b5:72db:f2ef:0:ef6b:ff98"
  ],
  "MX": [
    {
      "exchange": "",
      "priority": 0,
      "type": "MX"
    }
  ],
  "NS": [
    "hera.ns.cloudflare.com",
    "elliott.ns.cloudflare.com"
  ],
  "TXT": [
    [
      "_k2n1y4vw3qtb4skdx9e7dxt97qrmmq9"
    ],
    [
      "v=spf1 -all"
    ]
  ]
}
```

### cors

- Status: Success

```json
{
  "url": "https://example.com",
  "status": 200,
  "cors": {
    "accessControlAllowOrigin": null,
    "accessControlAllowCredentials": null,
    "accessControlAllowMethods": null,
    "accessControlAllowHeaders": null
  }
}
```

### securityTxt

- Status: Success

```json
{
  "url": "https://example.com/.well-known/security.txt",
  "status": 404,
  "contentType": "text/html",
  "found": false,
  "fields": {
    "contact": [],
    "policy": [],
    "expires": [],
    "encryption": [],
    "acknowledgments": []
  }
}
```

### httpMetadata

- Status: Success

```json
{
  "url": "https://example.com",
  "status": 200,
  "finalUrl": "https://example.com/",
  "responseTimeMs": 72,
  "headers": {
    "server": "cloudflare",
    "contentType": "text/html",
    "contentLength": null,
    "cacheControl": null,
    "location": null
  }
}
```

### technology

- Status: Success

```json
{
  "url": "https://example.com",
  "status": 200,
  "technologies": [
    {
      "name": "Cloudflare",
      "source": "Server header"
    }
  ]
}
```

### apiAnalysis

- Status: Success

```json
{
  "url": "https://example.com/",
  "status": 200,
  "contentType": "text/html",
  "contentLength": null,
  "server": "cloudflare",
  "responseSize": 559,
  "json": false
}
```
