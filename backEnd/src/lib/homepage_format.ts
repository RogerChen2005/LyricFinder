import { artists_conv } from './artists'
import type { SongRef, DiscoverList, DiscoverSection } from '../types'

const BLOCK_MAP: Record<string, 'playlist' | 'song'> = {
  HOMEPAGE_BLOCK_PLAYLIST_RCMD: 'playlist',
  HOMEPAGE_BLOCK_STYLE_RCMD: 'song',
  HOMEPAGE_BLOCK_OLD_SUBSCRIBE_ARTIST_NEW: 'song',
  HOMEPAGE_BLOCK_MGC_PLAYLIST: 'playlist',
}

function parsePlaylistCreative(creative: any): DiscoverList | null {
  const res = creative.resources?.[0]
  if (!res?.uiElement) return null
  return {
    name: res.uiElement.mainTitle?.title ?? '',
    cover_img: res.uiElement.image?.imageUrl ?? '',
    id: res.resourceId ?? creative.creativeId ?? '',
  }
}

function parseSongCreative(creative: any): SongRef[] {
  const songs: SongRef[] = []
  for (const resource of creative.resources ?? []) {
    if (resource.resourceType !== 'song') continue
    const ext = resource.resourceExtInfo
    const info = ext?.songData ?? ext?.song
    if (!info) continue
    songs.push({
      id: info.id,
      title: info.name,
      artists: artists_conv(info.artists ?? info.ar ?? []),
      album: {
        id: (info.album ?? info.al)?.id ?? 0,
        name: (info.album ?? info.al)?.name ?? '',
        cover: (info.album ?? info.al)?.picUrl ?? '',
      },
    })
  }
  return songs
}

export function homepage_format(src: any): { sections: DiscoverSection[] } {
  const sections: DiscoverSection[] = []
  if (!src.blocks) return { sections }

  for (const block of src.blocks) {
    const sectionType = BLOCK_MAP[block.blockCode]
    if (!sectionType) continue

    const title =
      block.uiElement?.subTitle?.title ??
      block.uiElement?.mainTitle?.title ??
      ''

    if (sectionType === 'playlist') {
      const items: DiscoverList[] = []
      for (const creative of block.creatives ?? []) {
        const item = parsePlaylistCreative(creative)
        if (item) items.push(item)
      }
      if (items.length > 0) sections.push({ title, type: 'playlist', items })
    } else {
      const items: SongRef[] = []
      for (const creative of block.creatives ?? []) {
        items.push(...parseSongCreative(creative))
      }
      if (items.length > 0) sections.push({ title, type: 'song', items })
    }
  }

  return { sections }
}
