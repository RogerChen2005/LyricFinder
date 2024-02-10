module.exports.artists_conv = function (obj) {
    let data = [];
    for (let i of obj) {
        data.push({
            name: i.name,
            id: i.id
        });
    }
    return data;
};