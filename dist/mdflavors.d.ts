export interface MDFlavor {
    maybe: RegExp;
    tags: {
        [type: string]: RegExp;
    };
}
export declare const mdFlavors: MDFlavor[];
export declare function mdMatch(md: MDFlavor, value: string): {
    tag: string;
    head: string;
    body: string;
    tail: string;
};
