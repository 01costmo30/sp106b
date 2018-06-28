var fs = require('fs');
var c = console;
var Rfile = process.argv[2];
var Nfile = Rfile.substring(0, Rfile.length-4) + ".hack";

var dlist = {
    "" :0b000,
    "M" :0b001,
    "D" :0b010,
    "MD" :0b011,
    "A" :0b110,
    "AM" :0b101,
    "AD" :0b110,
    "AMD" :0b111,
}

var jlist = {
    "" :0b000,
    "JGT" :0b001,
    "JEQ" :0b010,
    "JGE" :0b011,
    "JLT" :0b100,
    "JNE" :0b101,
    "JLE" :0b110,
    "JMP" :0b111
}

var clist = {
    "0" :0b0101010,
    "1" :0b0111111,
    "-1" :0b0111010,
    "D" :0b0001100,
    "A" :0b0110000,
    "!D" :0b0001101,
    "!A" :0b0110001,
    "-D" :0b0001111,
    "-A" :0b0110011,
    "D+1" :0b0011111,
    "A+1" :0b0110111,
    "D-1" :0b0001110,
    "A-1" :0b0110010,
    "D+A" :0b0000010,
    "D-A" :0b0010011,
    "A-D" :0b0000111,
    "D&A" :0b0000000,
    "D|A" :0b0010101,
    "M" :0b1110000,
    "!M" :0b1110001,
    "-M" :0b1110011,
    "M+1" :0b1110111,
    "M-1" :0b1110010,
    "D+M" :0b1000010,
    "D-M" :0b1010011,
    "M-D" :0b1000111,
    "D&M" :0b1000000,
    "D|M" :0b1010101
}

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
    }else {
        throw "Error: line" + (i+1);
    }
}

function 

assemble(Rfile, Nfile);