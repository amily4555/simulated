
angular.module('todoApp.router', [
    'ui.router'
])
    .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ])

    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('task');

            $stateProvider
                .state('task', {
                    url: '^/task',
                    views: {
                        'mainer': {
                            template: '<div ui-view="list"></div>',
                            //templateUrl: 'simulated/400.html',
                            controller: 'dataInitCtrl'
                        }
                    }
                })

                .state('task.list', {
                    url: '^/task/list',
                    views: {
                        'list': {
                            templateUrl: 'views/todo.task.list.html',
                            controller: 'taskListCtrl as atk'
                        }
                    }
                })

                .state('task.type', {
                    url: '^/task/list/:type',
                    views: {
                        'list': {
                            templateUrl: 'views/todo.task.detail.html',
                        },

                        'left@task.type': {
                            templateUrl: function($stateParams){
                                var type = $stateParams.type;
                                return 'views/todo.task.'+ type +'.html';
                            },

                            controller: 'taskListCtrl as atk'
                        }
                    }
                })

                .state('task.type.detail', {
                    url: '^/task/list/:type/:id',
                    views: {
                        'right': {
                            templateUrl: 'views/todo.task.form.html',

                            controller: 'taskDetailCtrl as t'
                        }
                    }
                });

        }
    ]);



