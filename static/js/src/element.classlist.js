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
