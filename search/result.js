"use strict";
mslApp.controller("ResultCtrl",
    function ($rootScope, $scope, $stateParams, $location, searchService, $q, localize) {

        if ($stateParams.isShowFilter == null || $stateParams.isShowFilter == 1)
            $rootScope.isShowFilter = true;
        else
            $rootScope.isShowFilter = false;

        if ($stateParams.dayOrder == null ||
            $stateParams.fromAddressCityId == null ||
            $stateParams.fromAddressQuarterId == null ||
            $stateParams.toAddressCityId == null ||
            $stateParams.toAddressQuarterId == null) {
            $scope.resultSubView = "";
            return;
        }

        if ($stateParams.fromAddressQuarterId != null &&
            $stateParams.toAddressQuarterId != null &&
            $stateParams.fromAddressQuarterId != 0 &&
            $stateParams.toAddressQuarterId != 0 &&
            $stateParams.fromAddressQuarterId == $stateParams.toAddressQuarterId) {
            $scope.search.userMessage = "_QuartersAreEqual_";
            $rootScope.isShowFilter = true;
            $scope.resultSubView = "";
            return;
        }



        //if ($stateParams.Hour)
        //    $scope.search.currentTime = $.grep($scope.search.timeList, function (e) { return e.ID == $stateParams.Hour; })[0];

        //if ($scope.search.dateList == null) {
        //    searchService.getDateList($scope.search, function (newDateList) {
        //        $scope.search.dateList = newDateList;
        //        if ($scope.search.dateList.length > 0)
        //            if ($stateParams.dayOrder)
        //                $scope.search.currentDate = $.grep($scope.search.dateList, function (e) { return e.ID == $stateParams.dayOrder; })[0];
        //            else
        //                $scope.search.currentDate = $scope.search.dateList[0];
        //    });
        //}

        //searchService.getCityList($scope.search, function (newCityList) {
        //    $scope.search.cityList = newCityList;

        //    if ($stateParams.fromAddressCityId)
        //        $scope.search.fromAddress.City = $.grep($scope.search.cityList, function (e) { return e.ID == $stateParams.fromAddressCityId; })[0];
        //    else
        //        $scope.search.fromAddress.City = { ID: 0, NAME: "" };
        //    if ($stateParams.toAddressCityId)
        //        $scope.search.toAddress.City = $.grep($scope.search.cityList, function (e) { return e.ID == $stateParams.toAddressCityId; })[0];
        //    else
        //        $scope.search.toAddress.City = { Id: 0, NAME: "" };

        //    $scope.search.searchCityId = $scope.search.fromAddress.City.ID;
        //    $scope.search.searchPlaceId = 0;
        //    searchService.getPlacesList($scope.search.getJsonString(), function (fromPlaceListVal) {
        //        $scope.fromPlaceList = fromPlaceListVal;
        //        if ($stateParams.fromAddressQuarterId)
        //            $scope.search.fromAddress.Quarter = $.grep($scope.fromPlaceList, function (e) { return e.ID == $stateParams.fromAddressQuarterId; })[0];
        //        else
        //            $scope.search.fromAddress.Quarter = { ID: 0, NAME: "" };
        //    });

        //    $scope.search.searchCityId = $scope.search.fromAddress.City.ID;
        //    if ($location.$$path.indexOf("origindestination") == -1)
        //        $scope.search.searchPlaceId = $scope.search.fromAddress.Quarter.ID;
        //    searchService.getPlacesList($scope.search.getJsonString(), function (toPlaceListVal) {
        //        $scope.toPlaceList = toPlaceListVal;
        //        if ($stateParams.toAddressQuarterId)
        //            $scope.search.toAddress.Quarter = $.grep($scope.toPlaceList, function (e) { return e.ID == $stateParams.toAddressQuarterId; })[0];
        //        else
        //            $scope.search.toAddress.Quarter = { ID: 0, NAME: "" };
        //    });

        //});

        $scope.tripOptionsClicked = function () {
            if ($rootScope.currentTabName == 2) return;
            $scope.resultSubView = 'pathplan';
        }

        $scope.scheduleClicked = function () {
            if ($scope.resultSubView == 'pathplan') return;
            if ($scope.resultSubView == "directlines") {

                var obj = eval('(' + $scope.search.selectedDirectLine + ')');
                if (obj.LineName == '-1')
                    //directLineSelected(obj.LineId, obj.LineName, obj.SourceQuarterId, obj.DestinationQuarterId);
                    $location.path("/origindestination/0/0/false"
                                        + "/" + $scope.search.fromAddress.City.ID + '-' + $scope.search.fromAddress.City.iid
                                        + "/" + obj.SourceQuarterId
                                        + "/" + $scope.search.toAddress.City.ID + '-' + $scope.search.toAddress.City.iid
                                        + "/" + obj.DestinationQuarterId
                                        + "/" + $scope.search.currentDate.ID
                                        + "/-1"
                                        + "/" + $rootScope.search.autocompleteOrigin.coords
                                        + "/" + $rootScope.search.autocompleteDestination.coords);
                else
                    $location.path("/linenumber/0/0"
                                    + "/" + $scope.search.fromAddress.City.ID + '-' + $scope.search.fromAddress.City.iid
                                    + "/" + obj.SourceQuarterId
                                    + "/" + $scope.search.toAddress.City.ID + '-' + $scope.search.toAddress.City.iid
                                    + "/" + obj.DestinationQuarterId
                                    + "/" + obj.LineId
                                    + "/" + $scope.search.currentDate.ID);

            }
            else
                $scope.resultSubView = 'transition';
        }

        $scope.detailsClicked = function () {
            if ($scope.resultSubView == 'pathplan' || $scope.resultSubView == 'directlines') return;
            $scope.resultSubView = 'details';
        }

        $scope.btnNextClicked = function (e) {

            switch ($scope.resultSubView) {
                case "pathplan":
                    $scope.resultSubView = 'transition';
                    break;
                case "transition":
                    $scope.resultSubView = 'details';
                    break;
                case "directlines":
                    var obj = eval('(' + $scope.search.selectedDirectLine + ')');

                    if (obj.LineName == '-1')
                        //directLineSelected(obj.LineId, obj.LineName, obj.SourceQuarterId, obj.DestinationQuarterId);
                        $location.path("/origindestination/0/0/false"
                                            + "/" + $scope.search.fromAddress.City.ID + '-' + $scope.search.fromAddress.City.iid
                                            + "/" + obj.SourceQuarterId
                                            + "/" + $scope.search.toAddress.City.ID + '-' + $scope.search.toAddress.City.iid
                                            + "/" + obj.DestinationQuarterId
                                            + "/" + $scope.search.currentDate.ID
                                            + "/-1"
                                            + "/" + $rootScope.search.autocompleteOrigin.coords
                                            + "/" + $rootScope.search.autocompleteDestination.coords);
                    else
                        $location.path("/linenumber/0/0"
                                        + "/" + $scope.search.fromAddress.City.ID + '-' + $scope.search.fromAddress.City.iid
                                        + "/" + obj.SourceQuarterId
                                        + "/" + $scope.search.toAddress.City.ID + '-' + $scope.search.toAddress.City.iid
                                        + "/" + obj.DestinationQuarterId
                                        + "/" + obj.LineId
                                        + "/" + $scope.search.currentDate.ID);

                    break;
            }

        }

        $scope.btnBackClicked = function (e) {

            switch ($scope.resultSubView) {
                case "pathplan":
                    break;
                case "transition":
                    //if (self.currentTabName == 'bydest' || self.isDirectLine == false)
                    $scope.resultSubView = 'pathplan';
                    //else
                    //    $scope.resultSubView = "directlines";
                    break;
                case "details":
                    $scope.resultSubView = "transition";
                    break;
                case "busstop":
                    $scope.resultSubView = "transition";
                    break;
                case "directlines":
                    $scope.resultSubView = "";
                    break;
            }

        }

        function saveParametersToLocalStorage() {

            if ($location.$$path.indexOf("origindestination") > -1) {
                if ($rootScope.search.language == "he") {
                    localStorage.setItem('hebydestFromCityId', $stateParams.fromAddressCityId);
                    localStorage.setItem('hebydestFromQuarterId', $stateParams.fromAddressQuarterId);
                    localStorage.setItem('hebydestToCityId', $stateParams.toAddressCityId);
                    localStorage.setItem('hebydestToQuarterId', $stateParams.toAddressQuarterId);
                }
                else {
                    localStorage.setItem('enbydestFromCityId', $stateParams.fromAddressCityId);
                    localStorage.setItem('enbydestFromQuarterId', $stateParams.fromAddressQuarterId);
                    localStorage.setItem('enbydestToCityId', $stateParams.toAddressCityId);
                    localStorage.setItem('enbydestToQuarterId', $stateParams.toAddressQuarterId);
                }

            }
            else {

                if ($rootScope.search.language == "he") {
                    localStorage.setItem('hebylineFromCityId', $stateParams.fromAddressCityId);
                    localStorage.setItem('hebylineLineNumberId', $stateParams.busStopMakat);
                    localStorage.setItem('hebylineFromQuarterId', $stateParams.fromAddressQuarterId);
                    localStorage.setItem('hebylineToCityId', $stateParams.toAddressCityId);
                    localStorage.setItem('hebylineToQuarterId', $stateParams.toAddressQuarterId);
                }
                else {
                    localStorage.setItem('enbylineFromCityId', $stateParams.fromAddressCityId);
                    localStorage.setItem('enbylineLineNumberId', $stateParams.busStopMakat);
                    localStorage.setItem('enbylineFromQuarterId', $stateParams.fromAddressQuarterId);
                    localStorage.setItem('enbylineToCityId', $stateParams.toAddressCityId);
                    localStorage.setItem('enbylineToQuarterId', $stateParams.toAddressQuarterId);
                }

            }

        }

        $scope.$on('resultSubViewChanged', function (event, args) {
            $scope.resultSubView = args.newValue;
        });

        $scope.$watch("resultSubView", function (newValue, oldValue) {

            if (newValue == null || newValue == "") return;

            setTimeout(function () {
                if (appConfig.isEggedDb != true) {
                    switch ($scope.resultSubView) {
                        case "pathplan":
                            $($($(".resultSubView")[0]).find(".PanelCollapseExpand")[0]).focus();
                            break;
                        case "transition":
                            $($(".resultSubView")[0]).find("input:radio:first").focus();
                            break;
                        case "busstop":
                            $($($(".resultSubView")[0]).find(".TableLine")[0]).focus();
                            break;
                        case "details":
                            $($($(".resultSubView")[0]).find(".TableLine")[0]).focus();
                            break;
                        case "directlines":
                            $($(".resultSubView")[0]).find("input:radio:first").focus();
                            break;
                    }
                }
                else {
                    $($(".resultSubView")[0]).focus();
                }
            }, 1000);

        });

        $scope.$on('quartersInitialized', function (event, args) {
            if ($location.$$path.indexOf("linenumber") > -1)
                $scope.resultSubView = "transition";
            else
                $scope.resultSubView = "pathplan";
            if ($stateParams.isDirectLines == "true")
                $scope.resultSubView = "directlines";

            if ($rootScope.isStorageActive == true)
                saveParametersToLocalStorage();

            setTimeout(function () {
                if (localize.language == "he-IL")
                    $($('.progressBarBusHeb')[0]).focus();
                else
                    $($('.progressBarBusEng')[0]).focus();
            }, 50);

        });

        //$($(".resultSubView")[0]).keydown(function (e) {
        //    //console.log("check : " + $scope.isFocusLeftResultView);
        //    setTimeout(function () { 
        //        if ($scope.isFocusLeftResultView != true) return;
        //        if (e.which == 9)
        //        $($($(".resultSubView")[0]).find(".btnRed1")[0]).focus();
        //    }, 500);
        //});

        //$($(".resultSubView")[0]).focusin(function () {
        //    $scope.isFocusLeftResultView = false;
        //});

        //$($(".resultSubView")[0]).focusout(function () {
        //    $scope.isFocusLeftResultView = true;
        //});


        //var isTabPressed = false;
        //$($(".resultSubView")[0]).keyup(function (e) {
        //    if (e.which == 9)
        //        isTabPressed = true;
        //});

        //$($(".resultSubView")[0]).focusin(function () {
        //});

        //$($(".resultSubView")[0]).focusout(function () {
        //    if (isTabPressed != true) return;
        //    isTabPressed = false;
        //    $($($(".resultSubView")[0]).find(".btnRed1")[0]).focus();
        //});


    });

