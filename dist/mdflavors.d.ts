declare type RegExpEx = RegExp | [RegExp, [number, number, number]];
export interface MDFlavor {
    maybe: RegExp;
    tags: {
        [type: string]: RegExpEx;
    };
}
export declare const mdFlavors: MDFlavor[];
declare type MDMatch = {
    tag: string;
    head: string;
    body: string;
    tail: string;
};
export declare function mdMatch(md: MDFlavor, value: string): MDMatch | null;
export {};
