import { Game } from "@gathertown/gather-game-client";
import notifier from "node-notifier";
import type {App } from "../app";
global.WebSocket = require("isomorphic-ws");

export type Player = {
    name: string,
    groups: boolean[],
    readonly id: string,
}

export type NotifyObject = {
    mode: number,
    isActive: boolean,
    name: string,
}

export class GatherClient {
    game: Game | undefined;
    playerIDs = new Array();
    playerList: Map<string, Player>;
    objList: Map<string, NotifyObject>;
    freezeState = false;
    freezeInterval: any;
    teleportMode = 0;
    freezeMode = 0;
    app: App;
    notifier = notifier;
    connected = false;

    constructor(app_: App){
        this.playerList = new Map();
        this.objList = new Map();
        this.app = app_;
    }

    public init(apiKey: string, spaceID: string, savedObjects: Map<string, NotifyObject>){
        // load saved notify objects from last session
        savedObjects.forEach((e, k)=>{
            this.objList.set(k,e);
        });
        console.log("start gather-control");
        this.game = new Game(spaceID,() => Promise.resolve({apiKey}))
        this.game.connect()?.then(()=>{this.connected = this.game?.connected ?? false;});
        this.game.subscribeToEvent("playerJoins", (data, context) => {
            console.log("player joins");
            let id = context.playerId;
            // check if id is already in the List because we dont remove them on disconnect thats easier when players reloading session
            if ((id) && !(this.playerList.has(id))){
                let name = context.player?.name ?? "";
                let p = {
                    name: name,
                    id: id,
                    groups: [false, false, false, false]
                }
                this.playerList.set(id, p);
            }
            if (typeof context.playerId != "undefined" && !(context.playerId in this.playerIDs)){
                this.playerIDs.push(context.playerId);
            }
        });

        this.game.subscribeToEvent("playerSetsName", (data, context) => {
            let id = context.playerId;
            let name = context.player?.name ?? "";
            if ((id)){
                let p = this.playerList.get(id);
                if (p){
                p.name = name;
                this.playerList.set(id, p);
                } 
            }
        })

        this.game.subscribeToEvent("playerInteracts", (data, context) => {
            let obj = data.playerInteracts.objId;
            obj = obj.slice(0,obj.search(/ - /));
            console.log(obj);
            console.log(data.playerInteracts.objId);
            if (this.objList.has(obj) && this.objList.get(obj)?.isActive == true){
                let msg = context.player?.name + " interacted with " + obj;
                let t = "action @ " + obj;
                notifier.notify({
                    title: t,
                    message: msg,
                });
                if (this.objList.get(obj)?.mode == 1){
                    let n: NotifyObject = {
                        mode: 1,
                        isActive: false,
                        name: obj,
                    }
                    this.objList.set(obj, n);
                    this.app.mainWidget.pages[1].refresh();
                }
            }
        });
    }


    public toggleFreez(){
        this.freezeState = !this.freezeState;
        if (this.freezeState){
            let pos = new Array();
            this.playerIDs.forEach((id) => {
                let p = this.game?.getPlayer(id);
                pos.push([p?.x ?? 0, p?.y ?? 0]);
            })

            this.freezeInterval = setInterval((_this: GatherClient, _pos: Array<Array<number>>) =>{
                _this.playerIDs.forEach((id, i): void => {
                    let p = _this.game?.getPlayer(id);
                    let map = p?.map ?? "";
                    let freezBool = false;
                    if (this.freezeMode == 4 ){ freezBool = true;}
                    if ( this.freezeMode < 4 ){ freezBool = this.playerList.get(id)?.groups[this.freezeMode] ?? false;}
                    if ((p?.x != _pos[i][0] || p?.y != _pos[i][1]) && freezBool == true ){
                        _this.game?.teleport(map, _pos[i][0], _pos[i][1],id);
                    }
                    
                })
            }, 100, this, pos)
            }
        else{ clearInterval(this.freezeInterval)}
    }

    public teleportTo(name: string, targetName: string){
        let targetPos = [0,0];
        let targetMap = "";
        let excludeID: string;
        this.playerIDs.forEach((id,i ) => {
            let p = this.game?.getPlayer(id);
            if ( p?.name == targetName){
               targetPos = [p.x, p.y];
               targetMap = p.map;
               excludeID = id; 
            }
        })
        if (targetPos != [0,0] && targetMap != ""){
            this.playerIDs.forEach((id) =>{
                let p = this.game?.getPlayer(id);
                let teleBool = false;
                if (this.teleportMode == 5) {
                    teleBool = true;
                }
                if (this.teleportMode == 4 && name == p?.name) {teleBool = true;}
                if (this.teleportMode < 4 ) {teleBool = this.playerList.get(id)?.groups[this.teleportMode] ?? false;}
                if (excludeID != id && teleBool == true){
                    this.game?.teleport(targetMap, targetPos[0], targetPos[1], id);
                }
            })
        }
    }
}