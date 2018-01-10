
var a = {
    b: 1,
    c: 2
}
let transformRequest = (data) => {
    let formData = new FormData();
    for (let item in data) {
        formData.append(item, data[item]);
    }
    return formData;
}
let b = transformRequest(a);
for (let item of b.entries()) {
    console.log(item)
}