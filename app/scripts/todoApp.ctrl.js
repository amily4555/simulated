angular.module('todoApp.ctrl', [])

    .controller('dataInitCtrl', ['$$', '$_', 'C', '$rootScope', '$injector', function ($$, $_, C, $rootScope, $injector) {

        var allTask = $_.storage('all');

        allTask ? $_.task.storage($_.task.group(allTask)) : $$.datastore.get({}, function(res){
            // 存储全部 Task
            $_.storage('all', res.data);
            // 分组存储各类Task
            $_.task.storage($_.task.group(res.data));
        });

        //$$.user.geter({
        //    'id': 1008
        //}, function(res){
        //    //console.debug('$$:::::', res);
        //});

        $$.company.get({
            companyId: 1009,
            recordId: 'X100876'
        });

        //$$.datastore.get({
        //    'id': 1003
        //}, function(res){
        //    //console.debug('$$:::::', res);
        //});
        //
        //
        //
        //$$.datastore.save({
        //    name: 'mizi'
        //}, function(res, headers, config){
        //    //console.debug('$$:::::', res);
        //}, function (res) {
        //    //console.debug(res);
        //    //console.debug('oOoOOoooOOo', res.headers('date'));
        //});
        //
        //$$.datastore.delete({
        //    id: 123
        //}, function(res){
        //    //console.debug('$$:::::', res);
        //});

        //$$.company.get({
        //    'companyId': 2,
        //    'recordId': 8,
        //    'id': 'def'
        //}, function(res){
        //    //console.debug('$$:::::', res);
        //});



        //var c = $injector.get('$simulatedCache');
        //$injector.get('$http').post('/v1/users', {cache: true});



        //$_$.datastore.get({}, function(res){
        //    console.debug('$_$:::::', res);
        //});

        $rootScope.C = C;
    }])

    .controller('taskListCtrl', ['$$', '$_', 'C', '$interval', function ($$, $_, C, $interval) {
        var vm = this;

        vm.all = $_.storage('all');

        if(null === vm.all || undefined === vm.all){
            var timeoutId = $interval(function(){
                if($_.storage('all')){
                    vm.all = $_.storage('all');
                    $interval.cancel(timeoutId);
                }
            }, 100);
        }

        _.each(C.STATUS_TYPE, function(v, k){
            vm[v] = $_.storage(v);
        });

        vm.addTask = function(){
            vm.all.unshift({
                'id': + new Date(),
                'title': vm.task,
                'status': -1,
                'updateTime': + new Date(),
                'createTime': + new Date()
            });

            $_.storage('all', vm.all);

            delete vm.task;
        };

        vm.removeTask = function(id){
            var index = _.findIndex(vm.all, function(item){
                return item.id === id;
            });

            vm.all.splice(index, 1);

            $_.task.restore(vm.all, function(){
                _.each(C.STATUS_TYPE, function(v, k){
                    vm[v] = $_.storage(v);
                });
            });
        };

        vm.changeStatus = function(id, status){
            vm.all = $_.findUpdater(vm.all, function(item){
                return item.id === id;
            }, function(item){
                item.status = status;
                item.updateTime = + new Date();
                return item;
            });

            $_.task.restore(vm.all, function(){
                _.each(C.STATUS_TYPE, function(v, k){
                    vm[v] = $_.storage(v);
                });
            });
        };

        return vm;

    }])

    .controller('taskDetailCtrl', ['$$', '$_', 'C', '$state', '$stateParams', function ($$, $_, C, $state, $stateParams) {
        var vm = this;
        var id = $stateParams.id, type = $stateParams.type;
        var tasks = $_.storage('all');

        vm = angular.extend(vm, _.find(tasks, function(item){
            return item.id === id;
        }) || {} );

        vm.save = function(form){
            if(form.$valid){
                tasks = $_.findUpdater(tasks, function(item){
                    return item.id === id;
                }, function(item){
                    angular.extend(item, vm);
                    item.updateTime = + new Date();
                    return item;
                });

                $_.task.restore(tasks);

                $state.reload('task.type');
            }
        };


        return vm;
    }]);


