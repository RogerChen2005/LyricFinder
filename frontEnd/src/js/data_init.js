import axios from "axios";

const proc = {
    "discover": function (callback, err){
        axios.post("./func", {
            target: "discover",
            data: {
                cookie: localStorage.getItem("cookie")
            }
        }).then(
            (response) => {
                callback({
                    songs: response.data.songs,
                    lists: response.data.lists
                })
            }
        ).catch((reason) => {
            if (typeof err === 'function') {
                err(reason);
            }
        });
    },
    "profile": function (callback, err){
        axios.post("./func", {
            target: "user_inf",
            data: {
                cookie: localStorage.getItem("cookie")
            }
        }).then((res) => {
            callback({
                profile: res.data
            });
        }).catch((reason) => {
            if (typeof err === 'function') {
                err(reason);
            }
        });
    },
    "private_list": function (callback, err){
        this.gets("profile",(data)=>{
            axios.post("./func", {
                target: "get_playlist",
                data: {
                    uid:data.profile.userid,
                    cookie: localStorage.getItem("cookie")
                }
            }).then(
                (res) => {
                    callback({
                        list: res.data.list
                    });
                }
            ).catch((reason) => {
                if (typeof err === 'function') {
                    err(reason);
                }
            });
        },(reason)=>{
            if (typeof err === 'function') {
                err(reason);    
        }});
    }
};

export class _data {
    gets(key, callback, err) {
        if (!this[key]) {
            if (typeof proc[key] === 'function') {
                proc[key].call(this,(data) => {
                    this[key] = data;
                    if (typeof callback === "function") {
                        callback(data);
                    }
                }, err);
            }
        }
        else if (typeof callback === 'function') {
            callback(this[key]);
        }
    }
    update(key, callback, err) {
        if (typeof proc[key] === 'function') {
            proc[key].call(this,(data) => {
                this[key] = data;
                if (typeof callback === "function") {
                    callback(data);
                }
            }, err);
        }
    }
    remove(key) {
        if (this[key]) delete this[key];
    }
    remove_all() {
        for (let key in proc) {
            if (this[key]) delete this[key];
        }
    }
}