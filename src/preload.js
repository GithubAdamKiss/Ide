const { ipcRenderer } = require("electron")
const path = require("path");


window.addEventListener('DOMContentLoaded',()=>{

    const elements = {
        new:document.getElementById("new"),
        open:document.getElementById("open"),
        documentName: document.getElementById("fileName"),
        fileTextArea:document.getElementById("fileTextArea"),
    }
    
    elements.new.addEventListener("click",()=>{
        ipcRenderer.send("new-document-triggered");
    })

    elements.open.addEventListener("click",()=>{
        ipcRenderer.send("open-file-triggered")
    })

    elements.fileTextArea.addEventListener('input',(e)=>{
        ipcRenderer.send("content-updated",e.target.value);
    })

    ipcRenderer.on('document-created',(_,filePath)=>{
        elements.documentName.innerHTML = path.parse(filePath).base;
        elements.fileTextArea.removeAttribute("disabled");
        elements.fileTextArea.value="";
        elements.fileTextArea.focus();
    })

    ipcRenderer.on('document-opened',(_,{filepath,content})=>{
        elements.documentName.innerHTML = path.parse(filepath).base;
        elements.fileTextArea.removeAttribute("disabled");
        elements.fileTextArea.value=content;
        elements.fileTextArea.focus();
    })

})