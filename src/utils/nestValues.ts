export default function getNestedValue(obj: Record<string, unknown>, path: string) {
  return path.split('.').reduce((o, p) => (o || {})[p], obj)
}
