var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
function first(o) {
    for (var k in o) {
        if (k != '__')
            return o[k];
    }
}
function isEqualShallow(a, b) {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    for (var key in a) {
        if (!(key in b) || a[key] !== b[key])
            return false;
    }
    for (var key in b) {
        if (!(key in a) || a[key] !== b[key])
            return false;
    }
    return true;
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
function M(value, vars) {
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
    switch (type) {
        case null:
            return value;
        case "inter":
            var _a = res[2].split(','), vn = _a[0], flags = _a[1];
            var v = _.get(vars, vn);
            if (v == null) {
                return merge(M(res[1], vars), null, M(res[3], vars));
            }
            else if (React.isValidElement(v)) {
                return merge(M(res[1], vars), React.cloneElement(v, { key: 'r' }), M(res[3], vars));
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
            return merge(M(res[1], vars), MDText.translate(res[2], vars), M(res[3], vars));
        default:
            return merge(M(res[1], vars), React.createElement(type, { key: type + res[2] }, M(res[2], vars)), M(res[3], vars));
    }
}
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
var MDText = (function (_super) {
    __extends(MDText, _super);
    function MDText(props) {
        _super.call(this, props);
    }
    MDText.format = function (text, options) {
        return M(text, options);
    };
    MDText.translate = function (key, options) {
        if (key == null)
            return null;
        var trans = _.get(MDText.texts, key);
        if (trans != null && !_.isString(trans)) {
            trans = resolveContext(trans, options && options.context);
        }
        if (trans == null) {
            return key;
        }
        return M(trans, options);
    };
    MDText.prototype.shouldComponentUpdate = function (nextProps) {
        return !isEqualShallow(this.props, nextProps);
    };
    MDText.prototype.render = function () {
        var tag = this.tag || this.props.tag || 'span';
        return React.createElement(tag, this.props, MDText.translate(this.props.text, this.props));
    };
    MDText.factory = function (tag) {
        return (function (_super) {
            __extends(MDTextTag, _super);
            function MDTextTag(props) {
                _super.call(this, props);
                this.tag = tag;
            }
            return MDTextTag;
        })(MDText);
    };
    ;
    MDText.setTexts = function (t) { return MDText.texts = t; };
    MDText.p = MDText.factory('p');
    MDText.span = MDText.factory('span');
    MDText.div = MDText.factory('div');
    MDText.button = MDText.factory('button');
    MDText.a = MDText.factory('a');
    return MDText;
})(React.Component);
module.exports = MDText;
