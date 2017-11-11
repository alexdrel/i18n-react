import * as React from 'react';
import { mdFlavors, MDFlavor, mdMatch } from './mdflavors';

export type NotFound = string | ((key: string, context?: any) => string);

function isString(s: any): s is string {
  return typeof s === 'string' || s instanceof String;
}

function isObject(o: any) {
  return typeof o === 'object';
}

function isFunction(o: any) {
  return typeof o === 'function';
}

function get(obj: any, path: string): any {
  var spath = path.split('.');
  for (var i = 0, len = spath.length; i < len; i++) {
    if (!obj || !isObject(obj)) return undefined;
    obj = obj[spath[i]];
  }
  return obj;
}

function first(o: any): any {
  for (var k in o) {
    if (k != '__') return o[k];
  }
}

function flatten(l: (string | any)[]) {
  let r: any[] = [];
  let s = '';
  let flush = () => s && (r.push(s), s = '');

  for (let i of l) {
    if (i == null) continue;
    if (isString(i)) {
      s += i;
    } else {
      flush();
      r.push(i);
    }
  }
  flush();
  return r.length > 1 ? r : (r.length ? r[0] : null);
}

class matcher {
  constructor(
    public mdFlavor: MDFlavor,
    public inter: (exp: string) => any,
    public self: (exp: string) => any) {
  }

  M(value: string): React.ReactNode {
    if (!value) return null;

    const m = mdMatch(this.mdFlavor, value);
    if (!m)
      return value;

    let middle: any = null;
    switch (m.tag) {
      case "inter":
        middle = this.inter && this.inter(m.body);
        break;
      case "self":
        middle = this.self && this.self(m.body);
        break;
      case "literal":
        middle = m.body;
        break;
      default:
        middle = React.createElement(m.tag, { key: m.tag + m.body }, this.M(m.body));
        break;
    }
    return flatten([this.M(m.head), middle, this.M(m.tail)]);
  }
}

function rangeHit(node: any, val: number) {
  for (let t in node) {
    if (!node.hasOwnProperty(t)) continue;
    var range = t.match(/^(-?\d+)\.\.(-?\d+)$/);
    if (range && (+range[1] <= val && val <= +range[2])) {
      return node[t];
    }
  }
}

function resolveContextPath(node: any, p: number, path: string[], context: any): string {
  const key = path[p];
  let trans: any;

  if (key != null && context[key] != null) {
    trans = get(node, context[key].toString());
    if (trans == null && (+context[key]) === context[key]) {
      trans = rangeHit(node, +context[key]);
    }
  }

  if (trans == null)
    trans = node._;
  if (trans == null)
    trans = first(node);

  if (trans != null && !isString(trans)) {
    return resolveContextPath(trans, p + 1, path, context);
  }
  return trans;
}

function resolveContext(node: any, context: any): string {
  if (context == null) {
    return resolveContextPath(node, 0, [], null);
  } else if (!isObject(context)) {
    return resolveContextPath(node, 0, ['_'], { _: context });
  } else {
    let ctx_keys: string[] = [];
    if (node.__) {
      ctx_keys = node.__.split('.');
    } else {
      for (var k in context) {
        if (!context.hasOwnProperty(k)) continue;
        ctx_keys.push(k);
      }
    }
    return resolveContextPath(node, 0, ctx_keys, context);
  }
}

export interface MDTextOpts {
  MDFlavor?: 0 | 1;
  notFound?: NotFound;
}

export class MDText {
  constructor(public texts: object, opt?: MDTextOpts) {
    this.setOpts(opt);
  }

  setTexts(texts: object, opt?: MDTextOpts) {
    this.texts = texts;
    this.setOpts(opt);
  }

  setOpts(opt: MDTextOpts) {
    if (!opt) return;
    if (opt.notFound !== undefined) this.notFound = opt.notFound;
    if (opt.MDFlavor !== undefined) this.MDFlavor = opt.MDFlavor;
  }

  private MDFlavor: 0 | 1 = 0;
  // public access is deprecated
  public notFound: NotFound = undefined;

  interpolate(exp: string, vars: object): any {
    const [vn, flags] = exp.split(',');
    const v = get(vars, vn);
    if (v == null) {
      return null;
    } else if (React.isValidElement<{ key: string }>(v)) {
      return React.cloneElement(v, { key: 'r' });
    }
    let vs: string;
    if (flags && flags.match(/l/)) {
      vs = v.toLocaleString();
    } else {
      vs = v.toString();
    }
    return vs;
  }

  format(value: string, vars?: object): React.ReactNode {
    if (!value) return value;

    return new matcher(
      mdFlavors[this.MDFlavor],
      (exp: string) => this.interpolate(exp, vars),
      (exp: string) => this.translate(exp, vars)
    ).M(value);
  }

  translate(key: string, options?: any): React.ReactNode {
    if (!key) return key;

    var trans: string | any = get(this.texts, key);
    const context = options && options.context;

    if (trans != null && !(isString(trans) || isFunction(trans))) {
      trans = resolveContext(trans, context);
    }

    if (trans == null) {
      trans = (options && options.notFound !== undefined) ? options.notFound :
        this.notFound !== undefined ? this.notFound :
          key;
    }

    if (isFunction(trans)) {
      trans = trans(key, context);
    }

    return this.format(trans, options);
  }

  factory(tagF: string) {
    // name High Order Function for React Dev tools
    let MDText = (props: any) => {
      let { text, tag, ...restProps } = props;

      let key: string;
      let options: any;

      if (text == null || isString(text)) {
        key = text;
        options = props;
        let { notFound, context, ...rest2Props } = restProps;
        restProps = rest2Props;
      } else {
        key = text.key;
        options = text;
      }

      let aTag = tagF || tag;
      let translation = this.translate(key, options)
      return aTag ?
        React.createElement(aTag, restProps, translation) :
        translation;
    };
    return MDText as React.StatelessComponent<any>;
  }

  p = this.factory('p');
  span = this.factory('span');
  li = this.factory('li');
  div = this.factory('div');
  button = this.factory('button');
  a = this.factory('a');

  text = this.factory(null);
}

var singleton = new MDText(null);
export default singleton;
