import React = require('react');
declare class MDText extends React.Component<any, {}> {
    constructor(tag?: string, props?: any);
    tag: string;
    static texts: any;
    static setTexts: (t: any) => any;
    static translate(key: string, options?: any): React.ReactChildList;
    shouldComponentUpdate(nextProps: any): boolean;
    render(): any;
    static p: any;
    static span: any;
    static div: any;
    static button: any;
    static a: any;
}
export = MDText;
