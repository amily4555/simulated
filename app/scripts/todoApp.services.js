angular.module('todoApp.services', [])



    .service('$_', ['C', function (C) {

        var $_ = {};

        /**
         * 基础方法
         */

        /**
         * localStorage 存取
         * @param key
         * @param val
         * @returns {undefined}
         */
        $_.storage = function (/**String*/key, /**T*/val) {
            if (null === val || undefined === val) {
                var _val = localStorage.getItem(key);
                if (typeof _val !== 'string') {
                    return undefined;
                }

                try {
                    return JSON.parse(_val);
                } catch (e) {
                    return _val || undefined;
                }
            } else {
                var str = angular.toJson(val);
                str = str.replace(/^\"(.*)\"$/, '$1');
                localStorage.setItem(key, str);
            }
        };

        /**
         * findUpdater(data, predicate[, cb][, insertType])
         * 数组的更新
         * 更新 predicate 找到的第一个匹配项目，并调换位置放入数组头部
         * @param data
         * @param predicate
         * @param cb
         */
        $_.findUpdater = function(/**Array*/ data, /**Function*/ predicate, /***/ cb){
            var index = _.findIndex(data, predicate), item = data[index];
            // 在源中删除该项
            data.splice(index, 1);
            item = cb ? cb.call(null, item) : item;
            data.unshift(item);
            return data;
        };

        /**
         * Task 模块
         * @type {{}}
         */
        $_.task = {};

        /**
         * Task 分组
         * @param data
         */
        $_.task.group = function (data) {
            var groupData = _.map(data, function (o) {
                o.statusType = C.STATUS_TYPE[o.status];
                return o;
            });

            groupData = _.groupBy(groupData, function (o) {
                return o.statusType;
            });

            _.each(C.STATUS_TYPE, function(k, v){
                groupData[k] = groupData[k] || '';
            });

            return groupData;
        };

        /**
         * Task 存储
         * @param obj
         */
        $_.task.storage = function (obj) {
            _.each(obj, function (o, k) {
                $_.storage(k, o);
            });
        };

        /**
         * Task 数据序列化
         * @param data
         */
        $_.task.restore = function(data, cb){
            // 重整数据
            var gt = $_.task.group(data);
            // 存储全部 Task
            $_.storage('all', data);
            // 分组存储各类Task
            $_.task.storage(gt);

            cb && cb.call(null, cb);


        };

        return $_;
    }]);


