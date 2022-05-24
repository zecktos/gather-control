import { QLabel } from "@nodegui/nodegui";
import { Page } from "../../components/uiElements";

export class LoadingPage extends Page {
    label = new QLabel();

    constructor(){
        super();
        this.label.setObjectName("loadingText")
        this.label.setText("connecting to gather town ...");
        this.rootLayout.addWidget(this.label);
    }
}