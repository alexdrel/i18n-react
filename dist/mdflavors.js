"use strict";
exports.__esModule = true;
;
function trimString(input) {
    input = String(input);
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
    return input.trim ? input.trim() : input.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}
function parseLiteral(value) {
    var token = "``";
    var begin = value.indexOf(token);
    if (begin === -1) {
        return null;
    }
    while (value[begin + token.length] === "`") {
        token += "`";
    }
    var end = begin;
    do {
        end = value.indexOf(token, end + token.length);
    } while (end !== -1 && (value[end - 1] === "`" || value[end + token.length] === "`"));
    if (end === -1) {
        return null;
    }
    return {
        tag: "literal",
        head: value.substring(0, begin),
        body: trimString(value.substring(begin + token.length, end)),
        tail: value.substring(end + token.length)
    };
}
var R = {
    "``": parseLiteral,
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
        var tagParser = tags[ctag];
        if (typeof tagParser === "function") {
            var parsed = tagParser(value);
            if (parsed) {
                return parsed;
            }
            else {
                continue;
            }
        }
        var cmatch = tagParser.exec(value);
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
