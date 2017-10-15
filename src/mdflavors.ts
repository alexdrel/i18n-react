const R = {
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
  "{}": /^(.*?)\{(.*?)\}(.*)$/,
};

export interface MDFlavor {
  maybe: RegExp;
  tags: { [type: string]: RegExp };
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

    const cmatch = tags[ctag].exec(value);
    if (cmatch) {
      if (match == null || cmatch[1].length < match[1].length) {
        match = cmatch;
        tag = ctag;
      }
    }
  }

  return match && { tag, head: match[1], body: match[2], tail: match[3] };
}
