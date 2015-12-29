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
            'simulatedUrl': '/simulated.json',
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

            var isDefined = angular.isDefined,
                isFunction = angular.isFunction,
                isString = angular.isString,
                isObject = angular.isObject,
                isArray = angular.isArray,
                forEach = angular.forEach,
                extend = angular.extend,
                copy = angular.copy,
                noop = angular.noop;

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
            var buildUrl = function (url, serializedParams) {
                if (serializedParams.length > 0) {
                    url += ((url.indexOf('?') == -1) ? '?' : '&') + serializedParams;
                }
                return url;
            };

            var createMap = function createMap() {
                return Object.create(null);
            };

            var lowercase = function (string) {
                return isString(string) ? string.toLowerCase() : string;
            };

            var trim = function (value) {
                return isString(value) ? value.trim() : value;
            };

            var headersGetter = function (resHeaderObj) {
                // 调试模式 response header
                var headersObj = extend({
                    "date": new Date().toString(),
                    "server": "nginx/1.8.0",
                    "connection": "keep-alive",
                    "content-length": "570",
                    "content-type": "text/html"
                }, resHeaderObj || {});

                return function (name) {
                    return name ? headersObj[name] : headersObj;
                };
            };

            var errorOpt = function(status, resHeaderObj, config){
                return {
                    data: '',
                    config: config,
                    status: status,
                    headers: headersGetter(resHeaderObj),
                    statusText: status + ''
                }
            };

            var restReqConfig = function(config){
                config = config || {};
                delete config.__simulated__;

                return config;
            };

            var restResConfig = function(config){
                config = config || {};

                config.url = config.realurl;
                delete config.realurl;

                config.method = config.realmethod;
                delete config.realmethod;

                return config;
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
                maxDelay: 3000,
                // 是否在模拟链接接口中显示实际访问接口
                queryShowRealurl: true,
                // 是否开启随机错误
                // 默认 0
                // debugError: 0-100
                debugError: 0,
                // 默认调试错误码
                errorCode: [404, 500, 401],
                // 模拟配置 response headers
                resHeaderObj: {}
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
                                    var simulatedConfig,
                                        debugError = d.debugError;

                                    // 存储真实请求接口值
                                    config.params = config.params || {};
                                    simulatedConfig = config.params.__simulated__ || {};

                                    config.realurl = config.url;
                                    config.realmethod = config.method;
                                    config.url = d.simulatedUrl;

                                    // 暴露给用户设计请求接口值在 header
                                    config.headers = config.headers || {};
                                    config.headers['X-SIMULATED-REALURL'] = config.realurl;

                                    // 暴露给用户设计请求接口值在 query params
                                    // 可关闭该功能，避免 url 长度超过浏览器限制长度
                                    if (d.queryShowRealurl) {
                                        config.params.__realurl__ = config.realurl;
                                    }

                                    // 模拟配置ajax url
                                    if (isCache || 'DELETE' === config.realmethod) {
                                        config.cache = $injector.get('$simulatedCache');

                                        // ng 只允许 method == 'GET || JSONP' 从缓存中获取
                                        if (!('GET' === config.method || 'JSONP' === config.method)) {
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

                                    /**
                                     * 模拟请求错误（status code)）
                                     */

                                    if(simulatedConfig.status){
                                        // 模拟错误码返回数据
                                        return $q.reject(errorOpt(simulatedConfig.status, d.resHeaderObj, restReqConfig(config)));
                                    }else if (d.debugError) {
                                        var rd = Math.random(), err = d.errorCode;
                                        if (Math.floor(rd * 1000) <= d.debugError * 10) {
                                            var status = err[Math.floor(rd * err.length)];
                                            // 模拟错误码返回数据
                                            return $q.reject(errorOpt(status, d.resHeaderObj, restReqConfig(config)));
                                        }
                                    }
                                }

                                return restReqConfig(config);
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


                                    res.config = restResConfig(config);
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

                                console.error('::::response error::::', res);

                                //return $q.resolve(res);

                                return $q.reject(res);
                            }

                        };
                    }]);
                }
            };

            this.$get = [function () {
                return noop;
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