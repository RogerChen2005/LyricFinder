import { ElMessage,ElNotification } from "element-plus";
const default_setting = { "mode": 0,"lyric":true,"tlyric": true, "level": "exhigh" }
import axios from 'axios'
export class Queue {
    constructor() {
        this.queue = [];
        this.total = 0;
    }
    add(item) {
        this.total += 1;
        let data = {
            id:item.id,
            title:item.title,
            album:item.album.name,
            artists:item.artists[0].name,
            album_img:item.album.cover,
            status:0,
            progress:0
        }
        this.queue.push(data);
        ElMessage({
            message: '添加成功',
            type: 'success',
        });
    }
    del(index) {
        this.total -= 1;
        this.queue.splice(index, 1);
        ElMessage({
            message: "删除成功",
            type: 'success'
        })
    }
    get length() {
        return this.total;
    }
    get inner_queue() {
        return this.queue;
    }
    set_progress(index, prog) {
        this.queue[index].progress = prog;
    }
    async download() {
        let task = new Task();
        for (let i of this.queue) {
            if (i.status == 0) {
                i.status = 1;
                task.add(i);
            }
        }
        task.download(()=>{
            ElNotification({
                title:"成功",
                message:"下载完成",
                type:"success"
            })
            task = null;
        });
    }
}

class Task {
    constructor() {
        this.queue = [];
        this.total = 0;
        this.complete = 0;
    }
    add(item) {
        this.queue.push(item);
        this.total++;
    }
    async download(callback) {
        let dirHandle = await window.showDirectoryPicker({
            id:"permission",
            mode:"readwrite"
        });
        let settings = JSON.parse(localStorage.getItem("settings"));
        if (!settings) settings = default_setting;
        for (let i in this.queue) {
            let arr = [];
            let result;
            result = await axios.post("/download", {
                target: "music_download",
                data:{
                    query: this.queue[i],
                    options: settings
                }
            });
            arr.push(result.data.filename);
            if (settings.lyric) {
                result=await axios.post("/download", {
                    target: "lyric_download",
                    data:{
                        query: this.queue[i],
                        options: settings
                    }
                });
                arr.push(result.data.filename);
            }
            this.transform(arr, dirHandle, i, () => {
                if (this.count()) {
                    dirHandle=null;
                    callback();
                }
            });
        }

    }
    async transform(query, handle, index, callback) {
        let queue = this.queue;
        queue[index].status = 2;
        for (let i in query) {
            let result = await axios({
                method: "post",
                responseType: "blob",
                data: {
                    filename: query[i]
                },
                url: '/file',
                onDownloadProgress(ProgressEvent) {
                    let percent = Math.floor(ProgressEvent.loaded / ProgressEvent.total);
                    queue[index].prog = percent;
                }
            })
            const fileHandle = await handle.getFileHandle(query[i], { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(result.data);
            await writable.close();
        }
        callback();
    }
    count() {
        this.complete++;
        return this.complete === this.total;
    }
}