"use strict";
mslApp.controller(
    "RealtimeQueryCtrl",
    function ($rootScope, $scope, $stateParams, $timeout, transitionService, globalFunctions) {

        var geocoder;
        $scope.favoriteStopList = [];
        $scope.favoriteStopList = JSON.stringify(getFavoriteStopList());
        $scope.busStopMakatValue = "";
        $scope.selectedLocation = "";
        $scope.selectedDescription = "";
        $scope.realtimeSelector = 1;

        $scope.typeIndex = $stateParams.typeIndex;
        $scope.dataString = $stateParams.dataString;

        if ($scope.typeIndex != null || $scope.dataString != null) {
            switch ($scope.typeIndex) {
                case '1':
                    $scope.selectedLocation = $stateParams.dataString;
                    break;
                case '2':
                    $scope.busStopMakatValue = $stateParams.dataString;
                    break;
                case '3':

                    break;
            }
        }

        //$(".searchByMakatBox").focus(function () {

        //    $scope.realtimeSelector = 2;
        //});

        $rootScope.$watch("isGoogleReachable", function (newVal, oldVal) {
            if (newVal == true) {
                geocoder = new google.maps.Geocoder();
            }
        });

        $scope.$watch("selectedLocation", function (newVal, oldVal) {
            if (!newVal) return;
            $scope.typeIndex = '1';
            $scope.realtimeSelector = 1;

            $scope.dataString = newVal;
            setTimeout(function () {
                if ($rootScope.isGoogleReachable == false) return;
                geocoder.geocode({ 'latLng': new google.maps.LatLng(newVal.split(',')[0], newVal.split(',')[1]) }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            $scope.selectedDescription = results[0].formatted_address;
                            $scope.$apply();
                        }
                    }
                    else
                    {
                        //alert("Geocoder failed due to: " + status);
                    }
                });
            }, 1000);
        });


        $scope.$watch("busStopMakatValue", function (newVal, oldVal) {
            if (!newVal) return;

            var isnum = /^\d+$/.test(newVal);
            if (isnum != true)
            {
                $scope.search.userMessageTitle = "_Title_";
                $scope.search.userMessage = "_FeedDigitsOnly_";
                $scope.busStopMakatValue = "";
            }

            $scope.typeIndex = '2';
            $scope.realtimeSelector = 2;
            $scope.dataString = newVal;
        });

        //$scope.$watch("realtimeSelector", function (newVal, oldVal) {
        //    $scope.typeIndex = newVal;
        //    switch (newVal) {
        //        case '1':
        //            $scope.busStopMakatValue = "";
        //            break;
        //        case '2':
        //            $scope.selectedLocation = "";
        //            $scope.selectedDescription = "";
        //            break;
        //    }

        //});

        function getFavoriteStopList() {
            //localStorage.setItem("favoriteStopList", []);
            if (!$rootScope.isStorageActive) return;
            var favoriteStopList = localStorage.getItem("favoriteStopList");
            if (favoriteStopList == null) favoriteStopList = [];
            favoriteStopList = JSON.parse("[" + favoriteStopList + "]");
            return favoriteStopList;
        }

        $scope.showRealtimeAddressMessage = function (e) {
                $scope.search.userMessageTitle = "_Title_";
                $scope.search.userMessage = "_HelpRealtimeAddress_";
        }

        $scope.showRealtimeStopMessage = function (e) {
                $scope.search.userMessageTitle = "_Title_";
                $scope.search.userMessage = "_HelpRealtimeStop_";
        }

    }
);


