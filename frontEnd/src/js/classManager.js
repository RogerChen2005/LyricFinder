export default class {
    constructor(){
        this.classes = [];
    }
    addHtmlclasses = (classname) => {
        let index = this.classes.indexOf(classname);
        if (index === -1) this.classes.push(classname);
        document.getElementsByTagName("html")[0].className = this.classes.join(" ");
    }
    delHtmlclasses = (classname) => {
        let index = this.classes.indexOf(classname);
        if (index != -1) this.classes.splice(index, 1);
        document.getElementsByTagName("html")[0].className = this.classes.join(" ");
    }
    init_darkmode() {
        const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
        if (isDarkTheme.matches) this.addHtmlclasses("dark");
        isDarkTheme.addEventListener('change', (event) => {
            if (event.matches) {
                this.addHtmlclasses("dark");
            } else {
                this.delHtmlclasses("dark");
            }
        });
    }
    apply(key){
        if(typeof key === "string"){
            if(this.classes.indexOf('key')!=-1){
                this.delHtmlclasses(key);
            }else this.addHtmlclasses(key);
        }
    }
    get isDark(){
        return this.classes.indexOf('dark') != -1;
    }
    isWhat(key){
        if(typeof key === 'string') return this.classes.indexOf(key) != -1;
        else return false;
    }
}