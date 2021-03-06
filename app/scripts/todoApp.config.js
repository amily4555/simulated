angular.module('todoApp.config', ['ngSimulated'])

    .constant('C', {
        STATUS_TYPE: {
            0: 'remove',
            1: 'progress',
            2: 'done'
        }
    })

    .config(['$simulatedProvider', '$httpProvider', '$templateCacheProvider', function ($simulatedProvider, $httpProvider, $templateCacheProvider) {
        //$simulatedProvider.defaults.maxDelay = 3000;
        //$simulatedProvider.defaults.minDelay = 100;
        $simulatedProvider.defaults.simulated = true;
        $simulatedProvider.defaults.debugError = 0;
        $simulatedProvider.defaults.simulatedModel = 'simulatedModel';
        $simulatedProvider.defaults.simulatedUrl = 'mzSimulated/simulated.json';
        $simulatedProvider.defaults.$httpProvider($httpProvider, $templateCacheProvider);
    }])

    .config(['$resourceProvider', function($resourceProvider) {
        console.debug('::::', $resourceProvider);
    }])

    .config(['$provide', function($provide){
        $provide.decorator('$resource', function($delegate) {
            $delegate.reinit = function() {
                //console.debug('oOooOOooo', this);
            };

            return $delegate;
        });
    }])

    .config(['$httpProvider', 'C', function ($httpProvider, C) {

        /**
         * http 拦截器设置
         */
        $httpProvider.interceptors.push(function ($q) {

            return {
                request: function (config) {

                    //console.debug(':::request-1', config);
                    //config.url = config.url + '?t=' + + new Date();
                    //config.url = 'dddd';

                    return config;
                },

                response: function (res) {

                    //console.debug('::::response-1', res);

                    //$q.resolve();

                    return res;

                    //return $q.reject(res);
                },

                responseError: function (res) {
                    var status = res.status;

                    console.debug('::::responseError', res.status);

                    return $q.reject(res);
                }

            };
        });

    }]);

