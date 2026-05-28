import { artists_conv } from './artists'
import type { SongRef, DiscoverList } from '../types'

interface DiscoverData {
  lists: DiscoverList[]
  songs: SongRef[]
}

const procs: Record<string, (src: any, dist: DiscoverData) => void> = {
  list(src, dist) {
    const res = src.resources[0]
    dist.lists.push({
      name: res.uiElement.mainTitle.title,
      cover_img: res.uiElement.image.imageUrl,
      id: res.resourceId,
    })
  },

  SONG_LIST_HOMEPAGE(src, dist) {
    for (const resource of src.resources) {
      if (resource.resourceType === 'song') {
        const info = resource.resourceExtInfo.song
        dist.songs.push({
          id: info.id,
          title: info.name,
          artists: artists_conv(info.ar),
          album: {
            id: info.al.id,
            name: info.al.name,
            cover: info.al.picUrl,
          },
        })
      }
    }
  },
}

export function homepage_format(src: any): DiscoverData {
  const resp: DiscoverData = { lists: [], songs: [] }
  if (src.blocks) {
    for (const block of src.blocks) {
      if (block.creatives) {
        for (const creative of block.creatives) {
          const proc = procs[creative.creativeType]
          if (typeof proc === 'function') {
            proc(creative, resp)
          }
        }
      }
    }
  }
  return resp
}
