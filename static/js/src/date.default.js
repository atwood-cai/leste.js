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
