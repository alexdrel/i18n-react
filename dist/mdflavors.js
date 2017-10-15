"use strict";
exports.__esModule = true;
var R = {
    "``": /^(.*?)``(.*?)``(.*)$/,
    "*": /^(|.*?\W)\*(\S.*?)\*(|\W.*)$/,
    "**": /^(|.*?\W)\*\*(\S.*?)\*\*(|\W.*)$/,
    "_": /^(|.*?\W)_(\S.*?)_(|\W.*)$/,
    "__": /^(|.*?\W)__(\S.*?)__(|\W.*)$/,
    "~": /^(|.*?\W)~(\S.*?)~(|\W.*)$/,
    "~~": /^(|.*?\W)~~(\S.*?)~~(|\W.*)$/,
    "[]": /^(.*?)\[(.*?)\](.*)$/,
    "#": /^(|.*?(?=\n))\n*\s*#([^#].*?)#*\s*\n+([\S\s]*)$/,
    "##": /^(|.*?(?=\n))\n*\s*##([^#].*?)#*\s*\n+([\S\s]*)$/,
    "###": /^(|.*?(?=\n))\n*\s*###([^#].*?)#*\s*\n+([\S\s]*)$/,
    "####": /^(|.*?(?=\n))\n*\s*####([^#].*?)#*\s*\n+([\S\s]*)$/,
    "\n": /^(.*?)[^\S\n]*\n()[^\S\n]*([\s\S]*)$/,
    "{{}}": /^(.*?)\{\{(.*?)\}\}(.*)$/,
    "{}": /^(.*?)\{(.*?)\}(.*)$/
};
exports.mdFlavors = [
    {
        maybe: /[\*_\{\[\n]/,
        tags: {
            strong: R["*"],
            em: R["_"],
            p: R["[]"],
            h1: R["#"],
            h2: R["##"],
            h3: R["###"],
            h4: R["####"],
            br: R["\n"],
            self: R["{{}}"],
            inter: R["{}"]
        }
    },
    {
        maybe: /[`\*_~\{\[\n]/,
        tags: {
            literal: R["``"],
            strong: R["**"],
            em: R["*"],
            b: R["__"],
            i: R["_"],
            strike: R["~~"],
            u: R["~"],
            p: R["[]"],
            h1: R["#"],
            h2: R["##"],
            h3: R["###"],
            h4: R["####"],
            br: R["\n"],
            self: R["{{}}"],
            inter: R["{}"]
        }
    }
];
function mdMatch(md, value) {
    if (!value.match(md.maybe))
        return null;
    var tags = md.tags;
    var match = null, tag = null;
    for (var ctag in tags) {
        if (!tags.hasOwnProperty(ctag))
            continue;
        var cmatch = tags[ctag].exec(value);
        if (cmatch) {
            if (match == null || cmatch[1].length < match[1].length) {
                match = cmatch;
                tag = ctag;
            }
        }
    }
    return match && { tag: tag, head: match[1], body: match[2], tail: match[3] };
}
exports.mdMatch = mdMatch;
