"use strict";

mslApp.controller("RealtimeResultCtrl",
    function ($window, $rootScope, $scope, $stateParams, transitionService, searchService, $location) {

        $scope.shilutFilterValue = "";
        $scope.nearBustopList = [];
        if ($stateParams.isShowFilter == null || $stateParams.isShowFilter == 1)
            $rootScope.isShowFilter = true;
        else
            $rootScope.isShowFilter = false;

        $scope.typeIndex = $stateParams.typeIndex;
        $scope.dataString = $stateParams.dataString;

        if ($scope.typeIndex != null && $scope.dataString != null) {
            localStorage.setItem('realtimeTypeIndex', $scope.typeIndex);
            localStorage.setItem('realtimeDataString', $scope.dataString);
        }

        if ($scope.typeIndex == null || $scope.dataString == null)
            return;

        function init() {
            switch ($scope.typeIndex) {
                case '1':

                    setTimeout(function () { $("#realtimeResult").focus(); }, 500);

                    $scope.nearBustopList = $scope.search.nearBustopList = null;
                    $rootScope.currentLocation = { coords: { latitude: $scope.dataString.split(',')[0], longitude: $scope.dataString.split(',')[1] }, description: "" };
                    $rootScope.getNearBustopList(null, function (nearBustopList) {
                        $scope.nearBustopList = $scope.search.nearBustopList;

                        $scope.favoriteStopList = getFavoriteStopList();
                        for (var j = 0; $scope.search.nearBustopList && j < $scope.search.nearBustopList.length; j++)
                            $scope.search.nearBustopList[j].isFavorite = false;
                        for (var i = 0; $scope.favoriteStopList != null && i < $scope.favoriteStopList.length; i++) {
                            for (var j = 0; j < $scope.search.nearBustopList.length; j++) {
                                if ($scope.search.nearBustopList[j].Makat == $scope.favoriteStopList[i])
                                    $scope.search.nearBustopList[j].isFavorite = true;
                            }
                        }

                    },
                    function () {
                        $scope.nearBustopList = $scope.search.nearBustopList = [];
                    });
                    break;

                case '2':

                    setTimeout(function () { $("#realtimeResult").focus(); }, 500);
                    $scope.nearBustopList = $scope.search.nearBustopList = null;
                    $scope.search.makat = $scope.dataString;
                    transitionService.getBusStopByMakat(
                        $scope.search.makat,
                        $scope.search.language,
                        false,
                        function (busStopByMakatVal) {

                            if (busStopByMakatVal == null || busStopByMakatVal == "" || busStopByMakatVal.Makat == 0) {
                                $scope.search.selectedBusStop = null;
                                return;
                            }

                            $rootScope.insertRealtimeToBusstop(busStopByMakatVal);
                            $scope.nearBustopList = [];
                            $scope.nearBustopList.push(busStopByMakatVal);

                            $scope.favoriteStopList = getFavoriteStopList();
                            for (var j = 0; $scope.search.nearBustopList && j < $scope.search.nearBustopList.length; j++)
                                $scope.search.nearBustopList[j].isFavorite = false;
                            for (var i = 0; $scope.favoriteStopList != null && i < $scope.favoriteStopList.length; i++) {
                                for (var j = 0; j < $scope.search.nearBustopList.length; j++) {
                                    if ($scope.search.nearBustopList[j].Makat == $scope.favoriteStopList[i])
                                        $scope.search.nearBustopList[j].isFavorite = true;
                                }
                            }

                            setTimeout(function () {
                                for (var j = 0; j < $scope.nearBustopList.length; j++)
                                    if ($scope.nearBustopList[j].LinesInStationList != null) {
                                        if ($scope.nearBustopList[j].LinesInStationList.length == 0)
                                            $scope.nearBustopList.splice(j, 1);
                                    }
                            }, 1000);

                        },
                    function () {
                        $scope.nearBustopList = $scope.search.nearBustopList = [];
                    });

                    break;

                case '3':

                    setTimeout(function () { $("#realtimeResult").focus(); }, 500);
                    var splittedList = getFavoriteStopList();
                    $scope.nearBustopList = [];
                    if (splittedList != null) {
                        for (var i = 0; i < splittedList.length; i++) {
                            $scope.search.makat = splittedList[i];
                            transitionService.getBusStopByMakat(
                                $scope.search.makat,
                                $scope.search.language,
                                false,
                                function (busStopByMakatVal) {

                                    if (busStopByMakatVal == null || busStopByMakatVal == "" || busStopByMakatVal.Makat == 0) {
                                        $scope.search.selectedBusStop = null;
                                        return;
                                    }

                                    $scope.search.selectedBusStop = busStopByMakatVal;
                                    if ($scope.search.nearBustopList == null)
                                        $scope.search.nearBustopList = [];

                                    $rootScope.insertRealtimeToBusstop(busStopByMakatVal);
                                    busStopByMakatVal.isFavorite = true;
                                    $scope.nearBustopList.push(busStopByMakatVal);

                                    setTimeout(function () {
                                        for (var j = 0; j < $scope.nearBustopList.length; j++)
                                            if ($scope.nearBustopList[j].LinesInStationList.length == 0)
                                                $scope.nearBustopList.splice(j, 1);
                                    }, 1000);

                                },
                            function () {
                                
                            });
                        }
                    }

                    break;

            }
        }
        init();
        $scope.favoriteStopClicked = function (stopMakat) {
            for (var i = 0; i < $scope.nearBustopList.length; i++) {
                if ($scope.nearBustopList[i].Makat == stopMakat) {
                    if ($scope.nearBustopList[i].isFavorite == true)
                        removeFromFavoriteList(stopMakat);
                    else
                        addToFavoriteList(stopMakat);
                    $scope.nearBustopList[i].isFavorite = !$scope.nearBustopList[i].isFavorite;
                    if ($scope.nearBustopList[i].isFavorite == false && $scope.typeIndex == "3")
                        $scope.nearBustopList.splice(i, 1);
                    break;
                }
            }
        }

        $scope.moveToSearchByLine = function (line, busstop) {
            
            searchService.QuarterByXy(
                busstop.Latitude,
                busstop.Longitude,
                300,
                $rootScope.search.language,
                $rootScope.search.isEggedDb,
                function (addressList) {
                    searchService.getDataFromServer("getCityList",
                        [$scope.search.language, $scope.search.isEggedDb],
                        function (newCityList) {
                            $scope.search.cityList = newCityList;

                            for (var j = 0; j < addressList.length; j++) {
                                var fetchedItem = $.grep($rootScope.search.cityList, function (e) { return e.ID.split('-')[0] == addressList[j].City.ID; })[0];
                                addressList[j].City.iid = fetchedItem.iid;
                                addressList[j].City.ID = addressList[j].City.ID + "-" + fetchedItem.iid;
                            }
                            var lineNumber = line.ID.toString();
                            lineNumber = lineNumber.substring(0, lineNumber.length - 1);

                            transitionService.getRovaDetails(
                                line.DestinationQuarterId,
                                $rootScope.search.language,
                                $rootScope.search.isEggedDb,
                                function (rovaDetails) {
                                    
                                    location.href = "#/linenumber/0/0"
                                                    + "/" + addressList[0].City.ID
                                                    + "/" + addressList[0].Quarter.ID
                                                    + "/" + rovaDetails.data.CITY.ID
                                                    + "/" + rovaDetails.data.ID
                                                    + "/" + lineNumber
                                                    + "/" + 1;
                                    setTimeout(function () {
                                        $rootScope.isShowFilter = true;
                                    }, 50);
                                });
                        });
                });


        }

        function isFavorite(newMakat) {
            var isFavorite = false;
            var list = getFavoriteStopList();
            for (var i = 0; i < list.length; i++) {
                if (list[i] == newMakat) {
                    isFavorite = true;
                    break;
                }
            }
            return isFavorite;
        }

        function addToFavoriteList(stopMakat) {
            var list = $scope.favoriteStopList = getFavoriteStopList();
            //for (var i = 0; i < $scope.search.nearBustopList.length; i++)
            //    if ($scope.search.nearBustopList[i].Makat == stopMakat) {
            list.push(stopMakat);
            //    break;
            //}
            localStorage.setItem("favoriteStopList", list);
        }

        function removeFromFavoriteList(stopMakat) {
            var list = getFavoriteStopList();
            for (var i = 0; i < list.length; i++) {
                if (list[i] == stopMakat) {
                    list.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem("favoriteStopList", list);
        }

        function getFavoriteStopList() {
            if (!$rootScope.isStorageActive) return;
            var favoriteStopList = localStorage.getItem("favoriteStopList");
            if (favoriteStopList == null) favoriteStopList = [];
            favoriteStopList = JSON.parse("[" + favoriteStopList + "]");
            return favoriteStopList;
        }

        var isDragging = false;
        var dragStartPoint = 0;

        $scope.refresh = function () {
            init();
        }

        $scope.shilutFilterValueKeyUp = function (value)
        {

            for (var i = 0; i < $scope.nearBustopList.length; i++) {
                for (var j = 0; j < $scope.nearBustopList[i].LinesInStationList.length; j++) {
                    $scope.nearBustopList[i].LinesInStationList[j].isVisible = null;
                }
            }

            if (value == null || value == "") return;
            debugger;
            for (var i = 0; i < $scope.nearBustopList.length; i++) {
                for (var j = 0; j < $scope.nearBustopList[i].LinesInStationList.length; j++) {
                    //$scope.nearBustopList[i].LinesInStationList[j].isVisible = null;
                    if ($scope.nearBustopList[i].LinesInStationList[j].Shilut.indexOf(value) > -1) {
                        $scope.nearBustopList[i].LinesInStationList[j].isVisible = true;
                    }
                    else {
                        $scope.nearBustopList[i].LinesInStationList[j].isVisible = false;
                    }
                }
            }

        }

        $scope.$watch("shilutFilterValue", function (newValue, oldValue) {
            if($scope.nearBustopList != null)
            for (var i = 0; i < $scope.nearBustopList.length; i++) {
                for (var j = 0; j < $scope.nearBustopList[i].LinesInStationList.length; j++) {
                    $scope.nearBustopList[i].LinesInStationList[j].isVisible = null;
                }
            }

            if (newValue == null || newValue == "") return;
            if ($scope.nearBustopList != null)
            for (var i = 0; i < $scope.nearBustopList.length; i++) {
                for (var j = 0; j < $scope.nearBustopList[i].LinesInStationList.length; j++) {
                    $scope.nearBustopList[i].LinesInStationList[j].isVisible = null;
                    if ($scope.nearBustopList[i].LinesInStationList[j].Shilut.indexOf(newValue) > -1) {
                        $scope.nearBustopList[i].LinesInStationList[j].isVisible = true;
                    }
                    else {
                        $scope.nearBustopList[i].LinesInStationList[j].isVisible = false;
                    }
                }
            }
            
        });

    }
);


