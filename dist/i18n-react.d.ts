import React = require('react');
export declare class MDText {
    texts: any;
    constructor(texts: any);
    setTexts(texts: any): void;
    notFound: string;
    interpolate(exp: string, vars: any): any;
    format(value: string, vars?: any): React.ReactNode;
    translate(key: string, options?: any): React.ReactNode;
    factory(tag: string): (props: any) => React.ReactElement<any>;
    p: (props: any) => React.ReactElement<any>;
    span: (props: any) => React.ReactElement<any>;
    li: (props: any) => React.ReactElement<any>;
    div: (props: any) => React.ReactElement<any>;
    button: (props: any) => React.ReactElement<any>;
    a: (props: any) => React.ReactElement<any>;
    text: (props: any) => React.ReactElement<any>;
}
declare var singleton: MDText;
export default singleton;
