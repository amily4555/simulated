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
        .constant('$simulatedConstant', {
            'simulatedUrl' : '/simulated.json',
            'version': '0.1.1',
            'author': 'mizi lin ',
            'company': 'AdMaster@2015'
        })

        .provider('$simulatedCache', [function () {
            this.$get = ['$cacheFactory', function ($cacheFactory) {
                return $cacheFactory('simulatedCache');
            }];
        }])

        .provider('$simulated', ['$httpProvider', '$simulatedConstant', function ($httpProvider, $simulatedConstant) {
            var provider = this;

            console.debug($simulatedConstant);

            /**
             * 判断 anyVal 是否存在 !null, !undefined）
             * @param any
             */
            var isExist = function (any) {
                return any !== undefined && any !== null;
            };

            /**
             * 匹配模拟数据
             * @param key
             * @param method
             */
            var mock = function (key, method) {
                return Mock.mock(mockData[key][method]);
            };

            /**
             * method 为 request 的时候，url添加参数
             * @param url
             * @param serializedParams
             * @returns {*}
             */
            var buildUrl = function(url, serializedParams) {
                if (serializedParams.length > 0) {
                    url += ((url.indexOf('?') == -1) ? '?' : '&') + serializedParams;
                }
                return url;
            };

            this.defaults = {
                // 是否执行数据模拟
                simulated: false,
                // 模拟请求地址
                simulatedUrl: $simulatedConstant.simulatedUrl,
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
                                 * 若用户没有配置 simulatedUrl 模拟调用接口则数据模拟接口，使用调用 simulatedCache
                                 * 若用户配置了 simulatedUrl 使遵从 angular $http 流程
                                 * 让用户自定义的 $httpProvider.interceptors 完全生效
                                 */

                                /**
                                 * 因为使用伪接口调用，
                                 * 影响用户在其他拦截器调用config的值
                                 * config.url = config.realurl || config.url;
                                 * config.method = config.realmethod || config.method;
                                 */
                                if (config.simulated) {

                                    // 判断伪接口类型
                                    // 是否使用cache来作为伪接口
                                    var isCache = d.simulatedUrl === $simulatedConstant.simulatedUrl;

                                    // 存储真实请求接口值
                                    config.realurl = config.url;
                                    config.realmethod = config.method;
                                    config.url = d.simulatedUrl;

                                    if(isCache || 'DELETE' === config.realmethod){
                                        config.cache = $injector.get('$simulatedCache');

                                        // ng 只允许 method == 'GET || JSONP' 从缓存中获取
                                        if(!('GET' === config.method || 'JSONP' === config.method)){
                                            config.method = 'GET';
                                        }

                                        /**
                                         * 模拟$http cache 读取规则
                                         */
                                        var url = buildUrl(config.url, config.paramSerializer(config.params));
                                        config.cache.put(url, '');
                                    }


                                    console.group('::::请求实际数据接口:::', config.realurl, config.realmethod);
                                    console.log('QUERY ->', config.params);
                                    console.log('PAYLOAD ->', config.data);
                                    console.groupEnd();
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

            this.$get = [function () {
                return angular.noop
            }];

        }])

        .config(['$simulatedProvider', function ($simulatedProvider) {
            console.debug($simulatedProvider.defaults);
        }])

        .run(["$simulatedCache", "$simulatedConstant", function ($simulatedCache, $simulatedConstant) {
            /**
             * 向内存中写入$simulatedCache，用于simulated伪造$http请求
             */
            $simulatedCache.put($simulatedConstant.simulatedUrl, '');
        }]);

})(window, angular);