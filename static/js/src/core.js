(function() {

    var fragmentRE = /^\s*<(\w+|!)[^>]*>/;
    var singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;

    var doc = document, win = window;

    function $(str) {
        if (fragmentRE.test(str)) {
            return createElement(str);
        }

        return doc.querySelector(str);
    }

    function $$(str) {
        return doc.querySelectorAll(str);
    }


    /**
     * 如果是单个html标签 直接返回ele
     * 否则返回一个 fragment
     **/
    function createElement (str) {
        var div = doc.createElement('div');
        div.innerHTML = str;

        /*
        if (singleTagRE.test(str))
            return div.firstChild;
        */

        var nodes = div.childNodes;
        var fragment = doc.createDocumentFragment();

        for (var i = nodes.length - 1; i >= 0; i-- ) {
            fragment.appendChild(nodes[i]);
        }

        return fragment;
    }

    win.$ = $;
    win.$$ = $$;


    var Helper = {

        ready: function(cb) {
            if(doc.readyState === 4) {
                cb();
            } else {
                doc.addEventListener('DOMContentLoaded', cb);
            }

        },

        extend: function(out) {
            var args = arguments, arg;
            out = out || {};

            for (var i = 1; i < args.length; i++) {
                arg = args[i];
                if (!arg)
                    continue;

                for (var key in arg) {
                    if (arg.hasOwnProperty(key))
                        out[key] = arg[key];
                }
            }

            return out;
        },

        /*
        deepExtend: function(out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];

                if (!obj)
                    continue;

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object')
                           arguments.callee(out[key], obj[key]);
                        else
                            out[key] = obj[key];
                    }
                }
            }

            return out;
        },*/

        /**
         * 直接扩展到原生对象prototype上
         **/
         /*
        extendNative: function(constructor, toObj, prop) {
            var instance = new constructor(null);

            for (var key in instance) {
                toObj[key] = instance[key];
            }

            Object.defineProperty(toObj, prop, {
                get: function() {
                    return this;
                },
                configurable: true,
                writeable: false
            });
        },
        */
    };

    Helper.extend($, Helper);
})();


