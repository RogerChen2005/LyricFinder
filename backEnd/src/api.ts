// Typed re-export of the existing api.js module
import apiJs = require('../api.js')

type ApiFn = (data: Record<string, any>) => Promise<{ body: any; status: number; cookie: string[] }>

export const lyric = apiJs.lyric as ApiFn
export const homepage_block_page = apiJs.homepage_block_page as ApiFn
export const artist_album = apiJs.artist_album as ApiFn
export const artists = apiJs.artists as ApiFn
export const search = apiJs.search as ApiFn
export const song_url_v1 = apiJs.song_url_v1 as ApiFn
export const song_detail = apiJs.song_detail as ApiFn
export const login_qr_key = apiJs.login_qr_key as ApiFn
export const login_qr_create = apiJs.login_qr_create as ApiFn
export const login_qr_check = apiJs.login_qr_check as ApiFn
export const user_account = apiJs.user_account as ApiFn
export const user_playlist = apiJs.user_playlist as ApiFn
export const playlist_track_all = apiJs.playlist_track_all as ApiFn
export const playlist_detail = apiJs.playlist_detail as ApiFn
export const album = apiJs.album as ApiFn
export const search_suggest = apiJs.search_suggest as ApiFn
