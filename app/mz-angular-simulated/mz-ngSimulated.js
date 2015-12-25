/**
 * 基于 angular $resource RESTful 数据模拟
 */

(function (window, angular, undefined) {
    'use strict';

    var $simulatedMinErr = angular.$$minErr('$simulated');

    /**
     * ngSimulated 基于 ngResource 运行
     */


    angular.module('ngSimulated', ['ng'])
        .provider('$simulatedCache', [function () {
            this.$get = ['$cacheFactory', function ($cacheFactory) {
                return $cacheFactory('simulatedCache');
            }];
        }])

        .provider('$simulated', ['$httpProvider', function ($httpProvider) {
            var provider = this;

            /**
             * 判断 anyVal 是否存在 !null, !undefined）
             * @param any
             */
            var isExist = function (any) {
                return any !== undefined && any !== null;
            };

            var mock = function (key, method) {
                return Mock.mock(mockData[key][method]);
            };

            this.defaults = {
                // 是否执行数据模拟
                simulated: false,
                // 是否贮存数据
                store: true,
                // 数据贮存类型
                // @storage HTMLStorage, 默认 dat
                // @memory 内存
                storeType: 'storage',
                // 模拟 ajax 延迟时间
                // 最小延迟时间
                minDelay: 50,
                // 最大延迟时间
                maxDelay: 3000
            };

            this.defaults.$httpProvider = function ($httpProvider) {
                var d = this;

                if (d.simulated) {

                    console.log('开启模拟数据插件 $simulated 插件');

                    $httpProvider.interceptors.push(['$q', '$injector', function ($q, $injector) {
                        return {
                            request: function (config) {


                                /**
                                 * $http 发起请求类型
                                 *  @-1 用户通过$http, $resource主动请求
                                 *  @-2 ng-router 或 ui-router 等第三方路由控件发起 templateUrl 请求
                                 *  @-3 ng-include 或 directive 由指令发起 templateUrl 请求
                                 * 其中 @-2，@-3 属于同一类型有 ng 主动缓存 templateUrl,
                                 * 同时用户不易对其 $http config 进行修改配置
                                 * 所以目前 mzSimulated 只对@-1 进行数据模拟
                                 */

                                /**
                                 * mzSimulated 目前针对一切非templateUrl的接口进行数据模拟
                                 * 若要自定义某接口是否使用 mzSimulated, 则请配置 config.simulated 值
                                 * config.simulated == true -> run mzSimulated
                                 * 若自定义接口本身只用 cache，则默认不执行 mzSimulated，若要执行 请设置 config.simulated = true
                                 */
                                config.simulated = isExist(config.simulated) ? config.simulated : config.cache ? false : true;

                                /**
                                 * 数据模拟接口，使用调用 templateCache
                                 * 使遵从 angular $http 流程
                                 * 让用户自定义的 $httpProvider.interceptors 完全生效
                                 * @type {*}
                                 */

                                /**
                                 * 影响用户在其他地方调用config的值
                                 * 修正反感
                                 * config.url = config.realurl || config.url;
                                 */
                                if (config.simulated) {

                                    // 存储真实请求接口值
                                    config.realurl = config.url;

                                    // ng 只允许 method == 'GET || JSONP' 从缓存中获取
                                    config.realmethod = config.method;
                                    config.url = '/simulated/store';

                                    // 每种method的缓存机制不太一样
                                    switch (config.method) {
                                        case 'GET' :
                                        case 'JSONP' :
                                            config.cache = config.cache || $injector.get('$templateCache');
                                            break;
                                        default :
                                            config.method = 'GET';
                                            config.cache = $injector.get('$simulatedCache');
                                            break;
                                    }

                                    console.info('::::请求实际数据接口:::', config.realurl, config.realmethod);

                                }

                                return config;
                            },

                            requestError: function (config) {
                                console.debug('requestError', config);
                                return config;
                            },

                            response: function (res) {
                                var config = res.config;
                                var method, url;

                                // 只处理 config.simulated == true 的数据
                                if (config.simulated) {

                                    url = config.realurl || config.url;
                                    method = config.realmethod || config.method;
                                    res.data = mock(url, method);

                                    config.url = url;
                                    config.method = method;
                                    delete config.realurl;
                                    delete config.realmethod;

                                    console.info('::::模拟数据::::', config.method, config.url, res.data);
                                }

                                return res;
                            },

                            responseError: function (res) {
                                var status = res.status;

                                if (200 == status) {
                                    console.debug(res);
                                    return $q.resolve(res);
                                }

                                console.debug('::::responseError', res);

                                //return $q.resolve(res);

                                return $q.reject(res);
                            }

                        };
                    }]);
                }

            };

            //this.defaults.interceptors = function ($q) {
            //    return {
            //        request: function (config) {
            //            console.debug('::OOOOOOooooOOOOoooO:request-1', config);
            //            config.AA = 666666666;
            //            return config;
            //        }
            //
            //    };
            //};

            this.$get = [function () {
                return angular.noop
            }];

        }])

        .config(['$simulatedProvider', function ($simulatedProvider) {
            console.debug($simulatedProvider.defaults);
        }])

        .run(["$templateCache", "$simulatedCache", "$injector", function ($templateCache, $simulatedCache, $injector) {
            /**
             * 向内存中写入templateCache，用于simulated伪造$http请求
             */
            $templateCache.put('/simulated/store', {});
            $simulatedCache.put('/simulated/store', {
                't': +new Date()
            });
        }]);

})(window, angular);