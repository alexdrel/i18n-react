"use strict";
exports.__esModule = true;
;
function removeLiteralDelimiters(input) {
    var length = input.length;
    return input.substring(input[0] === ' ' ? 1 : 0, input[length - 1] === ' ' ? length - 1 : length);
}
function parseLiteral(value) {
    for (var start = 0; start < value.length;) {
        var token = "``";
        var begin = value.indexOf(token, start);
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
        if (end !== -1) {
            return {
                tag: "literal",
                head: value.substring(0, begin),
                body: removeLiteralDelimiters(value.substring(begin + token.length, end)),
                tail: value.substring(end + token.length)
            };
        }
        start = begin + token.length;
    }
    return null;
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
