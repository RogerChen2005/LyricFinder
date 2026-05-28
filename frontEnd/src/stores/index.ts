import { defineStore } from 'pinia'
import { ref } from 'vue'
import ClassManager from '@/utils/classManager'
import { Queue } from '@/services/queue'
import { _data } from '@/services/data_init'

export interface AppSettings {
  mode: number
  lyric: boolean
  tlyric: boolean
  quality: string
  level: string
}

const defaultSettings: AppSettings = { mode: 0, lyric: true, tlyric: true, quality: 'exhigh', level: 'exhigh' }

export const useAppStore = defineStore('app', () => {
  const classManager = ref(new ClassManager())
  const queue = ref<Queue | null>(null)
  const data = ref<_data | null>(null)
  const settings = ref<AppSettings>(defaultSettings)

  function init() {
    classManager.value.init_darkmode()
    queue.value = new Queue()
    data.value = new _data()
    const saved = localStorage.getItem('settings')
    if (saved) {
      settings.value = JSON.parse(saved)
    }
  }

  return { classManager, queue, data, settings, init }
})
