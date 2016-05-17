angular.module('<%= appName %>.controllers')

  .controller('<%= firstCapCamelCtrlName %>Ctrl', ['$scope', '$rootScope', '$state',

    function($scope, $rootScope, $state) {

      /*========== Scope Models ==================================================*/

      /*========== Scope Functions ==================================================*/

      /*========== Listeners ==================================================*/

      /*========== Watches ==================================================*/

      $scope.$on('$ionicView.beforeEnter', function() {
        _init();
      });

      /*========== Private Functions ==================================================*/

      function _init() {
      };

    }]);
