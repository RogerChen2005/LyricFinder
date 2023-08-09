const fs = require('fs');
const path = require('path');
const { lyric, song_url_v1} = require('../api.js');
const request = require('request');
const taglib = require('node-taglib-sharp');
const axios =require('axios');
const sharp = require('sharp');
const send = require('./main.js')

taglib.Id3v2Settings.forceDefaultVersion=true;
taglib.Id3v2Settings.defaultVersion=3;

let settings = {
    classify: false,
    mode:0, //0: ar - title 1: title - ar
    path: 'C:/Users/Roger/Music'
}

const cookie = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'cookie.json'))).cookie;


function set_download_path(options) {
    if (!fs.existsSync(path.join(options.path, "download"))) {
        fs.mkdirSync(path.join(options.path, "download"), { recursive: true });
    }
    if (options.classify) {
        for(i of ['song','cover','lyric']){
            if (!fs.existsSync(path.join(options.path, "download", i))) {
                fs.mkdirSync(path.join(options.path, "download", i));
            }
        }
    }
}

function create_file_name(query,options,type,ext) {
    let filename = options.mode?`${query.title} - ${query.artists}`:`${query.artists} - ${query.title}`;
    filename = options.classify === true ? path.join(type, filename + ext) : filename + ext;
    filename = filename.replace(/\//g, "_");
    filename = filename.replace(/\*/g, "＊");
    filename = filename.replace(/:/g, "：");
    return path.join(options.path,filename);
}

function comp(t1,t2){
    if(t1.length===0) return false;
    if(t2.length===0) return true;
    let a1 = t1.split(':').map(Number),a2=t2.split(':').map(Number);
    if(a1[0] === a2[0]){
        return a1[1]<=a2[1];
    }
    else return a1[0] < a2[0];
}

function count(index){
    send('count',index);
}

async function lyric_download(queue, options,callback) {
    for(let index = 0;index<queue.length;index++){
        let query = queue[index];
        let result = await lyric({
            id: query.id
        })
        let save_path = create_file_name(query,options,'lyric','.lrc');
        if(result.body.tlyric.version==0){
            fs.writeFileSync(save_path, result.body.lrc.lyric);
        }
        else{
            let res = [];
            let lyric = result.body.lrc.lyric.split('\n');
            let tlyric = result.body.tlyric.lyric.split('\n');
            if(!Number(tlyric[0][1])){
                tlyric=tlyric.slice(1);
            }
            let start=lyric[0].indexOf('[')+1;
            let end=lyric[0].indexOf(']');
            let i=0,j=0
            for(;lyric.length>i&&tlyric.length>j;){
                let s1 = lyric[i],s2 = tlyric[j];
                if(comp(s1.slice(start,end),s2.slice(start,end))){
                    res.push(s1);
                    i++;
                }
                else{
                    res.push(s2);
                    j++;
                }
            }
            fs.writeFileSync(save_path, res.join('\n'));
           count(index);
        }
    }
}

async function music_download(queue, options ,callback) {
    for(let index = 0;index<queue.length;index++){
        let query = queue[index];
        let result = await song_url_v1({
            id: query.id,
            cookie: cookie,
            level: query.level
        })
        let url = result.body.data[0].url;
        let type = url.slice(url.lastIndexOf('.'));
        let save_path = create_file_name(query,options,'songs',type);
        let stream = fs.createWriteStream(save_path);
        request(url).pipe(stream);
        stream.on("finish", () => {
            axios({
                url: query.album_img,
                method: 'GET',
                responseType: 'arraybuffer'
            }).then(async (body) => {
                if (options.cover) {
                     fs.writeFileSync(path.join(create_file_name(query,options,'cover','.jpg')),body.data);
                     count(index);
                }
                let cover = {
                    data: taglib.ByteVector.fromByteArray(await sharp(Buffer.from(body.data)).resize(640).toBuffer()),
                    mimeType: 'image/jpeg',
                    type: taglib.PictureType.FrontCover,
                }
                let dest = taglib.File.createFromPath(save_path);
                dest.tag.pictures = [cover];
                dest.tag.title = query.title;
                dest.tag.album = query.album;
                dest.tag.performers = query.artists.split(',');
                dest.save();
                dest.dispose();
                count(index);
            });
        });
    }
}

function download_cover_only(queue,options,callback){
    for(let index = 0;index < queue.length;index++){
        let query = queue[index];
        axios({
            url: query.album_img,
            method: 'GET',
            responseType: 'arraybuffer'
        }).then(async (body) => {
            fs.writeFileSync(create_file_name(query,options,'cover','.jpg'),body.data);
            count(index);
        })
    }
}

module.exports.download =  async function(queue,options){
    if(options.song){
        music_download(queue,options);
    }
    else if(options.cover){
        download_cover_only(queue,options);
    }
    if(options.lyric){
        lyric_download(queue,options);
    }
}