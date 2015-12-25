angular.module('todoApp.filters', [])

    .filter('gender', [function() {
        return function(val, type) {
            return ('cn' === type ? {
                '0': '女孩',
                '1': '男孩'
            } : {
                '0': 'Girl',
                '1': 'Boy'
            })[val];
        };
    }]);