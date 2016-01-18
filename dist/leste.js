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
            var args = arguments, arg, start = 1;
            out = out || {};

            if(typeof args[0] == 'boolean') {
                start = 2;
            }

            for (var i = start; i < args.length; i++) {
                arg = args[i];
                if (!arg)
                    continue;

                for (var key in arg) {
                    if (arg.hasOwnProperty(key)) {
                        if (start == 2 && typeof arg[key] === 'object')
                           arguments.callee(out[key], arg[key]);
                        else
                            out[key] = arg[key];
                    }
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



(function() {

    function tens(d) {
        return d < 10 ? ('0' + d) : d;
    }

    var Extend = {

        /**
         * @param: format str
         * Y-m-d H:i:s
         **/
        format: function(str) {
            var self = this, replace = 'replace';
            var yy = tens(self.getFullYear()),
                mm = tens(self.getMonth() + 1),
                dd = tens(self.getDate()),
                hh = tens(self.getHours()),
                ii = tens(self.getMinutes()),
                ss = tens(self.getSeconds());
            return str[replace]('Y', yy)
                      [replace]('m', mm)
                      [replace]('d', dd)
                      [replace]('H', hh)
                      [replace]('i', ii)
                      [replace]('s', ss);
        },


    };

    $.extend(Date.prototype, Extend);

})();

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

(function() {

    var insertBefore = 'insertBefore',
        parentNode = 'parentNode',
        doc = document,
        createTextNode = 'createTextNode';

    function  _mutation(nodes) {
        if (!nodes.length) {
            throw new Error('No Dom');
        } else if (nodes.length === 1) {
            return typeof nodes[0] === 'string' ? doc[createTextNode](nodes[0]) : nodes[0];
        } else {
            var fragment = doc.createDocumentFragment(),
                 length = nodes.length,
                 index = -1,
                 node;

             while (++index < length) {
                 node = nodes[index];

                 fragment.appendChild(typeof node === 'string' ? doc[createTextNode](node) : node);
             }

             return fragment;
        }
    }


    var Extend = {

        before: function() {
            var self = this,  parent = self[parentNode];
            if (parent) {
                parent[insertBefore](_mutation(arguments), self);
            }
        },

        after: function() {
            var self = this,  parent = self[parentNode];
            if (parent) {
                parent[insertBefore](_mutation(arguments), self.nextSibling);
            }
        },

        replaceWith: function() {
            var self = this,  parent = self[parentNode];
            if (parent) {
                parent.replaceChild(_mutation(arguments), self);
            }
        },

        remove: function() {
            var self = this,  parent = self[parentNode];
            var parent = self[parentNode];
            if (parent) {
                parent.removeChild(self);
            }
        }

    };

    $.extendElement(Extend);

})();

(function() {

    var className = 'className',
        contains = 'contains',
        pro = 'prototype';
    /**
     * 为 Element 添加 classList polyfill
     **/
    var ClassList = function(ele) {
        var self = this;
        self.ele = ele;
        if(!ele) return;
        ele[className].split(/\s+/).forEach(function(cls) {
            if (cls.trim())
                self.push(cls);
        });
    };

    var prototype = ClassList[pro]= [];

    var classListPrototype = {
        add: function(cls) {
            var ele = this.ele;
            if(!this[contains](cls)) {
                ele[className] = ele[className] + ' ' + cls;
            }
            return ele;
        },
        remove: function(cls) {
            var self = this,
                ele = self.ele;
            if(self[contains](cls)) {
                ele[className] = ele[className].replace(cls, '');
            }
            return ele;
        },
        toggle: function(cls) {
            var self = this,
                ele = self.ele;
                clsName = ele[className];

            if(self[contains](cls)) {
                self.remove(cls);
                return false;
            } else {
                self.add(cls);
                return true;
            }
        },
        contains: function(cls) {
            return this.indexOf(cls) > -1;
        }
    };

    if(!$('html').classList) {
        $.extend(prototype, classListPrototype);
        Object.defineProperty(Element[pro], 'classList', {
            get: function() {
                return new ClassList(this);
            },
            configurable: true,
            writeable: false
        });
    }
})();

(function() {

    var prototype = 'prototype';
    /**
     * NodeList 扩展
     * 依赖 Element 扩展
     **/
    var Extend = {

        toArray: function() {
            var me = this;
            return me ? Array[prototype].slice.call(me) : [];
        }
    };

    $.extend(NodeList[prototype], Extend);

})();

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

/**
 * 目前暂时只支持单指触摸
 **/
$.ready(function() {

    var doc = document,
        touch = {},
        firstTouch,
        deltaX = 0, deltaY = 0,
        touchTimeout,
        pageX = 'pageX',
        pageY = 'pageY',
        target = 'target',
        setTime = setTimeout;

    doc.on('touchstart', function(e) {

        firstTouch = e.touches[0];

        touch.x1 = firstTouch[pageX];
        touch.y1 = firstTouch[pageY];
        touch.ele = 'tagName' in firstTouch[target] ? firstTouch[target] : firstTouch[target].parentNode;
        touch.last = new Date().getTime();

        touchTimeout && clearTimeout(touchTimeout);
    });

    doc.on('touchmove', function(e) {

        firstTouch = e.touches[0];

        touch.x2 = firstTouch[pageX];
        touch.y2 = firstTouch[pageY];

        deltaX += Math.abs(touch.x1 - touch.x2);
        deltaY += Math.abs(touch.y1 - touch.y2);
    });

    doc.on('touchend', function(e) {

        if ('last' in touch) {
            if (deltaX < 30 && deltaY < 30) {
                touchTimeout = setTime(function() {
                    touchTimeout = setTime(function() {
                        touchTimeout = null;
                        touch.ele.trigger('tap', {
                            touchstart: touch.last,
                            touchList: e.changedTouches
                        });
                    }, 250);
                }, 0);
            } else {
                touch = {};
            }

            deltaX = deltaY = 0;
        }
    });

});

(function() {

    function empty() {}

    var accepts = {
        script: 'text/javascript, application/javascript, application/x-javascript',
        json:   'application/json',
        xml:    'application/xml, text/xml',
        html:   'text/html',
        text:   'text/plain'
    };

    var defaultSetting = {
        // Default type of request
        type: 'GET',
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        success: empty,
        // Callback that is executed the the server drops error
        error: empty,
        // Callback that is executed on request complete (both: error and success)
        complete: empty,
        // Transport
        xhr: function() { return new window.XMLHttpRequest(); },
        dataType: 'json',
        // Whether the request is to another domain
        timeout: 0,
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true,

        crossDomain: false,

        async: true,
    };

    $.ajax = function(options) {

        var settings = $.extend({}, options || {});
            for (var key in defaultSetting)
                if (settings[key] === undefined)
                    settings[key] = defaultSetting[key];

        var headers = {},
            dataType = settings.dataType,
            mime = accepts[dataType],
            xhr = settings.xhr(),
            ajaxError = settings.error,
            ajaxSuccess = settings.success,
            abortTimeout,
            type = settings.type.toUpperCase();

        function setHeader(name, value) {
            headers[name.toLowerCase()] = [name, value];
        }

        if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest');

        setHeader('Accept', mime || '*/*');


        if(mime.indexOf(',') > -1) {
            mime = mime.split(',', 2)[0];
        }
        if(xhr.overrideMimeType) xhr.overrideMimeType(mime);


        if (settings.contentType || (settings.contentType !== false && settings.data && type!= 'GET'))
            setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');

        if (settings.headers)
            for (var name in settings.headers)
                setHeader(name, settings.headers[name]);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                xhr.onreadystatechange = empty;
                clearTimeout(abortTimeout);
                var result, error = false;
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
                    dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));
                    result = xhr.responseText;

                    try {
                        if (dataType == 'script')    (1,eval)(result);
                        else if (dataType == 'xml')  result = xhr.responseXML;
                        //else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result);
                        ajaxSuccess(result, xhr, settings);
                    } catch (e) {
                        error = e;
                        ajaxError(error, 'parsererror', xhr, settings);
                    }

                } else {
                    ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings);
                }
            }
        };

        xhr.open(settings.type, settings.url, settings.async, settings.username, settings.password);

        for (var head in headers)
            xhr.setRequestHeader(head, headers[head]);

        if (settings.timeout > 0)
            abortTimeout = setTimeout(function(){
                xhr.onreadystatechange = empty;
                xhr.abort();
                ajaxError(null, 'timeout', xhr, settings);
            }, settings.timeout);

        // avoid sending empty string (#319)
        xhr.send(type == 'GET' ? null : (settings.data ? JSON.stringify(settings.data) : null));

        return xhr;
    };

})();

/**
 * Promise polyfill v1.0.10
 * requires setImmediate
 *
 * © 2014–2015 Dmitry Korobkin
 * Released under the MIT license
 * github.com/Octane/Promise
 */
(function (global) {'use strict';

    var STATUS = '[[PromiseStatus]]';
    var VALUE = '[[PromiseValue]]';
    var ON_FUlFILLED = '[[OnFulfilled]]';
    var ON_REJECTED = '[[OnRejected]]';
    var ORIGINAL_ERROR = '[[OriginalError]]';
    var PENDING = 'pending';
    var INTERNAL_PENDING = 'internal pending';
    var FULFILLED = 'fulfilled';
    var REJECTED = 'rejected';
    var NOT_ARRAY = 'not an array.';
    var REQUIRES_NEW = 'constructor Promise requires "new".';
    var CHAINING_CYCLE = 'then() cannot return same Promise that it resolves.';

    // Modifed by polyfill service - remove undefined require statement
    var setImmediate = global.setImmediate;

    var isArray = Array.isArray || function (anything) {
        return Object.prototype.toString.call(anything) == '[object Array]';
    };

    function InternalError(originalError) {
        this[ORIGINAL_ERROR] = originalError;
    }

    function isInternalError(anything) {
        return anything instanceof InternalError;
    }

    function isObject(anything) {
        //Object.create(null) instanceof Object → false
        return Object(anything) === anything;
    }

    function isCallable(anything) {
        return typeof anything == 'function';
    }

    function isPromise(anything) {
        return anything instanceof Promise;
    }

    function identity(value) {
        return value;
    }

    function thrower(reason) {
        throw reason;
    }

    function enqueue(promise, onFulfilled, onRejected) {
        if (!promise[ON_FUlFILLED]) {
            promise[ON_FUlFILLED] = [];
            promise[ON_REJECTED] = [];
        }
        promise[ON_FUlFILLED].push(onFulfilled);
        promise[ON_REJECTED].push(onRejected);
    }

    function clearAllQueues(promise) {
        delete promise[ON_FUlFILLED];
        delete promise[ON_REJECTED];
    }

    function callEach(queue) {
        var i;
        var length = queue.length;
        for (i = 0; i < length; i++) {
            queue[i]();
        }
    }

    function call(resolve, reject, value) {
        var anything = toPromise(value);
        if (isPromise(anything)) {
            anything.then(resolve, reject);
        } else if (isInternalError(anything)) {
            reject(anything[ORIGINAL_ERROR]);
        } else {
            resolve(value);
        }
    }

    function toPromise(anything) {
        var then;
        if (isPromise(anything)) {
            return anything;
        }
        if(isObject(anything)) {
            try {
                then = anything.then;
            } catch (error) {
                return new InternalError(error);
            }
            if (isCallable(then)) {
                return new Promise(function (resolve, reject) {
                    setImmediate(function () {
                        try {
                            then.call(anything, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    });
                });
            }
        }
        return null;
    }

    function resolvePromise(promise, resolver) {
        function resolve(value) {
            if (promise[STATUS] == PENDING) {
                fulfillPromise(promise, value);
            }
        }
        function reject(reason) {
            if (promise[STATUS] == PENDING) {
                rejectPromise(promise, reason);
            }
        }
        try {
            resolver(resolve, reject);
        } catch(error) {
            reject(error);
        }
    }

    function fulfillPromise(promise, value) {
        var queue;
        var anything = toPromise(value);
        if (isPromise(anything)) {
            promise[STATUS] = INTERNAL_PENDING;
            anything.then(
                function (value) {
                    fulfillPromise(promise, value);
                },
                function (reason) {
                    rejectPromise(promise, reason);
                }
            );
        } else if (isInternalError(anything)) {
            rejectPromise(promise, anything[ORIGINAL_ERROR]);
        } else {
            promise[STATUS] = FULFILLED;
            promise[VALUE] = value;
            queue = promise[ON_FUlFILLED];
            if (queue && queue.length) {
                clearAllQueues(promise);
                callEach(queue);
            }
        }
    }

    function rejectPromise(promise, reason) {
        var queue = promise[ON_REJECTED];
        promise[STATUS] = REJECTED;
        promise[VALUE] = reason;
        if (queue && queue.length) {
            clearAllQueues(promise);
            callEach(queue);
        }
    }

    function Promise(resolver) {
        var promise = this;
        if (!isPromise(promise)) {
            throw new TypeError(REQUIRES_NEW);
        }
        promise[STATUS] = PENDING;
        promise[VALUE] = undefined;
        resolvePromise(promise, resolver);
    }

    Promise.prototype.then = function (onFulfilled, onRejected) {
        var promise = this;
        var nextPromise;
        onFulfilled = isCallable(onFulfilled) ? onFulfilled : identity;
        onRejected = isCallable(onRejected) ? onRejected : thrower;
        nextPromise = new Promise(function (resolve, reject) {
            function tryCall(func) {
                var value;
                try {
                    value = func(promise[VALUE]);
                } catch (error) {
                    reject(error);
                    return;
                }
                if (value === nextPromise) {
                    reject(new TypeError(CHAINING_CYCLE));
                } else {
                    call(resolve, reject, value);
                }
            }
            function asyncOnFulfilled() {
                setImmediate(tryCall, onFulfilled);
            }
            function asyncOnRejected() {
                setImmediate(tryCall, onRejected);
            }
            switch (promise[STATUS]) {
                case FULFILLED:
                    asyncOnFulfilled();
                    break;
                case REJECTED:
                    asyncOnRejected();
                    break;
                default:
                    enqueue(promise, asyncOnFulfilled, asyncOnRejected);
            }
        });
        return nextPromise;
    };

    Promise.prototype['catch'] = function (onRejected) {
        return this.then(identity, onRejected);
    };

    Promise.resolve = function (value) {
        var anything = toPromise(value);
        if (isPromise(anything)) {
            return anything;
        }
        return new Promise(function (resolve, reject) {
            if (isInternalError(anything)) {
                reject(anything[ORIGINAL_ERROR]);
            } else {
                resolve(value);
            }
        });
    };

    Promise.reject = function (reason) {
        return new Promise(function (resolve, reject) {
            reject(reason);
        });
    };

    Promise.race = function (values) {
        return new Promise(function (resolve, reject) {
            var i;
            var length;
            if (isArray(values)) {
                length = values.length;
                for (i = 0; i < length; i++) {
                    call(resolve, reject, values[i]);
                }
            } else {
                reject(new TypeError(NOT_ARRAY));
            }
        });
    };

    Promise.all = function (values) {
        return new Promise(function (resolve, reject) {
            var fulfilledCount = 0;
            var promiseCount = 0;
            var anything;
            var length;
            var value;
            var i;
            if (isArray(values)) {
                values = values.slice(0);
                length = values.length;
                for (i = 0; i < length; i++) {
                    value = values[i];
                    anything = toPromise(value);
                    if (isPromise(anything)) {
                        promiseCount++;
                        anything.then(
                            function (index) {
                                return function (value) {
                                    values[index] = value;
                                    fulfilledCount++;
                                    if (fulfilledCount == promiseCount) {
                                        resolve(values);
                                    }
                                };
                            }(i),
                            reject
                        );
                    } else if (isInternalError(anything)) {
                        reject(anything[ORIGINAL_ERROR]);
                    } else {
                        //[1, , 3] → [1, undefined, 3]
                        values[i] = value;
                    }
                }
                if (!promiseCount) {
                    resolve(values);
                }
            } else {
                reject(new TypeError(NOT_ARRAY));
            }
        });
    };

    if (typeof module != 'undefined' && module.exports) {
        module.exports = global.Promise || Promise;
    } else if (!global.Promise) {
        global.Promise = Promise;
    }

}(this));

/*
Copyright (c) 2014 GitHub, Inc.
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function() {
  'use strict';

  if (self.fetch) {
    return
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  var support = {
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self
  }

  function Body() {
    this.bodyUsed = false


    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (!body) {
        this._bodyText = ''
      } else {
        throw new Error('unsupported BodyInit type')
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = input
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this._initBody(bodyInit)
    this.type = 'default'
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request
      if (Request.prototype.isPrototypeOf(input) && !init) {
        request = input
      } else {
        request = new Request(input, init)
      }

      var xhr = new XMLHttpRequest()

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return;
      }

      xhr.onload = function() {
        var status = (xhr.status === 1223) ? 204 : xhr.status
        if (status < 100 || status > 599) {
          reject(new TypeError('Network request failed'))
          return
        }
        var options = {
          status: status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})();
