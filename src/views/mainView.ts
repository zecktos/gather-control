import { FlexLayout, QWidget, QPushButton, QIcon, QStackedWidget } from "@nodegui/nodegui";
import { App } from "../app";
import settingsIcon from '../../assets/cogs.svg';
import groupIcon from '../../assets/account-multiple-outline.svg';
import notifyIcon from '../../assets/bell-alert.svg';
import scriptIcon from '../../assets/language-javascript.svg'
import defaultIcon from '../../assets/star-circle-outline.svg';
import { style } from "./mainViewStyle";
import { GroupPage } from "./pages/groupPage";
import { NotifyPage } from "./pages/notifyPage";
import { ScriptsPage } from "./pages/scriptsPage";
import { GlobalControls, Page, PageSelect } from "../components/uiElements";
import { LoadingPage } from "./pages/loadingPage";

export class MainView extends QWidget {
    isFirstRun = true;
    rootLayout = new FlexLayout();
    header = new QWidget();
    headerLayout = new FlexLayout();
    centralWidget = new QWidget();
    centralWidgetLayout = new FlexLayout();
    settingsButton = new QPushButton();
    addDoorButton = new QPushButton();
    testButtonB = new QPushButton();

    pages: Array<Page>;
    pageStack= new QStackedWidget();
    pageSelect = new PageSelect();

    constructor(app: App){
        super();
        this.setObjectName("mainView");
        this.setLayout(this.rootLayout);
        this.header.setObjectName("Header");
        this.header.setLayout(this.headerLayout);
        this.settingsButton.setObjectName("SettingsButton");
        this.settingsButton.setIcon(new QIcon(settingsIcon));
        this.settingsButton.addEventListener("clicked", ()=> {app.switchView("settings")})
        this.headerLayout.addWidget(this.settingsButton);

        this.centralWidget.setObjectName("CentralWidget");
        this.centralWidget.setLayout(this.centralWidgetLayout);
        
        
        this.pageSelect.setObjectName("PageSelect");    
        this.pages = [new GroupPage(app.gather.playerList), new NotifyPage(app.gather.objList), new ScriptsPage(app)]
        this.pages[0].setObjectName("GroupPage");
        this.pages.forEach((v, i)=>{
            let name = "";
            let icon = defaultIcon;
            switch (i) {
                case 0:
                    name = " Groups  ⟳ "
                    icon = groupIcon;
                    break;
                case 1:
                    name = " Notify "
                    icon = notifyIcon;
                    break;
                case 2:
                    name = " Scripts "
                    icon = scriptIcon;
                    break;
            }
            this.pageStack.addWidget(this.pages[i]);
            this.pageSelect.addButton(this.pages[i], name, new QIcon(icon), this.pageStack);
        });
        let loadingPage = new LoadingPage();
        loadingPage.setObjectName("LoadingPage");
        this.centralWidgetLayout.addWidget(loadingPage);
        let waitForConnected = setInterval(()=>{
            if (app.gather.connected) {
                setTimeout(()=>{
                    this.centralWidgetLayout.removeWidget(loadingPage);
                    this.centralWidgetLayout.addWidget(this.pageSelect);
                    this.centralWidgetLayout.addWidget(this.pageStack);
                    this.pageSelect.select(app.settings.appConfig.page?? 0);
                    this.pages.forEach((e)=>{e.init()});
                }, 3500);
                clearInterval(waitForConnected);
            }
        }, 100);
        this.rootLayout.addWidget(this.header);
        this.rootLayout.addWidget(new GlobalControls(app));
        this.rootLayout.addWidget(this.centralWidget);
        this.setStyleSheet(style);
    }
}