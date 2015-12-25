angular.module('todoApp.resources', [])

    .service('$$', ['$resource', function ($resource) {
        return {
            //'datastore': $resource('datastore/todo.json')
            'datastore': $resource('/v1/users')
        };
    }])

    .service('$_$', ['$simulated', function ($simulated) {
        return {
            'datastore': $simulated('/datastore/todo.json')
        };
    }]);