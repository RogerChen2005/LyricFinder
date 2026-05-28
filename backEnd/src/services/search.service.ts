import { FastifyReply } from 'fastify'
import { search } from '@neteasecloudmusicapienhanced/api'
import { artists_conv } from '../lib/artists'
import type { SearchAlbum, SearchPlaylist, SearchArtist } from '../types'

export async function search_all(reply: FastifyReply, query: Record<string, any>) {
  const result = await search({ keywords: query.key, type: 1018 })
  const body = result.body as any
  const songs: any[] = []
  const albums: SearchAlbum[] = []
  const lists: SearchPlaylist[] = []
  const artistList: SearchArtist[] = []
  const moreText: Record<string, string> = {}

  if (body.result.song) {
    for (const i of body.result.song.songs) {
      songs.push({
        id: i.id,
        title: i.name,
        album: { name: i.al.name, id: i.al.id },
        artists: artists_conv(i.ar),
      })
    }
    moreText.song = body.result.song.moreText
  }
  if (body.result.album) {
    for (const i of body.result.album.albums) {
      albums.push({
        id: i.id,
        name: i.name,
        cover_img: i.picUrl,
        count: i.size,
        artist: i.artist.name,
      })
    }
    moreText.album = body.result.album.moreText
  }
  if (body.result.playList) {
    for (const i of body.result.playList.playLists) {
      lists.push({
        id: i.id,
        name: i.name,
        cover_img: i.coverImgUrl,
        creator: i.creator.nickname,
        count: i.trackCount,
      })
    }
    moreText.list = body.result.playList.moreText
  }
  if (body.result.artist) {
    for (const i of body.result.artist.artists) {
      artistList.push({
        id: i.id,
        name: i.name,
        img: i.img1v1Url,
      })
    }
    moreText.artist = body.result.artist.moreText
  }

  reply.status(200)
  return JSON.stringify({ songs, lists, albums, artists: artistList, moreText })
}

export async function search_list(reply: FastifyReply, query: Record<string, any>) {
  const result = await search({ keywords: query.key, offset: query.offset, limit: 30, type: 1000 })
  const body = result.body as any
  const data: SearchPlaylist[] = []
  for (const i of body.result.playlists) {
    data.push({
      id: i.id,
      name: i.name,
      cover_img: i.coverImgUrl,
      creator: i.creator.nickname,
      count: i.trackCount,
    })
  }
  reply.status(200)
  return JSON.stringify({ lists: data, count: body.result.playlistCount })
}

export async function search_song(reply: FastifyReply, query: Record<string, any>) {
  const result = await search({ keywords: query.key, offset: query.offset, limit: 30, type: 1 })
  const body = result.body as any
  const data: any[] = []
  for (const i of body.result.songs) {
    data.push({
      id: i.id,
      title: i.name,
      album: { name: i.album.name, id: i.album.id },
      artists: artists_conv(i.artists),
    })
  }
  reply.status(200)
  return JSON.stringify({ songs: data, count: body.result.songCount })
}

export async function search_album(reply: FastifyReply, query: Record<string, any>) {
  const result = await search({ keywords: query.key, offset: query.offset, limit: 30, type: 10 })
  const body = result.body as any
  const data: SearchAlbum[] = []
  for (const i of body.result.albums) {
    data.push({
      id: i.id,
      name: i.name,
      cover_img: i.picUrl,
      count: i.size,
      artist: i.artist.name,
    })
  }
  reply.status(200)
  return JSON.stringify({ albums: data, count: body.result.albumCount })
}

export async function search_artist(reply: FastifyReply, query: Record<string, any>) {
  const result = await search({ keywords: query.key, offset: query.offset, limit: 30, type: 100 })
  const body = result.body as any
  const data: SearchArtist[] = []
  for (const i of body.result.artists) {
    data.push({ id: i.id, name: i.name, img: i.img1v1Url })
  }
  reply.status(200)
  return JSON.stringify({ artists: data, count: body.result.artistCount })
}
