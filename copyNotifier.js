
const fse = require('fs-extra');

let buildDir;
let notifyModule;

switch (process.platform){
    case "linux":
        process.exit();

    case "win32":     
        buildDir = "./deploy/win32/GatherControl/";
        notifyModule = "node_modules/node-notifier/vendor/snoreToast/";
        break;
    
    case "darwin":
        buildDir = "./deploy/darwin/GatherControl.app/Contents/Resources/"
        notifyModule = "node_modules/node-notifier/vendor/mac.noindex/";
        break;
}
console.log("copy node-notifier bin to deploy directory ");
fse.copySync("./" + notifyModule, buildDir + notifyModule);
console.log("done ! ");

