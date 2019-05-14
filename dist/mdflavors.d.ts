export interface MDMatchResult {
    tag: string;
    head: string;
    body: string;
    tail: string;
}
export declare type TagParser = (value: string) => MDMatchResult;
export interface MDFlavor {
    maybe: RegExp;
    tags: {
        [type: string]: RegExp | TagParser;
    };
}
export declare const mdFlavors: MDFlavor[];
export declare function mdMatch(md: MDFlavor, value: string): MDMatchResult;
