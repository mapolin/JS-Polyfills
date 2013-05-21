// A lightweight document.querySelector polyfill
(function() {
    if( document.querySelector ) return;

    var _helper = {
        query: null,
        parent: null,
        getID : function(id, parent) { return parent ? parent.getElementById(id) : document.getElementById(id) || false; },
        getClass : function(className, parent) { return parent ? parent.getElementsByClassName(className) : document.getElementsByClassName(className) || false; },
        getTag : function(tag, parent) { return parent ? parent.getElementsByTagName(tag) : document.getElementsByTagName(tag) || false },
        find: function(selector, parent) {
            var element, target;
            if( selector.indexOf(' ') > -1 ) {
                target = selector.split(' ');
                target = target[target.length - 1];
                selector = selector.substr(0, selector.lastIndexOf(' '));

                element = this.drill(selector, target);
            }
            else {
                switch( selector.charAt(0) ) {
                    case '.': element = _helper.getClass( selector.substr(1, selector.length), parent ); break;
                    case '#': element = _helper.getID( selector.substr(1, selector.length), parent ); break;
                    default: element = _helper.getTag(selector, parent);
                }
            }

            return element;
        },
        drill: function(selector, target) {
            var result = null, parents = null, parent = null;
            selector = selector.split(' ');
            for(var i = 0; i < selector.length; i++) {
                parents = this.find(selector[i]);
                if(parents.length > 1) {
                    for(var index in parents) {
                        if( !isNaN( parseInt(index) ) ) {
                            result = this.find(target, parents[index]);
                        }
                    }
                }
                else {
                    result = this.find(parents, target);
                }
            }

            return result;
        }
    };

    document.querySelector = function(selector) {
        return _helper.find(selector);
    };
})();