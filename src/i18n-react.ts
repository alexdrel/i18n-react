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
  for (var k in o) return o[k];
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
        return res[1]+res[3];
      } else if(_.isObject(v) && Object.getPrototypeOf(v)._isReactElement) {
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
      var trans: string | any = key && _.get(MDText.texts, key);
      if(key==null || trans==null) {
        return key;
      }

      if(!_.isString(trans)) {
        var ctx_trans = (options && options.context!=null && _.get(trans, options.context.toString()));
        if(ctx_trans===false)
          ctx_trans=null;
        if(ctx_trans==null)
          ctx_trans = trans._;
        if(ctx_trans==null)
          ctx_trans = first(trans);
        if(ctx_trans==null)
          return key;
        trans = ctx_trans;
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

  static factory(tag?: string) {
    var ctor = function MDTextTag(props: any, ctx: any) {
       MDText.call(this, props, ctx);
       this.tag = tag;
    };
    ctor.prototype = MDText.prototype;
    return ctor;
  };

  static p      = MDText.factory('p');
  static span   = MDText.factory('span');
  static div    = MDText.factory('div');
  static button = MDText.factory('button');
  static a      = MDText.factory('a');
}

export = MDText;
