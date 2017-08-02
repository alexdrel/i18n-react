/// <reference types="react" />
import * as React from 'react';
export interface MDTextOpts {
    MDFlavor?: 0 | 1;
    notFound?: string;
}
export declare class MDText {
    texts: object;
    constructor(texts: object, opt?: MDTextOpts);
    setTexts(texts: object, opt?: MDTextOpts): void;
    setOpts(opt: MDTextOpts): void;
    private MDFlavor;
    notFound: string;
    interpolate(exp: string, vars: object): any;
    format(value: string, vars?: object): React.ReactNode;
    translate(key: string, options?: any): React.ReactNode;
    factory(tagF: string): (props: any) => React.ComponentElement<any, React.Component<any, React.ComponentState>>;
    p: (props: any) => React.ComponentElement<any, React.Component<any, React.ComponentState>>;
    span: (props: any) => React.ComponentElement<any, React.Component<any, React.ComponentState>>;
    li: (props: any) => React.ComponentElement<any, React.Component<any, React.ComponentState>>;
    div: (props: any) => React.ComponentElement<any, React.Component<any, React.ComponentState>>;
    button: (props: any) => React.ComponentElement<any, React.Component<any, React.ComponentState>>;
    a: (props: any) => React.ComponentElement<any, React.Component<any, React.ComponentState>>;
    text: (props: any) => React.ComponentElement<any, React.Component<any, React.ComponentState>>;
}
declare var singleton: MDText;
export default singleton;
