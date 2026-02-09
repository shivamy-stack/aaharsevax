import createApp from "../server/app";

let cachedApp: any = null;

async function getApp() {
  if (cachedApp) return cachedApp;
  const created = await createApp();
  cachedApp = created.app;
  return cachedApp;
}

export default async function handler(req: any, res: any) {
  const app = await getApp();
  // Express apps are callable as functions: (req, res)
  return app(req, res);
}
