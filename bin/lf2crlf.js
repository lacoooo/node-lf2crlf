#! /usr/bin/env node

var cwd = process.cwd();
var path = require("path");
var fs = require("fs");
var opts = require("nomnom")
    .script("lf2crlf")
    .option("DIR", {
        position: 0,
        required: true,
        help: "the directory to be LF2CRLFed.",

        callback: function(DIR) {
            var dir = path.resolve(cwd, DIR);

            try {
                var stat = fs.statSync(dir);
                if(!stat.isDirectory()) {
                    return "The <DIR> is not a directory.";
                }
            } catch(e) {
                return "Directory may not existing: " + e.message;
            }
        }
    })
    .option("recur", {
        abbr: "r",
        flag: true,
        help: "whether the directory should be recurred."
    })
    .parse();

var lf2crlf = require("../lib/lf2crlf");
var dir = path.resolve(cwd, opts.DIR);

lf2crlf(dir, opts.recur);

console.log("done.");
