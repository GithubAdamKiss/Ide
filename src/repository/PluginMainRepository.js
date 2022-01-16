const {app} = require('electron');
const { readdirSync, existsSync, readFileSync, read, readFile } = require('fs');
const {join} = require('path');

class PluginMainRepository{
    
    constructor() {
        this.PLUGINS = [];
    }

    get getPluginPath(){
        const appPath = app.getAppPath();
        const path = join(appPath,"./plugins")
        return path;
    }

    get getPluginContext(){
        /**
         * everything which is returned here will be availible in the plugin
         */
        return null;
    }

    loadPluginsInPath(){
        const plugins = readdirSync(this.getPluginPath)

        plugins.forEach(plugin =>{
            this.loadPlugin(plugin,this.getPluginPath);
        })

    }

    loadPlugin(plugin,path){
        const pluginPath = join(path,plugin);
        const pluginPackagePath = join(pluginPath,'module.json');

        if(!existsSync(pluginPath)){
            console.warn(`Plugin folder at ${pluginPath} doesnt exist`)
            return;
        }

        if(!existsSync(pluginPackagePath)){
            console.warn(`Plugin package file at ${pluginPackagePath} doesnt exist`);
            return;
        }

        let pluginInfo = JSON.parse(readFileSync(pluginPackagePath));
        pluginInfo = Object.assign(pluginInfo,{
            pluginPath,
            main: join(pluginPath,pluginInfo.main),
            render: join(pluginPath,pluginInfo.render),
        })

        
        this.requirePlugin(pluginInfo);
    }


    requirePlugin(pluginInfo){
        try {
            const pluginObject = __non_webpack_require__(pluginInfo.main);

            if(pluginObject.default){
                pluginObject.default(this.getPluginContext())
            }

            this.PLUGINS.push(pluginInfo);

        } catch (error) {
            console.error("Error occured during loading plugin "+ pluginInfo.main+" >> "+ error);
        }
    }




}

module.exports = PluginMainRepository;


