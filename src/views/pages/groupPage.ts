import { GroupEdit, Page } from "../../components/uiElements";
import { Player } from "../../components/gatherClient";
import { Direction, QApplication, QBoxLayout, QLabel, QScrollArea, QWidget, ScrollBarPolicy, SizeConstraint } from "@nodegui/nodegui";

export class GroupPage extends Page {
    editEntrys = new Array<GroupEdit>();
    playerList: Map<string, Player>;
    titleRow = new QWidget();
    titleRowLayout = new QBoxLayout(Direction.LeftToRight);
    list = new QWidget();
    listLayout = new QBoxLayout(Direction.TopToBottom);
    scrollArea = new QScrollArea();
    clipboard = QApplication.clipboard();
    test = 0;

    constructor(playerList_: Map<string, Player>){
        super();
        this.playerList = playerList_;
        this.list.setLayout(this.listLayout);
        this.listLayout.setSizeConstraint(SizeConstraint.SetMinimumSize);
        this.list.setMinimumSize(600, 60);
        this.titleRow.setLayout(this.titleRowLayout);
        this.titleRow.setInlineStyle("flex-direction: row; padding-bottom: 20px;");
        let labels = [];
        for ( let i=0; i < 5; i++){
            let l = new QLabel();
            if (i == 0){ l.setFixedSize(125,40);}
            else { l.setFixedSize(100,40);}
            labels.push(l);
            this.titleRowLayout.addWidget(labels[i]);
        }
        labels[0].setText("Player");
        labels[1].setText("Group A");
        labels[2].setText("Group B");
        labels[3].setText("Group C");
        labels[4].setText("Group D");
        this.titleRow.setFixedSize(600, 70);
        this.listLayout.addWidget(this.titleRow);
        this.scrollArea.setInlineStyle("border: none; flex: 1;");
        this.scrollArea.setVerticalScrollBarPolicy(ScrollBarPolicy.ScrollBarAsNeeded);
        this.scrollArea.setHorizontalScrollBarPolicy(ScrollBarPolicy.ScrollBarAlwaysOff);
        this.scrollArea.setWidget(this.list);
        this.rootLayout.addWidget(this.scrollArea);
        
    }
    
    public override refresh(){
        let entryIDs: string[] = [];
        this.editEntrys?.forEach((entry, index) => {
            if (this.playerList.has(entry.playerID)){
                // update entry maybe name changed ?
                let p = this.playerList.get(entry.playerID);
                if (p){entry.nameLabel.setText(p.name);}
            }
            else {
                // no need to remove a player entry because we dont remove player id from list on disconnect
                // thats easyer for players reloading session
                /*
               this.rootLayout.removeWidget(entry);
               this.editEntrys.splice(index,1);
               */
            }
        
            entryIDs.push(entry.playerID);
        });
        for (let id of this.playerList?.keys()){
            if ( !(entryIDs.includes(id))){
            // add entry
            let p = this.playerList.get(id);
                if (p) { let e = new GroupEdit(p, this.clipboard);
                    this.listLayout.insertWidget(1,e); 
                    this.list.adjustSize(); 
                    this.editEntrys.push(e);
                }
            }
        }

        if (this.test == 1){
            for (let i=0; i< 3; i++){
                let p: Player = {
                    name: "unreal",
                    groups: [false, false, false, false],
                    id: "xxxxxxx",
                }
                this.listLayout.insertWidget(1,new GroupEdit(p, this.clipboard));
                console.log("entry generated");
                this.list.adjustSize();
            }
        }
    }

    public override init(){
        this.refresh();
    }
    
}