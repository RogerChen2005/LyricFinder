import axios from '@/utils/request'

type Callback = (data: Record<string, any>) => void
type ErrCallback = (reason: any) => void

interface FetcherMap {
  [key: string]: (this: DataService, callback: Callback, err?: ErrCallback) => void
}

const fetchers: FetcherMap = {
  discover(callback, err) {
    axios.post('/api/discover', {
      cookie: localStorage.getItem('cookie')
    }).then((response) => {
      callback({
        sections: response.data.sections
      })
    }).catch((reason) => {
      if (typeof err === 'function') err(reason)
    })
  },
  profile(callback, err) {
    axios.post('/api/auth/user', {
      cookie: localStorage.getItem('cookie')
    }).then((res) => {
      callback({ profile: res.data })
    }).catch((reason) => {
      if (typeof err === 'function') err(reason)
    })
  },
  userPlaylists(callback, err) {
    this.get('profile', (data) => {
      axios.post('/api/playlist', {
        uid: (data.profile as Record<string, unknown>).userid,
        cookie: localStorage.getItem('cookie')
      }).then((res) => {
        callback({ list: res.data.list })
      }).catch((reason) => {
        if (typeof err === 'function') err(reason)
      })
    }, (reason) => {
      if (typeof err === 'function') err(reason)
    })
  }
}

export class DataService {
  [key: string]: unknown

  get(key: string, callback?: Callback, err?: ErrCallback): void {
    if (!this[key]) {
      if (typeof fetchers[key] === 'function') {
        fetchers[key].call(this, (data) => {
          this[key] = data
          if (typeof callback === 'function') callback(data)
        }, err)
      }
    } else if (typeof callback === 'function') {
      callback(this[key] as Record<string, unknown>)
    }
  }

  refresh(key: string, callback?: Callback, err?: ErrCallback): void {
    if (typeof fetchers[key] === 'function') {
      fetchers[key].call(this, (data) => {
        this[key] = data
        if (typeof callback === 'function') callback(data)
      }, err)
    }
  }

  clear(key: string): void {
    if (this[key]) delete this[key]
  }

  clearAll(): void {
    for (const key in fetchers) {
      if (this[key]) delete this[key]
    }
  }
}
