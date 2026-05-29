import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DownloadQueue } from '@/services/queue.service'
import { DataService } from '@/services/data-init.service'

export interface AppSettings {
  mode: number
  lyric: boolean
  tlyric: boolean
  quality: string
  level: string
}

const defaultSettings: AppSettings = { mode: 0, lyric: true, tlyric: true, quality: 'exhigh', level: 'exhigh' }

export const useAppStore = defineStore('app', () => {
  const queue = ref<DownloadQueue | null>(null)
  const data = ref<DataService | null>(null)
  const settings = ref<AppSettings>(defaultSettings)

  function init() {
    queue.value = new DownloadQueue()
    data.value = new DataService()
    const saved = localStorage.getItem('settings')
    if (saved) {
      settings.value = JSON.parse(saved)
    }
  }

  return { queue, data, settings, init }
})
