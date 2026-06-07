export function buildWizardUrl(path: string, state: Record<string, unknown>): string {
  const params = new URLSearchParams()

  Object.entries(state).forEach(([key, value]) => {
    if (!value) return

    if (Array.isArray(value)) {
      if (value.length > 0) params.set(key, value.map((item) => String(item)).join(','))
      return
    }

    params.set(key, String(value))
  })

  const query = params.toString()
  return query ? `${path}?${query}` : path
}
