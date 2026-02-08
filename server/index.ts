import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  // Provide a lightweight API index and a simple `/api/users` endpoint
  // Content-negotiation: return HTML for browsers (Accept: text/html)
  // and JSON for API tools (curl/postman with Accept: application/json).
  app.get('/api', (_req: Request, res: Response) => {
    const accept = (_req.headers.accept || '').toLowerCase();
    const info = {
      name: process.env.npm_package_name || 'aaharsevax',
      version: process.env.npm_package_version || process.env.npm_package_version || '1.0.0',
      endpoints: ['/api/donations', '/api/ngo-requests', '/api/inventory', '/api/users']
    };

    if (accept.includes('text/html')) {
      return res
        .status(200)
        .send(`<!doctype html><html><head><meta charset="utf-8"><title>API - ${info.name}</title></head><body><h1>${info.name} API</h1><p>Available endpoints:</p><ul>${info.endpoints.map(e=>`<li><a href="${e}">${e}</a></li>`).join('')}</ul></body></html>`);
    }

    return res.status(200).json(info);
  });

  // Minimal `/api/users` route so tools and browsers get a stable response.
  // Returns HTML for browsers and JSON for API clients.
  app.get('/api/users', (_req: Request, res: Response) => {
    const accept = (_req.headers.accept || '').toLowerCase();
    const users: Array<{ id: number; name: string }> = [];

    if (accept.includes('text/html')) {
      return res
        .status(200)
        .send(`<!doctype html><html><head><meta charset="utf-8"><title>Users - ${process.env.npm_package_name || 'aaharsevax'}</title></head><body><h1>Users</h1><p>No users yet.</p></body></html>`);
    }

    return res.status(200).json(users);
  });

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // VERCEL COMPATIBILITY NOTE:
  // Vercel Functions serve both the Express API and static client files.
  // We listen on localhost:PORT because Vercel's routing handles external access.
  // This is the standard pattern for serverless Node.js applications on Vercel.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(port, "localhost", () => {
      log(`serving on port ${port}`);
    });
})();
