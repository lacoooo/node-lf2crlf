var path = require("path");
var fs = require("fs");

function _isBinary(buf) {
    for(var i = 0; i < buf.length; i++) {
        if(buf[i] <= 8) return true;
    }
    return false;
}

function _processFile(filename) {
    try {

        const buf = fs.readFileSync(filename);

        if(_isBinary(buf)) return;

        console.log("process file:", filename);
        let wrapCount = 0
        for (let i = 0; i < buf.length; i++) {
            const num = buf[i]
            if (num === 13) {
                console.log("The above file is already crlf")
                return
            }
            if (num === 10) {
                wrapCount ++
            }
        }
        const res = Buffer.alloc(buf.length + wrapCount);
        let resLen = 0
        for (let i = 0; i < buf.length; i++) {
            const num = buf[i]
            if (num === 10) {
                res[resLen] = 13
                resLen ++
            }
            res[resLen] = num
            resLen ++
        }
        fs.writeFileSync(filename, res);

    } catch(e) {
        console.error("failed to process", filename + ":", e.message);
    }
}

var lf2crlf = module.exports = function(dir, recur) {
    try {
        var files = fs.readdirSync(dir);
        for(var i = 0; i < files.length; i++) {
            var filename = path.resolve(dir, files[i]);
            
            var stat = fs.statSync(filename);

            if(stat.isDirectory() && recur) {
                lf2crlf(filename, recur);
                continue;
            }

            if(stat.isFile()) {
                _processFile(filename);
            }
        }
    } catch(e) {
        console.error("Failed.", e.message);
    }
};

