import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const cwd = process.cwd();
  const clientsPath = path.join(cwd, "clients");
  let dirs: string[] = [];
  let err = "";
  try {
    dirs = await fs.readdir(clientsPath);
  } catch (e) {
    err = String(e);
  }
  return Response.json({ cwd, clientsPath, dirs, err });
}
