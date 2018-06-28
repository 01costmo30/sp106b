// 本檔案僅將06-assembler-hack/js/ash.js重新打過理解一遍 雖然有因檔案位置稍做修改，但基本跟老師的一模一樣
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

var symTable = {
  "R0"  :0,
  "R1"  :1,
  "R2"  :2,
  "R3"  :3,
  "R4"  :4,
  "R5"  :5,
  "R6"  :6,
  "R7"  :7,
  "R8"  :8,
  "R9"  :9,
  "R10" :10,
  "R11" :11,
  "R12" :12,
  "R13" :13,
  "R14" :14,
  "R15" :15,
  "SP"  :0,
  "LCL" :1,
  "ARG" :2,
  "THIS":3, 
  "THAT":4,
  "KBD" :24576,
  "SCREEN":16384
};

var symTop = 16;

function addSymbol(symbol) {
    symTable[symbol] = symTop;
    symTop ++;
}

function assemble(asmFile, objFile) {
    var asmText = fs.readFileSync(asmFile, "utf8");
    var lines = asmText.split(/\r?\n/);
    c.log(JSON.stringify(lines, null, 2));
    // lines[0].match(/^([^\/]*)(\/*.)?$/);
    // c.log("line = " + RegExp.$1.trim());
    pass1(lines);
    pass2(lines, objFile);
}

function parse(line, i) {
    line.match(/^([^\/]*)(\/*.)?$/); //去掉斜綫開頭的
    line = RegExp.$1.trim();
    if (line.length===0) {
        return null;
    }
    if (line.startsWith("@")) {
        return {type: "A", arg: line.substring(1).trim() };
    } else if (line.match(/^\(([^\)]+)\)$/)) { //符合有()且挂號内至少有一個字元
        return {type: "S", symbol: RegExp.$1}
    } else if (line.match(/^((([AMD]*)=)?([AMD01\+\-\&\|\!]*))(;(\w*))?$/)) { //符合(AMD出現0至多次=出現一次)出現0至1次(AMD01+-&|!出現0至多次)(;出現一次[A-Za-z0-9_]出現0至多次)出現0至1次
        return {type: "C", c: RegExp.$4, d: RegExp.$3, j:RegExp.$6 }
    }else {
        throw "Error: line" + (i+1);
    }
}

function pass1(lines) {
    c.log("==== 濾出組合語言&顯示原檔案所在行號&address行號 ====");
    var address = 0;
    for (var i=0; i<lines.length; i++) {
        var p = parse(lines[i], i);
        if (p===null) continue;
        if (p.type === "S") { // 將有()的那行(goto某function的那個function)以“symbol: function名 address行號”印出
            c.log("symbol: %s %s", p.symbol, intToStr(address, 4, 10));
            symTable[p.symbol] = address;
            continue;
        } else { // 將”原檔行號:address行號 組合語言“印出
            c.log(" p: %j", p);
        }
        c.log("%s:%s %s", intToStr(i+1, 3, 10), intToStr(address, 4, 10), lines[i]);
        address++;
    }
}

function pass2(lines, objFile) {
    c.log("========== 將組合語言轉成機器碼寫入檔案 ==========");
    var ws = fs.createWriteStream(objFile);
    ws.once('open', function(fd) {
        var address = 0;
        for (var i=0; i<lines.length;i++) {
            var p = parse(lines[i], i);
            if (p===null || p.type === "S") continue;
            var code = toCode(p);
            c.log("%s:%s %s", intToStr(i+1, 3, 10), intToStr(code, 16, 2), lines[i]);
            ws.write(intToStr(code, 16, 2)+"\n");
            address++;
        }
        ws.end();
    });
}

function intToStr(num, size, radix) { // 將數字轉成radix進制的size長度字串
    var s = num.toString(radix)+"";
    while (s.length < size) s = "0" +s;
    return s;
}

function toCode(p) {
    var address;
    if (p.type === "A") { 
        if (p.arg.match(/^\d+$/)) {
            address = parseInt(p.grg);
        } else {
            address = symTable[p.arg];
            if (typeof address === 'undefined') {
                address = symTop;
                addSymbol(p.arg, address);
            }
        }
        return address;
    } else {
        var d = dlist[p.d];
        var cx = clist[p.c];
        var j = jlist[p.j];
        return 0b111<<13|cx<<6|d<<3|j;
    }
}
assemble(Rfile, Nfile);