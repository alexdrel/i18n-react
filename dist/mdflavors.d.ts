export interface MDFlavor {
    maybe: RegExp;
    tags: {
        [type: string]: RegExp | Function;
    };
}
export declare const mdFlavors: MDFlavor[];
export declare function mdMatch(md: MDFlavor, value: string): any;
