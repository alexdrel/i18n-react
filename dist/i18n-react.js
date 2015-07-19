var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var React = require('react');
var _ = {
    assign: require('lodash/object/assign'),
    values: require('lodash/object/values'),
    compact: require('lodash/array/compact'),
    isString: require('lodash/lang/isString'),
    isObject: require('lodash/lang/isObject'),
    isEqual: require("lodash/lang/isEqual"),
    get: require('lodash/object/get')
};
function compact(array) {
    array = _.compact(array);
    return (array.length == 1) ? array[0] : array;
}
function merge(head, middle, tail) {
    if (_.isString(head || '') && _.isString(middle) && _.isString(tail || '')) {
        return (head || '') + middle + (tail || '');
    }
    return React.createElement('span', null, [head, middle, tail]);
}
var maybeRegex = /[\*_\{\[\n]/;
var regexes = {
    strong: /^(|.*?\W)\*(\S.*?)\*(|\W.*)$/,
    em: /^(|.*?\W)_(\S.*?)_(|\W.*)$/,
    p: /^(.*?)\[(.*?)\](.*)$/,
    br: /^(.*?)[^\S\n]*\n()[^\S\n]*([\s\S]*)$/,
    self: /^(.*?)\{\{(.*?)\}\}(.*)$/,
    inter: /^(.*?)\{(.*?)\}(.*)$/
};
function M(value, vars) {
    if (value == null || value == '')
        return null;
    if (!value.match(maybeRegex))
        return value;
    var res = null, type = null;
    for (var rtype in regexes) {
        var rres = regexes[rtype].exec(value);
        if (rres) {
            if (res == null || rres[1].length < res[1].length) {
                res = rres;
                type = rtype;
            }
        }
    }
    switch (type) {
        case null:
            return value;
        case "inter":
            var _a = res[2].split(','), vn = _a[0], flags = _a[1];
            var v = _.get(vars, vn);
            if (v == null) {
                return res[1] + res[3];
            }
            else if (_.isObject(v) && Object.getPrototypeOf(v)._isReactElement) {
                return [M(res[1], vars), React.cloneElement(v, { key: 'r' }), M(res[3], vars)];
            }
            var vs;
            if (flags && flags.match(/l/)) {
                vs = v.toLocaleString();
            }
            else {
                vs = v.toString();
            }
            return merge(M(res[1], vars), vs, M(res[3], vars));
        case "self":
            return compact([M(res[1], vars), MDText.translate(res[2], vars), M(res[3], vars)]);
        default:
            return compact([M(res[1], vars), React.createElement(type, { key: type + res[2] }, M(res[2], vars)), M(res[3], vars)]);
    }
}
var MDText = (function (_super) {
    __extends(MDText, _super);
    function MDText(tag, props) {
        if (!_.isString(tag)) {
            props = tag;
            this.tag = props.tag || 'span';
        }
        else {
            this.tag = tag;
        }
        _super.call(this, props);
    }
    MDText.format = function (text, options) {
        return M(text, options);
    };
    MDText.translate = function (key, options) {
        var trans = _.get(MDText.texts, key);
        if (trans == null) {
            return key;
        }
        if (!_.isString(trans)) {
            var ctx_trans = (options && options.context != null && _.get(trans, options.context.toString()));
            if (ctx_trans === false)
                ctx_trans = null;
            if (ctx_trans == null)
                ctx_trans = trans._;
            if (ctx_trans == null)
                ctx_trans = _.values(trans)[0];
            if (ctx_trans == null)
                return key;
            trans = ctx_trans;
        }
        return M(trans, options);
    };
    MDText.prototype.shouldComponentUpdate = function (nextProps) {
        return !_.isEqual(this.props, nextProps);
    };
    MDText.prototype.render = function () {
        return React.createElement(this.tag, this.props, MDText.translate(this.props.text, this.props));
    };
    MDText.setTexts = function (t) { return MDText.texts = t; };
    MDText.p = MDText.bind(null, 'p');
    MDText.span = MDText.bind(null, 'span');
    MDText.div = MDText.bind(null, 'div');
    MDText.button = MDText.bind(null, 'button');
    MDText.a = MDText.bind(null, 'a');
    return MDText;
})(React.Component);
module.exports = MDText;
