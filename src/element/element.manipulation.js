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
