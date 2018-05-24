var fs = require('fs');
var c = console;
var Rfile = process.argv[2];
var Nfile = Rfile.substring(0, Rfile.length-4) + ".hack";

function assemble(asmFile, objFile) {
    var asmText = fs.readFileSync(asmFile, "utf8");
    var lines = asmText.split(/\r?\n/);
    c.log(JSON.stringify(lines, null, 2));
    // lines[0].match(/^([^\/]*)(\/*.)?$/);
    // c.log("line = " + RegExp.$1.trim());
}

function parse(line, i) {
    line.match(/^([^\/]*)(\/*.)?$/); //去掉斜綫開頭的
    line = RegExp.$1.trim();
    if (line.length===0) {
        return null;
    }
    if (line.startwith("@")) {
        return {type: "A", at: line.substring(1).trim() };
    } else if (line.match(/^\(([^\)]+)\)$/)) {
        return {type: "S", symbol: RegExp.$1}
    } else if (line.match(/^((([AMD]*)=)?([AMD01\+\-\&\|\!]*)(\w*))?$/)) {
        return {type: "C", c: RegExp.$4, d: RegExp.$3}
    }
}

assemble(Rfile, Nfile);