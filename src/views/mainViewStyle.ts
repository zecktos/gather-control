export const style = 
`
QWidget {
    background-color: #FFFFFF
}

QPushButton {
    border-radius: 2px;
    border: 1px solid #4d4d4c;
    color: #1d1f21;
    background-color: qlineargradient( x1:0 y1:0, x2:0 y2:1, stop:1 #d6d6d6, stop:0 #FFFFFF);
}

QPushButton:hover {
    border: 1px solid #8e908c;
}

QPushButton:pressed {
    background-color: #d6d6d5;
}

QComboBox {
    border-radius: 2px;
    border: 1px solid #4d4d4c;
    color: #1d1f21;
    background-color: qlineargradient( x1:0 y1:0, x2:0 y2:1, stop:1 #d6d6d6, stop:0 #FFFFFF);
}

QComboBox:hover {
    border: 1px solid #8e908c;
}

QComboBox:drop-down {
    background-color: qlineargradient( x1:0 y1:0, x2:0 y2:1, stop:1 #d6d6d6, stop:0 #FFFFFF);
    color: 1d1f21;
}

QComboBox QAbstractItemView  {
    background-color: #FFFFFF;
    color: #1d1f21;
    border-radius: 2px;
}

QComboBox:down-arrow {
    color: #1d1f21;
}

QComboBox:item:selected  {
    color: #FFFFFF;
    border-radius: 2px;
    background-color: #4271ae;
}

QLabel {
    color: #1d1f21;
}

QLineEdit {
    border-radius: 2px;
    border: 1px solid #282a2e;
    background-color: #FFFFFF;
    color: #1d1f21;
}

QLineEdit:focus {
    border: 2px solid #4271ae;
}

QScrollBar {
    background-color: #f0f0f0;
    border-radius: 5px;
}

QScrollBar:handle {
    border-radius: 5px;
    background-color: #d6d6d6;
}

QScrollBar:handle:hover {
    background-color: #4271ae;
}

QScrollBar:add-line {
    background: none;
    border: none;
}

QScrollBar:sub-line {
    background: none;
    border: none;
}

#Header {
    background-color: #FFFFFF;
    align-items: 'flex-end';
    justify-content: 'center';
    flex: 1;
}

#SettingsButton {
    margin-left: 2px;
    margin-right: 5px;
    width: 40px;
    height: 30px;
}

#CentralWidget {
    align-self: 'center';
    margin: 3px;
    flex-direction: row;
    flex: 40;
}

#GlobalControls {
    align-self: 'stretch';
    align-items: 'center';
    justify-content: 'center';
    flex-direction: row;
    padding-right: 5px;
    padding-top: 10px;
    padding-bottom: 10px;
    flex: 2;
}
#LoadingPage {
    align-self: 'center';
    width: '100%';
    height: '100%';
    align-items: 'center';
    justify-content: 'center';
}

#PageSelect {
    align-self: 'flex-start';
    padding-left: 5px;
    padding-right: 20px;
    padding-top: 25px;
}

#PageSelect > QPushButton {
    background-color: #FFFFFF;
    border-radius: 15px;
    padding: 10px;
    border: 0px;
}

#PageSelect > QPushButton:hover {
    background-color: #e0e0e0;
}

#GroupEdit > QPushButton {
    background-color: #FFFFFF;
    text-align: left;
    border-radius: 2px;
    border: 0px;
}

#GroupEdit > QPushButton:pressed {
    color: #d6d6d5;
}

#GroupEdit:hover {
    border-radius: 5px;
    border: 1px solid #3e999f;
}

#NotifyEdit:hover {
    border-radius: 5px;
    border: 1px solid #3e999f;
}

#ScriptEntry:hover {
    border-radius: 5px;
    border: 1px solid #3e999f;
}

#NotifyAddButton {
    border-radius: 5px;
    border: 0px;
    background-color: #4271ae;
    color: #FFFFFF;
    margin-right: 15px;
    padding: 10px;
    width: 60px;
    height: 70px;
}

#NotifyAddButton:hover {
    border: 1px solid #1d1f21;
}

#NotifyAddButton:pressed {
    background-color: #365e91;
}

#NotifyDeleteButton:hover  {
    color: #c82829;
    border: 2px solid #c82829;
}

`