"use strict";
mslApp.controller("PathPlanCtrl",
    function ($rootScope, $scope, $timeout, searchService, localize, globalFunctions, $q) {

        $scope.isSortAscending = false;
        $scope.ShowWalkingManImgLegend = false;
        $rootScope.isNavigatedFromDetails = null;
        $scope.search.selectedPathPlan = null;
        $scope.search.selectedRadioPathPlan = null;
        $scope.PagedTableRowCount = 3;
        if ($rootScope.isBezeqOnline == true)
            $scope.PagedTableRowCount = 10;
        //var strFirstStation = localize.getLocalizedString("_FirstStation_");
        //var strConnectionName = localize.getLocalizedString("_ConnectionName_");
        //var strFirstConnectionName = localize.getLocalizedString("_FirstConnectionName_");
        //var strSecondConnectionName = localize.getLocalizedString("_SecondConnectionName_");
        //var strLastStation = localize.getLocalizedString("_LastStation_");
        //var strPrice = localize.getLocalizedString("_Price_");
        //var strTravelTime = localize.getLocalizedString("_EstimatedTravelTime_");
        //var strDistanceOf = localize.getLocalizedString("_DistanceOf_");
        //var strKm = localize.getLocalizedString("_Distance_");
        //var strHours = localize.getLocalizedString("_Hours_");

        var userClickedPanelIndex = false;
        $rootScope.SelectedIdList = null;

        function initDirectColumnDefs() {
            return [
                        //{ field: '', onHeaderClick: "", fieldWidth: "{width:'30px'}" },
                        { field: '_FirstStation_', onHeaderClick: "onPathPlanHeaderClick('')", fieldWidth: "{width:'25%'}" },
                        { field: '_FirstSegmentTripCount_', onHeaderClick: "onPathPlanHeaderClick('_FirstSegmentTripCount_')", fieldWidth: "{width:'40px'}" },
                        { field: '_LastStation_', onHeaderClick: "onPathPlanHeaderClick('')", fieldWidth: "{width:'25%'}" },
                        { field: '_Price_', onHeaderClick: "onPathPlanHeaderClick('Price')", fieldWidth: "{width:'73px'}", isSortUp: function () { return $scope.isPriceSortAsc; }, isSortDown: function () { return !$scope.isPriceSortAsc; } },
                        { field: '_TravelTime_', onHeaderClick: "onPathPlanHeaderClick('TravelTime')", fieldWidth: "{width:'83px'}", isSortUp: function () { return $scope.isTravelTimeSortAsc; }, isSortDown: function () { return !$scope.isTravelTimeSortAsc; } },
                        { field: '_Distance_', onHeaderClick: "onPathPlanHeaderClick('Distance')", fieldWidth: "{width: '270px'}", isSortUp: function () { return $scope.isDistanceSortAsc; }, isSortDown: function () { return !$scope.isDistanceSortAsc; } },
                        { field: '_Schedule_', onHeaderClick: "", fieldWidth: "{width: '90px'}", isSortUp: function () { }, isSortDown: function () { } }
            ];
        }
        function initOneConnectionColumnDefs() {
            return [
                        //{ field: '', onHeaderClick: "", fieldWidth: "{width:'30px'}" },
                        { field: '_FirstStation_', onHeaderClick: "onPathPlanHeaderClick('')", fieldWidth: "{width:'25%'}" },
                        { field: '_FirstSegmentTripCount_', onHeaderClick: "onPathPlanHeaderClick('FirstSegmentTripCount')", fieldWidth: "{width:'40px'}", isSortUp: function () { return $scope.isFirstSegmentTripCountSortAsc; }, isSortDown: function () { return !$scope.isFirstSegmentTripCountSortAsc; } },
                        { field: '_ConnectionName_', onHeaderClick: "onPathPlanHeaderClick('')", fieldWidth: "{width:'25%'}" },
                        { field: '_SecondSegmentTripCount_', onHeaderClick: "onPathPlanHeaderClick('SecondSegmentTripCount')", fieldWidth: "{width:'40px'}", isSortUp: function () { return $scope.iSecondSegmentTripCountSortAsc; }, isSortDown: function () { return !$scope.iSecondSegmentTripCountSortAsc; } },
                        { field: '_Price_', onHeaderClick: "onPathPlanHeaderClick('Price')", fieldWidth: "{width:'73px'}", isSortUp: function () { return $scope.isPriceSortAsc; }, isSortDown: function () { return !$scope.isPriceSortAsc; } },
                        { field: '_TravelTime_', onHeaderClick: "onPathPlanHeaderClick('TravelTime')", fieldWidth: "{width:'83px'}", isSortUp: function () { return $scope.isTravelTimeSortAsc; }, isSortDown: function () { return !$scope.isTravelTimeSortAsc; } },
                        { field: '_Distance_', onHeaderClick: "onPathPlanHeaderClick('Distance')", fieldWidth: "{width:'207px'}", isSortUp: function () { return $scope.isDistanceSortAsc; }, isSortDown: function () { return !$scope.isDistanceSortAsc; } },
                        { field: '_Schedule_', onHeaderClick: "", fieldWidth: "{width: '90px'}", isSortUp: function () { }, isSortDown: function () { } }
            ];
        }
        function initTwoConnectionColumnDefs() {
            return [
                        //{ field: '', onHeaderClick: "", fieldWidth: "{width:'30px'}" },
                        { field: '_FirstStation_', onHeaderClick: "onPathPlanHeaderClick('')", fieldWidth: "{width:'25%'}" },
                        { field: '_FirstSegmentTripCount_', onHeaderClick: "onPathPlanHeaderClick('FirstSegmentTripCount')", fieldWidth: "{width:'40px'}", isSortUp: function () { return $scope.isFirstSegmentTripCountSortAsc; }, isSortDown: function () { return !$scope.isFirstSegmentTripCountSortAsc; } },
                        { field: '_FirstConnectionName_', onHeaderClick: "onPathPlanHeaderClick('')", fieldWidth: "{width:'25%'}" },
                        { field: '_SecondSegmentTripCount_', onHeaderClick: "onPathPlanHeaderClick('SecondSegmentTripCount')", fieldWidth: "{width:'40px'}", isSortUp: function () { return $scope.iSecondSegmentTripCountSortAsc; }, isSortDown: function () { return !$scope.iSecondSegmentTripCountSortAsc; } },
                        { field: '_SecondConnectionName_', onHeaderClick: "onPathPlanHeaderClick('')", fieldWidth: "{width:'25%'}" },
                        { field: '_ThirdSegmentTripCount_', onHeaderClick: "onPathPlanHeaderClick('ThirdSegmentTripCount')", fieldWidth: "{width:'40px'}", isSortUp: function () { return $scope.isThirdSegmentTripCountSortAsc; }, isSortDown: function () { return !$scope.isThirdSegmentTripCountSortAsc; } },
                        { field: '_Price_', onHeaderClick: "onPathPlanHeaderClick('Price')", fieldWidth: "{width:'73px'}", isSortUp: function () { return $scope.isPriceSortAsc }, isSortDown: function () { return !$scope.isPriceSortAsc } },
                        { field: '_TravelTime_', onHeaderClick: "onPathPlanHeaderClick('TravelTime')", fieldWidth: "{width:'83px'}", isSortUp: function () { return $scope.isTravelTimeSortAsc; }, isSortDown: function () { return !$scope.isTravelTimeSortAsc; } },
                        { field: '_Distance_', onHeaderClick: "onPathPlanHeaderClick('Distance')", fieldWidth: "{width:'41px'}", isSortUp: function () { return $scope.isDistanceSortAsc; }, isSortDown: function () { return !$scope.isDistanceSortAsc; } },
                        { field: '_Schedule_', onHeaderClick: "", fieldWidth: "{width: '90px'}", isSortUp: function () { }, isSortDown: function () { } }
            ];
        }

        function markFirstLineInPane() {
            var paneIndex = $scope.search.currentPanelIndex;
            if ($scope.pathplan.pathPlanGridList[paneIndex] == null) return;
            if ($scope.pathplan.pathPlanGridList[paneIndex].pathplanList == null) return;
            switch ($scope.search.currentPanelIndex) {
                case 0:
                    $scope.search.selectedPathPlan = null;
                    if ($scope.pathplan.pathPlanGridList[paneIndex].pathplanList.length == 1) {
                        $scope.search.selectedPathPlan = $scope.pathplan.pathPlanGridList[paneIndex].pathplanList[0];
                        setPathplanValues();
                        if ($rootScope.isMapViewed == true)
                            $rootScope.$broadcast('resultSubViewChanged', { newValue: "transition" });

                        if ($rootScope.isNavigatedFromTransition != true)
                            $rootScope.$broadcast('resultSubViewChanged', { newValue: "transition" });

                    }
                    for (var i = 0; i < $scope.pathplan.pathPlanGridList[paneIndex].pathplanList.length; i++) {
                        if ($scope.pathplan.pathPlanGridList[paneIndex].pathplanList[i].DistanceDestination != null &&
                            $scope.pathplan.pathPlanGridList[paneIndex].pathplanList[i].DistanceDestination != '0') {
                            $scope.ShowWalkingManImgLegend = true;
                        }
                        if ($scope.pathplan.pathPlanGridList[paneIndex].pathplanList[i].DistanceSource != null &&
                            $scope.pathplan.pathPlanGridList[paneIndex].pathplanList[i].DistanceSource != '0') {
                            $scope.ShowWalkingManImgLegend = true;
                        }
                    }
                    if ($scope.search.selectedRadioPathPlan != null && $scope.ShowWalkingManImgLegend != true && $rootScope.isNavigatedFromTransition != true) {
                        $rootScope.$broadcast('resultSubViewChanged', { newValue: "transition" });
                    }
                    break;
                case 1:
                    if ($scope.pathplan.pathPlanGridList[paneIndex].pathplanList.length > 0) {
                        $scope.search.selectedPathPlan = $scope.pathplan.pathPlanGridList[paneIndex].pathplanList[0];
                        setPathplanValues();
                    }
                    break;
                case 2:
                    if ($scope.pathplan.pathPlanGridList[paneIndex].pathplanList.length > 0) {
                        $scope.search.selectedPathPlan = $scope.pathplan.pathPlanGridList[paneIndex].pathplanList[0];
                        setPathplanValues();
                    }
                    break;
            }
            $scope.search.pathplanPanelIndex = $scope.search.currentPanelIndex;
            if ($rootScope.isMapViewed == true)
                $rootScope.$broadcast('resultSubViewChanged', { newValue: "transition" });
        }

        function pathplanGridInsert(i, gridOptionsData, gridOptionsColumnDefs, gridOptionsheaderElem) {

            //$timeout(function () {

            switch (i) {
                case 0:
                    if (gridOptionsData.length > 0)
                        $scope.search.currentPanelIndex = 0;
                    break;
                case 1:
                    if (gridOptionsData.length > 0 && $scope.pathplan.pathPlanGridList[0].pathplanList && $scope.pathplan.pathPlanGridList[0].pathplanList.length == 0)
                        $scope.search.currentPanelIndex = 1;
                    break;
                case 2:
                    if (gridOptionsData.length > 0 && $scope.pathplan.pathPlanGridList[0].pathplanList && $scope.pathplan.pathPlanGridList[0].pathplanList.length == 0 && $scope.pathplan.pathPlanGridList[1].pathplanList.length == 0)
                        $scope.search.currentPanelIndex = 2;
                    break;
            }

            if (i == 0 && gridOptionsData.length == 1 && $scope.search.backNextClicked != -1) {
                $timeout(function () {
                    setPathplanValues();
                    //if ($rootScope.isNavigatedFromTransition == true)
                    //$rootScope.isNavigatedFromTransition = false;
                }, 100);
            }

            $scope.pathplan.pathPlanGridList[i] = {

                columnDefs: gridOptionsColumnDefs,
                pathplanList: gridOptionsData,
                headerClicked: function (headerName) {
                    $scope.isSortAscending = !$scope.isSortAscending;
                    var asc = $scope.isSortAscending;
                    var prop = headerName.replace('_', '');
                    prop = prop.replace('_', '');

                    if (prop == "TravelTime") prop = "TripTime";
                    if (prop == "FirstStation") prop = "SourceName";
                    //if (prop == "FirstConnectionName") prop = "Transitions[0].ConnectionPointDescription";
                    //if (prop == "SecondConnectionName") prop = "Transitions[1].ConnectionPointDescription";

                    this.pathplanList = this.pathplanList.sort(function (a, b) {
                      
                        if (prop == "Distance" || prop == "SecondSegmentTripCount" || prop == "FirstSegmentTripCount" || prop == "ThirdSegmentTripCount") {
                            a[prop] = parseFloat((a[prop]));
                            b[prop] = parseFloat((b[prop]));
                        }
                        if (asc) return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
                        else return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
                    });
                    this.setPageIndex(1);
                },
                currentPageIndex: 0,
                lastPageIndex: 0,
                pageSize: $scope.PagedTableRowCount,
                pageList: function () {
                    //if (this.lastPageIndex != 0) return this.lastPageIndex;
                    this.lastPageIndex = this.pathplanList.length / this.pageSize;
                    if (this.pathplanList.length % this.pageSize > 0)
                        this.lastPageIndex = parseInt(this.lastPageIndex) + 1;
                    else
                        this.lastPageIndex = parseInt(this.lastPageIndex);

                    var arrPageList = [];

                    for (var i = 0; i < this.lastPageIndex; i++) {
                        arrPageList.push(i + 1);
                    }
                    this.pagedPathplanList = this.pathplanList.slice(this.currentPageIndex * this.pageSize, (this.currentPageIndex + 1) * this.pageSize);
                    return arrPageList;
                },
                pagedPathplanList: [],
                setFirstPage: function () {
                    if (this.currentPageIndex == 0) return;
                    this.setPageIndex(1);
                },
                setPrevPage: function () {
                    if (this.currentPageIndex == 0) return;
                    this.setPageIndex(this.currentPageIndex);
                },
                setPageIndex: function (pageIndex) {
                    this.currentPageIndex = pageIndex - 1;
                    this.pagedPathplanList = this.pathplanList.slice(this.currentPageIndex * this.pageSize, (this.currentPageIndex + 1) * this.pageSize);
                },
                setNextPage: function () {
                    if (this.currentPageIndex == this.lastPageIndex - 1) return;
                    this.setPageIndex(this.currentPageIndex + 2);
                },
                setLastPage: function () {
                    if (this.currentPageIndex == this.lastPageIndex - 1) return;
                    this.setPageIndex(this.lastPageIndex);
                },

                PanelIndex: i,
                isOpen: false,
                headerElem: gridOptionsheaderElem
                //, gridElem: $scope.grid
                //, Clicked: "pathplan.accordionHeaderClicked('" + 2 + "')"
            };
            //}, 50);


        }

        function initPathPlanGrid() {
            //$scope.search.selectedPathPlan = null;
            var dataInitialized = [];
            var deferredGetPathPlan = $q.defer();
            var deferredGetPathPlanWithOneConnection = $q.defer();
            var deferredGetPathPlanWithTwoConnections = $q.defer();
            dataInitialized.push(deferredGetPathPlan.promise);
            dataInitialized.push(deferredGetPathPlanWithOneConnection.promise);
            dataInitialized.push(deferredGetPathPlanWithTwoConnections.promise);

            userClickedPanelIndex = false;
            $scope.search.selectedDirectLine = null;
            //if($scope.search.selectedPathPlan == null)
            //    $scope.parsedSelectedPathPlan[$scope.search.currentPanelIndex] = eval("(" + $scope.search.selectedPathPlan + ")");

            $rootScope.selectedLineList = [];
            $scope.parsedSelectedPathPlan = [];
            $scope.pathplan.pathPlanGridList = [];
            for (var i = 0; i < 3; i++)
                $scope.pathplan.pathPlanGridList.push(new Object());

            $scope.ShowWalkingManImgLegend = false;

            if ($scope.search.fromAddress.Quarter.NAME.indexOf("<") > -1)
                $scope.fixedFromQuarter = $($scope.search.fromAddress.Quarter.NAME)[0].title;
            else
                $scope.fixedFromQuarter = $scope.search.fromAddress.Quarter.NAME;

            if ($scope.search.toAddress.Quarter.NAME.indexOf("<") > -1)
                $scope.fixedToQuarter = $($scope.search.toAddress.Quarter.NAME)[0].title;
            else
                $scope.fixedToQuarter = $scope.search.toAddress.Quarter.NAME;

            if ($scope.fixedFromQuarter.indexOf($scope.search.fromAddress.City.NAME) > -1)
                $scope.fixedFromQuarter = $scope.fixedFromQuarter.replace($scope.search.fromAddress.City.NAME, "");
            if ($scope.search.toAddress.Quarter.NAME.indexOf($scope.search.toAddress.City.NAME) > -1)
                $scope.fixedToQuarter = $scope.fixedToQuarter.replace($scope.search.toAddress.City.NAME, "");

            //$scope.$parent.$parent.$parent.$$prevSibling.currentDate
            //$scope.$parent.$parent.$parent.$$prevSibling.currentTime
            //$scope.$parent.$parent.$parent.$$prevSibling.fromAddress
            //$scope.$parent.$parent.$parent.$$prevSibling.toAddress

            searchService.getPathPlan(
                $scope.search.currentDate.ID,
                $scope.search.fromAddress.Quarter.ID,
                $scope.search.toAddress.Quarter.ID,
                $scope.search.currentTime.ID != null ? $scope.search.currentTime.ID : "-1",
                $scope.search.language,
                $scope.search.isEggedDb,
                function (gridOptionsDataVal) {
                    var gridOptionsData = gridOptionsDataVal;
                    var gridOptionsColumnDefs;
                    var gridOptionsheaderElem;

                    if (gridOptionsData.length > 0) {
                        gridOptionsheaderElem = "_DirectSolution_";
                        gridOptionsColumnDefs = initDirectColumnDefs();
                        for (var j = 0; j < gridOptionsData.length ; j++) {

                            gridOptionsData[j].TripTime = globalFunctions.convertMinutesTohours(gridOptionsData[j].TripTime);

                            // gridOptionsData[j].titleString =
                            //  strFirstStation.split(',')[1] +
                            //  " " +
                            //  gridOptionsData[j].SourceName +
                            //  ", " +
                            //  strLastStation.split(',')[1] +
                            //  " " +
                            //  gridOptionsData[j].DestinationName +
                            //  ", " +
                            //  strPrice +
                            //  " " +
                            //  gridOptionsData[j].Price +
                            //  ", " +
                            //  strTravelTime +
                            //  " " +
                            //  gridOptionsData[j].TripTime +
                            // " " +
                            //strHours +
                            // ", " +
                            //  strDistanceOf +
                            //  " " +
                            // gridOptionsData[j].Distance +
                            // " " +
                            //strKm;

                        }
                    }
                    else
                        gridOptionsheaderElem = "_NoDirectRoutesFound_";

                    pathplanGridInsert(0, gridOptionsData, gridOptionsColumnDefs, gridOptionsheaderElem);

                    markFirstLineInPane();
                    if (gridOptionsData.length > 0)
                        deferredGetPathPlan.resolve("success");
                    else
                        deferredGetPathPlan.reject("fail");

                });

            searchService.getPathPlanWithOneConnection(
                $scope.search.currentDate.ID,
                //$scope.search.currentDate != null ? $scope.search.currentDate.NAME.split('-')[0].trim() : "",
                $scope.search.fromAddress.Quarter.ID,
                $scope.search.toAddress.Quarter.ID,
                $scope.search.currentTime.ID != null ? $scope.search.currentTime.ID : "-1",
                $scope.search.language,
                $scope.search.isEggedDb,
                function (gridOptionsDataVal) {
                    var gridOptionsData = gridOptionsDataVal;
                    var gridOptionsColumnDefs;
                    var gridOptionsheaderElem;
                    if (gridOptionsData.length > 0) {
                        gridOptionsheaderElem = "_Solution1_";
                        gridOptionsColumnDefs = initOneConnectionColumnDefs();


                        for (var j = 0; j < gridOptionsData.length ; j++) {

                            gridOptionsData[j].TripTime = globalFunctions.convertMinutesTohours(gridOptionsData[j].TripTime);
                            gridOptionsData[j].SourceName = ($scope.fixedFromQuarter.indexOf($scope.search.fromAddress.City.NAME) > -1) ? $scope.fixedFromQuarter : $scope.search.fromAddress.City.NAME + " " + $scope.fixedFromQuarter;
                            gridOptionsData[j].DestinationName = ($scope.fixedToQuarter.indexOf($scope.search.toAddress.City.NAME) > -1) ? $scope.fixedToQuarter : $scope.search.toAddress.City.NAME + " " + $scope.fixedToQuarter;

                            //gridOptionsData[j].titleString =
                            //     strFirstStation.split(',')[1] +
                            //     " " +
                            //     gridOptionsData[j].SourceName +
                            //     ", " +
                            //     strConnectionName +
                            //     " " +
                            //     gridOptionsData[j].Transitions[0].ConnectionPointDescription +
                            //     ", " +
                            //     strPrice +
                            //     " " +
                            //     gridOptionsData[j].Price +
                            //     ", " +
                            //     strTravelTime +
                            //     " " +
                            //     gridOptionsData[j].TripTime +
                            //    " " +
                            //    strHours +
                            //     ", " +
                            //     strDistanceOf +
                            //     " " +
                            //    gridOptionsData[j].Distance +
                            //    " " +
                            //    strKm;

                        }
                    }
                    else gridOptionsheaderElem = "_NoTwoBusRoutesFound_";

                    pathplanGridInsert(1, gridOptionsData, gridOptionsColumnDefs, gridOptionsheaderElem);

                    markFirstLineInPane();
                    if (gridOptionsData.length > 0)
                        deferredGetPathPlanWithOneConnection.resolve("success");
                    else
                        deferredGetPathPlanWithOneConnection.reject("fail");
                });

            searchService.getPathPlanWithTwoConnections(
                $scope.search.currentDate.ID,
                //cope.search.currentDate != null ? $scope.search.currentDate.NAME.split('-')[0].trim() : "",
                $scope.search.fromAddress.Quarter.ID,
                $scope.search.toAddress.Quarter.ID,
                $scope.search.currentTime.ID != null ? $scope.search.currentTime.ID : "-1",
                $scope.search.language,
                $scope.search.isEggedDb,
                function (data) {
                    var gridOptionsData = data;
                    var gridOptionsColumnDefs;
                    var gridOptionsheaderElem;
                    if (gridOptionsData.length > 0) {
                        gridOptionsheaderElem = "_Solution2_";
                        var gridOptionsColumnDefs = initTwoConnectionColumnDefs();

                        for (var j = 0; j < gridOptionsData.length ; j++) {

                            gridOptionsData[j].TripTime = globalFunctions.convertMinutesTohours(gridOptionsData[j].TripTime);
                            gridOptionsData[j].SourceName = ($scope.fixedFromQuarter.indexOf($scope.search.fromAddress.City.NAME) > -1) ? $scope.fixedFromQuarter : $scope.search.fromAddress.City.NAME + " " + $scope.fixedFromQuarter;
                            gridOptionsData[j].DestinationName = ($scope.fixedToQuarter.indexOf($scope.search.toAddress.City.NAME) > -1) ? $scope.fixedToQuarter : $scope.search.toAddress.City.NAME + " " + $scope.fixedToQuarter;
                            //gridOptionsData[j].SourceName = $scope.search.fromAddress.City.NAME + " " + $scope.fixedFromQuarter;
                            //gridOptionsData[j].DestinationName = $scope.search.toAddress.City.NAME + " " + $scope.fixedToQuarter;

                            //gridOptionsData[j].titleString =
                            // strFirstStation.split(',')[1] +
                            // " " +
                            // gridOptionsData[j].SourceName +
                            // ", " +
                            // strFirstConnectionName +
                            // " " +
                            // gridOptionsData[j].Transitions[0].ConnectionPointDescription +
                            // ", " +
                            // strSecondConnectionName +
                            // " " +
                            // gridOptionsData[j].Transitions[1].ConnectionPointDescription +
                            // ", " +
                            // strPrice +
                            // " " +
                            // gridOptionsData[j].Price +
                            // ", " +
                            // strTravelTime +
                            // " " +
                            // gridOptionsData[j].TripTime +
                            // " " +
                            // strHours +
                            // ", " +
                            // strDistanceOf +
                            // " " +
                            // gridOptionsData[j].Distance +
                            // " " +
                            // strKm;

                        }
                    }
                    else gridOptionsheaderElem = "_NoThreeBusRoutesFound_";

                    pathplanGridInsert(2, gridOptionsData, gridOptionsColumnDefs, gridOptionsheaderElem);
                    setPathplanValues();
                    markFirstLineInPane();
                    if (gridOptionsData.length > 0)
                        deferredGetPathPlanWithTwoConnections.resolve("success");
                    else
                        deferredGetPathPlanWithTwoConnections.reject("fail");
                });

            $q.all(dataInitialized).then(function (value) {

                //debugger;

            },
            function (value) {

                getActiveDatesHTML(function (sHTML) {
                    if (sHTML != "") {
                        $scope.search.userMessage = sHTML;
                    }
                    else {
                        if ($rootScope.isBezeqOnline == true)
                            $scope.search.userMessage = "_umNoSeviceToCityParam1_" + "|" + $scope.search.fromAddress.City.NAME + "|";
                        else
                            $scope.search.userMessage = "_umNoEggedSeviceToCityParam1_" + "|" + $scope.search.fromAddress.City.NAME + "|";
                    }
                });

            });


        }

        function getActiveDatesHTML(successCallback) {

            $scope.search.searchCityId = $scope.search.fromAddress.City.ID;
            searchService.GetActiveDateList(
                $rootScope.search.searchCityId,
                $rootScope.search.language,
                $rootScope.search.isEggedDb,
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
                            sHTML += "</br><a href='#/origindestination/1/0/" +
                            $scope.search.isDirectLine + "/" +
                            $scope.search.fromAddress.City.ID + "-" +
                            $scope.search.fromAddress.City.iid + "/" +
                            $scope.search.fromAddress.Quarter.ID + "/" +
                            $scope.search.toAddress.City.ID + "-" +
                            $scope.search.toAddress.City.iid + "/" +
                            $scope.search.toAddress.Quarter.ID + "/" +
                            (i + 1).toString() + "/0" +
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

        function getLowestAccordionPaneIndex(gridList) {

            for (var i = 0; i < $scope.pathplan.pathPlanGridList.length; i++) {
                if ($scope.pathplan.pathPlanGridList[i].pathplanList.length > 0) {
                    return i;
                }
            }

            return -1;

            ////$scope.search.currentPanelIndex	1	Number
            ////$scope.search.selectedPathPlan	null	Null

            //if ($scope.search.currentPanelIndex != -1 && $scope.search.currentPanelIndex != 3)
            //    return $scope.search.currentPanelIndex;

            //if (userClickedPanelIndex == true) return $scope.search.currentPanelIndex;
            //var lowestIndex = 3;
            //for (var i = 0; i < gridList.length; i++) {
            //    if (gridList[i].pathplanList.length > 0)
            //        if (i <= lowestIndex)
            //            lowestIndex = i;
            //}
            //return lowestIndex;
        }

        //$scope.accordionHeaderClicked = function (paneIndex) {
        //    var currentPaneIndex = parseInt(paneIndex);
        //    if ($scope.search.currentPanelIndex == currentPaneIndex && $scope.pathplan.pathPlanGridList[currentPaneIndex].pathplanList.length > 0) {
        //        $scope.search.currentPanelIndex = -1;
        //        userClickedPanelIndex = false;
        //    }
        //    else {
        //        $scope.search.selectedRadioPathPlan = $scope.search.selectedPathPlan = null;
        //        $scope.search.currentPanelIndex = currentPaneIndex;
        //        userClickedPanelIndex = true;
        //    }
        //    markFirstLineInPane();
        //}

        $scope.orderPathPlanLine = function (lineData) {
            switch ($scope.selectedHeaderName) {
                case 'Price':
                    return lineData.Price;
                    break;
                case 'Distance':
                    return lineData.Distance;
                    break;
                case 'TravelTime':
                    return lineData.TripTime;
                    break;
            }
        }

        $rootScope.$watch("search.currentPanelIndex", function (e) {
            if ($scope.search.currentPanelIndex == -1)
                $scope.search.selectedRadioPathPlan = $scope.search.selectedPathPlan = null;
        });

        $scope.pathplanClicked = function (selectedPathplan) {
            $scope.search.selectedPathPlan = selectedPathplan;
            setPathplanValues();
        }

        $scope.$watch("search.selectedRadioPathPlan", function (newValue, oldValue) {
            if (newValue == null) return;
            //$scope.search.selectedPathPlan = eval("(" + newValue + ")");
            setPathplanValues();
        });

        $scope.pathplan.showSchedule = function (selectedPathPlanLine) {

            //$timeout(function () {
            //$scope.search.selectedRadioPathPlan = selectedPathPlanLine;
            //$timeout(function () {
            $scope.search.selectedPathPlan = selectedPathPlanLine;
            setPathplanValues();
            $rootScope.$broadcast('resultSubViewChanged', { newValue: "transition" });
            //$scope.search.btnNextClicked(e);
            //}, 300);
            //}, 300);
        }

        function setPathplanValues() {

            $scope.search.firstConnection = new codeObject();
            $scope.search.secondConnection = new codeObject();

            if ($scope.search.selectedPathPlan == null) return;

            //$scope.parsedSelectedPathPlan = [];
            //$scope.parsedSelectedPathPlan[$scope.search.currentPanelIndex] = eval("(" + $scope.search.selectedPathPlan + ")");

            for (var i = 0; $scope.pathplan.pathPlanGridList[$scope.search.currentPanelIndex].pathplanList != null && i < $scope.pathplan.pathPlanGridList[$scope.search.currentPanelIndex].pathplanList.length; i++) {
                if ($scope.pathplan.pathPlanGridList[$scope.search.currentPanelIndex].pathplanList[i].ID == $scope.search.selectedPathPlan.ID) {
                    $scope.search.selectedPathPlan = $scope.pathplan.pathPlanGridList[$scope.search.currentPanelIndex].pathplanList[i];

                    //$scope.search.fromAddress.Quarter.NAME = $scope.search.selectedPathPlan.SourceName;
                    //$scope.search.toAddress.Quarter.NAME = $scope.search.selectedPathPlan.DestinationName;
                    for (var j = 0; j < $scope.pathplan.pathPlanGridList[0].pathplanList.length; j++) {
                        if ($scope.pathplan.pathPlanGridList[0].pathplanList[j].SourceName == $scope.search.selectedPathPlan.SourceName)
                            $scope.search.fromAddress.Quarter.ID = $scope.pathplan.pathPlanGridList[0].pathplanList[j].SourceID;
                        if ($scope.pathplan.pathPlanGridList[0].pathplanList[j].DestinationName == $scope.search.selectedPathPlan.DestinationName)
                            $scope.search.toAddress.Quarter.ID = $scope.pathplan.pathPlanGridList[0].pathplanList[j].DestinationID;
                    }

                    //if ($scope.search.selectedPathPlan.SourceID != null) {
                    //    //$scope.search.fromAddress.Quarter.ID = $scope.search.selectedPathPlan.SourceID;
                    //    //$scope.search.fromAddress.Quarter.NAME = $scope.search.selectedPathPlan.SourceName;
                    //    $scope.search.fromAddress.Quarter = { ID: $scope.search.selectedPathPlan.SourceID, NAME: $scope.search.selectedPathPlan.SourceName };
                    //}
                    //if ($scope.search.selectedPathPlan.DestinationID != null) {
                    //    //$scope.search.toAddress.Quarter.ID = $scope.search.selectedPathPlan.DestinationID;
                    //    //$scope.search.toAddress.Quarter.NAME = $scope.search.selectedPathPlan.DestinationName;
                    //    $scope.search.toAddress.Quarter = { ID: $scope.search.selectedPathPlan.DestinationID, NAME: $scope.search.selectedPathPlan.DestinationName };
                    //}
                    //$scope.search.selectedRadioPathPlan = JSON.stringify($scope.search.selectedPathPlan);
                    break;
                }
            }

            if ($scope.search.selectedPathPlan.Transitions != null) {

                //$.each($scope.parsedSelectedPathPlan[$scope.search.currentPanelIndex].Transitions, function (index, value)
                //{
                if ($scope.search.selectedPathPlan.Transitions.length > 0) {
                    $scope.search.firstConnection.ID = $scope.search.selectedPathPlan.Transitions[0].ConnectionPointId;
                    $scope.search.firstConnection.NAME = $scope.search.selectedPathPlan.Transitions[0].ConnectionPointDescription;
                }
                if ($scope.search.selectedPathPlan.Transitions.length > 1) {
                    $scope.search.secondConnection.ID = $scope.search.selectedPathPlan.Transitions[1].ConnectionPointId;
                    $scope.search.secondConnection.NAME = $scope.search.selectedPathPlan.Transitions[1].ConnectionPointDescription;
                }
                //});
            }
        }

        $scope.pathplan.showSpecialPriceMessage = function (messageIndex) {

            switch (messageIndex) {
                case 1:
                    $scope.search.userMessage = "_PriceOfTransTicket_";
                    //$scope.search.isShowFilter = true;
                    break;
                case 2:
                    $scope.search.userMessage = "_PriceOfContTicket_";
                    //$scope.search.isShowFilter = true;
                    break;
                case 3:
                    $scope.search.userMessage = "_PriceOfDisplayedOnSummary_";
                    //$scope.search.isShowFilter = true;
                    break;
            }
        }

        $scope.pathPlanGroupKeyPress = function (gridIndex) {

            var currentPaneIndex = parseInt(gridIndex);
            if ($scope.search.currentPanelIndex == currentPaneIndex &&
                $scope.pathplan.pathPlanGridList[currentPaneIndex].pathplanList != null &&
                $scope.pathplan.pathPlanGridList[currentPaneIndex].pathplanList.length > 0) {
                $scope.search.currentPanelIndex = -1;
                userClickedPanelIndex = false;
            }
            else {
                $scope.search.selectedRadioPathPlan = $scope.search.selectedPathPlan = null;
                $scope.search.currentPanelIndex = currentPaneIndex;
                userClickedPanelIndex = true;
            }
            markFirstLineInPane();
        }

        $scope.pathPlanKeyPress = function (params) {
            var splittedParam = params.split(',');
            var tagName = splittedParam[0];
            var keyValue = splittedParam[1];
            var altKey = splittedParam[2];
            var ctrlKey = splittedParam[3];
            var shiftKey = splittedParam[4];
            var gridIndex = splittedParam[5];
            gridIndex = parseInt(gridIndex);

            switch (keyValue) {
                //tab
                case "9":
                    if (shiftKey == "true") {
                        for (var i = 0; i < $scope.pathplan.pathPlanGridList[gridIndex].pathplanList.length; i++) {
                            if ($scope.pathplan.pathPlanGridList[gridIndex].pathplanList[i].ID == $scope.search.selectedPathPlan.ID) {
                                $scope.search.selectedPathPlan = $scope.pathplan.pathPlanGridList[gridIndex].pathplanList[i - 1];
                                //$scope.search.selectedRadioPathPlan = JSON.stringify($scope.search.selectedPathPlan);
                                setPathplanValues();
                                break;
                            }
                        }
                    }
                    else {
                        for (var i = 0; i < $scope.pathplan.pathPlanGridList[gridIndex].pathplanList.length; i++) {
                            if ($scope.pathplan.pathPlanGridList[gridIndex].pathplanList[i].ID == $scope.search.selectedPathPlan.ID) {
                                $scope.search.selectedPathPlan = $scope.pathplan.pathPlanGridList[gridIndex].pathplanList[i + 1];
                                //$scope.search.selectedRadioPathPlan = JSON.stringify($scope.search.selectedPathPlan);
                                setPathplanValues();
                                break;
                            }
                        }
                    }
                    break;
                    //enter
                case "13":
                    $rootScope.isNextButtonFocused = true;
                    break;
                    //down
                case "40":
                    //for (var i = 0; i < $scope.pathplan.pathPlanGridList[gridIndex].pathplanList.length; i++) {
                    //    if ($scope.pathplan.pathPlanGridList[gridIndex].pathplanList[i].ID == $scope.search.selectedPathPlan.ID) {
                    //        $scope.search.selectedPathPlan = $scope.pathplan.pathPlanGridList[gridIndex].pathplanList[i + 1];
                    //        setPathplanValues();
                    //        break;
                    //    }
                    //}
                    break;
                    //up
                case "38":
                    if (ctrlKey == "true") {
                        $scope.search.currentPanelIndex = -1;
                        $scope.$apply();
                        $scope.search.pathplanPanelIndex = $scope.pathplan.pathPlanGridList[gridIndex].PanelIndex;
                        $scope.$apply();
                    }
                    //else {
                    //    for (var i = 0; i < $scope.pathplan.pathPlanGridList[gridIndex].pathplanList.length; i++) {
                    //        if ($scope.pathplan.pathPlanGridList[gridIndex].pathplanList[i].ID == $scope.search.selectedPathPlan.ID) {
                    //            $scope.search.selectedPathPlan = $scope.pathplan.pathPlanGridList[gridIndex].pathplanList[i - 1];
                    //            setPathplanValues();
                    //            break;
                    //        }
                    //    }
                    //}
                    break;
                    //left
                case "37":
                    $scope.search.currentPanelIndex = gridIndex;
                    break;
                    //right
                case "39":
                    $scope.search.currentPanelIndex = -1;
                    $scope.search.pathplanPanelIndex = $scope.pathplan.pathPlanGridList[gridIndex].PanelIndex;
                    break;
            }

        }

        $scope.showPathplanAccessabilityMessage = function () {
            $scope.search.userMessageTitle = "_KeyboardUseInstruction_," + "_TableOf_," + "_TripSolutions_";
            $scope.search.userMessage = "_ScheduleListHelpBulletMessage_";
        }


        //// Get the render context local to this controller (and relevant params).
        //var renderContext = requestContext.getRenderContext("search.bydest.result.path-plan");

        //// The subview indicates which view is going to be rendered on the page.
        //$scope.subview = renderContext.getNextSection();

        //// I handle changes to the request context.
        //$scope.$on(
        //    "requestContextChanged",
        //    function () {

        //        // Make sure this change is relevant to this controller.
        //        if (!renderContext.isChangeRelevant()) return;

        //        // Update the view that is being rendered.
        //        $scope.subview = renderContext.getNextSection();

        //    }
        //);

        function init() {
            $scope.search.SelectedIdList = null;
            initPathPlanGrid();
        }

        //setTimeout(function () {
        init();
        //}, 1000);
    });
