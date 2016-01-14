(function() {
    var _handler = '__handlers',
        removeEventListener = 'removeEventListener',
        forEach = 'forEach',
        filter = 'filter';
    var specialEvents = {};
    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';

    function getEvents(type) {

        return type.split(' ')
            [filter](function(str) {
                return str.trim();
            });
    }

    var Extend = {

        /**
         * 多个事件必须空格间隔
         **/
        on: function(type, handler) {
            var self = this;

            getEvents(type)[forEach](function(s) {
                if(!self[_handler]) {
                    self[_handler] = [];
                }
                self[_handler].push(handler);
                self.addEventListener(s, handler, false);
            });

            return self;
        },

        off: function(type, handler) {
            var self = this;

            getEvents(type)[forEach](function(s) {

                if (handler) {
                    self[removeEventListener](s, handler);

                    //移除__events 对应的hanndler
                    self[_handler][forEach](function(fun, i) {
                        if(fun.toString() == handler.toString()) {
                            self[_handler].splice(i, 1);
                        }
                    });

                } else {
                    self[_handler][forEach](function(fun, i) {
                        self[removeEventListener](s, fun);
                    });
                }
            });

            return self;
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
