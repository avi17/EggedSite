"use strict";

mslApp.controller("BusStopCtrl",
    function ($rootScope, $timeout, localize, globalFunctions, transitionService) {

        var vm = this;
        $rootScope.isNavigatedFromDetails = true;
        vm.currentFirstAlightId = null;
        vm.isShowingBoarding = true;
        vm.currentPageIndex = 0;
        vm.lastPageIndex = 0;
        vm.pageSize = 6;
        vm.pagedBusStopList = [];

        //vm.tableHeight = "200px";
        //if ($rootScope.isBezeqOnline == true)
        //vm.tableHeight = "360px";

        $rootScope.busstopListTransition = [];

        $rootScope.$watch("busstopList", function (newVal, oldVal) {
            $rootScope.busstopListTransition = newVal;
            $timeout(function () {
                if ($(".busStopListView").find(".TableLine")[0] != null)
                    var LineHeight = $(".busStopListView").find(".TableLine")[0].clientHeight;
                var endTime;
                var startTime;
                for (var i = 0; i < $rootScope.busstopListTransition.length; i++) {
                    $rootScope.busstopListTransition[i].minuteFromStart = $rootScope.busstopListTransition[i].TimeFromOrigin;
                    if ($rootScope.isBezeqOnline) {
                        startTime = parseInt($rootScope.busstopListTransition[i].TimeFromOrigin / 60);
                        if (startTime > 0) {
                            $rootScope.busstopListTransition[i].hourFromStart = startTime;
                            $rootScope.busstopListTransition[i].minuteFromStart = $rootScope.busstopListTransition[i].minuteFromStart - (60 * startTime);
                        }
                        else $rootScope.busstopListTransition[i].hourFromStart = 0;

                    }
                    else {
                        endTime = parseInt($rootScope.busstopListTransition[i].ArrivalTime.replace(":", ""));
                        startTime = parseInt($rootScope.busstopListTransition[0].ArrivalTime.replace(":", ""));
                        if (parseInt($rootScope.busstopListTransition[i].ArrivalTime.split(":")[0]) < 6 && startTime > 1000) endTime += 2400;
                        var timeFormStart = endTime - startTime;
                        if (timeFormStart > 99)
                            $rootScope.busstopListTransition[i].hourFromStart = parseInt(timeFormStart / 100);
                        else $rootScope.busstopListTransition[i].hourFromStart = 0;
                        timeFormStart = null;
                    }
                    if ($rootScope.busstopListTransition[i].BoardingAlighting == strBoarding) {
                        $(".busStopListView").find(".TableLines").scrollTop(i * LineHeight);
                    }
                }
                endTime = null;
                startTime = null;
            }, 500);
            init();
        });

        vm.pageList = function () {

            vm.lastPageIndex = $rootScope.busstopListTransition.length / vm.pageSize;
            if ($rootScope.busstopListTransition.length % vm.pageSize > 0)
                vm.lastPageIndex = parseInt(vm.lastPageIndex) + 1;
            else
                vm.lastPageIndex = parseInt(vm.lastPageIndex);

            var pageList = [];

            for (var i = 0; i < vm.lastPageIndex; i++) {
                pageList.push(i + 1);
            }

            return pageList;
        }
        vm.setFirstPage = function () {
            if (vm.currentPageIndex == 1) return;
            vm.setPageIndex(1);
        }
        vm.setPrevPage = function () {
            if (vm.currentPageIndex == 1) return;
            vm.setPageIndex(vm.currentPageIndex - 1);
        }
        vm.setPageIndex = function (pageIndex) {
            vm.currentPageIndex = pageIndex;
            if ($rootScope.busstopListTransition.length <= vm.pageSize)
                vm.pagedBusStopList = $rootScope.busstopListTransition;
            else
                vm.pagedBusStopList = $rootScope.busstopListTransition.slice((vm.currentPageIndex - 1) * vm.pageSize, vm.currentPageIndex * vm.pageSize);

            vm.isShowFirstAlightStop = false;
            vm.isShowEstimatedDepartureTimeMessage = false;
            vm.isShowRefreshmentStation = false;

            $timeout(function () {
                for (var i = 0 ; i < vm.pagedBusStopList.length; i++) {

                    if (vm.pagedBusStopList[i].BoardingAlighting == "תחנת ירידה ראשונה" || vm.pagedBusStopList[i].BoardingAlighting == "First Alighting")
                        vm.isShowFirstAlightStop = true;

                    if (vm.pagedBusStopList[i].BusStopType != 'אסוף בלבד'
                        && vm.pagedBusStopList[i].BusStopType != 'Boarding Only'
                        && vm.currentFirstAlightId
                        && vm.pagedBusStopList[i].Id > $rootScope.search.busStationArrangementD
                        && vm.pagedBusStopList[i].Id < vm.currentFirstAlightId)
                        vm.isShowRefreshmentStation = true;

                    if (vm.pagedBusStopList[i].MazanToMoza != "0") {
                        //		            vm.pagedBusStopList [i].isShowStarImg = true;
                        vm.isShowEstimatedDepartureTimeMessage = true;
                    }
                }
            }, 50);
        }
        vm.setNextPage = function () {
            if (vm.currentPageIndex == vm.lastPageIndex) return;
            vm.setPageIndex(vm.currentPageIndex + 1);
        }
        vm.setLastPage = function () {
            if (vm.currentPageIndex == vm.lastPageIndex) return;
            vm.setPageIndex(vm.lastPageIndex);
        }

        var strBoarding = localize.getLocalizedString("_Boarding_");
        var strAlighting = localize.getLocalizedString("_Alighting_");
        //var strRefreshmentStation = localize.getLocalizedString("_RefreshmentStation_");

        vm.showBusstopOnMap = function (selectedBusStop) {
            $rootScope.toggleMap(true);
            $rootScope.search.isShowAllTransitions = false;
            $timeout(function () {
                $rootScope.search.selectedBusStop = selectedBusStop;
                $rootScope.showBusstopDataPane();
                $rootScope.search.map.setZoom(15);
            }, 1000);
        }

        vm.routeTo = function (route) {
            vm.resultViewName = route;
        }

        vm.toggleBoardingAlighting = function () {
            vm.isShowingBoarding = !vm.isShowingBoarding;

            var LineHeight = $(".busStopListView").find(".TableLine")[0].clientHeight;
            if (vm.isShowingBoarding == true) {

                for (var i = 0; i < $rootScope.busstopListTransition.length; i++) {
                    if ($rootScope.busstopListTransition[i].BoardingAlighting == strBoarding) {
                        $(".busStopListView").find(".TableLines").scrollTop(i * LineHeight);
                    }
                }

            } else {

                for (var i = 0; i < $rootScope.busstopListTransition.length; i++) {
                    if ($rootScope.busstopListTransition[i].BoardingAlighting == strAlighting) {
                        $(".busStopListView").find(".TableLines").scrollTop(i * LineHeight);
                    }
                }

            }
            //vm.$apply();

        }

        if ($rootScope.search.selectedScheduleLine != null && $rootScope.search.selectedScheduleLine.DepartureTime != null)
            vm.DepartureTime = $rootScope.search.selectedScheduleLine.DepartureTime;
        else
            vm.DepartureTime = $rootScope.search.originTime.split(" ")[1];

        function init() {
            if ($rootScope.busstopListTransition[$rootScope.search.busStationArrangementD - 1] != null &&
                $rootScope.busstopListTransition[$rootScope.search.busStationArrangementD - 1].FirstAlightId != null) {
                if ($rootScope.isBezeqOnline != true)
                    vm.currentFirstAlightId = $rootScope.busstopListTransition[$rootScope.search.busStationArrangementD - 1].FirstAlightId;
                else {
                    if ($rootScope.busstopListTransition[$rootScope.search.busStationArrangementD - 1].BoardingAlighting == "עליה"
                        || $rootScope.busstopListTransition[$rootScope.search.busStationArrangementD - 1].BoardingAlighting == "Boarding") vm.currentFirstAlightId = 12;
                }
            }
            vm.isShowFirstAlightStop = false;
            vm.isShowEstimatedDepartureTimeMessage = false;
            vm.isShowRefreshmentStation = false;

            if ($rootScope.busstopListTransition.length == 0 && $rootScope.prevSubView != null) {
                vm.resultViewName = null;
                vm.resultViewName = "date-list";
                $rootScope.search.userMessage = "_NoBusStops_";
                $rootScope.prevSubView = "bus-stop";
            }

            $timeout(function () {
                for (var i = 0 ; i < $rootScope.busstopListTransition.length; i++) {

                    if ($rootScope.busstopListTransition[i].BoardingAlighting == "תחנת ירידה ראשונה" || $rootScope.busstopListTransition[i].BoardingAlighting == "First Alighting")
                        vm.isShowFirstAlightStop = true;

                    if ($rootScope.busstopListTransition[i].BusStopType != 'אסוף בלבד'
                                && $rootScope.busstopListTransition[i].BusStopType != 'Boarding Only'
                        && vm.currentFirstAlightId
                        && $rootScope.busstopListTransition[i].Id > $rootScope.search.busStationArrangementD
                        && $rootScope.busstopListTransition[i].Id < vm.currentFirstAlightId)
                        vm.isShowRefreshmentStation = true;

                    if ($rootScope.busstopListTransition[i].MazanToMoza != "0") {
                        //		            $rootScope.busstopListTransition [i].isShowStarImg = true;
                        vm.isShowEstimatedDepartureTimeMessage = true;
                    }
                }
            }, 50);

        }

        function cleanPrintCss() {
            if (navigator.userAgent.indexOf('Chrome') != -1) {
                $(".TableHeaders tr th").css("padding", "")
                                       .css("font-weight", "")
                                       .css("font-size", "")
                                          .css("text-align", "");
                $(".TableHeaders tr th:last").css("display", "")
            }
            $(".busStopListView table tr td").css("font-size", "")
                                            .css("border", "")
                                            .css("padding", "")
                                            .css("font-weight", "")
                                            .css("text-align", "")
            $(".busStopListView table tr:even").css("background-color", "")
            $(".busStopListView table tr:odd").css("background-color", "")
            $(".TableLines").css("height", "200px");

        }

        function initMailAndPrintContent() {
            $(".TableLines").css("height", "");
            if (navigator.userAgent.indexOf('Chrome') != -1) {
                $(".TableHeaders tr th").css("padding", "8px")
                                       .css("font-weight", "bold")
                                       .css("font-size", "12px")
                                          .css("text-align", "center");
                $(".TableHeaders tr th:last").css("display", "none")
            }
            $(".busStopListView table tr td").css("font-size", "12px")
                                                        .css("border", "1px solid black")
                                                        .css("padding", "5px")
                                                        .css("font-weight", "bold")
                                                        .css("text-align", "center");
            $(".busStopListView table tr:even").css("background-color", "white");
            $(".busStopListView table tr:odd").css("background-color", "lightgray");

            var printAndMailContent =
                               '<div class="container" style="width:1000px;">' +
                                '<img src="Content/images/headermenu/logo_egged.png" class="siteLogoImage" style="line-height: 185px; font-weight: bolder;" data-ng-class="{true: FloatRight, false: FloatLeft}[dir]"></div>'
                               + '<br /> '
                               + '<div style="font-size:20px;">' + $rootScope.search.currentDate.NAME + '</div><br />'
                               + $(".busStopListView").html() +
                                "<br /></div>";
            return printAndMailContent;
        }

        function getHtmlStopTable() {

            var retval = "";
            var strNum = localize.getLocalizedString("_Num_");
            var strCityPlace = localize.getLocalizedString("_CityPlace_");
            var stationName = localize.getLocalizedString("_StationName_");
            var strstationNumber = localize.getLocalizedString("_StationNumber_");
            var strType = localize.getLocalizedString("_Type_");
            var strArrival = localize.getLocalizedString("_Arrival_");
            var strDistance = localize.getLocalizedString("_Distance_");
            var strPlatfom = localize.getLocalizedString("_Platform_");
            var strUp = localize.getLocalizedString("_BoardingAlightingUp_");
            var strDown = localize.getLocalizedString("_BoardingAlightingDown_");
            var strStationsInLine = localize.getLocalizedString("_StationsInLine_");
            var strOnTime = localize.getLocalizedString("_OnTime_");
            var strFromSingleLetter = localize.getLocalizedString("_From_");
            var strToSingleLetter = localize.getLocalizedString("_To_");
            var origin = localize.getLocalizedString("_origin_");
            var destination = localize.getLocalizedString("_destination_");
            var dierction;
            if (localize.language == "he-IL") dierction = "rtl";
            else dierction = "ltr";
            retval += "<table style='direction:" + dierction + ";'><thead>" +
            "<tr>" +
            "<th colspan='10'><div style='font-weight: bold;width:100%'>" +
           "" + origin + ": "
            + $rootScope.search.fromAddress.City.NAME + " " +
            $rootScope.search.fromAddress.Quarter.NAME +
            "  " + destination + ": "
            + $rootScope.search.toAddress.City.NAME + " "
            + $rootScope.search.toAddress.Quarter.NAME +
            "</div>" +
            "</th>" +
            "</tr>" +
            "<tr>" +
            "<th colspan='10'>" +
            "<div style='font-weight: bold;width:100%'>" +
            strStationsInLine +
            $rootScope.selectedLine.NAME +
            " " + strOnTime + " " +
            $rootScope.busstopListTransition[$rootScope.search.busStationArrangementD - 1].ArrivalTime +
            "</div>" +
            "</th>" +
            "</tr>" +
           '<tr style="width:100%;background-color:darkgreen;color:white;font-family:arial;border:1px solid black;text-align:center">' +
            "<th style='width: 0.05%;'>" + strNum + "</th>" +
            "<th style='width: 19%;'>" + strCityPlace + "</th>" +
            "<th style='width: 19%;'>" + stationName + "</th>" +
            "<th style='width: 9%;'>" + strstationNumber + "</th>" +
            "<th style='width: 19%;'>" + strType + "</th>" +
            "<th style='width: 7%;'>" + strArrival + "</th>" +
            "<th style='width: 1%;'>" + strDistance + "</th>" +
            "<th style='width: 6%'>" + strPlatfom + "</th>" +
            "<th style='width: 9%;'>" + strDown + "</th>" +
            "</tr>" +
            "</thead><tbody>";
            for (var i = 0; i < $rootScope.busstopListTransition.length; i++) {
                var color;
                if (i % 2 == 0) color = "lightgray";
                else color = "white";
                retval += '<tr style="width:100%;background-color:' + color + ';text-align:center;">' +
                "<th style='width: 0.05%;border:1px solid black;padding:2px;'>" + $rootScope.busstopListTransition[i].Id + "</td>" +
                "<th style='width: 19%;font-weight: normal;border:1px solid black;padding:2px;'>" + $rootScope.busstopListTransition[i].PlaceDescription + "</td>" +
                "<th style='width: 9%;font-weight: normal;border:1px solid black;padding:2px;'>" + $rootScope.busstopListTransition[i].Name + "</td>" +
                "<td style='width: 19%;border:1px solid black;padding:2px'>" + $rootScope.busstopListTransition[i].Makat + "</td>" +
                "<td style='width: 9%;border:1px solid black;padding:2px'>" + $rootScope.busstopListTransition[i].BusStopType + "</td>" +
                "<td style='width: 7%;border:1px solid black;padding:2px'>" + $rootScope.busstopListTransition[i].ArrivalTime + "</td>" +
                "<td style='width: 1%;border:1px solid black;padding:2px'>" + $rootScope.busstopListTransition[i].Distance + "</td>" +
                "<td style='width: 6%;border:1px solid black;padding:2px'>" + $rootScope.busstopListTransition[i].PlatformId + "</td>" +
                "<td style='width: 9%;border:1px solid black;padding:2px'>" + $rootScope.busstopListTransition[i].BoardingAlighting + "</td>" +
            "</tr>"
            }
            retval += "</tbody>" +
            "</table>" +
            "<div  style='direction:" + dierction + ";'>" +
             $(".HighlightedTextRedNotice").html() +
            "</div>";
            return retval;
        }

        vm.sendMail = function () {
            var strPleaseProvideMailAddress = localize.getLocalizedString("_PleaseProvideMailAddress_");
            var address = "";
            if ($rootScope.userDetails != null && $rootScope.userDetails.emailAddress != null)
                address = $rootScope.userDetails.emailAddress;
            var destinationMailAddress = prompt(strPleaseProvideMailAddress, address);
            debugger;
            if (destinationMailAddress == null) return;
            if (destinationMailAddress.indexOf('@') > -1) {


                $rootScope.userDetails.emailAddress = destinationMailAddress
                if ($rootScope.isStorageActive)
                    localStorage.setItem("emailAddress", $rootScope.userDetails.emailAddress);
                var strEggedSite = localize.getLocalizedString("_Title_");
                var strWeeklySchedule = localize.getLocalizedString("_WeeklySchedule_");
                var bodyContent = getHtmlStopTable();

                var printObject =
                {
                    ToAddress: destinationMailAddress
                    , ToName: ""
                    , Subject: strEggedSite //+ " - " + strWeeklySchedule //+ " - " + weeklyReportData.Shilut + "מ:" + weeklyReportData.DestinationName + " ל:" + weeklyReportData.OriginName
                    , Body: bodyContent
                };
                var jsonString = JSON.stringify(printObject);
                transitionService.sendMail(jsonString,
                    function (data) {
                        $rootScope.search.userMessageTitle = "_SendByEmail_";
                        $rootScope.search.userMessage = "_MessageSuccessfullySent_";
                    },
                    function (result) {
                        $rootScope.search.userMessageTitle = "_SendByEmail_";
                        $rootScope.search.userMessage = "_MessageSendFailed_";
                    });
                cleanPrintCss();
            }
            else {
                $rootScope.search.userMessageTitle = "_SendByEmail_";
                $rootScope.search.userMessage = "_IlegalMailAddress_";
            }
        }

        vm.print = function () {
            if (navigator.userAgent.indexOf('Firefox') != -1) alert("שים לב! תוכן רחב, מומלץ להדפיס לרוחב.");
            var printContent = initMailAndPrintContent();
            globalFunctions.printHtml(printContent);
            cleanPrintCss();
        }

    }
);

