const { error } = require('console');
const {app,BrowserWindow, ipcMain, dialog} = require('electron');

const reloader = require('electron-reloader')(module);
const fileSys = require('fs');

const path = require('path')

let mainWindow = null;
let openedFilePath = "";

const createWindow = () =>{
    mainWindow = new BrowserWindow({
        width:1200,
        height: 720,
        //titleBarStyle: "hidden",
        webPreferences:{
            preload: path.join(__dirname,'preload.js')
        }
    });
    mainWindow.webContents.openDevTools();
    mainWindow.loadFile('./view/index.html')

}


app.whenReady().then(()=>{
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

ipcMain.on("new-document-triggered",()=>{
    dialog.showSaveDialog(mainWindow,{
        filters:[{name:"text files",extensions: ["txt"]}]
    }).then(({filePath})=>{
        console.log('file paht',filePath);
        fileSys.writeFile(filePath,"",(error)=>{
            if(error){
                console.log(error);
            }else{
                openedFilePath = filePath;
                mainWindow.webContents.send("document-created",filePath);
            }
        })
    })
    
})

ipcMain.on("open-file-triggered",()=>{
    dialog.showOpenDialog({
        properties:['openFile'],
        filters:[{name:"text files",extensions: ["txt"]}]
    }).then(({filePaths})=>{
        const filepath = filePaths[0];

        fileSys.readFile(filepath,"utf8",(error,content)=>{
            if(error){
                console.log(error);
            }else{
                openedFilePath = filepath;
                mainWindow.webContents.send("document-opened",{filepath, content})
            }
        })
    })
})

ipcMain.on("content-updated",(_,textAreaContent)=>{
    fileSys.writeFile(openedFilePath, textAreaContent,(error)=>{
        if(error){
            console.log(error);
        }
    })
})