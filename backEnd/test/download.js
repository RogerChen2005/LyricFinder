const fs = require('fs');
const path = require('path');
const { lyric, song_url_v1,song_detail} = require('../api.js');
const request = require('request');
const taglib = require('node-taglib-sharp');
const axios =require('axios');
const sharp = require('sharp');

taglib.Id3v2Settings.forceDefaultVersion=true;
taglib.Id3v2Settings.defaultVersion=3;

let settings = {
    classify: false,
    mode:0, //0: ar - title 1: title - ar
    path: 'C:/Users/admin/Music'
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
    let filename = options.mode?`${query.artists} - ${query.title}`:`${query.title} - ${query.artists}`;
    filname = options.classify === true ? path.join(type, filename + ext) : filename + ext;
    filename = str.replace(/\//g, "_");
    filename = filename.replace(/\*/g, "＊");
    filename = filename.replace(/:/g, "：");
    return path.join(options.path,filename);
}

async function lyric_download(query, options,callback) {
    let result = await lyric({
        id: query.id
    })
    let save_path = create_file_name(query,options,'lyric','lrc');
    if(result.body.tlyric.version=0){
        fs.writeFileSync(save_path, JSON.stringify(result.body));
    }
    else{
        let lyric = result.body.lrc.lyric.split('\n');
        let tlytic = result.body.tlyric.lyric.split('\n');
        if(Number(tlyric[0][1])===NaN){
            tlytic=tlytic.slice(1);
        }
    }
}

async function music_download(query, options ,callback) {
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
                 fs.writeFileSync(path.join(options.path,create_file_name(name+".jpg")),body.data);
                 callback();
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
            dest.tag.performers = query.artists;
            dest.save();
            dest.dispose();
        });
    });
}

function download_cover_only(query,options,callback){
    axios({
        url: query.album_img,
        method: 'GET',
        responseType: 'arraybuffer'
    }).then(async (body) => {
        fs.writeFileSync(create_file_name(query,options,'cover','.jpg'),body.data);
    })
}

async function download(queue){
    
}

lyric_download({
    id: 563733684,
}, settings)