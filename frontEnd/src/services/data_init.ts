import axios from 'axios'

type Callback = (data: Record<string, unknown>) => void
type ErrCallback = (reason: unknown) => void

interface ProcMap {
  [key: string]: (this: _data, callback: Callback, err?: ErrCallback) => void
}

const proc: ProcMap = {
  discover(callback, err) {
    axios.post('./func', {
      target: 'discover',
      data: {
        cookie: localStorage.getItem('cookie')
      }
    }).then((response) => {
      callback({
        songs: response.data.songs,
        lists: response.data.lists
      })
    }).catch((reason) => {
      if (typeof err === 'function') err(reason)
    })
  },
  profile(callback, err) {
    axios.post('./func', {
      target: 'user_inf',
      data: {
        cookie: localStorage.getItem('cookie')
      }
    }).then((res) => {
      callback({ profile: res.data })
    }).catch((reason) => {
      if (typeof err === 'function') err(reason)
    })
  },
  private_list(callback, err) {
    this.gets('profile', (data) => {
      axios.post('./func', {
        target: 'get_playlist',
        data: {
          uid: (data.profile as Record<string, unknown>).userid,
          cookie: localStorage.getItem('cookie')
        }
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

export class _data {
  [key: string]: unknown

  gets(key: string, callback?: Callback, err?: ErrCallback): void {
    if (!this[key]) {
      if (typeof proc[key] === 'function') {
        proc[key].call(this, (data) => {
          this[key] = data
          if (typeof callback === 'function') callback(data)
        }, err)
      }
    } else if (typeof callback === 'function') {
      callback(this[key] as Record<string, unknown>)
    }
  }

  update(key: string, callback?: Callback, err?: ErrCallback): void {
    if (typeof proc[key] === 'function') {
      proc[key].call(this, (data) => {
        this[key] = data
        if (typeof callback === 'function') callback(data)
      }, err)
    }
  }

  remove(key: string): void {
    if (this[key]) delete this[key]
  }

  remove_all(): void {
    for (const key in proc) {
      if (this[key]) delete this[key]
    }
  }
}
