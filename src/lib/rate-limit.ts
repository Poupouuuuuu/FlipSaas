const rateMap = new Map<string, { count: number; resetTime: number }>()

interface RateLimitResult {
  success: boolean
  remaining: number
}

/**
 * Simple in-memory rate limiter.
 * @param key - Unique key (e.g. user ID or IP)
 * @param limit - Max requests per window
 * @param windowMs - Time window in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const now = Date.now()
  const entry = rateMap.get(key)

  if (!entry || now > entry.resetTime) {
    rateMap.set(key, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 }
  }

  entry.count++
  return { success: true, remaining: limit - entry.count }
}

// Nettoyage périodique pour éviter les fuites mémoire (toutes les 5 min)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateMap) {
      if (now > entry.resetTime) {
        rateMap.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}
