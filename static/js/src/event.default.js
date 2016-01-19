(function() {
    var _handler = '__handler',
        forEach = 'forEach',
        filter = 'filter',
        removeEventListener = 'removeEventListener';
    var specialEvents = {};
    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';


    var Extend = {

        /**
         * 多个事件必须空格间隔
         **/
        on: function(type, handler) {
            var self = this;
            if (!self[_handler]) self[_handler] = [];
            self[_handler].push({
                t: type,
                f: handler
            });

            self.addEventListener(type, handler, false);
            return self;
        },

        off: function(type, handler) {
            var self = this, handlers = self[_handler];

            //off all
            if (!type && !handler) {
                if (handlers) {
                    handlers[forEach](function(i) {
                        self[removeEventListener](i.t, i.f, false);
                    });
                    handlers = 0;
                }

            } else {

                self[removeEventListener](type, handler, false);

                if (handlers) {
                    handlers[forEach](function(i, k) {
                        if (i.f == handler || i.f.r && i.f.r == handler) {
                            self[removeEventListener](i.t, i.f, false);
                            handlers.splice(k, 1);
                            handlers.length == 0 ? handlers = 0 : '';
                        }
                    });
                }
            }

            return self;
        },

        delegate: function(selector, type, handler) {
            var self = this;
            var hand = function(e) {
                var tags = self.find(selector);
                for (var i = 0, l = tags.length; i < l; i++) {
                    if (tags[i].contains(e.target)) {
                        handler.call(tags[i], e);
                        break;
                    }
                }
            };
            hand.r = handler;
            self.on(type, hand);
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

    $.extend(Node.prototype, Extend);


})();
