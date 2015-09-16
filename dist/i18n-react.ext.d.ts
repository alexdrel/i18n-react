declare module 'i18n-react' {
  import React = require('react');
  class MDText extends React.Component<any, {}> {
    constructor(props?: any);
    tag: string;
    static texts: any;
    static setTexts: (t: any) => any;
    static format(text: string, options?: any): React.ReactNode;
    static translate(key: string, options?: any): React.ReactNode;
    shouldComponentUpdate(nextProps: any): boolean;
    render(): React.ReactElement<any>;
    static factory(tag?: string): typeof MDText;
    static p: typeof MDText;
    static span: typeof MDText;
    static div: typeof MDText;
    static button: typeof MDText;
    static a: typeof MDText;
}
  export = MDText;
}
