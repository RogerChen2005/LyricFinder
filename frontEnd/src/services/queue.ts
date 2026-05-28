import { ElMessage, ElNotification } from 'element-plus'
import axios from 'axios'

const default_setting = { mode: 0, lyric: true, tlyric: true, level: 'exhigh' }

interface QueueItem {
  id: number
  title: string
  album: string
  artists: string
  album_img: string
  status: number
  progress: number
  prog?: number
}

interface SongItem {
  id: number
  title: string
  album: { name: string; cover: string }
  artists: { name: string }[]
}

export class Queue {
  queue: QueueItem[] = []
  total = 0

  add(item: SongItem): void {
    this.total += 1
    const data: QueueItem = {
      id: item.id,
      title: item.title,
      album: item.album.name,
      artists: item.artists[0].name,
      album_img: item.album.cover,
      status: 0,
      progress: 0
    }
    this.queue.push(data)
    ElMessage({ message: '添加成功', type: 'success' })
  }

  del(index: number): void {
    this.total -= 1
    this.queue.splice(index, 1)
    ElMessage({ message: '删除成功', type: 'success' })
  }

  get length(): number {
    return this.queue.length
  }

  get inner_queue(): QueueItem[] {
    return this.queue
  }

  set_progress(index: number, prog: number): void {
    this.queue[index].progress = prog
  }

  async download(): Promise<void> {
    let task: Task | null = new Task()
    for (const i of this.queue) {
      if (i.status === 0) {
        i.status = 1
        task.add(i)
      }
    }
    task.download(() => {
      ElNotification({ title: '成功', message: '下载完成', type: 'success' })
      task = null
    })
  }
}

class Task {
  queue: QueueItem[] = []
  total = 0
  complete = 0

  add(item: QueueItem): void {
    this.queue.push(item)
    this.total++
  }

  async download(callback: () => void): Promise<void> {
    const dirHandle: FileSystemDirectoryHandle = await (window as any).showDirectoryPicker({
      id: 'permission',
      mode: 'readwrite'
    })
    let settings = JSON.parse(localStorage.getItem('settings') ?? 'null')
    if (!settings) settings = default_setting
    for (const i in this.queue) {
      const arr: string[] = []
      let result = await axios.post('./download', {
        target: 'music_download',
        data: { query: this.queue[i], options: settings }
      })
      arr.push(result.data.filename)
      if (settings.lyric) {
        result = await axios.post('./download', {
          target: 'lyric_download',
          data: { query: this.queue[i], options: settings }
        })
        arr.push(result.data.filename)
      }
      this.transform(arr, dirHandle, Number(i), () => {
        if (this.count()) {
          callback()
        }
      })
    }
  }

  async transform(query: string[], handle: FileSystemDirectoryHandle, index: number, callback: () => void): Promise<void> {
    const queue = this.queue
    queue[index].status = 2
    for (const i in query) {
      const result = await axios({
        method: 'post',
        responseType: 'blob',
        data: { filename: query[i] },
        url: './file',
        onDownloadProgress(ProgressEvent) {
          const percent = Math.floor(ProgressEvent.loaded / (ProgressEvent.total ?? 1) * 100)
          queue[index].prog = percent
        }
      })
      const fileHandle = await handle.getFileHandle(query[i], { create: true })
      const writable = await fileHandle.createWritable()
      await writable.write(result.data)
      await writable.close()
    }
    callback()
  }

  count(): boolean {
    this.complete++
    return this.complete === this.total
  }
}
