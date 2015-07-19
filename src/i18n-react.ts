// <reference path="./reference.d.ts" />
import React = require('react');

var _ = {
  assign: require('lodash/object/assign'),
  values: require('lodash/object/values'),
  compact: require('lodash/array/compact'),
  isString: require('lodash/lang/isString'),
  isObject: require('lodash/lang/isObject'),
  isEqual: require("lodash/lang/isEqual"),
  get: require('lodash/object/get')
};

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
  br: /^(.*?)[^\S\n]*\n()[^\S\n]*([\s\S]*)$/,
  self: /^(.*?)\{\{(.*?)\}\}(.*)$/,
  inter: /^(.*?)\{(.*?)\}(.*)$/
};

function M(value: string, vars?: any): React.ReactChildList {
  if(value==null || value=='')
    return null;

  if(!value.match(maybeRegex))
    return value;

  var res: RegExpExecArray = null,
      type: string = null;
  for(var rtype in regexes) {
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
  constructor(tag?: string, props?: any) {
    if(!_.isString(tag)) {
      props = tag;
      this.tag = props.tag || 'span';
    } else {
      this.tag = tag;
    }
    super(props);
  }

  tag: string;

  static texts : any;
  static setTexts = (t: any) => MDText.texts = t;

  static format(text: string, options?: any): React.ReactChildList {
      return M(text, options);
  }

  static translate(key: string, options?: any): React.ReactChildList {
      var trans: string | any = _.get(MDText.texts, key);
      if(trans==null) {
        return key;
      }

      if(!_.isString(trans)) {
        var ctx_trans = (options && options.context!=null && _.get(trans, options.context.toString()));
        if(ctx_trans===false)
          ctx_trans=null;
        if(ctx_trans==null)
          ctx_trans = trans._;
        if(ctx_trans==null)
          ctx_trans = _.values(trans)[0];
        if(ctx_trans==null)
          return key;
        trans = ctx_trans;
      }

      return M(trans, options);
  }

  shouldComponentUpdate(nextProps: any) {
    return !_.isEqual(this.props, nextProps);
  }

  render() {
    // TODO - destructuring props, pending typescript JSX support
    return React.createElement(this.tag, this.props, MDText.translate(this.props.text, this.props));
  }

  static p      = MDText.bind(null,'p');
  static span   = MDText.bind(null,'span');
  static div    = MDText.bind(null,'div');
  static button = MDText.bind(null,'button');
  static a      = MDText.bind(null,'a');
}

export = MDText;
