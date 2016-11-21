"use strict";

mslApp.controller("MapCtrl",
    function ($rootScope, $scope, requestContext) {

        $scope.$watch("search.mapSelectedLocation", function (e) {
            if ($rootScope.search.mapSelectedLocation == null) return;
            var coords = $rootScope.search.mapSelectedLocation.split(',');
            $rootScope.search.onSelectedAddressFrom({ lat: coords[0], lng: coords[1] });
            $scope.$apply();

        });

    });
