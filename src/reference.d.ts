declare function require(module: string) : any;

// Tiny Subset of Type definitions for React 0.13.0
// Project: http://facebook.github.io/react/
// Definitions by: Asana <https://asana.com>, AssureSign <http://www.assuresign.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module 'react' {
  interface ReactElement<P> {
      props: P;
  }

  class Component<P, S> {
    constructor(initialProps: P);
    props: P;
    protected render(): ReactElement<any> | string;
    protected shouldComponentUpdate(nextProps: P): boolean;
  }

  interface ComponentClass<P> {
    new(props?: P, context?: any): Component<P, any>;
  }

  type ReactChild = ReactElement<any> | string | number;

  // Should be Array<ReactNode> but type aliases cannot be recursive
  type ReactFragment = {} | Array<ReactChild | any[] | boolean>;
  type ReactNode = ReactChild | ReactFragment | boolean;

  function createElement<P>(type: string | ComponentClass<P>, props: P, ...children: any[]): ReactElement<any>;
  function cloneElement(el: ReactElement<any>, override?: any) : ReactElement<any>;
  function renderToStaticMarkup(el: ReactElement<any>): string;
  function isValidElement(e: any): boolean;
}
