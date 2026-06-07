export function getInitials(firstName?: string, lastName?: string): string {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
}

const AVATAR_PALETTE = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#06b6d4',
]

export function getAvatarColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash * 31) + seed.charCodeAt(i)) | 0
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]
}
