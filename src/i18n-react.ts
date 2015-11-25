// <reference path="./reference.d.ts" />
import React = require('react');

var _ = {
  isString: (s:any) => typeof s === 'string' || s instanceof String,
  isObject: (o:any) => typeof o === 'object',
  get: (obj: any, path: string): any  => {
    var spath = path.split('.');
    for(var i = 0, len = spath.length; i < len; i++) {
      if(!obj || typeof obj !== 'object') return undefined;
      obj = obj[spath[i]];
    }
    return obj;
  }
};

function first(o: any): any {
  for (var k in o) {
    if(k!='__') return o[k];
  }
}

function isEqualShallow(a: any, b: any) {
  if(a===b) return true;
  if(a==null || b==null) return false;

  for(var key in a) {
    if(!(key in b) || a[key] !== b[key]) return false;
  }
  for(var key in b) {
    if(!(key in a) || a[key] !== b[key]) return false;
  }
  return true;
}

function merge2(head: any, tail: any): any {
  if(head==null) return tail;
  if(tail==null) return head;

  if(_.isString(head) && _.isString(tail))
    return head+tail;
  return [head, tail];
 }

function merge(head: any, middle: any, tail: any): any {
  if(head==null) return merge2(middle, tail);
  if(middle==null) return merge2(head, tail);
  if(tail==null) return merge2(head, middle);

  if(_.isString(head) && _.isString(middle) && _.isString(tail))
    return head+middle+tail;

  return  [head, middle,tail];
}

var maybeRegex = /[\*_\{\[\n]/;

var regexes : {[type:string]: RegExp}= {
  strong: /^(|.*?\W)\*(\S.*?)\*(|\W.*)$/,
  em: /^(|.*?\W)_(\S.*?)_(|\W.*)$/,
  p: /^(.*?)\[(.*?)\](.*)$/,
  h1: /^(|.*?(?=\n))\n*\s*#([^#].*?)#*\s*\n+([\S\s]*)$/,
  h2: /^(|.*?(?=\n))\n*\s*##([^#].*?)#*\s*\n+([\S\s]*)$/,
  h3: /^(|.*?(?=\n))\n*\s*###([^#].*?)#*\s*\n+([\S\s]*)$/,
  h4: /^(|.*?(?=\n))\n*\s*####([^#].*?)#*\s*\n+([\S\s]*)$/,
  br: /^(.*?)[^\S\n]*\n()[^\S\n]*([\s\S]*)$/,
  self: /^(.*?)\{\{(.*?)\}\}(.*)$/,
  inter: /^(.*?)\{(.*?)\}(.*)$/
};

function M(value: string, vars?: any): React.ReactNode {
  if(value==null || value=='')
    return null;

  if(!value.match(maybeRegex))
    return value;

  var res: RegExpExecArray = null,
      type: string = null;

  for(var rtype in regexes) {
    if( !regexes.hasOwnProperty( rtype ) ) continue;

    var rres = regexes[rtype].exec(value);
    if(rres) {
      if(res == null || rres[1].length < res[1].length) {
        res = rres;
        type = rtype;
      }
    }
  }

  switch(type) {
    case null:
      return value;
    case "inter":
      var [vn, flags] = res[2].split(',');
      var v = _.get(vars, vn);
      if(v==null) {
        return merge( M(res[1], vars), null,  M(res[3], vars) );
      } else if(React.isValidElement(v)) {
        return merge( M(res[1], vars), React.cloneElement(v, { key: 'r'}), M(res[3], vars) );
      }
      var vs : string;
      if(flags && flags.match(/l/)) {
        vs = v.toLocaleString();
      } else {
        vs = v.toString();
      }
      return merge( M(res[1], vars), vs, M(res[3], vars) );

    case "self":
      return merge( M(res[1], vars), MDText.translate(res[2], vars), M(res[3], vars) );

    default:
      return merge( M(res[1], vars), React.createElement(type, { key: type + res[2] }, M(res[2], vars)), M(res[3], vars) );
  }
}

function rangeHit(node: any, val: number) {
  for(var t in node) {
    if( !node.hasOwnProperty( t ) ) continue;
    var range = t.match(/^(-?\d+)\.\.(-?\d+)$/);
    if(range && (+range[1] <= val && val <= +range[2])) {
      return node[t];
    }
  }
}

function resolveContextPath(node: any, p: number, path: string[], context: any) : string {
  var key = path[p];
  var trans: any;

  if(key!=null && context[key]!=null) {
    trans = _.get(node, context[key].toString());
    if(trans==null && (+context[key])===context[key]) {
      trans = rangeHit(node, +context[key]);
    }
  }

  if(trans==null)
    trans = node._;
  if(trans==null)
    trans = first(node);

  if(trans!=null && !_.isString(trans)) {
    return resolveContextPath(trans, p+1, path, context);
  }
  return trans;
}

function resolveContext(node: any, context: any) : string {
  if(context==null) {
    return resolveContextPath(node, 0, [], null);
  } else if(!_.isObject(context)) {
    return resolveContextPath(node, 0, ['_'], { _: context });
  } else {
    var ctx_keys : string[] = [];
    if(node.__) {
      ctx_keys = node.__.split('.');
    } else {
      for(var k in context) {
        if( !context.hasOwnProperty( k ) ) continue;
        ctx_keys.push(k);
      }
    }
    return resolveContextPath(node, 0, ctx_keys, context);
  }
}

class MDText extends React.Component<any, {}> {
  constructor(props?: any) {
    super(props);
  }

  tag: string;

  static texts : any;
  static setTexts = (t: any) => MDText.texts = t;

  static format(text: string, options?: any): React.ReactNode {
      return M(text, options);
  }

  static translate(key: string, options?: any): React.ReactNode {
      if(key==null) return null;

      var trans: string | any = _.get(MDText.texts, key);

      if(trans!=null && !_.isString(trans)) {
        trans = resolveContext(trans, options && options.context);
      }

      if(trans==null) {
        return key;
      }

      return M(trans, options);
  }

  shouldComponentUpdate(nextProps: any) {
    return !isEqualShallow(this.props, nextProps);
  }

  render() {
    var tag = this.tag || this.props.tag || 'span';
    // TODO - destructuring props, pending typescript JSX support
    // remove tag, context, text
    return React.createElement(tag, this.props, MDText.translate(this.props.text, this.props));
  }

  static factory(tag?: string): typeof MDText {
    return class MDTextTag extends MDText {
       constructor(props: any) { super(props); this.tag = tag; }
    };
  };

  static p      = MDText.factory('p');
  static span   = MDText.factory('span');
  static div    = MDText.factory('div');
  static button = MDText.factory('button');
  static a      = MDText.factory('a');
}

export = MDText;
