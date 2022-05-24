
export class Plugin{
    script;
    gatherClient;
    name = "";
    mode = "";
    buttonString = "";
    loopState;
    loopID;

    async init(scriptPath, app){
        this.gatherClient = app.gather;
        try {
            let moduleLoad = import(/* webpackIgnore: true */ scriptPath)
            await moduleLoad.then((module)=>{ this.script = module;});
            this.name = this.script.name;
            this.mode = this.script.mode;
            if(this.mode == "oneShot"){
                this.buttonString = this.script.buttonString;
            }
            this.script.init(this.gatherClient);
            if (this.mode == "loop"){
                this.loopState = this.script.autoStart;
                if(this.loopState){
                    this.start();
                }
            }
            return this.name;
        }
        catch(err){
            console.log("error loading script : ", scriptPath);
            console.log(err);
            return "failed loading script ";
        }
    }

    start(){
        this.script.start(this.gatherClient);
        this.loopID = setInterval(this.script.update,this.script.updateInterval,this.gatherClient);
        this.loopState = true;
    }

    stop(){
        if(this.loopID){
            this.script.stop(this.gatherClient);
            clearInterval(this.loopID);
            this.loopState = false;
        }
    }

    oneShot(){
        this.buttonString =  this.script.oneShot(this.gatherClient);
    }
}