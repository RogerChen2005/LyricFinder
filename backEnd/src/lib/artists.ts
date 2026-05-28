import type { ArtistRef } from '../types'

export function artists_conv(obj: Array<{ name: string; id: number }>): ArtistRef[] {
  return obj.map((i) => ({ name: i.name, id: i.id }))
}
