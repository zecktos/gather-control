import { FileMode, FlexLayout, QFileDialog, QLabel, QLineEdit, QPushButton,  QWidget } from "@nodegui/nodegui";
import { App } from "../app";
import { style } from "./settingsViewStyle";
const  { version } =  require("../../package.json");

export class SettingsView extends QWidget {
    rootLayout = new FlexLayout();
    box = new QWidget();
    boxLayout = new FlexLayout();
    keyLabel = new QLabel();
    keyInput = new QLineEdit();
    spaceLabel = new QLabel();
    spaceInput = new QLineEdit();
    saveButton = new QPushButton();
    versionLabel = new QLabel();

    dirSelectDialog = new QFileDialog();
    dirSelectButton = new QPushButton();
    dirSelectLabel = new QLabel();
    dirPath = "";

    constructor(app: App){
        super();
        this.box.setObjectName("Box");
        this.box.setLayout(this.boxLayout);

        this.setObjectName("SettingsView");
        this.setLayout(this.rootLayout);

        this.keyLabel.setText("api key");
        this.boxLayout.addWidget(this.keyLabel);
        this.boxLayout.addWidget(this.keyInput)

        this.spaceLabel.setText("space ID");
        this.boxLayout.addWidget(this.spaceLabel);
        this.boxLayout.addWidget(this.spaceInput);

        this.dirSelectLabel.setText("scripts directory");
        this.dirSelectDialog.setFileMode(FileMode.Directory);
        this.dirSelectButton.addEventListener("clicked", ()=>{
                this.dirSelectDialog.exec();
                this.dirPath = this.dirSelectDialog.selectedFiles()[0];
                this.dirSelectButton.setText(this.dirPath);
        });
        this.boxLayout.addWidget(this.dirSelectLabel);
        this.boxLayout.addWidget(this.dirSelectButton);

        this.saveButton.setObjectName("SaveButton");
        this.saveButton.setText("save");
        this.saveButton.addEventListener('clicked', () => this.saveAndClose(app));
        this.boxLayout.addWidget(this.saveButton);

        this.rootLayout.addWidget(this.box);

        this.versionLabel.setObjectName("VersionLabel");
        this.versionLabel.setText("version:  " + version);
        this.rootLayout.addWidget(this.versionLabel);

        this.setStyleSheet(style);
    }

    private convertToSpaceId(inputStr: string){
        inputStr = inputStr.trim();
        if (inputStr.charAt(0) == "/"){
            inputStr = inputStr.substring(1);
        }
        let parts = inputStr.split("/");
        let id = parts[0] + "\\" + parts[1];
        return id;
    }

    private convertFromSpaceId(id: string){
        let idParts = id.split("\\");
        let outputStr = idParts[0] + "/" + idParts[1];
        return outputStr;
    }

    private  saveAndClose(app: App){
        app.settings.appConfig.apiKey = this.keyInput.text().trim();
        app.settings.appConfig.spaceID = this.convertToSpaceId(this.spaceInput.text());
        app.settings.appConfig.scriptDir = this.dirPath;
        app.settings.saveAppConfig();
        app.switchView("main");
    }

    public setConfig(app: App){
        this.keyInput.setText(app.settings.appConfig.apiKey);
        this.spaceInput.setText(this.convertFromSpaceId(app.settings.appConfig.spaceID));
        this.dirSelectButton.setText(app.settings.appConfig.scriptDir);
        this.dirPath = app.settings.appConfig.scriptDir;
    }
}
