const {artists_conv} = require('./global.js');

const procs = {
    "list": (src,dist) => {
        let res = src.resources[0];
        let data = {
            name:res.uiElement.mainTitle.title,
            cover_img:res.uiElement.image.imageUrl,
            id:res.resourceId,
        };
        dist.lists.push(data);
    },
    "SONG_LIST_HOMEPAGE":(src,dist)=>{
        for(let resource of src.resources){
            if(resource.resourceType === 'song'){
                let info = resource.resourceExtInfo.song;
                let song = {
                    id:info.id,
                    title:info.name,
                    artists:artists_conv(info.ar),
                    album:{
                        id:info.al.id,
                        name:info.al.name,
                        cover:info.al.picUrl
                    }
                };
                dist.songs.push(song);
            }
        }
    }
}

module.exports.homepage_format =  function (src) {
    let resp = {
        lists: [],
        songs: []
    }
    if (src.blocks) {
        for (let block of src.blocks) {
            if (block.creatives) {
                for (let creative of block.creatives) {
                    let proc = procs[creative.creativeType];
                    if (typeof proc === 'function') {
                        proc(creative,resp);
                    }
                }
            }
        }
    }
    return resp;
}
