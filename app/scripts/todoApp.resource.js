angular.module('todoApp.resources', [])

    .service('$$', ['$resource', function ($resource) {

        return {
            //'datastore': $resource('datastore/todo.json')
            'datastore': $resource('/v1/users', {}, {
                geter: {
                    method: 'GET',

                    transformRequest: function(request) {
                        console.log(':::::::::::', arguments);
                        return request;
                    },


                    interceptor: {
                        request: function(config){
                            console.debug(':::::::::', config);
                        },

                        response: function(config){
                            console.debug(':::::::::', config);
                        }
                    }
                }
            }),

            'user': $resource('/v1/users/:id', {}, {
                geter: {
                    method: 'GET',

                    transformRequest: function(request, fn) {
                        //console.log('::oooo:::::::::', arguments);
                        return request;
                    },


                    interceptor: {
                        request: function(config){
                            console.debug(':::::::::', config);
                        },

                        response: function(config){
                            console.debug(':::::::::', config);
                        }
                    }
                }
            }),

            'company': $resource('/v1/companys/:companyId/records/:recordId', {
                companyId: '1003',
                recordId: '@id'
            }),

            'test': $resource('/v1/test/:type/records/:recordId/comments/:commentId')
        };
    }])

    .service('$_$', ['$simulated', function ($simulated) {
        return {
            'datastore': $simulated('/datastore/todo.json')
        };
    }]);