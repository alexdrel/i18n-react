function trimString(input: string) : string {
  input = String(input);
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
  return input.trim ? input.trim() : input.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
}

function processLiteral(value: string): object {
  let token = "``";
  const begin = value.indexOf(token);

  if (begin === -1) {
    return null;
  }

  while(value[begin + token.length] === "`") {
    token += "`";
  };

  let end = begin;

  do {
    end = value.indexOf(token, end + token.length);
  } while(end !== -1 && (value[end - 1] === "`" || value[end + token.length] === "`"))

  if (end === -1) {
    return null;
  }

  return {
    tag: 'literal',
    head: value.substring(0, begin),
    body: trimString(value.substring(begin + token.length, end)),
    tail: value.substring(end + token.length),
  };
}

const R = {
  "``": processLiteral,
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
  tags: { [type: string]: RegExp | Function };
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

export function mdMatch(md: MDFlavor, value: string) {
  if (!value.match(md.maybe))
    return null;

  const tags = md.tags;

  let match: RegExpExecArray = null,
    tag: string = null;

  for (let ctag in tags) {
    if (!tags.hasOwnProperty(ctag)) continue;

    const tagParser = tags[ctag];

    if (typeof tagParser === 'function') {
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
