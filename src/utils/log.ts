const isDebugLogEnabled = true;
export function log(message: string): void {
  if (!isDebugLogEnabled) return;
  console.log(`[esa-premix] ${message}`);
}
