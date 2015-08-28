import React = require('react');
declare class MDText extends React.Component<any, {}> {
    constructor(props?: any);
    tag: string;
    static texts: any;
    static setTexts: (t: any) => any;
    static format(text: string, options?: any): React.ReactNode;
    static translate(key: string, options?: any): React.ReactNode;
    shouldComponentUpdate(nextProps: any): boolean;
    render(): React.ReactElement<any>;
    static factory(tag?: string): (props: any, ctx: any) => void;
    static p: (props: any, ctx: any) => void;
    static span: (props: any, ctx: any) => void;
    static div: (props: any, ctx: any) => void;
    static button: (props: any, ctx: any) => void;
    static a: (props: any, ctx: any) => void;
}
export = MDText;
