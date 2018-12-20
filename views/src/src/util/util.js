
function downloadFile(url) {
    let elemIF = document.createElement("iframe")
    elemIF.src = url
    elemIF.style.display = "none"
    document.body.appendChild(elemIF)
    // let a = document.createElement("a")
    // a.href = url
    // a.download = "1"
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
}

export {
    downloadFile
}
