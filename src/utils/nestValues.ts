/* eslint-disable @typescript-eslint/no-explicit-any */
export default function getNestedValue(obj: Record<string, unknown>, path: string) {
  return path.split('.').reduce((o, p) => ((o || {}) as any)[p], obj) as unknown
}
