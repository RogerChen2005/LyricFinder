const { json } = require("express");
const {search,lyric,song_detail,song_url_v1,login_qr_key,login_qr_create,user_account,user_playlist,playlist_track_all} = require("../api")
const fs = require("fs");
const path = require("path");
const { cookie } = require("request");

async function search_query(query){
    let result = await search({
        keywords:query.key,
        limit:5
    });
    fs.writeFileSync(path.join(__dirname,"result.json"),JSON.stringify(result));
}
async function get_song_detail(query){
    let result = await song_detail({
        ids:query.id
    });
    fs.writeFileSync(path.join(__dirname,"result.json"),JSON.stringify(result));
} 

async function get_song_url(query){
    let result = await song_url_v1({
        id:query.id,
        level:query.level,
        cookie:query.cookie
    });
    fs.writeFileSync(path.join(__dirname,"result.json"),JSON.stringify(result));
}

async function get_qr_code_key(){
    let result = await login_qr_key();
    fs.writeFileSync(path.join(__dirname,"result.json"),JSON.stringify(result));
}

async function get_qr_code_create(){
    let key = await login_qr_key();
    let result = await login_qr_create({
        "key":key.body.data.unikey,
        "qrimg":true
    });
    fs.writeFileSync(path.join(__dirname,"result.json"),JSON.stringify(result));
}

async function user_inf(query){
    let result = await user_account({
        cookie:query.cookie
    });
    fs.writeFileSync(path.join(__dirname,"result.json"),JSON.stringify(result));
}

async function get_user_playlist(query){
    let result = await user_playlist({
        uid:query.uid
    });
    fs.writeFileSync(path.join(__dirname,"result.json"),JSON.stringify(result));
}

async function get_list_song(query){
    let result = await playlist_track_all({
        id:query.id,
    })
    fs.writeFileSync(path.join(__dirname,"result.json"),JSON.stringify(result));
}

async function get_lyric(query){
    let result = await lyric({
        id: query.id
    })
    fs.writeFileSync(path.join(__dirname,"result.json"),JSON.stringify(result));
}


search_query({
    key:"12"
})