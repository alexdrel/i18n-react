/// <reference types="react" />
import * as React from 'react';
export declare type NotFound = string | ((key: string, context?: any) => string);
export interface MDTextOpts {
    MDFlavor?: 0 | 1;
    notFound?: NotFound;
}
export declare class MDText {
    texts: object;
    constructor(texts: object, opt?: MDTextOpts);
    setTexts(texts: object, opt?: MDTextOpts): void;
    setOpts(opt: MDTextOpts): void;
    private MDFlavor;
    notFound: NotFound;
    interpolate(exp: string, vars: object): any;
    format(value: string, vars?: object): React.ReactNode;
    translate(key: string, options?: any): React.ReactNode;
    factory(tagF: string): React.StatelessComponent<any>;
    p: React.StatelessComponent<any>;
    span: React.StatelessComponent<any>;
    li: React.StatelessComponent<any>;
    div: React.StatelessComponent<any>;
    button: React.StatelessComponent<any>;
    a: React.StatelessComponent<any>;
    text: React.StatelessComponent<any>;
}
declare var singleton: MDText;
export default singleton;
