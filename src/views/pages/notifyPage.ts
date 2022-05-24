import { NotifyEntry, Page } from "../../components/uiElements";
import { Direction, QBoxLayout, QPushButton, QWidget, QScrollArea, ScrollBarPolicy, SizeConstraint, QIcon } from "@nodegui/nodegui";
import type { NotifyObject } from '../../components/gatherClient'
import addIcon from '../../../assets/plus-box.png'

export class NotifyPage extends Page {
    NotifyEntrys = new Array<NotifyEntry>();
    list = new QWidget();
    addButon = new QPushButton();
    listLayout = new QBoxLayout(Direction.TopToBottom);
    scrollArea = new QScrollArea();
    objList: Map<string, NotifyObject>;
    initRefresh = true;

    constructor(objList_: Map<string, NotifyObject>){
        super();
        this.objList = objList_;
        this.setObjectName("NotifyPage");
        this.list.setLayout(this.listLayout);
        this.setInlineStyle("flex-direction: column;")
        this.list.setMinimumSize(600,60);
        this.listLayout.setSizeConstraint(SizeConstraint.SetMinimumSize);
        this.addButon.setObjectName("NotifyAddButton");
        this.addButon.setFixedSize(45,30);
        this.addButon.setInlineStyle("padding-right: 15px; padding-bottom: 10px; margin-right: 10px; width: 100px; height: 60px")
        this.addButon.setIcon(new QIcon(addIcon));
        this.addButon.setInlineStyle("align-self: flex-end; margin-right: 5px;")
        this.addButon.addEventListener("clicked", ()=>{this.addEntry()});
        this.rootLayout.addWidget(this.addButon);
        this.scrollArea.setInlineStyle("border: none; flex: 1;");
        this.scrollArea.setVerticalScrollBarPolicy(ScrollBarPolicy.ScrollBarAsNeeded);
        this.scrollArea.setHorizontalScrollBarPolicy(ScrollBarPolicy.ScrollBarAlwaysOff);
        this.scrollArea.setWidget(this.list);
        this.rootLayout.addWidget(this.scrollArea);
    }

    private addEntry(){
        let n = new NotifyEntry(this, this.objList);
        this.listLayout.insertWidget(-1,n);
        this.list.adjustSize();
        this.NotifyEntrys.push(n);
        this.list.adjustSize();
        return n;
    }

    public override refresh() {
        if (this.initRefresh){
            console.log("create saved entrys");
            this.objList.forEach((e)=>{
                let n = this.addEntry();
                n.objectEdit.setText(e.name);
                n.mode.setCurrentIndex(e.mode);
                n.activeBox.setChecked(e.isActive);
                n.obj = e.name;
                n.objPrev = e.name;
            });
            this.initRefresh = false;
        }
        this.NotifyEntrys.forEach((e) => {
           e.updateCheckbox();
       }); 
    }

    public deleteEntry(entry: NotifyEntry){
        entry.hide();
        this.NotifyEntrys.forEach((e, i)=>{
            if (e == entry){
                console.log("delete Entry");
                this.NotifyEntrys.splice(i,1);
            }
        })
        this.listLayout.removeWidget(entry);
        this.list.adjustSize();
    }

    public override init() {
        this.refresh(); 
    }
}