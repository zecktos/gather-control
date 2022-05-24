import { QMainWindow, QStackedWidget, WidgetEventTypes } from '@nodegui/nodegui';
import { SettingsView } from './views/settingsView'
import { MainView } from './views/mainView';
import { GatherClient } from './components/gatherClient'
import { SettingsStore } from './components/settingsStore'


export class App {
  
  gather = new GatherClient(this);
  win = new QMainWindow();
  root = new QStackedWidget();
  settingsWidget = new SettingsView(this);
  mainWidget = new MainView(this);
  settings = new SettingsStore();

  constructor() {
    this.win.setWindowTitle("Gather Control");
    this.win.setMinimumSize(800, 350);

    this.mainWidget.setObjectName("myroot");
    this.root.addWidget(this.mainWidget);
    this.root.addWidget(this.settingsWidget);
    this.win.setCentralWidget(this.root);
  }

  public init() {
    this.win.resize(this.settings.appConfig.width, this.settings.appConfig.height);
    this.win.addEventListener(WidgetEventTypes.Close, () => {
      this.settings.appConfig.width = this.win.size().width();
      this.settings.appConfig.height = this.win.size().height();
      this.settings.appConfig.page = this.mainWidget.pageStack.currentIndex();
      this.settings.saveAppConfig();
      this.settings.saveSession(this.gather.objList);
      console.log("exit");
    })

    if (this.settings.appConfig.apiKey == "" || typeof this.settings.appConfig.apiKey == "undefined") {
      this.switchView("settings");
    }
    else { this.switchView("main"); }

    this.win.show();

    let readyLog = setInterval(()=>{
      if (this.gather.connected) {
        console.log("----> READY <-----");
        clearInterval(readyLog);
      }
    },100,);

    (global as any).win = this.win;
  }

  public switchView(view: string) {
    switch (view) {
      case "main":
        if (this.mainWidget.isFirstRun) {
          this.gather.init(this.settings.appConfig.apiKey, this.settings.appConfig.spaceID, this.settings.getNotifyObjects());
          this.mainWidget.isFirstRun = false;
        }
        this.root.setCurrentWidget(this.mainWidget);
        break;
      case "settings":
        this.root.setCurrentWidget(this.settingsWidget);
        this.settingsWidget.setConfig(this);
        break;
    }
  }
}