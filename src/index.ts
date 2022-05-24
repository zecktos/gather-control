import { App } from './app'
import { GatherConfigPath } from './components/settingsStore';
import { createWriteStream, writeFileSync } from 'fs';
import path from 'path';
import fs from 'fs';


let logFile = path.join(GatherConfigPath(), "log.txt");
// create/clear log file
try {
    writeFileSync(logFile, '');
}
catch (err) {
    fs.mkdirSync(GatherConfigPath());
    console.log("create user data directory");
    writeFileSync(logFile, '');
}

// redirect console.log to logfile
let access = createWriteStream(logFile);
process.stdout.write = access.write.bind(access) as any;
process.stderr.write = access.write.bind(access) as any;
process.on('uncaughtException', function (err) {
    console.error((err && err.stack) ? err.stack : err);
});

const app = new App();

app.init();