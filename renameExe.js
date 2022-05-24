if (process.platform == "win32"){
    const fse = require('fs-extra');
    console.log("rename windows exe");
    var buildDir = "./deploy/win32/build/GatherControl/";
    var qodeBin = buildDir + "qode.exe";
    var gatherBin = buildDir + "GatherControl.exe";
    fse.moveSync(qodeBin, gatherBin);
    console.log("done !");
}