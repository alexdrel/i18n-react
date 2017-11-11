"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
exports.__esModule = true;
var React = require("react");
var mdflavors_1 = require("./mdflavors");
function isString(s) {
    return typeof s === 'string' || s instanceof String;
}
function isObject(o) {
    return typeof o === 'object';
}
function isFunction(o) {
    return typeof o === 'function';
}
function get(obj, path) {
    var spath = path.split('.');
    for (var i = 0, len = spath.length; i < len; i++) {
        if (!obj || !isObject(obj))
            return undefined;
        obj = obj[spath[i]];
    }
    return obj;
}
function first(o) {
    for (var k in o) {
        if (k != '__')
            return o[k];
    }
}
function flatten(l) {
    var r = [];
    var s = '';
    var flush = function () { return s && (r.push(s), s = ''); };
    for (var _i = 0, l_1 = l; _i < l_1.length; _i++) {
        var i = l_1[_i];
        if (i == null)
            continue;
        if (isString(i)) {
            s += i;
        }
        else {
            flush();
            r.push(i);
        }
    }
    flush();
    return r.length > 1 ? r : (r.length ? r[0] : null);
}
var matcher = /** @class */ (function () {
    function matcher(mdFlavor, inter, self) {
        this.mdFlavor = mdFlavor;
        this.inter = inter;
        this.self = self;
    }
    matcher.prototype.M = function (value) {
        if (!value)
            return null;
        var m = mdflavors_1.mdMatch(this.mdFlavor, value);
        if (!m)
            return value;
        var middle = null;
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
function resolveContext(node, context) {
    if (context == null) {
        return resolveContextPath(node, 0, [], null);
    }
    else if (!isObject(context)) {
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
var MDText = /** @class */ (function () {
    function MDText(texts, opt) {
        this.texts = texts;
        this.MDFlavor = 0;
        // public access is deprecated
        this.notFound = undefined;
        this.p = this.factory('p');
        this.span = this.factory('span');
        this.li = this.factory('li');
        this.div = this.factory('div');
        this.button = this.factory('button');
        this.a = this.factory('a');
        this.text = this.factory(null);
        this.setOpts(opt);
    }
    MDText.prototype.setTexts = function (texts, opt) {
        this.texts = texts;
        this.setOpts(opt);
    };
    MDText.prototype.setOpts = function (opt) {
        if (!opt)
            return;
        if (opt.notFound !== undefined)
            this.notFound = opt.notFound;
        if (opt.MDFlavor !== undefined)
            this.MDFlavor = opt.MDFlavor;
    };
    MDText.prototype.interpolate = function (exp, vars) {
        var _a = exp.split(','), vn = _a[0], flags = _a[1];
        var v = get(vars, vn);
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
        if (!value)
            return value;
        return new matcher(mdflavors_1.mdFlavors[this.MDFlavor], function (exp) { return _this.interpolate(exp, vars); }, function (exp) { return _this.translate(exp, vars); }).M(value);
    };
    MDText.prototype.translate = function (key, options) {
        if (!key)
            return key;
        var trans = get(this.texts, key);
        var context = options && options.context;
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
    };
    MDText.prototype.factory = function (tagF) {
        var _this = this;
        // name High Order Function for React Dev tools
        var MDText = function (props) {
            var text = props.text, tag = props.tag, restProps = __rest(props, ["text", "tag"]);
            var key;
            var options;
            if (text == null || isString(text)) {
                key = text;
                options = props;
                var notFound = restProps.notFound, context = restProps.context, rest2Props = __rest(restProps, ["notFound", "context"]);
                restProps = rest2Props;
            }
            else {
                key = text.key;
                options = text;
            }
            var aTag = tagF || tag;
            var translation = _this.translate(key, options);
            return aTag ?
                React.createElement(aTag, restProps, translation) :
                translation;
        };
        return MDText;
    };
    return MDText;
}());
exports.MDText = MDText;
var singleton = new MDText(null);
exports["default"] = singleton;
