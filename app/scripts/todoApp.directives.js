angular.module('todoApp.directives', [])

    .directive('clock', [function() {
            return {
                restrict: 'EC',
                replace: true,
                templateUrl: '../views/clock.html',
                link: function(scope, elem, attrs) {
                    console.debug(elem);
                },

                controller: ['$interval', function($interval){
                    var vm = this;
                    vm.now = + new Date();

                    $interval(function(){
                        vm.now = + new Date();
                    }, 1000);
                }],

                controllerAs: 'clock'
            };
        }
    ]);