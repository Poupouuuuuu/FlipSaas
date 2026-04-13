// Subscription statuses that grant full access
const ACTIVE_STATUSES = ['active', 'trialing']

export function isSubscriptionActive(status: string | null): boolean {
  if (!status) return false
  return ACTIVE_STATUSES.includes(status)
}

// past_due = payment failed but Stripe hasn't canceled yet
// User keeps access for a grace period (configurable in Stripe)
export function isSubscriptionGracePeriod(status: string | null): boolean {
  return status === 'past_due'
}

export function hasFullAccess(status: string | null, role: string | null): boolean {
  if (role === 'admin') return true
  return isSubscriptionActive(status) || isSubscriptionGracePeriod(status)
}
