const fs = require('fs');
const path = require('path');
const { lyric, song_url_v1, search } = require('./api.js');
const request = require('request');
const taglib = require('node-taglib-sharp');
const axios = require('axios');
const cookie = String(fs.readFileSync("./cookies/cookie.txt"));
const temp_path = "./temp";

taglib.Id3v2Settings.forceDefaultVersion = true;
taglib.Id3v2Settings.defaultVersion = 3;

module.exports.set_download_path = function () {
    if (!fs.existsSync(temp_path)) {
        fs.mkdirSync(temp_path, { recursive: true });
    }
}

function create_file_name(query, options, ext) {
    if (options.use_origin_name) return path.join(temp_path, query.origin_name + ext);
    let filename = options.mode ? `${query.title} - ${query.artists}` : `${query.artists} - ${query.title}`;
    filename = filename.replace(/\//g, "_");
    filename = filename.replace(/\*/g, "＊");
    filename = filename.replace(/:/g, "：");
    return `${filename}.${ext}`;
}

function comp(t1, t2) {
    if (t1.length === 0) return false;
    if (t2.length === 0) return true;
    let a1 = t1.split(':').map(Number), a2 = t2.split(':').map(Number);
    if (a1[0] === a2[0]) {
        return a1[1] <= a2[1];
    }
    else return a1[0] < a2[0];
}

module.exports.lyric_download = async function (data, res) {
    let options = data.options;
    let query = data.query;
    let result = await lyric({
        id: query.id
    })
    let save_name = create_file_name(query, options, 'lrc');
    let save_path = path.join(temp_path, save_name);
    fs.writeFileSync(save_path, JSON.stringify(result.body));
    try {
        if (options.tlyric && result.body.tlyric && result.body.tlyric.lyric) {
            let res = [];
            let lyric = result.body.lrc.lyric.split('\n');
            let tlyric = result.body.tlyric.lyric.split('\n');
            if (!Number(tlyric[0][1])) {
                tlyric = tlyric.slice(1);
            }
            let start1 = lyric[0].indexOf('[') + 1, start2 = tlyric[0].indexOf('[') + 1;
            let end1 = lyric[0].indexOf(']'), end2 = tlyric[0].indexOf(']');
            let i = 0, j = 0
            for (; lyric.length > i && tlyric.length > j;) {
                let s1 = lyric[i], s2 = tlyric[j];
                if (comp(s1.slice(start1, end1), s2.slice(start2, end2))) {
                    res.push(s1);
                    i++;
                }
                else {
                    res.push(s2);
                    j++;
                }
            }
            fs.writeFileSync(save_path, res.join('\n'));
        }
        else fs.writeFileSync(save_path, result.body.lrc.lyric);
        res.status(200);
        return JSON.stringify({
            filename: save_name
        });
    }
    catch (e) {
        console.log(e);
        res.status(404).end();
    }
}

module.exports.music_download = async function (data, res) {
    let options = data.options;
    let query = data.query;
    let result = await song_url_v1({
        id: query.id,
        cookie: cookie,
        level: options.level
    })
    let url = result.body.data[0].url;
    let type = result.body.data[0].type;
    let save_name = create_file_name(query, options, type);
    let save_path = path.join(temp_path, save_name);
    let stream = fs.createWriteStream(save_path);
    request(url).pipe(stream);
    return new Promise((resolve) => {
        stream.on("finish", () => {
            axios({
                url: query.album_img,
                method: 'GET',
                responseType: 'arraybuffer'
            }).then(async (body) => {
                let cover = {
                    data: taglib.ByteVector.fromByteArray(Buffer.from(body.data)),
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
                res.status(200);
                resolve(JSON.stringify({
                    filename: save_name
                }));
            });
        });
    })
}
/*
function cover_download(queue, options) {
    for (let index = 0; index < queue.length; index++) {
        let query = queue[index];
        axios({
            url: query.album_img,
            method: 'GET',
            responseType: 'arraybuffer'
        }).then(async (body) => {
            fs.writeFileSync(create_file_name(query, options, 'cover', '.jpg'), body.data);
            count('count', index);
        })
    }
}

async function fileDisplay(filePath) {
    return new Promise((resolve) => {
        let file_list = [];
        fs.readdir(filePath, function (err, files) {
            if (err) { console.warn(err, "读取文件夹错误！") }
            else {
                for (let filename of files) {
                    let stats = fs.statSync(path.join(filePath, filename));
                    if (stats.isFile()) {
                        let ext = filename.substring(filename.lastIndexOf(".") + 1, filename.length);
                        if (['flac', 'wav', 'ape', 'mp3'].includes(ext)) {
                            if (!fs.existsSync(path.join(filePath, filename.substring(0, filename.lastIndexOf(".")) + ".lrc"))) {
                                file_list.push(filename);
                            }
                        }
                    }
                }
            }
            resolve(file_list);
        });
    })
}
*/

module.exports.get_file = function (body, res) {
    let filepath = path.join(temp_path, body.filename);
    if (fs.existsSync(filepath)) {
        const filesize = fs.statSync(filepath).size
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'content-length': filesize
        })
        let readStream = fs.createReadStream(filepath);
        readStream.pipe(res);
        readStream.on('close', () => {
            fs.rmSync(filepath);
            res.end()
        });
    }
    else res.status(404).end();
}

/*
module.exports.get_folder_songs = async function (res, query) {
    let filePaths = await fileDisplay(query.path);
    let queue = [];
    for (let filePath of filePaths) {
        let origin_name = filePath.substring(0, filePath.lastIndexOf("."));
        let metadata = taglib.File.createFromPath(path.join(query.path, filePath));
        let key = '';
        if (metadata.tag.title) key += metadata.tag.title + " ";
        if (metadata.tag.performers) key += metadata.tag.performers[0];
        if (!key) key = origin_name;
        let result = await search({
            keywords: key,
            limit: 5
        });
        if (result.body.result.songCount > 0) {
            let songs = result.body.result.songs;
            let index = 0;
            for (let i = 0; i < songs.length; i++) {
                if (songs[i].name === metadata.tag.title && songs[i].album === metadata.tag.album) {
                    index = i;
                    break;
                }
            }
            let artists = [];
            for (j of songs[index].artists) {
                artists.push(j.name);
            }
            queue.push({
                id: songs[index].id,
                title: songs[index].name,
                artists: artists.join(','),
                album: songs[index].album.name,
                origin_name: filePath.substring(0, filePath.lastIndexOf(".")),
                search_key: key
            })
        }
    }
    return JSON.stringify({
        queue: queue
    });
}
*/