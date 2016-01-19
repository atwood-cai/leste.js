(function() {

    var prototype = 'prototype',
        extend = 'extend',
        extendEle = 'extendElement';

    $[extendEle] = function(o) {
        $[extend](Element[prototype], o);
        $[extend](Document[prototype], o);
    };

    var Extend = {

        /**
         * 一个参数 getAttribute
         * 两个参数 setAttribute
         **/
        attr: function(attribute) {
            var args = arguments;
            var me = this;
            if(args.length === 1) {
                return me.getAttribute(attribute);
            } else {
                me.setAttribute.apply(me, args);
            }
        },

        /**
         * ele.NS.css('width')
         * ele.NS.css('width', '1px')
         * ele.NS.css({width: '1px', height: '1px'})*/
        css: function(p1, p2) {
            var ele = this;
            var type = typeof p1, k;
            var len = arguments.length;
            if(len === 0) return '';

            if(len === 1) {
                if(type == 'string') {
                    return getComputedStyle(ele)[p1];
                }

                if(type == 'object') {
                    $[extend](ele.style, p1);
                }
            } else {
                ele.style[p1] = p2;
            }

            return ele;
        },

        /**
         * @param: selector
         **/
        find: function(str) {
            return this.querySelectorAll(str);
        },

        /**
         * @param: htmlString | dom | dom array | null
         **/
        html: function() {
            var me = this,
                arg = arguments,
                innerHTML = 'innerHTML';

            if (arg.length === 0) {
                return me[innerHTML];
            }

            me[innerHTML] = arg[0].toString();

            return me;
        },

        hide: function() {
            var ele = this;
            ele.style.display = 'none';
            return ele;
        },

        show: function() {
            var ele = this;
            ele.style.display = '';
            return ele;
        },

        offset: function() {
            var rect = this.getBoundingClientRect();
            var body = document.body;
            return {
                top: rect.top + body.scrollTop,
                left: rect.left + body.scrollLeft
            };
        },

    };

    $[extendEle](Extend);
})();
