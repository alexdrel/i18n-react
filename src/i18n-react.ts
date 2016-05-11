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

class matcher {
  constructor(public inter: (exp: string) => any, public self: (exp: string) => any) {
  }

  M(value: string): React.ReactNode {
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

    if (!type)
        return value;

    let middle: any = null;
    switch(type) {
      case "inter":
        middle = this.inter && this.inter(res[2]);
        break;
      case "self":
        middle = this.self && this.self(res[2]);
        break;
      default:
        middle = React.createElement(type, { key: type + res[2] }, this.M(res[2]));
        break;
    }
    return merge( this.M(res[1]), middle, this.M(res[3]) );
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

export class MDText {
  constructor(public texts: any) {
  }

  setTexts(texts: any) {
    this.texts = texts;
  }

  notFound: string;

  interpolate(exp: string, vars: any): any {
    var [vn, flags] = exp.split(',');
    var v = _.get(vars, vn);
    if(v==null) {
      return null;
    } else if(React.isValidElement(v)) {
      return React.cloneElement(v, { key: 'r'});
    }
    var vs : string;
    if(flags && flags.match(/l/)) {
      vs = v.toLocaleString();
    } else {
      vs = v.toString();
    }
    return vs;
  }

  format(value: string, vars?: any): React.ReactNode {
    return new matcher(
        (exp:string) => this.interpolate(exp, vars),
        (exp:string) => this.translate(exp, vars)
      ).M(value);
  }

  translate(key: string, options?: any): React.ReactNode {
    if(key==null) return null;

    var trans: string | any = _.get(this.texts, key);

    if(trans!=null && !_.isString(trans)) {
      trans = resolveContext(trans, options && options.context);
    }

    if(trans==null) {
      return (options && options.notFound !== undefined) ? options.notFound :
          this.notFound !== undefined ? this.notFound :
          key;
    }

    return this.format(trans, options);
  }

  factory(tag: string) {
    return (props: any) => React.createElement(tag, props, this.translate(props.text, props));
  }

  p      = this.factory('p');
  span   = this.factory('span');
  li     = this.factory('li');
  div    = this.factory('div');
  button = this.factory('button');
  a      = this.factory('a');

  text = (props: any) => React.createElement(props.tag || 'span', props, this.translate(props.text, props));
}

var singleton = new MDText(null);
export default singleton;
