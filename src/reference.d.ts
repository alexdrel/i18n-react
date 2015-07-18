declare function require(module: string) : any;

// Tiny Subset of Type definitions for React 0.13.0
// Project: http://facebook.github.io/react/
// Definitions by: Asana <https://asana.com>, AssureSign <http://www.assuresign.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module 'react' {
  class Component<P, S> {
    constructor(initialProps: P);
    props: P;
    protected render(): ReactElement | string;
    protected shouldComponentUpdate(nextProps: P): boolean;
  }
  interface ComponentClass<P> {
    new(props?: P, context?: any): Component<P, any>;
  }

  type ReactElement = any;

  type ReactChildList = string | ReactElement | ReactElement[];
  function createElement<P>(type: string | ComponentClass<P>, props: P, ...children: any[]): ReactElement;
  function cloneElement(el: ReactElement, override?: any) : ReactElement;
  function renderToStaticMarkup(el: ReactElement): string;
}
