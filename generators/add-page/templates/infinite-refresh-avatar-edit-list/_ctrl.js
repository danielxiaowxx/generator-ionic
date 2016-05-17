/**
 * Created by danielxiao
 */

angular.module('<%= appName %>.controllers')

  .controller('<%= firstCapCamelCtrlName %>Ctrl', ['$scope', '$rootScope', '$state', '$ionicScrollDelegate', '$ionicListDelegate', 'ionicModal', 'appConstants', 'restService',

    function($scope, $rootScope, $state, $ionicScrollDelegate, $ionicListDelegate, ionicModal, appConstants, restService) {

      var searchCondition = {
        pageNum : 0, // 当前页码 0是因为一开始就会运行loadMore
        pageSize: 20 // 每次请求数据条数
      };

      /*========== Scope Models ==================================================*/

      $scope.noMoreData = false;

      $scope.isNoData = false;

      $scope.loadingData = false;

      $scope.dataList = [];

      /*========== Scope Functions ==================================================*/

      $scope.loadMore = function() {
        if (!$scope.loadingData) {
          searchCondition.pageNum++;
          getDataList(true);
        }
      };

      $scope.doRefresh = function() {
        searchCondition.pageNum = 1;
        getDataList(false);
      };

      $scope.viewItemDetail = function(item) {
        console.log(item);
      };

      $scope.removeCustomer = function(item) {
        $rootScope.confirm($rootScope.i18n.deleteConfirm).then(function(result) {
          if (result) {
            return daoService.removeCustomer(id);
          } else {
            return null;
          }

        }).then(function(result) {
          $ionicListDelegate.closeOptionButtons();
          if (result) {
            $scope.search();
          }
        });
      };

      /*========== Listeners ==================================================*/

      /*========== Watches ==================================================*/

      $scope.$on('$ionicView.loaded', function() {
        _init();
      });

      /*========== Private Functions ==================================================*/

      function getDataList(isAppend) {

        $scope.loadingData = true;
        $rootScope.loading(true);

        restService.getDataList(searchCondition.pageSize, searchCondition.pageNum).success(function(data) {

          $scope.loadingData = false;

          if (isAppend) {
            $scope.dataList = $scope.dataList.concat(data.results);
          } else {
            $scope.dataList = data.results;
          }

          // 设置是否load more可用
          if (data.results.length === 0 || data.count <= $scope.dataList.length) {
            $scope.noMoreData = true;
          } else {
            $scope.noMoreData = false;
          }
        }).catch(function(e) {
          //console.error(e);
        }).finally(function() {
          $rootScope.loading(false);
          $scope.isNoData = $scope.dataList.length === 0;

          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      }

      function _init() {
      }

    }]);
