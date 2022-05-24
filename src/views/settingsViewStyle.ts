export const style =
`
#SettingsView {
    background-color: #FFFFFF;
    align-items: 'center';
    justify-content: 'center';
}

#Box {
    margin-top: 150px;
    width: 400px;
    height: '100%';
    flex: 4;

}

#VersionLabel {
    flex: 1;
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

#SaveButton {
    border-radius: 5px;
    border: 0px;
    background-color: #4271ae;
    color: #FFFFFF;
    margin-top: 10px;
    width: 100px;
}

#SaveButton:hover {
    border: 1px solid #1d1f21;
}

#SaveButton:pressed {
    background-color: #365e91;
}

`