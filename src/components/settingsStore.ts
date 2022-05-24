import fs from 'fs';
import { homedir } from 'os';
import path from 'path';
import { NotifyObject } from './gatherClient';


type Config = {
  width: number,
  height: number,
  apiKey: string,
  spaceID: string;
  scriptDir: string;
  page: number;
}

type Session = {
    notifyObjects: Array<NotifyObject>;
}

const configFile = "config.json";
const sessionFile = "session.json";

export function GatherConfigPath() {
    let configPath;
    switch (process.platform) {
        case "linux":
            configPath = path.join(homedir(), ".config", "gather-control");
            break;
        case "darwin":
            configPath = path.join(homedir(), "Library", "Application Support", "gather-control");
            break;
        case "win32":
            configPath = path.join(homedir(), "AppData", "Roaming", "gather-control");
            break;
        default:
            configPath = path.join(homedir(), "gather-control");
        }
    return configPath;
}

export class SettingsStore {
    configPath: string;
    appConfig: Config = {
        "width": 1000,
        "height": 800,
        "apiKey": "",
        "spaceID": "",
        "scriptDir": "",
        "page": 0
    }
    session: Session;
    constructor(){
        this.configPath = "";
        this.session = {
            notifyObjects: new Array(),
        }

        this.configPath = GatherConfigPath();

        try {
            this.appConfig = JSON.parse(fs.readFileSync(path.join(this.configPath, configFile)).toString());
        }
        catch (err) {
            // actually this is not needed anymore dir is created in index.ts
            //fs.mkdirSync(this.configPath);
            //console.log("create user data directory");
            fs.writeFileSync(path.join(this.configPath, configFile), JSON.stringify(this.appConfig));
        }
        try {
            this.session= JSON.parse(fs.readFileSync(path.join(this.configPath, sessionFile)).toString());
        }
        catch (err) {
            console.log("no saved session loaded");
        }

    }

    public saveAppConfig(){
        fs.writeFileSync(path.join(this.configPath, configFile), JSON.stringify(this.appConfig));
    }

    public saveSession(objList: Map<string, NotifyObject>){
        let objArray: Array<NotifyObject> = new Array;
        objList.forEach((e)=>{
            objArray.push(e);
        });
        let session: Session = {
            notifyObjects: objArray,
        }
        fs.writeFileSync(path.join(this.configPath, sessionFile), JSON.stringify(session));
    }

    public getNotifyObjects(){
        let objList: Map<string,NotifyObject> = new Map();
        this.session.notifyObjects.forEach((e)=>{
                objList.set(e.name,e);
            });
        return objList;
    }
}