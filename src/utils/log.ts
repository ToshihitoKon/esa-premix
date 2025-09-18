import { loadSettings } from "./settings.ts";

export async function log(message: string): void {
  const settings = await loadSettings();
  if (!settings.debuglog) return;
  console.log(`[esa-premix] ${message}`);
}
