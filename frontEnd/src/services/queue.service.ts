import { ElMessage, ElNotification } from 'element-plus'
import axios from '@/utils/request'

const default_setting = { mode: 0, lyric: true, tlyric: true, level: 'exhigh' }

const enum DownloadStatus {
  Waiting = 0,
  Preparing = 1,
  Downloading = 2
}

interface DownloadItem {
  id: number
  title: string
  album: string
  artists: string
  album_img: string
  status: DownloadStatus
  progress: number
}

interface SongInfo {
  id: number
  title: string
  album: { name: string; cover: string }
  artists: { name: string }[]
}

export class DownloadQueue {
  items: DownloadItem[] = []
  completedItems: DownloadItem[] = []
  total = 0
  private isDownloading = false

  add(song: SongInfo): void {
    this.total += 1
    const item: DownloadItem = {
      id: song.id,
      title: song.title,
      album: song.album.name,
      artists: song.artists.map((artist) => artist.name).join(' / '),
      album_img: song.album.cover,
      status: DownloadStatus.Waiting,
      progress: 0
    }
    this.items.push(item)
    ElMessage({ message: '添加成功', type: 'success' })
  }

  remove(index: number): void {
    if (!this.items[index]) return
    this.total -= 1
    this.items.splice(index, 1)
    ElMessage({ message: '删除成功', type: 'success' })
  }

  get length(): number {
    return this.items.length
  }

  async downloadAll(): Promise<void> {
    if (this.isDownloading) {
      ElMessage({ message: '下载任务进行中', type: 'warning' })
      return
    }

    const downloader = new FileDownloader((item) => this.moveToCompleted(item))
    for (const item of this.items) {
      if (item.status === DownloadStatus.Waiting) {
        item.status = DownloadStatus.Preparing
        item.progress = 0
        downloader.addTask(item)
      }
    }

    if (downloader.total === 0) {
      ElMessage({ message: '没有待下载的任务', type: 'warning' })
      return
    }

    this.isDownloading = true
    try {
      const { failed } = await downloader.execute()
      if (failed === 0) {
        ElNotification({ title: '成功', message: '下载完成', type: 'success' })
      } else {
        ElNotification({ title: '部分失败', message: `${failed} 个任务下载失败`, type: 'warning' })
      }
    } finally {
      this.isDownloading = false
    }
  }

  private moveToCompleted(item: DownloadItem): void {
    const index = this.items.indexOf(item)
    if (index !== -1) {
      this.items.splice(index, 1)
    }

    if (!this.completedItems.includes(item)) {
      this.completedItems.unshift(item)
    }
  }
}

class FileDownloader {
  pendingItems: DownloadItem[] = []
  total = 0

  constructor(private readonly onItemComplete: (item: DownloadItem) => void) {}

  addTask(item: DownloadItem): void {
    this.pendingItems.push(item)
    this.total++
  }

  async execute(): Promise<{ failed: number }> {
    const dirHandle = await this.pickDirectory()
    const settings = this.getSettings()
    const results = await Promise.allSettled(
      this.pendingItems.map((item) => this.downloadItem(item, settings, dirHandle))
    )

    return {
      failed: results.filter((result) => result.status === 'rejected').length
    }
  }

  private async downloadItem(
    item: DownloadItem,
    settings: typeof default_setting,
    dirHandle: FileSystemDirectoryHandle | null
  ): Promise<void> {
    try {
      const filenames = await this.prepareFiles(item, settings)
      await this.saveFiles(filenames, item, dirHandle)
      item.status = DownloadStatus.Downloading
      item.progress = 100
      this.onItemComplete(item)
    } catch (error) {
      item.status = DownloadStatus.Waiting
      item.progress = 0
      throw error
    }
  }

  private async prepareFiles(item: DownloadItem, settings: typeof default_setting): Promise<string[]> {
    const filenames: string[] = []
    const musicResult = await axios.post('/api/download/music', {
      query: item,
      options: settings
    })
    filenames.push(musicResult.data.filename)

    if (settings.lyric) {
      const lyricResult = await axios.post('/api/download/lyric', {
        query: item,
        options: settings
      })
      filenames.push(lyricResult.data.filename)
    }

    return filenames
  }

  private async pickDirectory(): Promise<FileSystemDirectoryHandle | null> {
    const win = window as Window & {
      showDirectoryPicker?: (options: { id: string, mode: 'readwrite' }) => Promise<FileSystemDirectoryHandle>
    }

    if (typeof win.showDirectoryPicker !== 'function') {
      return null
    }

    return win.showDirectoryPicker({ id: 'permission', mode: 'readwrite' }).catch(() => null)
  }

  private getSettings(): typeof default_setting {
    try {
      return JSON.parse(localStorage.getItem('settings') ?? 'null') ?? default_setting
    } catch {
      return default_setting
    }
  }

  async saveFiles(filenames: string[], item: DownloadItem, dirHandle: FileSystemDirectoryHandle | null): Promise<void> {
    item.status = DownloadStatus.Downloading
    for (const filename of filenames) {
      const result = await axios({
        method: 'post',
        responseType: 'blob',
        data: { filename },
        url: '/api/file',
        onDownloadProgress(event) {
          const percent = Math.floor(event.loaded / (event.total ?? 1) * 100)
          item.progress = percent
        }
      })
      if (dirHandle) {
        const fileHandle = await dirHandle.getFileHandle(filename, { create: true })
        const writable = await fileHandle.createWritable()
        await writable.write(result.data)
        await writable.close()
      } else {
        const url = URL.createObjectURL(result.data)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    }
  }
}
