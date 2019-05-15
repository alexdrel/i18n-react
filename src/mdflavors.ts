type RegExpEx = RegExp | [RegExp, [number, number, number]];
export interface MDFlavor {
  maybe: RegExp;
  tags: { [type: string]: RegExpEx };
}

const R: { [name: string]: RegExpEx } = {
  "`` ": [/^(.*?(?:(?!`).|^))(``+)\s(.*?)\s\2(?!`)(.*)$/, [1, 3, 4]],
  "``": [/^(.*?(?:(?!`).|^))(``+)(?!`)(.*?(?!`).)\2(?!`)(.*)$/, [1, 3, 4]],
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
      literals: R["`` "],
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

type MDMatch = { tag: string, head: string, body: string, tail: string };

export function mdMatch(md: MDFlavor, value: string): MDMatch | null {
  if (!value.match(md.maybe))
    return null;

  const tags = md.tags;
  let match: MDMatch | null = null;

  for (let ctag in tags) {
    if (!tags.hasOwnProperty(ctag)) continue;

    const rg = tags[ctag];
    const [regex, groups] = rg instanceof RegExp ? [rg, [1, 2, 3]] : rg;

    const cmatch = regex.exec(value);
    if (cmatch) {
      if (match == null || cmatch[groups[0]].length < match.head.length) {
        match = { tag: ctag, head: cmatch[groups[0]], body: cmatch[groups[1]], tail: cmatch[groups[2]] };
      }
    }
  }
  return match;
}
