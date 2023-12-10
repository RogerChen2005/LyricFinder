const { search, song_url_v1, song_detail, login_qr_key, login_qr_create, login_qr_check, user_account, user_playlist, playlist_track_all, playlist_detail, album } = require("./api.js")
const { download, get_folder_songs } = require('./download.js')
const fs = require('fs');
const cookie = String(fs.readFileSync("./cookies/cookie.txt"));

async function search_all(res, query) {
    let songs = [], albums = [], lists = [];
    let result = await search({
        keywords: query.key,
        type: 1018
    });
    let moreText = {};
    if (result.body.result.song) {
        for (let i of result.body.result.song.songs) {
            let artists = [];
            for (j of i.ar) {
                artists.push(j.name);
            }
            songs.push({
                id: i.id,
                title: i.name,
                album: i.al.name,
                artists: artists.join(','),
            });

        }
        moreText.song = result.body.result.song.moreText;
    }
    if (result.body.result.album) {
        for (let i of result.body.result.album.albums) {
            albums.push({
                id: i.id,
                name: i.name,
                cover_img: i.picUrl,
                count: i.size,
                artist: i.artist.name,
            });

        }
        moreText.album = result.body.result.album.moreText;
    }
    if (result.body.result.playList) {
        for (let i of result.body.result.playList.playLists) {
            lists.push({
                id: i.id,
                name: i.name,
                cover_img: i.coverImgUrl,
                creator: i.creator.nickname,
                count: i.trackCount,
            });
        }
        moreText.list = result.body.result.playList.moreText;
    }
    return JSON.stringify({
        songs, lists, albums, moreText
    })
}
async function search_list(res, query) {
    let data = [];
    let result = await search({
        keywords: query.key,
        offset: query.offset,
        limit: 30,
        type: 1000
    });
    for (let i of result.body.result.playlists) {
        data.push({
            id: i.id,
            name: i.name,
            cover_img: i.coverImgUrl,
            creator: i.creator.nickname,
            count: i.trackCount,
        });
    }
    return JSON.stringify({
        lists: data,
        count: result.body.result.playlistCount
    })
}
async function search_album(res, query) {
    let data = [];
    let result = await search({
        keywords: query.key,
        offset: query.offset,
        limit: 30,
        type: 10
    });
    for (let i of result.body.result.albums) {
        data.push({
            id: i.id,
            name: i.name,
            cover_img: i.picUrl,
            count: i.size,
            artist: i.artist.name,
        });
    }
    return JSON.stringify({
        albums: data,
        count: result.body.result.albumCount
    })
}
async function search_song(res, query) {
    let data = [];
    let result = await search({
        keywords: query.key,
        offset: query.offset,
        limit: 30,
        type: query.type
    });
    for (let i of result.body.result.songs) {
        let artists = [];
        for (j of i.artists) {
            artists.push(j.name);
        }
        data.push({
            id: i.id,
            title: i.name,
            album: i.album.name,
            artists: artists.join(','),
        });
    }
    return JSON.stringify({
        songs: data,
        count: result.body.result.songCount
    })
}

async function get_song_detail(res, query) {
    let result = await song_detail({
        ids: query.id
    });
    let ress = result.body.songs[0]
    let artists = [];
    for (i of ress.ar) {
        artists.push(i.name);
    }
    return JSON.stringify({
        id: ress.id,
        title: ress.name,
        artists: artists.join(','),
        album: ress.al.name,
        album_img: ress.al.picUrl
    });
}

async function get_song_url(res, query) {
    let result = await song_url_v1({
        id: query.id,
        level: query.level,
        cookie: cookie
    });
    return JSON.stringify(result.body.data[0]);
}

async function generate_qr_code(res, query) {
    let key = await login_qr_key();
    let result = await login_qr_create({
        "key": key.body.data.unikey,
        "qrimg": true
    });
    return JSON.stringify({
        "key": key.body.data.unikey,
        "qrimg": result.body.data.qrimg
    });
}

async function qr_check(res, query) {
    let result = await login_qr_check({
        "key": query.key
    });
    return JSON.stringify({
        "code": result.body.code,
        "cookie": result.body.cookie
    });
}

async function user_inf(res, query) {
    let result = await user_account({
        cookie: query.cookie
    });
    if (result.body.profile) {
        res.status(200);
        return JSON.stringify({
            userid: result.body.profile.userId,
            nickname: result.body.profile.nickname,
            avatarUrl: result.body.profile.avatarUrl,
            backgroundUrl: result.body.profile.backgroundUrl,
            signature: result.body.profile.signature,
            isvip: result.body.account.paidFee,
            status: result.body.account.status
        });
    }
    else {
        res.status(404);
        return "";
    }
}

async function get_playlist(res, query) {
    let result = [];
    for (let offset = 0; ; offset += 30) {
        let value = await user_playlist({
            uid: query.uid,
            limit: 30,
            offset: offset
        });
        for (let i of value.body.playlist) {
            result.push({
                list_name: i.name,
                id: i.id,
                img_url: i.coverImgUrl,
                count: i.trackCount
            });
        }
        if (value.body.more === false) {
            break;
        }
    }
    return JSON.stringify({
        list: result
    });
}

async function get_list_song(res, query) {
    let data = [];
    let result = await playlist_track_all({
        id: query.id,
        limit: 30,
        offset: query.offset
    })
    for (let i of result.body.songs) {
        data.push({
            title: i.name,
            id: i.id,
            artists: i.ar[0].name,
            album: i.al.name,
            album_img: i.al.picUrl
        });
    }
    return JSON.stringify({
        songs: data
    })
}

async function songlist_detail(res, query) {
    try {
        let result = await playlist_detail({
            id: query.id
        });
        let songlist = result.body.playlist;
        res.status(200);
        return JSON.stringify({
            name: songlist.name,
            cover_img: songlist.coverImgUrl,
            create_time: songlist.createTime,
            count: songlist.trackCount,
            description: songlist.description,
        });
    }
    catch (e) {
        console.log(e);
        res.status(500);
        return "";
    }
}

async function get_album(res, query) {
    try {
        let result = await album({
            id: query.id
        });
        let songlist = result.body.album;
        let data = [];
        for (let i of result.body.songs) {
            data.push({
                title: i.name,
                id: i.id,
                artists: i.ar[0].name,
                album: i.al.name,
                album_img: i.al.picUrl
            });
        }
        return JSON.stringify({
            detail: {
                name: songlist.name,
                cover_img: songlist.picUrl,
                create_time: songlist.publishTime,
                count: songlist.size,
                description: songlist.description,
            },
            songs: data
        });
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = {
    search_all, search_list, search_song, search_album,
    get_song_url,
    get_song_detail,
    generate_qr_code,
    qr_check,
    user_inf,
    get_playlist,
    get_list_song,
    get_folder_songs,
    songlist_detail,
    get_album,
}