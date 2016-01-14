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
