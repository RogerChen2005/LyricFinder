const { artist_album, artists, search, song_url_v1, song_detail, login_qr_key, login_qr_create, login_qr_check, user_account, user_playlist, playlist_track_all, playlist_detail, album } = require("./api.js")
const { download, get_folder_songs } = require('./download.js')
const fs = require('fs');
const cookie = String(fs.readFileSync("./cookies/cookie.txt"));

function artists_conv(obj) {
    let data = [];
    for (let i of obj) {
        data.push({
            name: i.name,
            id: i.id
        });
    }
    return data;
}

async function search_all(res, query) {
    let songs = [], albums = [], lists = [], artists = [];
    let result = await search({
        keywords: query.key,
        type: 1018
    });
    let moreText = {};
    if (result.body.result.song) {
        for (let i of result.body.result.song.songs) {
            songs.push({
                id: i.id,
                title: i.name,
                album: {
                    name: i.al.name,
                    id: i.al.id
                },
                artists: artists_conv(i.ar),
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
    if (result.body.result.artist) {
        for (let i of result.body.result.artist.artists) {
            artists.push({
                id: i.id,
                name: i.name,
                cover_img: i.img1v1Url,
            });
        }
        moreText.artist = result.body.result.artist.moreText;
    }
    res.status(200);
    return JSON.stringify({
        songs, lists, albums, artists, moreText
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
    res.status(200);
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
    res.status(200);
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
        type: 1
    });
    for (let i of result.body.result.songs) {
        data.push({
            id: i.id,
            title: i.name,
            album: i.album.name,
            artists: artists_conv(i.artists)
        });
    }
    res.status(200);
    return JSON.stringify({
        songs: data,
        count: result.body.result.songCount
    })
}

async function search_artist(res, query) {
    let data = [];
    let result = await search({
        keywords: query.key,
        offset: query.offset,
        limit: 30,
        type: 100
    });
    for (let i of result.body.result.artists) {
        data.push({
            id: i.id,
            name: i.name,
            img: i.img1v1Url,
        });
    }
    res.status(200);
    return JSON.stringify({
        artists: data,
        count: result.body.result.artistCount
    })
}

async function get_song_detail(res, query) {
    let result = await song_detail({
        ids: query.id
    });
    let data = result.body.songs[0]
    res.status(200);
    return JSON.stringify({
        id: data.id,
        title: data.name,
        artists: artists_conv(data.ar),
        album:{
            id:data.al.id,
            name:data.al.name,
            cover:data.al.picUrl
        } 
    });
}

async function get_song_url(res, query) {
    let result = await song_url_v1({
        id: query.id,
        level: query.level,
        cookie: cookie
    });
    res.status(200);
    return JSON.stringify(result.body.data[0]);
}

async function generate_qr_code(res, query) {
    let key = await login_qr_key();
    let result = await login_qr_create({
        "key": key.body.data.unikey,
        "qrimg": true
    });
    res.status(200);
    return JSON.stringify({
        "key": key.body.data.unikey,
        "qrimg": result.body.data.qrimg
    });
}

async function qr_check(res, query) {
    let result = await login_qr_check({
        "key": query.key
    });
    if (result) {
        res.status(200);
        return JSON.stringify({
            "code": result.body.code,
            "cookie": result.body.cookie
        });
    }
    else{
        res.status(500);
        return'';
    }
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
    res.status(200);
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
            artists: artists_conv(i.ar),
            album: {
                name: i.al.name,
                id: i.al.id,
                cover: i.al.picUrl
            },
        });
    }
    res.status(200);
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
            let artists = [];
            for (let j of i.ar) {
                artists.push({
                    name: j.name,
                    id: j.id,
                })
            }
            data.push({
                title: i.name,
                id: i.id,
                artists: artists_conv(i.ar),
                album: {
                    name: i.al.name,
                    id: i.al.id,
                    cover: i.al.picUrl
                },
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
        res.status(500);
    }
}

async function artist_info(res, query) {
    try {
        let result = await artists({
            id: query.id
        });
        let body = result.body;
        let artist = body.artist;
        let data = [];
        for (let i of body.hotSongs) {
            data.push({
                id: i.id,
                title: i.name,
                album: {
                    name: i.al.name,
                    id: i.al.id
                },
                artists: artists_conv(i.ar),
            })
        }
        res.status(200);
        return JSON.stringify({
            info: {
                name: artist.name,
                id: artist.id,
                pic: artist.picUrl,
                description: artist.briefDesc,
            },
            songs: data,
        });
    } catch (e) {
        console.log(e);
        res.status(500);
    }
}

async function get_artist_album(res, query) {
    let data = [];
    let result = await artist_album({
        id: query.id,
        offset: query.offset,
        limit: 30,
    });
    for (let i of result.body.hotAlbums) {
        data.push({
            id: i.id,
            name: i.name,
            cover_img: i.picUrl,
            count: i.size,
            artist: i.artist.name,
        });
    }
    res.status(200);
    return JSON.stringify({
        albums: data,
        count: result.body.artist.albumSize,
    })
}

module.exports = {
    search_all, search_list, search_song, search_album, search_artist,
    get_song_url, get_artist_album, get_song_detail,
    generate_qr_code, qr_check, user_inf, get_playlist,
    get_list_song, get_folder_songs, songlist_detail,
    get_album, artist_info,
}