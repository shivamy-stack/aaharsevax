import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

export async function createApp() {
  const app = express();
  const httpServer = createServer(app);

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        (req as any).rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      // @ts-ignore
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        console.log(logLine);
      }
    });

    next();
  });

  await registerRoutes(httpServer as any, app);

  app.get('/api', (_req: Request, res: Response) => {
    const accept = (_req.headers.accept || '').toLowerCase();
    const info = {
      name: process.env.npm_package_name || 'aaharsevax',
      version: process.env.npm_package_version || '1.0.0',
      endpoints: ['/api/donations', '/api/ngo-requests', '/api/inventory', '/api/users']
    };

    if (accept.includes('text/html')) {
      return res
        .status(200)
        .send(`<!doctype html><html><head><meta charset="utf-8"><title>API - ${info.name}</title></head><body><h1>${info.name} API</h1><p>Available endpoints:</p><ul>${info.endpoints.map(e=>`<li><a href="${e}">${e}</a></li>`).join('')}</ul></body></html>`);
    }

    return res.status(200).json(info);
  });

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

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    try {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    } catch (err) {
      console.error("Failed to setup Vite:", err);
    }
  }

  return { app, httpServer };
}

export default createApp;
