"use strict";
mslApp.controller(
    "MinimizedCtrl",
    function ($rootScope, $scope) {

        $scope.changeSearch = function (e) {
            $rootScope.isShowFilter = true;
        }

    }
);
