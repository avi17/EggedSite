"use strict";
mslApp.controller(
    "TransitionCtrl",
    function ($rootScope, $scope, $stateParams, $timeout, transitionService, $location, $filter, globalFunctions) {

        $scope.isDigested = false;
        init();
        //if ($rootScope.isNavigatedFromDetails != null && $rootScope.isNavigatedFromDetails == true) {
        //    $rootScope.isNavigatedFromDetails = false;
        //    return;
        //}

        $scope.isSolutionByDeparture = true;
        $rootScope.isNavigatedFromTransition = true;
        $scope.isShowEstimatedDepartureTimeMessage = false;
        $scope.isShowAftermidnightMessage = false;
        $scope.isAirlineDependentFrom = false;
        $scope.isAirlineDependentTo = false;
        $scope.isShowMigunMessage = false;
        $scope.ShowAccessibilityMessage = false;
        $scope.isShowPlatformNumber = false;

        $rootScope.fromPlaceNameArray = ["", "", ""];
        $rootScope.toPlaceNameArray = ["", "", ""];
        $scope.PagedTableRowCount = 6;
        if ($rootScope.isBezeqOnline == true)
            $scope.PagedTableRowCount = 8;

        $scope.isFocusOnMapButton = false;
        $scope.isFocusOnStationButton = false;
        $rootScope.isNextButtonFocused = false;

        $scope.transitionList = [];
        $scope.gridScheduleList = [];
        $scope.selectedIdList = [];
        $scope.selectedLineList = [];

        $rootScope.gridScheduleList = [];
        $rootScope.selectedIdList = [];
        $rootScope.selectedLineList = [];

        //if ($rootScope.SelectedIdList != null)
        //    $scope.selectedIdList = $rootScope.SelectedIdList;
        //if ($rootScope.selectedLineList != null)
        //    $scope.selectedLineList = $rootScope.selectedLineList;

        $scope.toggleDepartureArrival = function () {
            $scope.isSolutionByDeparture = !$scope.isSolutionByDeparture;

        }

        $scope.scheduleKeyPress = function (params) {
            var splittedParam = params.split(',');
            var tagName = splittedParam[0];
            var keyValue = splittedParam[1];
            var altKey = splittedParam[2];
            var ctrlKey = splittedParam[3];
            var shiftKey = splittedParam[4];
            var gridIndex = splittedParam[5];
            gridIndex = parseInt(gridIndex);

            $scope.isFocusOnMapButton = false;
            $scope.isFocusOnStationButton = false;


            //tab
            if (keyValue == "9") {
                //$scope.isFocusOnMapButton = true;
                //$scope.isFocusOnStationButton = true;
            }
            //enter
            if (keyValue == "13") {
                $rootScope.isNextButtonFocused = true;
                for (var i = 0; i < $scope.fullTransitionList[gridIndex].length; i++) {
                    if ($scope.fullTransitionList[gridIndex][i].Id == $scope.selectedIdList[$scope.search.currentScheduleGridIndex]) {
                        $scope.search.btnNextClicked(e);
                        //$rootScope.isNextButtonFocused = true;
                        break;
                    }
                }
            }
            //down
            if (keyValue == "40") {
                for (var i = 0; i < $scope.fullTransitionList[gridIndex].length; i++) {
                    if ($scope.fullTransitionList[gridIndex][i].Id == $scope.selectedLineList[gridIndex].Id) {
                        $rootScope.selectedIdList[gridIndex] = $scope.selectedIdList[gridIndex] = $scope.fullTransitionList[gridIndex][i + 1].Id;
                        $rootScope.selectedLineList[gridIndex] = $scope.selectedLineList[gridIndex] = $scope.fullTransitionList[gridIndex][i + 1];
                        scheduleRowSelected($scope.selectedLineList[gridIndex]);
                        break;
                    }
                }
            }
            //up
            if (keyValue == "38") {
                for (var i = 0; i < $scope.fullTransitionList[gridIndex].length; i++) {
                    if ($scope.fullTransitionList[gridIndex][i].Id == $scope.selectedLineList[gridIndex].Id) {
                        $rootScope.selectedIdList[gridIndex] = $scope.selectedIdList[gridIndex] = $scope.fullTransitionList[gridIndex][i - 1].Id;
                        $rootScope.selectedLineList[gridIndex] = $scope.selectedLineList[gridIndex] = $scope.fullTransitionList[gridIndex][i - 1];
                        scheduleRowSelected($scope.selectedLineList[gridIndex]);
                        break;
                    }
                }
            }
            //left
            if (keyValue == "37") {
                $scope.search.currentScheduleGridIndex = gridIndex + 1;
            }
            //right
            if (keyValue == "39") {
                $scope.search.currentScheduleGridIndex = gridIndex - 1;
            }
            splittedParam = null;
            tagName = null;
            keyValue = null;
            altKey = null;
            ctrlKey = null;
            shiftKey = null;
            gridIndex = null;
        }

        $scope.showLessSchedule = function () {
            //finding minimal datetime to use a filter for first schedule table
            var minimalFilterTime = new Date();

            for (var i = 0; i < $scope.search.dateList.length; i++)
                if ($scope.search.dateList[i].ID == $scope.search.currentDate.ID) {
                    minimalFilterTime.setDate(minimalFilterTime.getDate() + i);
                    break;
                }

            if ($scope.search.currentTime.ID == -1) {
                minimalFilterTime.setSeconds(0);
                minimalFilterTime.setMilliseconds(0);
            }
            else {
                var hour = parseInt($scope.search.currentTime.NAME.split(':')[0]);
                var minute = parseInt($scope.search.currentTime.NAME.split(':')[1]);
                minimalFilterTime.setHours(hour);
                minimalFilterTime.setMinutes(minute);
                minimalFilterTime.setSeconds(0);
                minimalFilterTime.setMilliseconds(0);
            }

            for (var j = 0 ; j < $scope.fullTransitionList[0].length; j++) {
                var tempdate = $scope.fullTransitionList[0][j].DtOriginBusstop.split('T')[0];
                var temptime = $scope.fullTransitionList[0][j].DtOriginBusstop.split('T')[1];
                var tempyear = tempdate.split('-')[0];
                var tempmonth = tempdate.split('-')[1];
                var tempday = tempdate.split('-')[2];
                var temphour = temptime.split(':')[0];
                var tempminute = temptime.split(':')[1];
                var d = new Date(tempyear, tempmonth - 1, tempday, temphour, tempminute, 0, 0);
                if (d >= minimalFilterTime) {
                    $scope.selectedIdList[0] = $scope.fullTransitionList[0][j].Id;
                    $scope.selectedLineList[0] = $scope.fullTransitionList[0][j];
                    break;
                }
            }
            if ($scope.selectedIdList.length == 0) {
                $scope.selectedIdList[0] = $scope.fullTransitionList[0][$scope.fullTransitionList[0].length - 1].Id;
                $scope.selectedLineList[0] = $scope.fullTransitionList[0][$scope.fullTransitionList[0].length - 1];
            }
            minimalFilterTime = null;
        }

        function initSelectedIdList() {
            if ($scope.fullTransitionList.length == 0 || $scope.fullTransitionList[0].length == 0)
                return;
            $scope.selectedLineList = [];
            $scope.showLessSchedule();
            //$scope.selectedIdList[0] = $scope.fullTransitionList[0][0].Id;
            //$scope.selectedLineList[0] = $scope.fullTransitionList[0][0];
            if ($scope.fullTransitionList.length > 1)
            {
                if ($scope.isSolutionByDeparture == true) {
                    for (var c = 0 ; c < $scope.fullTransitionList[1].length; c++) {
                        if ($scope.fullTransitionList.length > 1 && $scope.fullTransitionList[1].length > 0)
                            if ($scope.fullTransitionList[1][c].Id == $scope.fullTransitionList[0][0].NextTransitionId) {
                                $scope.selectedIdList[1] = $scope.fullTransitionList[1][c].Id;
                                $scope.selectedLineList[1] = $scope.fullTransitionList[1][c];
                                if ($scope.fullTransitionList.length > 2 && $scope.fullTransitionList[2].length >= 1)
                                    for (var d = 0 ; d < $scope.fullTransitionList[2].length; d++) {
                                        if ($scope.fullTransitionList[1][c].NextTransitionId == $scope.fullTransitionList[2][d].Id) {
                                            $scope.selectedIdList[2] = $scope.fullTransitionList[2][d].Id;
                                            $scope.selectedLineList[2] = $scope.fullTransitionList[2][d];
                                            break;
                                        }
                                    }
                                break;
                            }
                    }
                }
                else {
                    //for (var c = 0 ; c < $scope.fullTransitionList[1].length; c++) {
                    //    if ($scope.fullTransitionList.length > 1 && $scope.fullTransitionList[1].length > 0)
                    //        if ($scope.fullTransitionList[1][c].Id == $scope.fullTransitionList[2][0].PreviousTransitionId) {
                    //            $scope.selectedIdList[1] = $scope.fullTransitionList[1][c].Id;
                    //            $scope.selectedLineList[1] = $scope.fullTransitionList[1][c];
                    //            if ($scope.fullTransitionList.length > 2 && $scope.fullTransitionList[0].length >= 1)
                    //                for (var d = 0 ; d < $scope.fullTransitionList[0].length; d++) {
                    //                    if ($scope.fullTransitionList[1][c].PreviousTransitionId == $scope.fullTransitionList[0][d].Id) {
                    //                        $scope.selectedIdList[0] = $scope.fullTransitionList[0][d].Id;
                    //                        $scope.selectedLineList[0] = $scope.fullTransitionList[0][d];
                    //                        break;
                    //                    }
                    //                }
                    //            break;
                    //        }
                    //}
                }
            }
            else {
                if ($scope.fullTransitionList[0].length == 1) {
                    $scope.selectedIdList[0] = $scope.fullTransitionList[0][0].Id;
                    $scope.selectedLineList[0] = $scope.fullTransitionList[0][0];
                }
            }
            setDetailParams();
        }

        function setDetailParams() {

            // transitionService.setSelectedLineList($scope.selectedLineList);

            $rootScope.SelectedIdList = $scope.selectedIdList;
            $rootScope.selectedLineList = $scope.selectedLineList;
            $scope.search.selectedScheduleLine = $scope.selectedLineList[0];

            var fromArr = [];
            var toArr = [];
            fromArr.push($scope.search.fromAddress.City.NAME + " " + $scope.search.fromAddress.Quarter.NAME);
            if ($scope.search.firstConnection == null)
                fromArr.push("");
            else
                fromArr.push($scope.search.firstConnection.NAME);
            if ($scope.search.secondConnection == null)
                fromArr.push("");
            else
                fromArr.push($scope.search.secondConnection.NAME);

            if ($scope.search.firstConnection == null)
                fromArr.push("");
            else
                toArr.push($scope.search.firstConnection.NAME);
            if ($scope.search.secondConnection == null)
                fromArr.push("");
            else
                toArr.push($scope.search.secondConnection.NAME);
            toArr.push($scope.search.toAddress.City.NAME + " " + $scope.search.toAddress.Quarter.NAME);
            //transitionService.setFromPlaceName(fromArr);
            //transitionService.setToPlaceName(toArr);
            $rootScope.FromPlaceName = fromArr;
            $rootScope.ToPlaceName = toArr;
            fromArr = [];
            toArr = [];
        }

        function getCurrentPageRows(currentGridIndex) {
            if ($location.path().indexOf("details") > -1)
                return

            for (var j = 0 ; j < $scope.fullTransitionList[currentGridIndex].length; j++) {
                $scope.fullTransitionList[currentGridIndex][j].tableIndex = currentGridIndex;
            }

            var tempTransitionList = $scope.fullTransitionList[currentGridIndex];

            var cancelRefresh = $timeout(function () {
                $scope.transitionList[currentGridIndex] = tempTransitionList;
            }, 100);

            $scope.$on('$destroy', function (e) {
                $timeout.cancel(cancelRefresh);
            });

            $scope.transitionList[currentGridIndex] = tempTransitionList.slice(0, 10);
        }

        function scheduleRowSelected(e) {

            if ($scope.gridScheduleList.length == 0 || e.TransitionId == null) return;

            if ($scope.isSolutionByDeparture == true) {
                $scope.selectedIdList[e.TransitionId] = e.Id;
                $scope.selectedLineList[e.TransitionId] = e;
                var selectedPageIndex = e.Id / $scope.gridScheduleList[e.TransitionId].pageSize;
                selectedPageIndex = parseInt(selectedPageIndex);
                $scope.gridScheduleList[e.TransitionId].setPageIndex(selectedPageIndex + 1);
                if ($scope.fullTransitionList.length > e.TransitionId + 1) {
                    for (var c = 0 ; c < $scope.fullTransitionList[e.TransitionId + 1].length; c++) {
                        if ($scope.fullTransitionList[e.TransitionId + 1][c].Id == e.NextTransitionId) {
                            //checking the second table's checkbox
                            if (globalFunctions.TimeBiggerThan(e.TimeDestinationBusstop, $scope.fullTransitionList[e.TransitionId + 1][c].TimeOriginBusstop) == true) {
                                $scope.selectedIdList[e.TransitionId + 1] = null;
                                $rootScope.selectedLineList[e.TransitionId + 1] = $scope.selectedLineList[e.TransitionId + 1] = null;
                                if ($scope.fullTransitionList.length - e.TransitionId > 2) {
                                    $scope.selectedIdList[e.TransitionId + 2] = null;
                                    $rootScope.selectedLineList[e.TransitionId + 2] = $scope.selectedLineList[e.TransitionId + 2] = null;
                                }
                                $rootScope.gridScheduleList = null;
                                $scope.search.userMessage = "_NoContinuationBus_";
                                break;
                            }
                            else {
                                $scope.selectedIdList[e.TransitionId + 1] = e.NextTransitionId;
                                $scope.selectedLineList[e.TransitionId + 1] = $scope.fullTransitionList[e.TransitionId + 1][c];
                            }
                            var selectedPageIndex = $scope.fullTransitionList[e.TransitionId + 1][c].Id / $scope.gridScheduleList[e.TransitionId + 1].pageSize;
                            selectedPageIndex = parseInt(selectedPageIndex);
                            $scope.gridScheduleList[e.TransitionId + 1].setPageIndex(selectedPageIndex + 1);
                            if ($scope.fullTransitionList.length - e.TransitionId > 2) {
                                for (var d = 0 ; d < $scope.fullTransitionList[2].length; d++) {
                                    if ($scope.fullTransitionList[1][c].NextTransitionId == $scope.fullTransitionList[2][d].Id) {
                                        //checking the third table's checkbox
                                        $scope.selectedIdList[e.TransitionId + 2] = $scope.fullTransitionList[2][d].Id;
                                        $scope.selectedLineList[e.TransitionId + 2] = $scope.fullTransitionList[2][d];
                                        var selectedPageIndex = $scope.fullTransitionList[1][c].NextTransitionId / $scope.gridScheduleList[1].pageSize;
                                        selectedPageIndex = parseInt(selectedPageIndex + 1);
                                        $scope.gridScheduleList[2].setPageIndex(selectedPageIndex);
                                    }
                                }
                                break;
                            }
                            break;
                        }
                    }
                }
            }
            else {
                //debugger;
                $scope.selectedIdList[e.TransitionId] = e.Id;
                $scope.selectedLineList[e.TransitionId] = e;
                //var selectedPageIndex = e.Id / $scope.gridScheduleList[e.TransitionId].pageSize;
                //selectedPageIndex = Math.round(selectedPageIndex+1);
                //$scope.gridScheduleList[e.TransitionId].setPageIndex(selectedPageIndex);
                if (e.TransitionId > 0) {
                    for (var c = 0 ; c < $scope.fullTransitionList[e.TransitionId - 1].length; c++) {
                        if ($scope.fullTransitionList[e.TransitionId - 1][c].Id == e.PreviousTransitionId) {
                            //checking the second table's checkbox
                            
                            if (globalFunctions.TimeSmallerThan(e.DtOriginBusstop, $scope.fullTransitionList[e.TransitionId - 1][c].DtDestinationBusstop) == true) {
                                $scope.selectedIdList[e.TransitionId - 1] = null;
                                $rootScope.selectedLineList[e.TransitionId - 1] = $scope.selectedLineList[e.TransitionId - 1] = null;
                                if (e.TransitionId == 2) {
                                    $scope.selectedIdList[0] = null;
                                    $rootScope.selectedLineList[0] = $scope.selectedLineList[0] = null;
                                }
                                $rootScope.gridScheduleList = null;
                                $scope.search.userMessage = "_NoContinuationBus_";
                                break;
                            }
                            else {
                                $scope.selectedIdList[e.TransitionId - 1] = e.PreviousTransitionId;
                                $scope.selectedLineList[e.TransitionId - 1] = $scope.fullTransitionList[e.TransitionId - 1][c];
                            }
                            var selectedPageIndex = $scope.fullTransitionList[e.TransitionId - 1][c].Id / $scope.gridScheduleList[e.TransitionId - 1].pageSize;
                            selectedPageIndex = parseInt(selectedPageIndex);
                            $scope.gridScheduleList[e.TransitionId - 1].setPageIndex(selectedPageIndex+1);
                            if (e.TransitionId == 2) {
                                //debugger;
                                for (var d = 0 ; d < $scope.fullTransitionList[2].length; d++) {
                                    if ($scope.fullTransitionList[1][c].PreviousTransitionId == $scope.fullTransitionList[0][d].Id) {
                                        //checking the third table's checkbox
                                        $scope.selectedIdList[e.TransitionId - 2] = $scope.fullTransitionList[0][d].Id;
                                        $scope.selectedLineList[e.TransitionId - 2] = $scope.fullTransitionList[0][d];
                                        var selectedPageIndex = $scope.fullTransitionList[1][c].PreviousTransitionId / $scope.gridScheduleList[1].pageSize;
                                        selectedPageIndex = Math.round(selectedPageIndex + 1);
                                        $scope.gridScheduleList[e.TransitionId - 2].setPageIndex(selectedPageIndex);
                                    }
                                }
                                break;
                            }
                            break;
                        }
                    }
                }
            }

            selectedPageIndex = null;
            //setDetailParams();

        }

        function init() {
            $scope.$watch("selectedIdList[0]", function (newVal, oldVal) {
                if (typeof $scope.fullTransitionList == 'undefined') return;
                if ($scope.fullTransitionList.length < 1) return;
                var parsedRow = $.grep($scope.fullTransitionList[0], function (e) { return e.Id == newVal; })[0];
                if (parsedRow == null) parsedRow = $scope.fullTransitionList[0][0];
                scheduleRowSelected(parsedRow);
            });

            $scope.$watch("selectedIdList[1]", function (newVal, oldVal) {
                if (typeof $scope.fullTransitionList == 'undefined') return;
                if ($scope.fullTransitionList.length < 2) return;
                var parsedRow = $.grep($scope.fullTransitionList[1], function (e) { return e.Id == newVal; })[0];
                scheduleRowSelected(parsedRow);
            });

            $scope.$watch("selectedIdList[2]", function (newVal, oldVal) {
                if (typeof $scope.fullTransitionList == 'undefined') return;
                if ($scope.fullTransitionList.length < 3) return;
                var parsedRow = $.grep($scope.fullTransitionList[2], function (e) { return e.Id == newVal; })[0];
                scheduleRowSelected(parsedRow);
            });
        }

        if ($scope.search.DestinationID != null && $scope.search.firstConnection.ID == null) {
            for (var i = 0; i < $scope.search.toPlaceList.length; i++)
                if ($scope.search.toPlaceList[i].ID == $scope.search.DestinationID) {
                    $scope.search.toAddress.Quarter = $scope.search.toPlaceList[i];
                }
            $scope.search.DestinationID = null;
        }

        if ($scope.search.SourceID != null && $scope.search.firstConnection.ID == null) {
            for (var i = 0; i < $scope.search.fromPlaceList.length; i++)
                if ($scope.search.fromPlaceList[i].ID == $scope.search.SourceID) {
                    $scope.search.fromAddress.Quarter = $scope.search.fromPlaceList[i];
                    break;
                }
            $scope.search.SourceID = null;
        }

        //var transitionList;
        //var fullTransitionList;

        transitionService.getScheduleGridData(
                $rootScope.search.currentDate != null ? $rootScope.search.currentDate.ID : "",
                $rootScope.search.fromAddress.Quarter.ID,
                ($rootScope.search.firstConnection == null || $rootScope.search.firstConnection.ID == null ? 0 : $rootScope.search.firstConnection.ID),
                ($rootScope.search.secondConnection == null || $rootScope.search.secondConnection.ID == null ? 0 : $rootScope.search.secondConnection.ID),
                $rootScope.search.toAddress.Quarter.ID,
                $rootScope.search.lineNumber == null ? 0 : $rootScope.search.lineNumber.ID,
                $rootScope.search.language,
                $rootScope.search.isEggedDb,
            function (transitionListVal) {

                $scope.fullTransitionList = null;
                $scope.fullTransitionList = [];

                for (var i = 0; i < transitionListVal.Transitions.length; i++) {
                    var list = $.extend(true, [], transitionListVal.Transitions[i].ScheduleList);
                    $scope.fullTransitionList.push(list);
                }

                $scope.transitionList = $scope.fullTransitionList;

                //});

                if ($scope.fullTransitionList.length == 0) {
                    //$rootScope.$broadcast('resultSubViewChanged', { newValue: "pathplan" });
                    //setTimeout(function () {
                    if ($scope.fullTransitionList.length == 0) {
                        $scope.search.userMessage = "_NoDirectRoutesFound_";
                        $rootScope.isShowFilter = true;
                        $rootScope.$broadcast('resultSubViewChanged', { newValue: "" });
                        return;
                    }
                    //}, 500);
                    //return;
                }

                $rootScope.search.autocompleteDestination.description = $scope.search.toAddress.City.NAME + " " + $scope.search.toAddress.Quarter.NAME;
                $rootScope.search.autocompleteOrigin.description = $scope.search.fromAddress.City.NAME + " " + $scope.search.fromAddress.Quarter.NAME;


                ////copy transitionList into fullTransitionList
                //for (var j = 0 ; j < transitionList.length; j++)
                //    $.extend($scope.fullTransitionList[j] , transitionList[j]);

                //$scope.showLessSchedule();

                var transitionCount = $scope.fullTransitionList.length;

                $timeout(function () {
                    for (var i = 0 ; i < transitionCount; i++) {

                        switch (i) {
                            case 0:
                                if ($scope.search.fromAddress.Quarter.NAME.indexOf($scope.search.fromAddress.City.NAME) > -1)
                                    $rootScope.fromPlaceNameArray[i] = $scope.search.fromAddress.Quarter.NAME;
                                else
                                    $rootScope.fromPlaceNameArray[i] = $scope.search.fromAddress.City.NAME + " " + globalFunctions.parse($scope.search.fromAddress.Quarter.NAME);
                                if ($scope.search.selectedPathPlan != null) {
                                    if ($scope.search.selectedPathPlan.SourceName.indexOf($scope.search.fromAddress.City.NAME) > -1)
                                        $rootScope.fromPlaceNameArray[i] = $scope.search.selectedPathPlan.SourceName;
                                    else
                                        $rootScope.fromPlaceNameArray[i] = $scope.search.fromAddress.City.NAME + " " + globalFunctions.parse($scope.search.selectedPathPlan.SourceName);
                                }
                                break;
                            case 1:
                                $rootScope.fromPlaceNameArray[i] = $scope.search.firstConnection.NAME;
                                break;
                            case 2:
                                $rootScope.fromPlaceNameArray[i] = globalFunctions.parse($scope.search.secondConnection.NAME);
                                break;
                        }
                        switch (i) {
                            case 0:
                                if ($scope.search.currentTabName == 'bydest' && transitionCount > 1)
                                    $rootScope.toPlaceNameArray[i] = $scope.search.firstConnection.NAME;
                                else {
                                    if ($scope.search.toAddress.Quarter.NAME.indexOf($scope.search.toAddress.City.NAME) > -1)
                                        $rootScope.toPlaceNameArray[i] = $scope.search.toAddress.Quarter.NAME;
                                    else
                                        $rootScope.toPlaceNameArray[i] = $scope.search.toAddress.City.NAME + " " + globalFunctions.parse($scope.search.toAddress.Quarter.NAME);

                                    if ($scope.search.selectedPathPlan != null) {
                                        if ($scope.search.selectedPathPlan.DestinationName.indexOf($scope.search.toAddress.City.NAME) > -1)
                                            $rootScope.toPlaceNameArray[i] = $scope.search.selectedPathPlan.DestinationName;
                                        else
                                            $rootScope.toPlaceNameArray[i] = $scope.search.toAddress.City.NAME + " " + globalFunctions.parse($scope.search.selectedPathPlan.DestinationName);
                                    }
                                }
                                break;
                            case 1:
                                if (transitionCount == 2) {
                                    $rootScope.toPlaceNameArray[i] = $scope.search.toAddress.City.NAME + " " + globalFunctions.parse($scope.search.toAddress.Quarter.NAME)
                                    if ($scope.search.selectedPathPlan != null)
                                        $rootScope.toPlaceNameArray[i] = $scope.search.toAddress.City.NAME + " " + globalFunctions.parse($scope.search.selectedPathPlan.DestinationName)
                                }
                                else
                                    $rootScope.toPlaceNameArray[i] = $scope.search.secondConnection.NAME;
                                break;
                            case 2:
                                $rootScope.toPlaceNameArray[i] = $scope.search.toAddress.City.NAME + " " + globalFunctions.parse($scope.search.toAddress.Quarter.NAME);
                                if ($scope.search.selectedPathPlan != null)
                                    $rootScope.toPlaceNameArray[i] = $scope.search.toAddress.City.NAME + " " + globalFunctions.parse($scope.search.selectedPathPlan.DestinationName);
                                break;
                        }

                        getCurrentPageRows(i);

                        //$scope.isShowEstimatedDepartureTimeMessage = false;
                        //$scope.isShowAftermidnightMessage = false;
                        //$scope.isShowMigunMessage = false;

                        for (var k = 0 ; k < $scope.fullTransitionList[i].length; k++) {

                            //if ($scope.fullTransitionList[i][k].PlatformNumber != '0')
                            //    $scope.isShowPlatformNumber = true;

                            //if ($scope.fullTransitionList[i][k].Accessibility == 1)
                            //    $scope.ShowAccessibilityMessage = true;

                            //if ($scope.fullTransitionList[i][k].Migun == 3)
                            //    $scope.isShowMigunMessage = true;

                            if ($scope.search.currentDate.NAME.split('-')[0].trim().split('/')[0] != $scope.fullTransitionList[i][k].DtOriginBusstop.split('T')[0].split('-')[2]) {
                                $scope.fullTransitionList[i][k].isShowAftermidnightImg = true;
                                $scope.isShowAftermidnightMessage = true;
                            }
                            else
                                $scope.fullTransitionList[i][k].isShowAftermidnightImg = false;

                            if ($scope.fullTransitionList[i][k].MazanToMoza != 0)
                                $scope.isShowEstimatedDepartureTimeMessage = true;
                            if ($scope.fullTransitionList[i][k].Makat == $rootScope.airlineDependent.makatFrom)
                                $scope.isAirlineDependentFrom = true;
                            if ($scope.fullTransitionList[i][k].Makat == $rootScope.airlineDependent.makatTo)
                                $scope.isAirlineDependentTo = true;
                        }
                    }



                }, 200);

                for (var i = 0 ; i < transitionCount; i++) {


                    var gridTemp = {
                        gridIndex: i,
                        isShowPlatformNumber: false,
                        ShowAccessibilityMessage: false,
                        isShowMigunMessage: false,
                        //shilutList: transitionShilutScheduleList,
                        ShowPlatformHeader: false,
                        ShowShieldedHeader: false,
                        ShowAccessibilityHeader: false,
                        fromPlaceName: $rootScope.fromPlaceNameArray[i],
                        toPlaceName: $rootScope.toPlaceNameArray[i],
                        rowSelected: function (e) {
                            scheduleRowSelected(e);
                        },
                        showScheduleOnMap: function (line) {
                            $rootScope.selectedLineIndex = this.gridIndex;
                            $scope.search.selectedScheduleLine = line;
                            $rootScope.selectedLineList[$rootScope.selectedLineIndex] = line;
                            //scheduleRowSelected(line);
                            //$scope.$apply();
                            $rootScope.toggleMap(true);
                            //$scope.search.isShowAllBusstops = true;
                            //$scope.search.isShowAllTransitions = false;
                        },
                        showStations: function (line) {
                            $rootScope.selectedLineIndex = this.gridIndex;
                            $rootScope.selectedLine = { ID: line.Makat, NAME: line.Shilut };
                            $scope.search.selectedScheduleLine = line;
                            $rootScope.selectedLineList[$rootScope.selectedLineIndex] = line;
                            $scope.search.LineNumber = line.LineNumber;
                            $scope.search.makat = line.Makat;
                            $scope.search.chalufa = line.Chalufa;
                            $scope.search.busStationArrangementD = line.BusStationArrangementD;
                            $scope.search.busStationArrangementA = line.BusStationArrangementA;
                            $scope.search.originTime = $filter('date')(new Date(line.OriginTime), 'dd/MM/yyyy HH:mm');
                            transitionService.getBusStopList($rootScope.search.getJsonString(),
                                function (getBusStopListVal) {
                                    $rootScope.busstopList = getBusStopListVal;
                                });
                            $rootScope.$broadcast('resultSubViewChanged', { newValue: "busstop" });
                        },
                        fullTransitionList: $scope.fullTransitionList[i],
                        pagedTransitionList: [],
                        currentPageIndex: 0,
                        lastPageIndex: 0,
                        pageSize: $scope.PagedTableRowCount,
                        pageList: [],
                        getPageList: function () {
                            //if (this.lastPageIndex != 0) return this.lastPageIndex;
                            this.lastPageIndex = this.fullTransitionList.length / this.pageSize;
                            if (this.fullTransitionList.length % this.pageSize)
                                this.lastPageIndex = parseInt(this.lastPageIndex) + 1;
                            else
                                this.lastPageIndex = parseInt(this.lastPageIndex);
                            this.lastPagingPageIndex = this.lastPageIndex / 5;
                            if (this.lastPageIndex % 5)
                                this.lastPagingPageIndex = parseInt(this.lastPagingPageIndex) + 1;
                            else
                                this.lastPagingPageIndex = parseInt(this.lastPagingPageIndex);

                            var arrPageList = [];


                            for (var i = 0; i < this.lastPageIndex ; i++) {
                                if (i >= this.currentPagingPageIndex * 5 && (this.currentPagingPageIndex + 1) * 5 > i) {
                                    var fromTime = this.fullTransitionList[i * this.pageSize].TimeOriginBusstop;
                                    var pageToIndex = (i + 1) * this.pageSize - 1;
                                    if (pageToIndex > this.fullTransitionList.length - 1)
                                        pageToIndex = this.fullTransitionList.length - 1;
                                    var toTime = this.fullTransitionList[pageToIndex].TimeOriginBusstop;
                                    arrPageList.push({ id: i + 1, timeRange: fromTime + " - " + toTime });
                                    //arrPageList.push(i + 1);
                                }
                            }
                            this.pagedTransitionList = this.fullTransitionList.slice(this.currentPageIndex * this.pageSize, (this.currentPageIndex + 1) * this.pageSize);

                            this.isShowPlatformNumber = false;
                            this.ShowAccessibilityMessage = false;
                            this.isShowMigunMessage = false;
                            for (var i = 0; i < this.pagedTransitionList.length; i++) {
                                if(this.pagedTransitionList[i].PlatformNumber != '0')
                                    this.isShowPlatformNumber = true;
                                if (this.pagedTransitionList[i].Accessibility == 1)
                                    this.ShowAccessibilityMessage = true;
                                if (this.pagedTransitionList[i].Migun == 3)
                                    this.isShowMigunMessage = true;
                            }

                            return arrPageList;
                        },
                        setFirstPage: function () {
                            if (this.currentPageIndex == 0) return;
                            this.currentPagingPageIndex = 0;
                            this.setPageIndex(1);
                        },
                        setPrevPage: function () {
                            if (this.currentPageIndex == 0) return;
                            this.setPageIndex(this.currentPageIndex);
                        },
                        setPageIndex: function (pageIndex) {
                            this.currentPageIndex = pageIndex - 1;
                            this.currentPagingPageIndex = this.currentPageIndex / 5;
                            this.currentPagingPageIndex = parseInt(this.currentPagingPageIndex);
                            //this.pagedTransitionList = this.fullTransitionList.slice(this.currentPageIndex * this.pageSize, (this.currentPageIndex + 1) * this.pageSize);
                            this.pageList = this.getPageList();
                        },
                        setNextPage: function () {
                            if (this.currentPageIndex == this.lastPageIndex - 1) return;
                            this.setPageIndex(this.currentPageIndex + 2);
                        },
                        setLastPage: function () {
                            if (this.currentPageIndex == this.lastPageIndex - 1) return;
                            this.currentPagingPageIndex = this.lastPagingPageIndex;
                            this.setPageIndex(this.lastPageIndex);
                        },

                        currentPagingPageIndex: 0,
                        lastPagingPageIndex: 0,
                        setPrevPagingPage: function () {
                            this.currentPagingPageIndex--;
                            this.pageList = this.getPageList();
                        },
                        setNextPagingPage: function (e) {
                            this.currentPagingPageIndex++;
                            this.pageList = this.getPageList();
                        },
                        columnDefs:
                        [
                            { field: '_Select_', textAlign: "center", fieldWidth: "{width:'25px'}", fieldVisibility: function () { return true; }, filterType: "", filterClosed: function () { } },
                            { field: '_line_', textAlign: "", fieldWidth: "{width:'30px'}", fieldVisibility: function () { return true; }, filterType: "", filterClosed: function () { } },
                            {
                                field: '_Hour_', textAlign: "", fieldWidth: "{width:'49px'}", fieldVisibility: function () { return true; }, filterType: "hour", filterClosed: function (filterValue, gridId) {
                                    var selectedDate = new Date(filterValue.ID);
                                    for (var i = 0; i < $scope.fullTransitionList[gridId].length; i++) {
                                        var tempdate = $scope.fullTransitionList[gridId][i].DtOriginBusstop.split('T')[0];
                                        var temptime = $scope.fullTransitionList[gridId][i].DtOriginBusstop.split('T')[1];
                                        var tempyear = tempdate.split('-')[0];
                                        var tempmonth = tempdate.split('-')[1];
                                        var tempday = tempdate.split('-')[2];
                                        var temphour = temptime.split(':')[0];
                                        var tempminute = temptime.split(':')[1];
                                        var comparedDate = new Date(tempyear, tempmonth - 1, tempday, temphour, tempminute, 0, 0);
                                        //var comparedDate = new Date($scope.fullTransitionList[gridId][i].DtOriginBusstop);
                                        if (selectedDate <= comparedDate) {
                                            $scope.gridScheduleList[gridId].setPageIndex(parseInt(i / $scope.PagedTableRowCount) + 1, null);
                                            break;
                                        }
                                    }
                                },
                                minvalue: $scope.transitionList[i][0] == null ? 0: $scope.transitionList[i][0].DtOriginBusstop,
                                maxvalue: $scope.transitionList[i][$scope.transitionList[i].length - 1] == null ? 0 : $scope.transitionList[i][$scope.transitionList[i].length - 1].DtOriginBusstop,
                                gridIndex: i
                            },
                            { field: '_Company_', textAlign: "center", fieldWidth: "{width:'36px'}", fieldVisibility: function () { return true; }, filterType: "", filterClosed: function () { } },
                            { field: '_Arrival_', textAlign: "", fieldWidth: "{width:'30px'}", fieldVisibility: function () { return true; }, filterType: "", filterClosed: function () { } },
                            { field: '_Duration_', textAlign: "", fieldWidth: "{width:'30px'}", fieldVisibility: function () { return $rootScope.isBezeqOnline; }, filterType: "", filterClosed: function () { } },
                            { field: '_Platform_', textAlign: "", fieldWidth: "{width:'25px'}", fieldVisibility: function (index) { return $scope.gridScheduleList[index].isShowPlatformNumber && $rootScope.isBezeqOnline; }, filterType: "", filterClosed: function () { } },
                            { field: '_Shielded_', textAlign: "center", fieldWidth: "{width:'31px'}", fieldVisibility: function (index) { return $scope.gridScheduleList[index].isShowMigunMessage; }, filterType: "", filterClosed: function () { } },
                            { field: '_Accessibile_', textAlign: "center", fieldWidth: "{width:'25px'}", fieldVisibility: function (index) { return $scope.gridScheduleList[index].ShowAccessibilityMessage; }, filterType: "", filterClosed: function () { } },
                            { field: '_Map_', textAlign: "center", fieldWidth: "{width:'25px'}", fieldVisibility: function () { return $rootScope.isGoogleReachable; }, filterType: "", filterClosed: function () { } },
                            { field: '_busStop_', textAlign: "center", fieldWidth: "{width:'35px'}", fieldVisibility: function () { return true; }, filterType: "", filterClosed: function () { } }
                        ]
                    };

                    //$timeout(function () {
                    gridTemp.getPageList();
                    $scope.gridScheduleList.push(gridTemp);
                }
                $timeout(function () {
                    $scope.isDigested = true;
                }, 150);
                if (0 < $scope.gridScheduleList[0].pagedTransitionList < 7) $scope.gridScheduleList[0].pageList.push({ id: 1 });
                $rootScope.gridScheduleList = $scope.gridScheduleList;

                //for (var i = 0; $rootScope.SelectedIdList && i < $rootScope.SelectedIdList.length; i++) {
                //    if ($scope.fullTransitionList[i] != null && $rootScope.SelectedIdList[i] != null) {
                //        var parsedRow = $scope.fullTransitionList[i][$rootScope.SelectedIdList[i]];
                //        scheduleRowSelected(parsedRow);
                //    }
                //}

                //if ($rootScope.isNavigatedFromDetails == null || $rootScope.isNavigatedFromDetails == false) {
                initSelectedIdList();

                //}
                //else {
                //    $rootScope.isNavigatedFromDetails = false;
                //}

                $rootScope.$broadcast('transitionlistChanged', { newValue: $scope.fullTransitionList });


            });


        $scope.showScheduleAccessabilityMessage = function () {
            $scope.search.userMessageTitle = "_KeyboardUseInstruction_," + "_TableOf_," + "_Schedule_";
            $scope.search.userMessage = "_ScheduleListHelpBulletMessage_";
        }

    });
