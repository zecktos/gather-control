import { QWidget, QLabel, QCheckBox, FlexLayout, QStackedWidget, QLineEdit, QPushButton, QIcon, QBoxLayout, Direction, QComboBox, WidgetEventTypes, QClipboard } from "@nodegui/nodegui";
import type { App } from '../app'
import { NotifyPage } from "../views/pages/notifyPage";
import type { Player, NotifyObject} from './gatherClient'
import deleteIcon from '../../assets/delete.svg'
import deleteIconRed from '../../assets/delete-red.png'
import { Plugin } from './plugin'
import { StyleA, StyleB } from "./buttonStyles";

export class Page extends QWidget{
    rootLayout = new FlexLayout();

    constructor(){
        super();
        this.setLayout(this.rootLayout);
    }

    public init(){}

    public refresh(){}
}

export class PageSelect extends QWidget {
    rootLayout = new FlexLayout();
    groupButton = new QPushButton();
    notifyButton = new QPushButton();
    buttons = new Array<QPushButton>();

    constructor(){
        super();
        this.setLayout(this.rootLayout);
    }

    addButton(page: Page, name: string, icon: QIcon, stack: QStackedWidget){
        let button = new QPushButton();
        button.setText(name);
        button.setIcon(icon);
        this.buttons.push(button);
        
        
    
        button.addEventListener("clicked", ()=>{
            page.refresh();
            stack.setCurrentWidget(page);
            this.buttons.forEach((e,i)=>{
                if( this.buttons[i] == button){
                    button.setStyleSheet(StyleA.active);
                }
                else {
                    this.buttons[i].setStyleSheet(StyleA.inactive);
                }
            });
        });
        this.rootLayout.addWidget(button);
    }

    select(index: number){
        this.buttons[index].click();
    }
}

export class GlobalControls extends QWidget{
    constructor(app: App){
        super();
        let freezeButton = new QPushButton();
        let teleportButton = new QPushButton();
        let freezeMode = new QComboBox();
        let teleportMode = new QComboBox();
        let targetNameEdit = new QLineEdit();
        let nameEdit = new QLineEdit();
        let toLabel = new QLabel();
        let rootLayout = new FlexLayout();
        let freezeLabel = "start freeze";
        
        this.setObjectName("GlobalControls")
        this.setLayout(rootLayout);
        freezeButton.setObjectName("freezeButton");
        
        freezeButton.setText(freezeLabel);
        freezeButton.setInlineStyle("margin-right: 3px; padding: 2px;")
        freezeButton.addEventListener("clicked", () =>{
            app.gather.toggleFreez()
            if (app.gather.freezeState){
            freezeLabel = "stop freeze";
            freezeButton.setStyleSheet(StyleB.active);
            }
            else{
                freezeLabel = "start freeze";
                freezeButton.setStyleSheet(StyleB.inactive);
            }
            freezeButton.setText(freezeLabel);
        })
        freezeMode.addItems(["Group A", "Group B", "Group C", "Group D", "all"]);
        freezeMode.setInlineStyle("margin-right: 20px; padding: 2px;")
        freezeMode.addEventListener("currentIndexChanged",(index)=>{
            console.log("freeze mode changed to: ", index );
            app.gather.freezeMode = index;
        });
        freezeMode.setCurrentIndex(4);

        teleportMode.addItems(["Group A", "Group B", "Group C", "Group D", "by name", "all"]);
        teleportMode.setInlineStyle("margin-right: 3px; padding: 2px")
        teleportMode.addEventListener("currentIndexChanged",(index)=>{
            console.log("teleport mode changed to: ", index );
            app.gather.teleportMode = index;
        });
        teleportMode.setCurrentIndex(5);
        teleportButton.setObjectName("teleportButton");
        teleportButton.addEventListener("clicked", () =>{
            app.gather.teleportTo(nameEdit.text(), targetNameEdit.text());
        })
        teleportButton.setText("teleport");
        teleportButton.setInlineStyle("margin-right: 3px; padding: 2px;");
        targetNameEdit.setObjectName("targetNameEdit");
        toLabel.setText("to");
        toLabel.setInlineStyle("padding-left: 3px; padding-right: 3px;")
        rootLayout.addWidget(freezeButton);
        rootLayout.addWidget(freezeMode);
        rootLayout.addWidget(teleportButton);
        rootLayout.addWidget(teleportMode);
        rootLayout.addWidget(nameEdit);
        rootLayout.addWidget(toLabel);
        rootLayout.addWidget(targetNameEdit);

    }
}

export class GroupEdit extends QWidget {
    rootLayout = new QBoxLayout(Direction.LeftToRight);
    nameLabel = new QPushButton;
    groupCheckBoxes: Array<QCheckBox> = new Array();
    playerID = "";
    
    constructor(player: Player, clipboard: QClipboard | null){
        super();
        this.setObjectName("GroupEdit");
        this.setLayout(this.rootLayout);
        this.setFixedSize(600, 60);
        this.playerID = player.id;
        this.nameLabel.setText(player.name);
        this.nameLabel.setFixedSize(200,40);
        this.nameLabel.addEventListener("clicked",()=>{
            clipboard?.setText(player.name);
        });
        this.rootLayout.addWidget(this.nameLabel);
        player.groups.forEach((v, i, a)=>{
            this.groupCheckBoxes.push(new QCheckBox(this));
            this.groupCheckBoxes[i].setChecked(v);
            this.groupCheckBoxes[i].setFixedSize(100,40);
            this.groupCheckBoxes[i].addEventListener("clicked", () =>{
                a[i] = this.groupCheckBoxes[i].isChecked();
                console.log("edit group");
            });
            this.rootLayout.addWidget(this.groupCheckBoxes[i]);
        });
    }
}

export class NotifyEntry extends QWidget {
    rootLayout = new QBoxLayout(Direction.LeftToRight);
    objectEdit = new QLineEdit();
    mode = new QComboBox();
    activeBox = new QCheckBox();
    deleteButton = new QPushButton();
    obj = "";
    objPrev =  "";
    objectList: Map<string, NotifyObject>;
    deleteIcon = new QIcon(deleteIcon);
    deleteIconred = new QIcon(deleteIconRed);
    constructor(parent: NotifyPage, objectList_: Map<string, NotifyObject>){
        super();
        this.objectList = objectList_;
        this.setObjectName("NotifyEdit");
        this.setLayout(this.rootLayout);
        this.setFixedSize(600, 60);
        this.objectEdit.setFixedSize(200, 30);
        this.activeBox.setFixedSize(30, 30);
        this.activeBox.setInlineStyle("min-width: 20px; min-height: 20px");
        this.mode.setFixedSize(70,30);
        this.deleteButton.setObjectName("NotifyDeleteButton");
        this.deleteButton.setFixedSize(30,20);
        this.deleteButton.setIcon(this.deleteIcon);
        this.deleteButton.addEventListener(WidgetEventTypes.HoverEnter, ()=>{
            this.deleteButton.setIcon(this.deleteIconred);
        });
        this.deleteButton.addEventListener(WidgetEventTypes.HoverLeave, ()=>{
            this.deleteButton.setIcon(this.deleteIcon);
        });
        this.deleteButton.addEventListener("clicked", ()=>{
            parent.deleteEntry(this);
            this.objectList.delete(this.obj);
        });
        this.mode.addItems(["repeat", "once"]);
        this.objectEdit.addEventListener("editingFinished",()=>{
            this.obj = this.objectEdit.text().replace(/\s/g, "");
            if (this.objectList.has(this.objPrev)){
                this.objectList.delete(this.objPrev);
            }
            this.objectList.set(this.obj, this.setObj(this.obj));
            this.objPrev = this.obj;
            console.log("object edited") 
        });
        this.activeBox.setChecked(true);
        this.activeBox.addEventListener("clicked", ()=>{
            if (this.objectList.has(this.obj)){
                this.objectList.set(this.obj, this.setObj(this.obj));
            }

        });
        this.mode.addEventListener("currentIndexChanged", ()=>{
            if (this.objectList.has(this.obj)){
                this.objectList.set(this.obj, this.setObj(this.obj));
            }

        });

        this.rootLayout.addWidget(this.objectEdit);
        this.rootLayout.addWidget(this.activeBox);
        this.rootLayout.addWidget(this.mode);
        this.rootLayout.addWidget(this.deleteButton);
    }

    public updateCheckbox(){
        if (this.objectList.has(this.obj)){
            this.activeBox.setChecked(this.objectList.get(this.obj)?.isActive ?? false);
        }
    }

    private setObj(name_: string){
        let n = {
            mode: this.mode.currentIndex(),
            isActive: this.activeBox.isChecked(),
            name: name_,
        }
        return n;
    }
}

export class ScriptEntry extends QWidget {
    rootLayout = new QBoxLayout(Direction.LeftToRight);
    scriptName = new QLabel();
    mode = "";
    runButton = new QPushButton();
    constructor(scriptName: string, app: App){
        super();
        let plugin = new Plugin();
        this.setObjectName("ScriptEntry");
        this.setLayout(this.rootLayout);
        this.setFixedSize(500, 60);

        plugin.init(scriptName, app).then((name) => {
            this.scriptName.setText(name);
            if (plugin.mode == "oneShot"){
                this.runButton.setText(plugin.buttonString);
                this.runButton.addEventListener("clicked",()=>{
                    plugin.oneShot();
                    this.runButton.setText(plugin.buttonString);
                });
            }
            if (plugin.mode == "loop"){
                if(plugin.loopState){
                    this.runButton.setText("stop");
                }
                else{this.runButton.setText("start");}
                this.runButton.addEventListener("clicked",()=>{
                    if(plugin.loopState){
                        plugin.stop()
                        this.runButton.setText("start");
                        this.runButton.setStyleSheet(StyleB.inactive);
                    }
                    else{
                        plugin.start();
                        this.runButton.setText("stop");
                        this.runButton.setStyleSheet(StyleB.active);
                    }
                });
            }
        this.rootLayout.addWidget(this.scriptName);
        this.rootLayout.addWidget(this.runButton);
        });
    }
}
