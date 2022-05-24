import { App } from "../../app";
import { Page, ScriptEntry } from "../../components/uiElements";
import fs from 'fs';
import path from 'path';
import { Direction, QBoxLayout,QScrollArea, QWidget, ScrollBarPolicy, SizeConstraint } from "@nodegui/nodegui";

export class ScriptsPage extends Page {
    ScriptEntrys = new Array<ScriptEntry>();
    list = new QWidget();
    listLayout = new QBoxLayout(Direction.TopToBottom);
    scrollArea = new QScrollArea();
    app: App;

    constructor(app_: App){
        super();
        this.app = app_;
        this.list.setLayout(this.listLayout);
        this.listLayout.setSizeConstraint(SizeConstraint.SetMinimumSize);
        this.list.setMinimumSize(600, 60);
        this.scrollArea.setInlineStyle("border: none; flex: 1;");
        this.scrollArea.setVerticalScrollBarPolicy(ScrollBarPolicy.ScrollBarAsNeeded);
        this.scrollArea.setHorizontalScrollBarPolicy(ScrollBarPolicy.ScrollBarAlwaysOff);
        this.scrollArea.setWidget(this.list);
        this.rootLayout.addWidget(this.scrollArea);
    }

    public override init() {
        try {
            let filenames = fs.readdirSync(this.app.settings.appConfig.scriptDir);
            filenames.forEach((file) => {
                if (path.extname(file) == ".js"){
                    let scriptPath = path.join(this.app.settings.appConfig.scriptDir, file);
                    if(process.platform == "win32"){
                        scriptPath = "file:\\" + scriptPath;
                    }
                    let s = new ScriptEntry(scriptPath, this.app);
                    this.listLayout.insertWidget(-1,s);
                    this.ScriptEntrys.push(s);
                    this.list.adjustSize();
                }
            });

        }
        catch(err){
            console.log("error loading scripts")
            console.log(err);
        }
    }
}