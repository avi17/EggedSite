"use strict";

mslApp.controller(
    "DirectLinesCtrl",
    function ($rootScope, $scope, searchService, globalFunctions) {


        $scope.currentPageIndex = 0;
        $scope.lastPageIndex = 0;
        $scope.pageSize = 6;
        $scope.pageddirectLinesList = [];

        //$rootScope.selectEggedHesseimBanner($rootScope.search.selectedToAddress.City.ID);

        $scope.pageList = function () {

            if ($scope.directLinesList == null) return;
            $scope.pageddirectLinesList = $scope.directLinesList.slice($scope.currentPageIndex * $scope.pageSize, ($scope.currentPageIndex + 1) * $scope.pageSize);

            $scope.lastPageIndex = $scope.directLinesList.length / $scope.pageSize;
            if ($scope.directLinesList.length % $scope.pageSize > 0)
                $scope.lastPageIndex = parseInt($scope.lastPageIndex) + 1;
            else
                $scope.lastPageIndex = parseInt($scope.lastPageIndex);

            var pageList = [];

            for (var i = 0; i < $scope.lastPageIndex; i++) {
                pageList.push(i + 1);
            }

            return pageList;
        }

        $scope.setFirstPage = function () {
            if ($scope.currentPageIndex == 0) return;
            $scope.setPageIndex(0);
        }

        $scope.setPrevPage = function () {
            if ($scope.currentPageIndex == 0) return;
            $scope.setPageIndex($scope.currentPageIndex - 1);
        }

        $scope.setPageIndex = function (pageIndex) {
            $scope.currentPageIndex = pageIndex;
            $scope.pageddirectLinesList = $scope.directLinesList.slice(($scope.currentPageIndex - 1) * $scope.pageSize, $scope.currentPageIndex * $scope.pageSize);
        }

        $scope.setNextPage = function () {
            if ($scope.currentPageIndex == $scope.lastPageIndex - 1) return;
            $scope.setPageIndex($scope.currentPageIndex + 1);
        }

        $scope.setLastPage = function () {
            if ($scope.currentPageIndex == $scope.lastPageIndex - 1) return;
            $scope.setPageIndex($scope.lastPageIndex - 1);
        }

        $scope.$watch("directLinesList", function (newVal, oldVal) {
            if (newVal == null || newVal == "") return;

            $scope.pageddirectLinesList = newVal.slice($scope.currentPageIndex * $scope.pageSize, ($scope.currentPageIndex + 1) * $scope.pageSize);

        });

        $scope.showDirectLinesAccessabilityMessage = function () {
            $scope.search.userMessageTitle = "_KeyboardUseInstruction_," + "_TableOf_," + "_LinesBetweenCities_";
            $scope.search.userMessage = "_ScheduleListHelpBulletMessage_";
        }


        // --- Define Scope Methods. ------------------------ //


        $rootScope.$watch("search.selectedDirectLine", function (newValue, oldValue) {
            $scope.parsedSelectedDirectLine = eval("(" + newValue + ")");
        });

        function init() {

            $scope.parsedSelectedDirectLine = null;
            $rootScope.search.selectedPathPlan = null;
            $rootScope.search.selectedDirectLine = null;
            $rootScope.selectedLineList = [];
            if ($rootScope.search.fromAddress.City.ID != null &&
                $rootScope.search.toAddress.City.ID != null &&
                $rootScope.search.fromAddress.City.ID == $rootScope.search.toAddress.City.ID) {
                $rootScope.search.userMessageTitle = "_SearchBy_" + "," + "_bydest_";
                $rootScope.search.userMessage = "_CitiesAreEqual_";
                $scope.resultViewName = "";
                return;
            }
            var directLinesList;
            searchService.getDirectLines(
                $rootScope.search.currentDate.ID,
                $rootScope.search.fromAddress.City.ID,
                $rootScope.search.toAddress.City.ID,
                $rootScope.search.language,
                $rootScope.search.isEggedDb,
                function (directlinesListval) {
                    debugger;
                    directLinesList = directlinesListval;


                    if ($rootScope.search.fromAddress.City.NAME)
                        $scope.fromCity = $rootScope.search.fromAddress.City.NAME.replace("&apos;", "'");
                    if ($rootScope.search.toAddress.City.NAME)
                        $scope.toCity = $rootScope.search.toAddress.City.NAME.replace("&apos;", "'");


                    if (directLinesList.length == 0) {
                        $rootScope.search.userMessageTitle = "_SearchBy_" + "," + "_bydest_";
                        $rootScope.search.userMessage = "_NoDirectRoutesFound_";
                        $rootScope.isShowFilter = true;
                        $rootScope.$broadcast('resultSubViewChanged', { newValue: "" });
                        return;
                    }

                    for (var i = 0; i < directLinesList.length; i++) {
                        directLinesList[i].Id = i;
                        //if (directLinesList[i].LineName == "-1")
                        //    directLinesList[i].LineName = "רכבת";
                        directLinesList[i].KM = globalFunctions.roundTwoDigits(directLinesList[i].KM);
                        directLinesList[i].TripTime = globalFunctions.convertMinutesTohours(directLinesList[i].TripTime);
                    }

                    $scope.parsedSelectedDirectLine = directLinesList[0];
                    $scope.directLinesList = directLinesList;

                    $rootScope.search.selectedDirectLine = JSON.stringify($scope.directLinesList[0]);

                    //var path = "/search/bydest/result/direct-lines/";
                    //path = initSearchObject.initDirectLinesUrlParams($rootScope.search, path);
                    //$rootScope.isUrlChangedInCode = 2;

                });
        }

        init();

    }
);

