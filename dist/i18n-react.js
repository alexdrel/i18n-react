"use strict";
var React = require('react');
var _ = {
    isString: function (s) { return typeof s === 'string' || s instanceof String; },
    isObject: function (o) { return typeof o === 'object'; },
    get: function (obj, path) {
        var spath = path.split('.');
        for (var i = 0, len = spath.length; i < len; i++) {
            if (!obj || typeof obj !== 'object')
                return undefined;
            obj = obj[spath[i]];
        }
        return obj;
    }
};
function Object_rest(obj, keys) {
    var target = {};
    for (var i in obj) {
        if (keys.indexOf(i) >= 0)
            continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i))
            continue;
        target[i] = obj[i];
    }
    return target;
}
;
function first(o) {
    for (var k in o) {
        if (k != '__')
            return o[k];
    }
}
function merge2(head, tail) {
    if (head == null)
        return tail;
    if (tail == null)
        return head;
    if (_.isString(head) && _.isString(tail))
        return head + tail;
    return [head, tail];
}
function merge(head, middle, tail) {
    if (head == null)
        return merge2(middle, tail);
    if (middle == null)
        return merge2(head, tail);
    if (tail == null)
        return merge2(head, middle);
    if (_.isString(head) && _.isString(middle) && _.isString(tail))
        return head + middle + tail;
    return [head, middle, tail];
}
var maybeRegex = /[\*_\{\[\n]/;
var regexes = {
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
var matcher = (function () {
    function matcher(inter, self) {
        this.inter = inter;
        this.self = self;
    }
    matcher.prototype.M = function (value) {
        if (value == null || value == '')
            return null;
        if (!value.match(maybeRegex))
            return value;
        var res = null, type = null;
        for (var rtype in regexes) {
            if (!regexes.hasOwnProperty(rtype))
                continue;
            var rres = regexes[rtype].exec(value);
            if (rres) {
                if (res == null || rres[1].length < res[1].length) {
                    res = rres;
                    type = rtype;
                }
            }
        }
        if (!type)
            return value;
        var middle = null;
        switch (type) {
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
        return merge(this.M(res[1]), middle, this.M(res[3]));
    };
    return matcher;
}());
function rangeHit(node, val) {
    for (var t in node) {
        if (!node.hasOwnProperty(t))
            continue;
        var range = t.match(/^(-?\d+)\.\.(-?\d+)$/);
        if (range && (+range[1] <= val && val <= +range[2])) {
            return node[t];
        }
    }
}
function resolveContextPath(node, p, path, context) {
    var key = path[p];
    var trans;
    if (key != null && context[key] != null) {
        trans = _.get(node, context[key].toString());
        if (trans == null && (+context[key]) === context[key]) {
            trans = rangeHit(node, +context[key]);
        }
    }
    if (trans == null)
        trans = node._;
    if (trans == null)
        trans = first(node);
    if (trans != null && !_.isString(trans)) {
        return resolveContextPath(trans, p + 1, path, context);
    }
    return trans;
}
function resolveContext(node, context) {
    if (context == null) {
        return resolveContextPath(node, 0, [], null);
    }
    else if (!_.isObject(context)) {
        return resolveContextPath(node, 0, ['_'], { _: context });
    }
    else {
        var ctx_keys = [];
        if (node.__) {
            ctx_keys = node.__.split('.');
        }
        else {
            for (var k in context) {
                if (!context.hasOwnProperty(k))
                    continue;
                ctx_keys.push(k);
            }
        }
        return resolveContextPath(node, 0, ctx_keys, context);
    }
}
var MDText = (function () {
    function MDText(texts) {
        this.texts = texts;
        this.p = this.factory('p');
        this.span = this.factory('span');
        this.li = this.factory('li');
        this.div = this.factory('div');
        this.button = this.factory('button');
        this.a = this.factory('a');
        this.text = this.factory(null);
    }
    MDText.prototype.setTexts = function (texts) {
        this.texts = texts;
    };
    MDText.prototype.interpolate = function (exp, vars) {
        var _a = exp.split(','), vn = _a[0], flags = _a[1];
        var v = _.get(vars, vn);
        if (v == null) {
            return null;
        }
        else if (React.isValidElement(v)) {
            return React.cloneElement(v, { key: 'r' });
        }
        var vs;
        if (flags && flags.match(/l/)) {
            vs = v.toLocaleString();
        }
        else {
            vs = v.toString();
        }
        return vs;
    };
    MDText.prototype.format = function (value, vars) {
        var _this = this;
        return new matcher(function (exp) { return _this.interpolate(exp, vars); }, function (exp) { return _this.translate(exp, vars); }).M(value);
    };
    MDText.prototype.translate = function (key, options) {
        if (key == null)
            return null;
        var trans = _.get(this.texts, key);
        if (trans != null && !_.isString(trans)) {
            trans = resolveContext(trans, options && options.context);
        }
        if (trans == null) {
            return (options && options.notFound !== undefined) ? options.notFound :
                this.notFound !== undefined ? this.notFound :
                    key;
        }
        return this.format(trans, options);
    };
    MDText.prototype.factory = function (tag) {
        var _this = this;
        return function (props) {
            var text = props.text;
            var key;
            var options;
            var omitProps = ['text', 'tag'];
            if (text == null || _.isString(text)) {
                key = text;
                options = props;
                omitProps = ['text', 'context', 'tag', 'notFound'];
            }
            else {
                key = text.key;
                options = text;
            }
            return React.createElement(tag || options.tag || props.tag || 'span', Object_rest(props, omitProps), _this.translate(key, options));
        };
    };
    return MDText;
}());
exports.MDText = MDText;
var singleton = new MDText(null);
exports.__esModule = true;
exports["default"] = singleton;
