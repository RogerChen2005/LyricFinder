type ApiResponse = { body: any; status: number; cookie: string[] }
type ApiFn = (data: Record<string, any>) => Promise<ApiResponse>

export const lyric: ApiFn
export const homepage_block_page: ApiFn
export const artist_album: ApiFn
export const artists: ApiFn
export const search: ApiFn
export const song_url_v1: ApiFn
export const song_detail: ApiFn
export const login_qr_key: ApiFn
export const login_qr_create: ApiFn
export const login_qr_check: ApiFn
export const user_account: ApiFn
export const user_playlist: ApiFn
export const playlist_track_all: ApiFn
export const playlist_detail: ApiFn
export const album: ApiFn
export const search_suggest: ApiFn
