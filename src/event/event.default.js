(function() {
    var _handler = '__handlers',
        forEach = 'forEach',
        filter = 'filter';
    var specialEvents = {};
    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';


    var Extend = {

        /**
         * 多个事件必须空格间隔
         **/
        on: function(type, handler) {
            var self = this;
            self.addEventListener(type, handler, false);
            return self;
        },

        off: function(type, handler) {
            var self = this;
            self.removeEventListener(type, handler);
            return self;
        },

        delegate: function(selector, type, handler) {
            var self = this;
            self.on(type, function(e) {
                if(e.target == $(selector)) {
                    handler(e);
                }
            });
            return this;
        },

        trigger: function (evtStr, data) {
            var evt = null;

            evt = document.createEvent(specialEvents[evtStr] || 'Events');
            evt.initEvent(evtStr, true, false);
            evt.data = data;

            this.dispatchEvent(evt);
            return this;
        }
    };

    ['on', 'off', 'trigger'][forEach](function(method) {

        Node.prototype[method] = Extend[method];

        /* NodeList 不扩展这些方法
        NodeList.prototype[method] = function() {
            var args = arguments;
            this.toArray().map(function(ele) {
                ele[method].apply(ele, args);
            });
        };*/

    });

})();
