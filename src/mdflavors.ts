export interface MDMatchResult {
  tag: string;
  head: string;
  body: string;
  tail: string;
};

export type MDTagParser = (value: string) => MDMatchResult;

function removeLiteralDelimiters(input: string) : string {
  const { length } = input;
  return input.substring(input[0] === ' ' ? 1 : 0, input[length - 1] === ' ' ? length - 1 : length);
}

function parseLiteral(value: string): MDMatchResult {
  for (let start = 0; start < value.length;) {
    let token = "``";

    const begin = value.indexOf(token, start);

    if (begin === -1) {
      return null;
    }

    while (value[begin + token.length] === "`") {
      token += "`";
    }

    let end = begin;

    do {
      end = value.indexOf(token, end + token.length);
    } while (end !== -1 && (value[end - 1] === "`" || value[end + token.length] === "`"));

    if (end !== -1) {
      return {
        tag: "literal",
        head: value.substring(0, begin),
        body: removeLiteralDelimiters(value.substring(begin + token.length, end)),
        tail: value.substring(end + token.length),
      };
    }

    start = begin + token.length;
  }

  return null;
}

const R = {
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
  "{}": /^(.*?)\{(.*?)\}(.*)$/,
};

export interface MDFlavor {
  maybe: RegExp;
  tags: { [type: string]: RegExp | MDTagParser };
}

export const mdFlavors: MDFlavor[] = [
  { // V0
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
      inter: R["{}"],
    }
  },
  { // V1
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
      inter: R["{}"],
    }
  }
];

export function mdMatch(md: MDFlavor, value: string): MDMatchResult {
  if (!value.match(md.maybe))
    return null;

  const tags = md.tags;

  let match: RegExpExecArray = null,
    tag: string = null;

  for (let ctag in tags) {
    if (!tags.hasOwnProperty(ctag)) continue;

    const tagParser = tags[ctag];

    if (typeof tagParser === "function") {
      const parsed = tagParser(value);
      if (parsed) {
        return parsed;
      } else {
        continue;
      }
    }

    const cmatch = tagParser.exec(value);
    if (cmatch) {
      if (match == null || cmatch[1].length < match[1].length) {
        match = cmatch;
        tag = ctag;
      }
    }
  }

  return match && { tag, head: match[1], body: match[2], tail: match[3] };
}
