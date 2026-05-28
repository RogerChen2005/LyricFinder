export default class ClassManager {
  classes: string[] = []

  addHtmlclasses(classname: string): void {
    const index = this.classes.indexOf(classname)
    if (index === -1) this.classes.push(classname)
    document.getElementsByTagName('html')[0].className = this.classes.join(' ')
  }

  delHtmlclasses(classname: string): void {
    const index = this.classes.indexOf(classname)
    if (index !== -1) this.classes.splice(index, 1)
    document.getElementsByTagName('html')[0].className = this.classes.join(' ')
  }

  init_darkmode(): void {
    const isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)')
    if (isDarkTheme.matches) this.addHtmlclasses('dark')
    isDarkTheme.addEventListener('change', (event) => {
      if (event.matches) {
        this.addHtmlclasses('dark')
      } else {
        this.delHtmlclasses('dark')
      }
    })
  }

  apply(key: string): void {
    if (typeof key === 'string') {
      if (this.classes.indexOf(key) !== -1) {
        this.delHtmlclasses(key)
      } else {
        this.addHtmlclasses(key)
      }
    }
  }

  get isDark(): boolean {
    return this.classes.indexOf('dark') !== -1
  }

  isWhat(key: string): boolean {
    if (typeof key === 'string') return this.classes.indexOf(key) !== -1
    return false
  }
}
