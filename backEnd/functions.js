const { search, song_url_v1, song_detail, login_qr_key, login_qr_create, login_qr_check, user_account, user_playlist, playlist_track_all } = require("./api.js")
const {download} = require('./download.js')

async function search_query(query) {
    let data = [];
    let result = await search({
        keywords: query.key,
        offset: query.offset,
        limit: 30
    });
    for (let i of result.body.result.songs) {
        let artists=[];
        for(j of i.artists){
            artists.push(i.name);
        }
        data.push({
            id: i.id,
            title: i.name,
            album: i.album.name,
            artists: artists.join(','),
        });
    }
    return JSON.stringify({
        songs:data,
        count:result.body.result.songCount
    })
}

async function get_song_detail(query) {
    let result = await song_detail({
        ids: query.id
    });
    let res = result.body.songs[0]
    let artists=[];
    for(i of res.artists){
        artists.push(i.name);
    }
    return JSON.stringify({
        id:res.id,
        title:res.name,
        artists:artists.join(','),
        album:res.al.name,
        alnum_img:res.al.picUrl
    });
}

async function get_song_url(query) {
    let result = await song_url_v1({
        id: query.id,
        level: query.level
    });
    return JSON.stringify(result.body.data[0]);
}

async function generate_qr_code(query) {
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

async function qr_check(query) {
    let result = await login_qr_check({
        "key": query.key
    });
    return JSON.stringify({
        "code": result.body.code,
        "cookie": result.body.cookie
    });
}

async function user_inf(query) {
    let result = await user_account({
        cookie: query.cookie
    });
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

async function get_playlist(query) {
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

async function get_list_song(query) {
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

async function download_query(query){
    download(query.queue,query.options);
    return "{}";
}

module.exports = {
    "search_query": search_query,
    "get_song_url": get_song_url,
    "get_song_detail": get_song_detail,
    "generate_qr_code": generate_qr_code,
    "qr_check": qr_check,
    "user_inf": user_inf,
    "get_playlist": get_playlist,
    "get_list_song": get_list_song
}