export interface ArtistRef {
  name: string
  id: number
}

export interface AlbumRef {
  name: string
  id: number
  cover?: string
}

export interface SongRef {
  id: number
  title: string
  artists: ArtistRef[]
  album: AlbumRef
}

export interface SearchAlbum {
  id: number
  name: string
  cover_img: string
  count: number
  artist: string
}

export interface SearchPlaylist {
  id: number
  name: string
  cover_img: string
  creator: string
  count: number
}

export interface SearchArtist {
  id: number
  name: string
  img?: string
}

export interface SongUrlResult {
  id: number
  url: string
  type: string
  [key: string]: any
}

export interface QRCodeResult {
  key: string
  qrimg: string
}

export interface QRCheckResult {
  code: number
  cookie: string
}

export interface UserInfo {
  userid: number
  nickname: string
  avatarUrl: string
  backgroundUrl: string
  signature: string
  isvip: boolean
  status: number
}

export interface PlaylistItem {
  list_name: string
  id: number
  img_url: string
  count: number
}

export interface PlaylistDetail {
  name: string
  cover_img: string
  create_time: number
  count: number
  description: string
}

export interface AlbumDetail {
  name: string
  cover_img: string
  create_time: number
  count: number
  description: string
}

export interface ArtistDetail {
  name: string
  id: number
  pic: string
  description: string
}

export interface DiscoverList {
  name: string
  cover_img: string
  id: number
}

export interface DiscoverResult {
  lists: DiscoverList[]
  songs: SongRef[]
}

export interface DownloadOptions {
  level?: string
  mode?: boolean
  use_origin_name?: boolean
  tlyric?: boolean
}

export interface DownloadQuery {
  id: number
  title?: string
  artists?: string
  album?: string
  album_img?: string
  origin_name?: string
}

export interface FuncPayload {
  target: string
  data: Record<string, any>
}

export interface DownloadPayload {
  target: string
  data: any
}

export interface FilePayload {
  filename: string
}
