
export const StyleA = {
    active:         
    `
        QPushButton {
            background-color: #4271ae;
            color: #FFFFFF;
        }

        QPushButton:hover {
            color: #e0e0e0;
        }
    `,

    inactive:         
    `
        QPushButton {
            background-color: #FFFFFF;
            color: #1d1f21;
        }
        QPushButton:hover {
            background-color: #e0e0e0;
        }

`
}

export const StyleB = {
    active:         
    `
    QPushButton {
        border-radius: 2px;
        border: 2px solid #c82829;
        color: #c82829;
        background-color: qlineargradient( x1:0 y1:0, x2:0 y2:1, stop:1 #d6d6d6, stop:0 #FFFFFF);
        margin-right: 3px;
        padding: 2px;
    }

    QPushButton:hover {
        border: 2px solid #f23838;
    }

    QPushButton:pressed {
        background-color: #d6d6d5;
    }

    `,

    inactive:        
    `
    QPushButton {
        border-radius: 2px;
        border: 1px solid #4d4d4c;
        background-color: qlineargradient( x1:0 y1:0, x2:0 y2:1, stop:1 #d6d6d6, stop:0 #FFFFFF);
        margin-right: 3px;
        padding: 2px;
    }

    QPushButton:hover {
        border: 1px solid #8e908c;
    }

    QPushButton:pressed {
        background-color: #d6d6d5;
    }

    `
}