"use strict";
mslApp.controller("SearchCtrl",
    function ($rootScope, $scope, $stateParams, $timeout, searchService, $location, $q) {

        if ($stateParams.isClear && $stateParams.isClear == "1") {

            if ($scope.search.dateList != null)
                $scope.search.currentDate = $scope.search.dateList[0];

            if ($scope.search.originMarker) {
                $scope.search.originMarker.setMap(null);
                $scope.search.originMarker = null;
            }
            if ($scope.search.destinationMarker) {
                $scope.search.destinationMarker.setMap(null);
                $scope.search.destinationMarker = null;
            }

            $rootScope.gridScheduleList = null;
            $scope.search.nearBustopList = null;

            setTimeout(function () {
                if ($location.$$path.indexOf("origindestination") > -1)
                    $location.path("/origindestination/1/0");
                else
                    $location.path("/linenumber/1/0");
            }, 50);

            return;

        }
        if ($rootScope.accessibilitySite == true  && $location.$$path.indexOf("freetext") < 0) $rootScope.accessibilitySite = false;
        //if ($rootScope.isMapViewed != true)
        clearAllFields();

        $(".ui-widget").each(function () {
            if ($(this)[0].style.display == "block") {
                $($(this)[0].parentElement.parentElement).find(".ui-dialog-titlebar-close").click();
                return false;
            }
        });

        $rootScope.isNavigatedFromTransition = false;
        $rootScope.isNavigatedFromDetails = false;

        $scope.deferredFromCityId = $q.defer();
        $scope.deferredFromPlaceId = $q.defer();
        $scope.deferredToCityId = $q.defer();
        $scope.deferredToPlaceId = $q.defer();
        $scope.deferredLineNumber = $q.defer();

        var quartersInitialized = [];
        quartersInitialized.push($scope.deferredFromPlaceId.promise);
        quartersInitialized.push($scope.deferredToPlaceId.promise);
        if ($location.$$path.indexOf("origindestination") > -1) {
        }
        else {
            quartersInitialized.push($scope.deferredLineNumber.promise);
        }

        $q.all(quartersInitialized).then(function () {
            $rootScope.$broadcast('quartersInitialized', { newValue: "" });

        });

        $scope.isAddressSearchVisible = false;
        $scope.isBylineAddressSearchVisible = false;
        $scope.focusBylineLineNumber = false;

        $scope.search.isDirectLine = false;
        if ($stateParams.isDirectLines != null) {
            if ($stateParams.isDirectLines == "true")
                $scope.search.isDirectLine = true;
            if ($stateParams.isDirectLines == "false")
                $scope.search.isDirectLine = false;
        }

        searchService.getTimeList(function (timeList) {
            $scope.search.timeList = timeList;
            if (timeList.length > 0)
                if ($stateParams.Hour)
                    $scope.search.currentTime = $.grep($scope.search.timeList,
                    function (e) { return e.ID == $stateParams.Hour; })[0];
                else
                    $scope.search.currentTime = timeList[0];
        });

        searchService.getDataFromServer("getDateList",
            [$scope.search.language, $scope.search.isEggedDb]
            , function (newDateList) {
                $scope.search.dateList = newDateList;
                if ($scope.search.dateList.length > 0)
                    if ($stateParams.dayOrder)
                        $scope.search.currentDate = $.grep($scope.search.dateList,
                        function (e) { return e.ID == $stateParams.dayOrder; })[0];
                    else {
                        if ($scope.search.dateList != null)
                            $scope.search.currentDate = $scope.search.dateList[0];
                    }
            });

        if ($stateParams.originCoords && $stateParams.originCoords != 0)
            $scope.search.autocompleteOrigin = { coords: $stateParams.originCoords, description: "" };
        if ($stateParams.destinationCoords && $stateParams.destinationCoords != 0)
            $scope.search.autocompleteDestination = { coords: $stateParams.destinationCoords, description: "" };
        //$scope.search.autocompleteBylineOrigin = { coords: "", description: "" };
        //$scope.search.autocompleteBylineDestination = { coords: "", description: "" };
        var isFirstTime = true;
        searchService.getDataFromServer("getCityList",
            [$scope.search.language, $scope.search.isEggedDb],
            function (newCityList) {
                $scope.search.cityList = newCityList;

                if ($stateParams.fromAddressCityId) {
                   
                    var fromAddressCity = $.grep($scope.search.cityList, function (e) { return e.ID == $stateParams.fromAddressCityId; })[0];
                    if (fromAddressCity != null) {
                        //if (fromAddressCity.ID.indexOf('-') == -1)
                        //    fromAddressCity.ID = fromAddressCity.ID + '-' + fromAddressCity.iid;
                        $scope.search.fromAddress.City = { iid: fromAddressCity.iid, ID: fromAddressCity.ID, NAME: fromAddressCity.NAME };
                    }
                    //if ($rootScope.oldOriginCity != null && $rootScope.oldOriginCity.ID != 0 && fromAddressCity.ID == $rootScope.oldOriginCity.ID)
                    //    fromAddressCity = $.grep($scope.search.cityList, function (e) { return e.iid == $rootScope.oldOriginCity.iid; })[0];
                    //if ($rootScope.oldDestinationCity != null && $rootScope.oldDestinationCity.ID != 0 && fromAddressCity.ID == $rootScope.oldDestinationCity.ID)
                    //    fromAddressCity = $.grep($scope.search.cityList, function (e) { return e.iid == $rootScope.oldDestinationCity.iid; })[0];
                    //if (fromAddressCity != null)
                    //    $scope.search.fromAddress.City = { iid: fromAddressCity.iid, ID: fromAddressCity.ID, NAME: fromAddressCity.NAME };
                }
                //else
                //    $scope.search.fromAddress.City = { iid: 0, ID: 0, NAME: "" };

                if ($location.$$path.indexOf("origindestination") > -1) {
                    if ($stateParams.toAddressCityId) {
                        var toAddressCity = $.grep($scope.search.cityList, function (e) { return e.ID == $stateParams.toAddressCityId; })[0];
                        if (toAddressCity != null) {
                            //if (toAddressCity.ID.indexOf('-') == -1)
                            //    toAddressCity.ID = toAddressCity.ID + '-' + toAddressCity.iid;
                            $scope.search.toAddress.City = { iid: toAddressCity.iid, ID: toAddressCity.ID, NAME: toAddressCity.NAME };
                        }
                        //if ($rootScope.oldDestinationCity != null && $rootScope.oldDestinationCity.ID != 0 && toAddressCity.ID == $rootScope.oldDestinationCity.ID)
                        //    toAddressCity = $.grep($scope.search.cityList, function (e) { return e.iid == $rootScope.oldDestinationCity.iid; })[0];
                        //if ($rootScope.oldOriginCity != null && $rootScope.oldOriginCity.ID != 0 && toAddressCity.ID == $rootScope.oldOriginCity.ID)
                        //    toAddressCity = $.grep($scope.search.cityList, function (e) { return e.iid == $rootScope.oldOriginCity.iid; })[0];
                        //if (toAddressCity != null)
                        //    $scope.search.toAddress.City = { iid: toAddressCity.iid, ID: toAddressCity.ID, NAME: toAddressCity.NAME };

                    }
                }
                //else
                //    $scope.search.toAddress.City = { iid: 0, ID: 0, NAME: "" };

            });

        function getSelectedPriority(arr) {
            var iLength = arr.length;
            var iPriority = 0;
            var codeObj = new codeObject();

            for (var i = 0; i < iLength; i++) {
                if (arr[i].PRIORITY > iPriority) {
                    iPriority = arr[i].PRIORITY;
                    codeObj.ID = arr[i].ID;
                    codeObj.NAME = arr[i].NAME;
                }
            }
            return codeObj;
        }

        function getCityPriority(arr) {
            var iLength = arr.length;
            var iPriority = 1000;
            var codeObj = new codeObject();

            for (var i = 0; i < iLength; i++) {
                if (arr[i].PRIORITY < iPriority) {
                    iPriority = arr[i].PRIORITY;
                    codeObj.iid = arr[i].iid;
                    codeObj.ID = arr[i].ID;
                    codeObj.NAME = arr[i].NAME;
                }
            }
            return codeObj;
        }

        function initBusLineList() {

            $q.when($scope.deferredFromCityId.promise).then(function () {

                searchService.GetBusLineListByYeshuv(
                    $scope.search.fromAddress.City.ID != 0 ? $scope.search.fromAddress.City.ID.split('-')[0] : $scope.search.fromAddress.City.ID,
                    $scope.search.currentDate != null ? $scope.search.currentDate.ID : "",
                    $scope.search.language,
                    $scope.search.isEggedDb,
                    function (busLineListValue) {
                        $scope.busLineList = busLineListValue;
                        if ($scope.busLineList.length > 0) {
                            var searchlineNumber;
                            if ($stateParams.busStopMakat != null && isFirstTime)
                                searchlineNumber = $.grep($scope.busLineList, function (e) { return e.ID == $stateParams.busStopMakat; })[0];
                            if (searchlineNumber != null)
                                $scope.search.lineNumber = searchlineNumber;
                            else {
                                $scope.search.lineNumber = { ID: 0, NAME: "" };
                            }
                        }
                        else {
                            if ($scope.search.fromAddress.City.NAME && $scope.search.fromAddress.City.NAME != "") {
                                getActiveDatesHTML(function (sHTML) {
                                    if (sHTML != "") {
                                        $scope.search.userMessage = sHTML;
                                    }
                                    else {
                                        if ($rootScope.isBezeqOnline == true)
                                            $scope.search.userMessage = "_umNoSeviceToCityParam1_" + "|" + $scope.search.fromAddress.City.NAME + "|";
                                        else
                                            $scope.search.userMessage = "_umNoEggedSeviceToCityParam1_" + "|" + $scope.search.fromAddress.City.NAME + "|";
                                        $scope.search.fromAddress.City = { iid: 0, ID: 0, NAME: "" };
                                    }
                                });
                            }
                        }
                    });

            });

        }

        function initFromPlaceListByLine() {

            $q.when($scope.deferredFromCityId.promise).then(function () {
                $scope.search.searchCityId = $scope.search.fromAddress.City.ID;
                if ($scope.search.searchCityId.indexOf('-') == -1)
                    $scope.search.searchCityId = $scope.search.searchCityId + "-" + $scope.search.fromAddress.City.iid;
                $scope.search.searchPlaceId = 0;
                searchService.getPlacesByLine(
                    $scope.search.currentDate != null ? $scope.search.currentDate.ID : "",
                    $scope.search.searchCityId != 0 ? $scope.search.searchCityId.split('-')[0] : $scope.search.searchCityId,
                    $scope.search.searchPlaceId,
                    $scope.search.lineNumber.ID,
                    $scope.search.language,
                    $scope.search.isEggedDb,
                    true,
                    function (fromPlaceListByLine) {
                        $scope.fromPlaceListByLine = fromPlaceListByLine;
                        if ($scope.fromPlaceListByLine.length > 0) {
                            var fromAddressQuarter;
                            if ($stateParams.fromAddressQuarterId != null)
                                fromAddressQuarter = $.grep($scope.fromPlaceListByLine, function (e) { return e.ID == $stateParams.fromAddressQuarterId; })[0];
                            if (fromAddressQuarter != null)
                                $scope.search.fromAddress.Quarter = fromAddressQuarter;
                            else {
                                if ($scope.search.fromAddress.Quarter.ID == 0 &&
                                    $stateParams.fromAddressQuarterId != null &&
                                    fromAddressQuarter != null &&
                                    $stateParams.fromAddressQuarterId != fromAddressQuarter.ID) {
                                    $rootScope.isShowFilter = true;
                                    $scope.search.userMessage = "_umFromPlaceNotFound_";
                                }
                                $scope.search.fromAddress.Quarter = getSelectedPriority($scope.fromPlaceListByLine, 0);
                            }
                        }
                        else {
                            if ($rootScope.isBezeqOnline == true)
                                $scope.search.userMessage = "_umNoSeviceToCityParam1_" + "|" + $scope.search.fromAddress.City.NAME + "|";
                            else
                                $scope.search.userMessage = "_umNoEggedSeviceToCityParam1_" + "|" + $scope.search.fromAddress.City.NAME + "|";
                            $scope.search.fromAddress.City = { iid: 0, ID: 0, NAME: "" };
                        }
                    });
            });
        }

        function initFromPlaceList() {
            $q.when($scope.deferredFromCityId.promise).then(function () {
                $scope.search.searchCityId = $scope.search.fromAddress.City.ID;
                if ($scope.search.searchCityId.indexOf('-') == -1)
                    $scope.search.searchCityId = $scope.search.searchCityId + "-" + $scope.search.fromAddress.City.iid;
                $scope.search.searchPlaceId = 0;
                $scope.search.lineNumber = { ID: 0, NAME: "" };
                cleanCityId();
                if ($scope.search.searchCityId == null)
                    $scope.fromPlaceList = [];
                else
                    searchService.getPlacesList(
                    $scope.search.currentDate != null ? $scope.search.currentDate.ID : 0,
                        $scope.search.searchCityId != 0 ? $scope.search.searchCityId.split('-')[0] : $scope.search.searchCityId,
                        $scope.search.searchPlaceId != null ? $scope.search.searchPlaceId : 0,
                        $scope.search.lineNumber.ID,
                        $scope.search.language,
                        $scope.search.isEggedDb,
                        function (fromPlaceListVal) {
                            $scope.fromPlaceList = fromPlaceListVal;
                            if ($scope.fromPlaceList.length > 0) {
                                var fromAddressQuarter;
                                if ($stateParams.fromAddressQuarterId != null && isFirstTime)
                                    fromAddressQuarter = $.grep($scope.fromPlaceList, function (e) { return e.ID == $stateParams.fromAddressQuarterId; })[0];
                                if (fromAddressQuarter != null)
                                    $scope.search.fromAddress.Quarter = fromAddressQuarter;
                                else {
                                    if ($scope.search.fromAddress.Quarter.ID == 0 &&
                                        $stateParams.fromAddressQuarterId != null &&
                                        fromAddressQuarter != null &&
                                        $stateParams.fromAddressQuarterId != fromAddressQuarter.ID) {
                                        $rootScope.isShowFilter = true;
                                        $scope.search.userMessage = "_umFromPlaceNotFound_";
                                    }
                                    $scope.search.fromAddress.Quarter = getSelectedPriority($scope.fromPlaceList, 0);
                                }
                            }
                            else {
                                if ($rootScope.isBezeqOnline == true)
                                    $scope.search.userMessage = "_umNoSeviceToCityParam1_" + "|" + $scope.search.fromAddress.City.NAME + "|";
                                else
                                    $scope.search.userMessage = "_umNoEggedSeviceToCityParam1_" + "|" + $scope.search.fromAddress.City.NAME + "|";
                                $scope.search.fromAddress.City = { iid: 0, ID: 0, NAME: "" };
                            }
                        });
            });
        }

        function initToCityList(value) {

            $q.when($scope.deferredFromPlaceId.promise).then(function () {
                $scope.search.searchCityId = $scope.search.fromAddress.City.ID;
                if ($scope.search.searchCityId.indexOf('-') == -1)
                    $scope.search.searchCityId = $scope.search.searchCityId + "-" + $scope.search.fromAddress.City.iid;
                $scope.search.searchPlaceId = $scope.search.fromAddress.Quarter.ID;
                if ($scope.search.fromAddress.Quarter == null) return;
                searchService.getToYeshuvByLine(
                    $scope.search.currentDate != null ? $scope.search.currentDate.ID : "",
                    $scope.search.fromAddress.Quarter.ID,
                    $scope.search.lineNumber.ID,
                    $scope.search.language,
                    $scope.search.isEggedDb,
                    function (tocityListVal) {
                        //$scope.search.toAddress.City = {iid: 0, ID: 0, NAME: ""};
                        $scope.toCityList = [];
                        for (var i = 0; i < tocityListVal.length; i++) {
                            var fetchedItem = $.grep($scope.search.cityList, function (e) { return (e.NAME == tocityListVal[i].NAME); })[0];
                            if (fetchedItem == null) {
                                fetchedItem = tocityListVal[i];
                                fetchedItem.ID = fetchedItem.ID + '-1';
                            }
                            fetchedItem.PRIORITY = tocityListVal[i].PRIORITY;
                            $scope.toCityList.push(fetchedItem);
                        }
                        if ($scope.toCityList.length > 0) {
                            var toAddressCity;
                            if ($stateParams.toAddressCityId != null && isFirstTime)
                                toAddressCity = $.grep($scope.toCityList, function (e) { return e.ID.split('-')[0] == $stateParams.toAddressCityId.split('-')[0]; })[0];
                            if (toAddressCity != null)
                                $scope.search.toAddress.City = toAddressCity;
                            else
                                $scope.search.toAddress.City = getCityPriority($scope.toCityList);
                            //$scope.search.toAddress.City = $.grep($scope.search.cityList, function (e) { return e.ID.split('-')[0] == $scope.search.toAddress.City.ID; })[0];
                        }

                    });
            });

        }

        function initToPlaceList() {

            if ($scope.search.toAddress.City.ID == null || $scope.search.toAddress.City.ID == 0) return;

            if ($location.$$path.indexOf("origindestination") > -1) {
                if ($scope.search.toAddress.City.ID.indexOf('-') == -1)
                    $scope.search.toAddress.City.ID = $scope.search.toAddress.City.ID + "-" + $scope.search.toAddress.City.iid;
                $scope.search.searchCityId = $scope.search.toAddress.City.ID;
                cleanCityId();
                searchService.getPlacesList(
                    $scope.search.currentDate != null ? $scope.search.currentDate.ID : 0,
                        $scope.search.searchCityId != 0 ? $scope.search.searchCityId.split('-')[0] : $scope.search.searchCityId,
                        $scope.search.searchPlaceId != null ? $scope.search.searchPlaceId : 0,
                        $scope.search.lineNumber.ID,
                        $scope.search.language,
                        $scope.search.isEggedDb,
                        function (toPlaceListVal) {
                            $scope.toPlaceList = toPlaceListVal;

                            if ($scope.toPlaceList.length > 0) {
                                var toAddressQuarter;
                                if ($stateParams.toAddressQuarterId != null && location.href.indexOf("linenumber") < 0)
                                    toAddressQuarter = $.grep($scope.toPlaceList, function (e) { return e.ID == $stateParams.toAddressQuarterId; })[0];
                                if (toAddressQuarter != null)
                                    $scope.search.toAddress.Quarter = toAddressQuarter;
                                else
                                    $scope.search.toAddress.Quarter = getSelectedPriority($scope.toPlaceList, 0);
                            }
                            else
                                if ($rootScope.isBezeqOnline == true)
                                    $scope.search.userMessage = "_umNoSeviceToCityParam1_" + "|" + $scope.search.toAddress.City.NAME + "|";
                                else
                                    $scope.search.userMessage = "_umNoEggedSeviceToCityParam1_" + "|" + $scope.search.toAddress.City.NAME + "|";
                        });
            }
            else {
                $q.when($scope.deferredFromPlaceId.promise).then(function () {
                    if ($scope.search.toAddress.City.ID.indexOf('-') == -1)
                        $scope.search.toAddress.City.ID = $scope.search.toAddress.City.ID + "-" + $scope.search.toAddress.City.iid;
                    $scope.search.searchCityId = $scope.search.toAddress.City.ID;
                    $scope.search.searchPlaceId = $scope.search.fromAddress.Quarter.ID;
                    cleanCityId();
                    searchService.getPlacesList(
                    $scope.search.currentDate != null ? $scope.search.currentDate.ID : 0,
                        $scope.search.searchCityId != 0 ? $scope.search.searchCityId.split('-')[0] : $scope.search.searchCityId,
                        $scope.search.searchPlaceId != null ? $scope.search.searchPlaceId : 0,
                        $scope.search.lineNumber.ID,
                        $scope.search.language,
                        $scope.search.isEggedDb,
                        function (toPlaceListVal) {
                            $scope.toPlaceList = toPlaceListVal;

                            if ($scope.toPlaceList.length > 0) {

                                var toAddressQuarter;
                                if ($stateParams.toAddressQuarterId != null && isFirstTime)        //from the url
                                    toAddressQuarter = $.grep($scope.toPlaceList, function (e) { return e.ID == $stateParams.toAddressQuarterId; })[0];
                                if (toAddressQuarter != null && isFirstTime)
                                    $scope.search.toAddress.Quarter = toAddressQuarter;
                                else {
                                    if ($scope.search.toAddress.Quarter.ID == 0 &&
                                        $stateParams.toAddressQuarterId != null &&
                                        toAddressQuarter == null &&
                                        $scope.search.toAddress.City.ID == $stateParams.toAddressCityId) {
                                        $rootScope.isShowFilter = true;
                                        $scope.search.userMessage = "_umToPlaceNotFound_";
                                    }
                                    if ($scope.search.toAddress.Quarter.ID == 0 &&
                                        $stateParams.toAddressQuarterId != null &&
                                        toAddressQuarter != null &&
                                        $stateParams.toAddressQuarterId != toAddressQuarter.ID) {
                                        $rootScope.isShowFilter = true;
                                        $scope.search.userMessage = "_umToPlaceNotFound_";
                                    }
                                    $scope.search.toAddress.Quarter = getSelectedPriority($scope.toPlaceList, 0);
                                }

                            }
                            else
                                if ($rootScope.isBezeqOnline == true)
                                    $scope.search.userMessage = "_umNoSeviceToCityParam1_" + "|" + $scope.search.toAddress.City.NAME + "|";
                                else
                                    $scope.search.userMessage = "_umNoEggedSeviceToCityParam1_" + "|" + $scope.search.toAddress.City.NAME + "|";
                        });

                });
            }

        }

        function onSelectedAddressFrom(location) {
            $scope.isAddressFromSelected = false;
            //$scope.search.fromAddress.Quarter = { ID: 0, NAME: "" };
            //$scope.search.fromAddress.City = { iid: 0, ID: 0, NAME: "" };
            $scope.search.coordinateLat = location.lat;
            $scope.search.coordinateLng = location.lng;
            for (var i = 0; i < 10; i++) {
                if ($scope.isAddressFromSelected == true) break;
                $scope.search.coordinateDistance = i * 500;
                searchService.QuarterByXy(
                    $scope.search.coordinateLat,
                    $scope.search.coordinateLng,
                    $scope.search.coordinateDistance,
                    $scope.search.language,
                    $scope.search.isEggedDb,
                    function (addressList) {
                        for (var j = 0; j < addressList.length; j++) {
                            var fetchedItem = $.grep($scope.search.cityList, function (e) { return e.ID.split('-')[0] == addressList[j].City.ID; })[0];
                            addressList[j].City.iid = fetchedItem.iid;
                            addressList[j].City.ID = addressList[j].City.ID + "-" + fetchedItem.iid;
                        }
                        if ($scope.isAddressFromSelected == false) {
                            if (addressList.length == 1) {
                                $rootScope.alternativeSourceSelected(addressList[0].City, addressList[0].Quarter);
                                $scope.isAddressFromSelected = true;
                            }
                            else {
                                if ($rootScope.isMapViewed == true) {
                                    $rootScope.alternativeSourceSelected(addressList[0].City, addressList[0].Quarter);
                                    $scope.isAddressFromSelected = true;
                                }
                                else {
                                    if (addressList.length > 1) {
                                        var quarterFound = $.grep(addressList, function (e) { return e.Quarter.ID == $stateParams.fromAddressQuarterId; })[0];
                                        if (quarterFound == null || quarterFound.length == 0) {
                                            $scope.search.alternativeSourceList = addressList;
                                            $scope.isAddressFromSelected = true;
                                        }
                                    }
                                }
                            }
                        }
                    });
            }
        }

        function onSelectedAddressTo(location) {
            $scope.isAddressToSelected = false;
            //$scope.search.toAddress.Quarter = { ID: 0, NAME: "" };
            //$scope.search.toAddress.City = { iid: 0, ID: 0, NAME: "" };
            $scope.search.coordinateLat = location.lat;
            $scope.search.coordinateLng = location.lng;
            for (var i = 0; i < 10; i++) {
                if ($scope.isAddressToSelected == true) break;
                $scope.search.coordinateDistance = i * 500;
                searchService.QuarterByXy(
                    $scope.search.coordinateLat,
                    $scope.search.coordinateLng,
                    $scope.search.coordinateDistance,
                    $scope.search.language,
                    $scope.search.isEggedDb,
function (addressList) {
    for (var j = 0; j < addressList.length; j++) {
        var fetchedItem = $.grep($scope.search.cityList, function (e) { return e.ID.split('-')[0] == addressList[j].City.ID; })[0];
        addressList[j].City.iid = fetchedItem.iid;
        addressList[j].City.ID = addressList[j].City.ID + "-" + fetchedItem.iid;
    }
    if ($scope.isAddressToSelected == false) {
        if (addressList.length == 1) {
            $rootScope.alternativeDestinationSelected(addressList[0].City, addressList[0].Quarter);
            $scope.isAddressToSelected = true;
        }
        else {
            if ($rootScope.isMapViewed == true) {
                $rootScope.alternativeDestinationSelected(addressList[0].City, addressList[0].Quarter);
                $scope.isAddressToSelected = true;
            }
            else {
                if (addressList.length > 1) {
                    var quarterFound = $.grep(addressList, function (e) { return e.Quarter.ID == $stateParams.toAddressQuarterId; })[0];
                    if (quarterFound == null || quarterFound.length == 0) {
                        $scope.search.alternativeDestinationList = addressList;
                        $scope.isAddressToSelected = true;
                    }
                }
            }
        }
    }
});
            }
        }

        function getActiveDatesHTML(successCallback) {
            $scope.search.searchCityId = $scope.search.fromAddress.City.ID;
            if ($scope.search.searchCityId.indexOf('-') == -1)
                $scope.search.searchCityId = $scope.search.searchCityId + "-" + $scope.search.fromAddress.City.iid;
            searchService.GetActiveDateList(
                $scope.search.searchCityId != 0 ? $scope.search.searchCityId.split('-')[0] : $scope.search.searchCityId,
                $scope.search.language,
                $scope.search.isEggedDb,
                function (daysList) {
                    $scope.activeDayList = daysList;
                    var bActiveDateFound = false;
                    var sHTML = "<div style='text-align: center; font-size: 20px;'>לישוב " +
                                $scope.search.fromAddress.City.NAME +
                                " אין שירות ביום מבוקש. בחר יום אחר.</div>";

                    for (var i = 0; i < daysList.length; i++) {
                        if (daysList[i].IS_ACTIVE) {
                            if ($scope.search.currentDate.NAME.split(' ')[0] == daysList[i].NAME) {
                                $scope.activeDayList = null;
                                return sHTML = "active";
                            }
                            sHTML += "</br><a href='#/linenumber/1/0/" +
                            $scope.search.fromAddress.City.ID + "-" +
                            $scope.search.fromAddress.City.iid + "/" +
                    $scope.search.fromAddress.Quarter.ID + "/" +
                    $scope.search.toAddress.City.ID + "-" +
                    $scope.search.toAddress.City.iid + "/" +
                    $scope.search.toAddress.Quarter.ID + "/" +
                   0 + "/" +
                    (i + 1).toString() +
                    "'>" +
                    daysList[i].NAME + " " +
                    daysList[i].ID +
                    "</a><span style='float: left;'> - יש שירות</span>";
                            bActiveDateFound = true;
                        }
                        else {
                            sHTML += "</br><span>" + " " + daysList[i].NAME + " " + daysList[i].ID + "</span><span style='float: left;'> - אין שירות</span></span>";
                        }
                    }

                    if (!bActiveDateFound) {
                        $scope.activeDayList = [];
                        sHTML = "";
                    }

                    successCallback(sHTML);
                });
        }

        $scope.clearFromCity = function () {
            //$scope.search.fromAddress = new address();
            //$scope.busLineList = [];
            //$scope.search.lineNumber = { ID: 0, NAME: "" };
            //$scope.fromPlaceList = [];
            //$scope.fromPlaceListByLine = [];
            //$scope.search.resultViewName = "";
        }

        $scope.clearToCity = function () {
            //$scope.search.toAddress = new address();
            //$scope.toPlaceList = [];
            //$scope.toCityList = [];
            //$scope.search.resultViewName = "";
        }

        $rootScope.alternativeSourceSelected = function (selectedCity, selectedQuarter) {
            $scope.search.fromAddress.City = selectedCity;
            if (selectedCity.ID.indexOf('-') == -1)
                selectedCity.ID = selectedCity.ID + "-" + selectedCity.iid;
            $scope.search.searchCityId = selectedCity.ID;
            $stateParams.fromAddressQuarterId = selectedQuarter.ID;
            //$scope.$apply();
            //setTimeout(function () {
            //    if ($scope.fromPlaceList.length > 0)
            //        $scope.search.fromAddress.Quarter = $.grep($scope.fromPlaceList, function (e) { return e.ID == selectedQuarter.ID; })[0];
            //    $scope.search.searchFromSelector = "egged";
            //    $scope.$apply();
            //}, 500);
        }

        $rootScope.alternativeDestinationSelected = function (selectedCity, selectedQuarter) {
            $scope.search.toAddress.City = selectedCity;
            if (selectedCity.ID.indexOf('-') == -1)
                selectedCity.ID = selectedCity.ID + "-" + selectedCity.iid;
            $scope.search.searchCityId = selectedCity.ID;
            $stateParams.toAddressQuarterId = selectedQuarter.ID;
            //$scope.$apply();
            //setTimeout(function () {
            //    if ($scope.toPlaceList.length > 0)
            //        $scope.search.toAddress.Quarter = $.grep($scope.toPlaceList, function (e) { return e.ID == selectedQuarter.ID; })[0];
            //    $scope.search.searchToSelector = "egged";
            //    $scope.$apply();
            //}, 500);
        }

        $scope.showLinesBetweenSettlementsMessage = function (e) {
            $scope.search.userMessageTitle = "_Title_";
            $scope.search.userMessage = "_HelpLinesBetweenSettlements_";
        }

        $scope.$watch("search.isDirectLine", function (newValue, oldValue) {
            if (newValue == null) return;
            if (oldValue != null && newValue == oldValue) return;
            if ($scope.search.fromAddress.Quarter.ID == 0 && $scope.search.toAddress.Quarter.ID == 0) return;
            updateAddressLine();
        });

        $scope.$watch("search.currentTime", function (newValue, oldValue) {
            if (newValue == null) return;
            if (oldValue != null && newValue.ID == oldValue.ID) return;
            if ($location.$$path.indexOf("origindestination") == -1) return;
            var x = new Date();
            if (newValue != null && newValue != "" && $scope.search != null) {
                if (newValue.ID == -1)
                    $scope.search.hour = "00:00";
                else
                    $scope.search.hour = newValue.NAME;
                $scope.search.originTime = x.getDate() + "-" + (x.getMonth() + 1).toString() + "-" + x.getFullYear() + " " + newValue.NAME;
                if ($scope.search.fromAddress.Quarter.ID == 0 || $scope.search.toAddress.Quarter.ID == 0) return;
                updateAddressLine();
            }
        });

        $scope.$watch("search.currentDate", function (newValue, oldValue) {
            if (newValue == null) return;
            if (oldValue != null && newValue.ID == oldValue.ID) return;

            var dateString = newValue.NAME.split('-')[0].trim();
            var splittedDateString = dateString.split('/')
            var dayValue = splittedDateString[0];
            var monthValue = splittedDateString[1];
            var yearValue = splittedDateString[2];
            var dateValue = new Date(yearValue*1, monthValue*1-1, dayValue*1);

            var today = new Date();

            var x = today.getDate();

            if (dateValue.getDate() == today.getDate() &&
                dateValue.getMonth() == today.getMonth() &&
                dateValue.getYear() == today.getYear())
                $scope.search.currentTime = $scope.search.timeList[0];
            else
                $scope.search.currentTime = $scope.search.timeList[9];
            if ($scope.search.fromAddress.Quarter.ID == 0 || $scope.search.toAddress.Quarter.ID == 0) {
                if ($location.$$path.indexOf("origindestination") > -1) {
                }
                else {
                    //if ($stateParams.busStopMakat != null && $stateParams.busStopMakat != 0)
                    //$scope.search.userMessage = "_umLineNotActiveOnDay_";
                    initBusLineList();
                    $scope.deferredLineNumber.promise.$$state.status = 0;
                }
            }
            else {
                updateAddressLine();
            }
        });

        function updateAddressLine() {
            if ($location.$$path.indexOf("origindestination") > -1) {
                $location.path("/origindestination/1/0/" +
                $scope.search.isDirectLine + "/" +
                $scope.search.fromAddress.City.ID + "-" +
                $scope.search.fromAddress.City.iid + "/" +
                $scope.search.fromAddress.Quarter.ID + "/" +
                $scope.search.toAddress.City.ID + "-" +
                $scope.search.toAddress.City.iid + "/" +
                $scope.search.toAddress.Quarter.ID + "/" +
                $scope.search.currentDate.ID + "/" +
                $scope.search.currentTime.ID + "/" +
                $rootScope.search.autocompleteOrigin.coords + "/" +
                $rootScope.search.autocompleteDestination.coords);
            }
            else {
                $location.path("/linenumber/1/0/" +
                $scope.search.fromAddress.City.ID + "-" +
                $scope.search.fromAddress.City.iid + "/" +
                $scope.search.fromAddress.Quarter.ID + "/" +
                $scope.search.toAddress.City.ID + "-" +
                $scope.search.toAddress.City.iid + "/" +
                $scope.search.toAddress.Quarter.ID + "/" +
                $scope.search.lineNumber.ID + "/" +
                $scope.search.currentDate.ID + "/" +
                $scope.search.currentTime.ID);
            }
        }

        $scope.$watch("search.fromAddress.City.NAME", function (newValue) {
            if ($scope.search.fromAddress == null || $scope.search.fromAddress.City == null || newValue == null) return;
            if (newValue == null || newValue == "") {
                $scope.search.fromAddress.City.ID = 0;
                $scope.resultSubView = "";
                if ($location.$$path.indexOf("origindestination") > -1) {
                    if ($scope.fromPlaceList && $scope.fromPlaceList.length > 0) {
                        $scope.search.fromAddress.Quarter = { ID: 0, NAME: "" };
                        $scope.fromPlaceList = [];
                    }
                }
                else {
                    $scope.search.lineNumber = { ID: 0, NAME: "" };
                    $scope.busLineList = [];
                }
            }
        });

        $scope.$watch("search.fromAddress.City", function (newValue) {
            if (newValue == null || newValue.ID == null) return;
            if (newValue.ID != 0) {
                $scope.deferredFromCityId.resolve();
                if ($location.$$path.indexOf("origindestination") > -1 || $rootScope.isMapViewed == true) {
                    initFromPlaceList();
                    $scope.deferredFromPlaceId.promise.$$state.status = 0;
                    //$scope.deferredFromPlaceId = $q.defer();
                }
                else {
                    initBusLineList();
                    $scope.deferredLineNumber.promise.$$state.status = 0;
                    //$scope.deferredLineNumber = $q.defer();
                }
                //$rootScope.oldOriginCity = { iid: newValue.iid, ID: newValue.ID, NAME: newValue.NAME };
            }
        });

        $scope.$watch("search.lineNumber", function (newValue) {
            if (newValue == null || newValue.ID == null) return;
            if ($location.$$path.indexOf("origindestination") > -1) return;
            $rootScope.$broadcast('resultSubViewChanged', { newValue: "" });
            $q.when($scope.deferredFromCityId.promise).then(function () {

                $scope.deferredToCityId.promise.$$state.status = 0;
                //$scope.deferredToCityId = $q.defer();
                if (newValue.ID != 0) {
                    $scope.deferredLineNumber.resolve();
                    initFromPlaceListByLine();
                    setTimeout(function () {
                        isFirstTime = false;

                    },500)
                    }
                else {
                    $scope.fromPlaceListByLine = [];
                    $scope.toPlaceList = [];
                    $scope.toCityList = [];
                }
            });
        });

        $scope.$watch("search.fromAddress.Quarter", function (newValue) {
            if (newValue == null || newValue.ID == null) return;
            //$rootScope.$broadcast('resultSubViewChanged', { newValue: "" });
            $scope.resultSubView = "";
            if (newValue.ID == 0) {
            }
            else {
                if ($location.$$path.indexOf("linenumber") > -1) {
                    $scope.deferredToCityId.promise.$$state.status = 0;
                    //$scope.deferredToCityId = $q.defer();
                    initToCityList(newValue.ID);
                }
                $scope.deferredFromPlaceId.resolve();
            }
        });

        $scope.$watch("search.toAddress.City.NAME", function (newValue) {
            if (newValue == null) return;
            $scope.deferredToCityId.promise.$$state.status = 0;
            if ($scope.toPlaceList && $scope.toPlaceList.length > 0) {
                $scope.search.toAddress.Quarter = { ID: 0, NAME: "" };
                $scope.toPlaceList = [];
            }
        });

        $scope.$watch("search.toAddress.City", function (newValue) {
            if (newValue == null || newValue.ID == null) return;
            $scope.deferredToPlaceId.promise.$$state.status = 0;
            if (newValue.ID != 0) {
                $scope.deferredToCityId.resolve();
                //$rootScope.oldDestinationCity = { iid: newValue.iid, ID: newValue.ID, NAME: newValue.NAME };
            }
            initToPlaceList();
        });

        $scope.$watch("search.toAddress.Quarter", function (newValue, oldVal) {
            if (newValue == null || newValue.ID == null) return;
            //$rootScope.$broadcast('resultSubViewChanged', { newValue: "" });
            $scope.resultSubView = "";
            if (newValue.ID == 0) { }
            else
                $scope.deferredToPlaceId.resolve();
        });

        $scope.$watch("search.autocompleteOrigin.coords", function (newVal, oldVal) {
            if (!newVal) return;
            //if (newVal == "") {
            //    //$scope.search.fromAddress = new address();
            //}
            //else {
            //$scope.search.autocompleteOrigin.coords = $scope.search.selectedAddressFrom;
            var coords = newVal.split(',');
            onSelectedAddressFrom({
                lat: coords[0], lng: coords[1]
            });

            //if ($scope.isBezeqOnline == true) {
            //    $timeout(function () {
            //        $("#bydestDestinationAddressInput").focus();
            //    }, 400);
            //}
            //}
        });

        $scope.$watch("search.autocompleteDestination.coords", function (newVal, oldVal) {
            if (!newVal) return;
            //if (newVal == "") {
            //    //$scope.search.toAddress = new address();
            //}
            //else {
            //$scope.search.autocompleteDestination.coords = $scope.search.selectedAddressTo;
            var coords = newVal.split(',');
            onSelectedAddressTo({ lat: coords[0], lng: coords[1] });

            if ($rootScope.isBezeqOnline == true) {
                //$timeout(function () {
                //    $("#btnSearchByLine").focus();
                //    //$scope.search.isShowResultFocused = true;
                //}, 200);
            }
            //}
        });

        $scope.$watch("search.autocompleteBylineOrigin", function (newValue, oldValue) {
            if (newValue.coords == null || newValue.coords == "") return;
            setTimeout(function () {
                $scope.search.coordinateLat = newValue.coords.split(',')[0];
                $scope.search.coordinateLng = newValue.coords.split(',')[1];
                $scope.search.coordinateDistance = 1000;
                searchService.QuarterByXy(
                    $scope.search.coordinateLat,
                    $scope.search.coordinateLng,
                    $scope.search.coordinateDistance,
                    $scope.search.language,
                    $scope.search.isEggedDb,
                    function (addresslistVal) {
                        if (addresslistVal.length == 0) return;
                        for (var i = 0; i < $scope.fromPlaceListByLine.length; i++) {
                            if ($scope.fromPlaceListByLine[i].ID == addresslistVal[0].Quarter.ID) {
                                $scope.search.fromAddress.Quarter = $scope.fromPlaceListByLine[i];
                                return;
                            }
                        }
                        $scope.search.userMessage = "כתובת מוצא לא נמצאת במסלול הקו";
                        //alert("כתובת מוצא לא נמצאת במסלול הקו");
                    });
            }, 500);
        }, true);

        $scope.$watch("search.autocompleteBylineDestination", function (newValue, oldValue) {
            if (newValue.coords == null || newValue.coords == "") return;
            setTimeout(function () {
                $scope.search.coordinateLat = newValue.coords.split(',')[0];
                $scope.search.coordinateLng = newValue.coords.split(',')[1];
                $scope.search.coordinateDistance = 1000;
                searchService.QuarterByXy(
                    $scope.search.coordinateLat,
                    $scope.search.coordinateLng,
                    $scope.search.coordinateDistance,
                    $scope.search.language,
                    $scope.search.isEggedDb,
                    function (addresslistVal) {
                        if (addresslistVal.length == 0) return;
                        for (var i = 0; i < $scope.toPlaceList.length; i++) {
                            if ($scope.toPlaceList[i].ID == addresslistVal[0].Quarter.ID) {
                                $scope.search.toAddress.Quarter = $scope.toPlaceList[i];
                                return;
                            }
                        }
                        $scope.search.userMessage = "כתובת יעד לא נמצאת במסלול הקו";
                        //alert("כתובת יעד לא נמצאת במסלול הקו");
                    });
            }, 500);
        }, true);

        $("#bydestFromCityCombo").keyup(function (e) {
            if (appConfig.isEggedDb == true) return;
            if (e.keyCode == '13')
                setTimeout(function () {
                    $("#bydestToCityCombo").focus();
                }, 150);
        });

        $("#bydestToCityCombo").keyup(function (e) {
            if (appConfig.isEggedDb == true) return;
            if (e.keyCode == '13')
                setTimeout(function () {
                    $("#bydestSearchButton").focus();
                }, 150);
        });

        $("#bylineFromCityCombo").keyup(function (e) {
            if (appConfig.isEggedDb == true) return;
            if (e.keyCode == '13')
                setTimeout(function () {
                    $("#lineNumberCombo").focus();
                }, 150);
        });

        this.init = function () {

            $timeout(function () {
                if ($rootScope.isBezeqOnline == true) {
                    if ($location.$$path.indexOf("origindestination") > -1)
                        $("#bydestOriginCityInput").focus();
                    else
                        $("#bylineOriginCityInput").focus();
                }
                else {
                    //if ($rootScope.emergencyMessageViewed != null && $rootScope.emergencyMessageViewed == true) return;
                    //$rootScope.emergencyMessageViewed = true;
                    //if (localStorage.getItem("EmergencyMessageId") != null) {
                    //    if (localStorage.getItem("EmergencyMessageId").split("-")[1] == "0")
                    //        return;
                    //}
                    //$rootScope.showSiteMessages("EmergencyMessage");
                }
            }, 200);

        }
        this.init();

        function clearAllFields() {
            $scope.search.autocompleteOrigin = { coords: "", description: "" };
            $scope.search.autocompleteDestination = { coords: "", description: "" };
            $scope.search.autocompleteBylineOrigin = { coords: "", description: "" };
            $scope.search.autocompleteBylineDestination = { coords: "", description: "" };
            $scope.search.autocompleteExtra = { coords: "", description: "" };
            $rootScope.currentLocation = { coords: "", description: "" };
            $scope.search.fromAddress.City = { iid: 0, ID: 0, NAME: "" };
            $scope.search.toAddress.City = { iid: 0, ID: 0, NAME: "" };
            $scope.search.fromAddress.Quarter = { ID: 0, NAME: "" };
            $scope.search.toAddress.Quarter = { ID: 0, NAME: "" };
            $scope.search.lineNumber = { ID: 0, NAME: "" };
            $scope.search.firstConnection = new codeObject();
            $scope.search.secondConnection = new codeObject();
            $scope.search.selectedPathPlan = null;
        }

        function cleanCityId() {
            if ($scope.search.fromAddress.City.ID != null)
                $scope.search.fromAddress.City.ID = $scope.search.fromAddress.City.ID != 0 ? $scope.search.fromAddress.City.ID.split('-')[0] : $scope.search.fromAddress.City.ID;
            if ($scope.search.toAddress.City.ID != null)
                $scope.search.toAddress.City.ID = $scope.search.toAddress.City.ID != 0 ? $scope.search.toAddress.City.ID.split('-')[0] : $scope.search.toAddress.City.ID;
            if ($scope.search.searchCityId != null)
                $scope.search.searchCityId = $scope.search.searchCityId != 0 ? $scope.search.searchCityId.split('-')[0] : $scope.search.searchCityId;
        }

    });
