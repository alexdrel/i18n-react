declare module 'i18n-react' {
  import React = require('react');
  export class MDText {
      texts: any;
      constructor(texts: any);
      setTexts(texts: any): void;
      notFound: string;
      interpolate(exp: string, vars: any): any;
      format(value: string, vars?: any): React.ReactNode;
      translate(key: string, options?: any): React.ReactNode;
      factory(tag: string): (props: any) => React.ComponentElement<any, React.Component<any, {} | void>>;
      p: (props: any) => React.ComponentElement<any, React.Component<any, {} | void>>;
      span: (props: any) => React.ComponentElement<any, React.Component<any, {} | void>>;
      li: (props: any) => React.ComponentElement<any, React.Component<any, {} | void>>;
      div: (props: any) => React.ComponentElement<any, React.Component<any, {} | void>>;
      button: (props: any) => React.ComponentElement<any, React.Component<any, {} | void>>;
      a: (props: any) => React.ComponentElement<any, React.Component<any, {} | void>>;
      text: (props: any) => React.ComponentElement<any, React.Component<any, {} | void>>;
  }
  var singleton: MDText;
  export default singleton;
}
