const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

function parseTime(timeStr: string): number {
  const [time, period] = timeStr.split(' ')
  const [rawHours, minutes] = time.split(':').map(Number)
  let hours = rawHours
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return hours * 60 + minutes
}

export function isShopOpen(shop: { opening_hours: Record<string, string> }): boolean {
  const now = new Date()
  const day = days[now.getDay()]
  const hours = shop.opening_hours[day]

  if (!hours || hours === 'Closed') return false

  const parts = hours.split('–').map((s) => s.trim())
  if (parts.length !== 2) return false

  const openMin = parseTime(parts[0])
  const closeMin = parseTime(parts[1])
  const nowMin = now.getHours() * 60 + now.getMinutes()

  return nowMin >= openMin && nowMin < closeMin
}
