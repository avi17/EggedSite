mslApp.directive('mapTransition', function ($timeout, $rootScope, $filter, searchService, transitionService, localize, infoBoxlist, googleMapsUtil) {
    return {
        templateUrl: '/app/views/directive/mapTransition.htm',
        link: function (scope, element, attrs) {
            //if ($rootScope.isGoogleReachable == false) return;
            var currentBusStopList;
            var transitionShilutScheduleList = [];
            scope.transitionShilutScheduleList = [];
            var strBoarding = localize.getLocalizedString("_Boarding_");
            var strAlighting = localize.getLocalizedString("_Alighting_");
            scope.isLinesInStationTableVisible = false;

            //scope.selectedSectionId = 0;
            scope.selectedSolutionMakat = 0;
            scope.isMouseOverTransitionSection = true;

            scope.showAllShilutSchedule = function () {
                scope.showLineBusstops(-1);
                loadBusstopLists();
            }

            scope.selectShilutSchedule = function (shilutScheduleIndex) {

                scope.showLineBusstops(shilutScheduleIndex);
                getServiceBusstopList(scope.selectedTransitionShilutSchedule.shilutScheduleList[shilutScheduleIndex], function (busstopList) {
                    $rootScope.search.currentBusStopList = [[], [], []];
                    $rootScope.search.currentBusStopList[shilutScheduleIndex] = busstopList;
                });

            }

            scope.selectSolution = function (solutionIndex) {
                //$rootScope.selectedLineIndex = -1;
                //scope.selectedSectionId = sectionId;
                //parseInt(scope.transitionShilutScheduleList[0].Shilut)
                scope.selectedTransitionShilutSchedule = scope.transitionShilutScheduleList[0];
                $rootScope.search.selectedScheduleLine = scope.transitionShilutScheduleList[0].shilutScheduleList[solutionIndex];
                scope.selectedSolutionMakat = $rootScope.search.selectedScheduleLine.Shilut;
                //$rootScope.search.selectedScheduleLine = $rootScope.selectedLineList[sectionId];
                $rootScope.search.isShowAllBusstops = true;
                $rootScope.search.isShowAllTransitions = true;


                for (var j = 0; j < scope.transitionShilutScheduleList[0].busstopList.length; j++)
                    for (var i = 0; i < scope.transitionShilutScheduleList[0].busstopList[j].length; i++) {
                        if (scope.transitionShilutScheduleList[0].busstopList[j][i].BoardingAlighting == strBoarding) {
                            scope.transitionShilutScheduleList[0].shilutScheduleList[j].boardingBusstop = scope.transitionShilutScheduleList[0].busstopList[j][i];

                            getRealtimeToStop(i, j, solutionIndex,
                                function (retval) {
                                    //scope.transitionShilutScheduleList[0].shilutScheduleList[j].MinutesToArrival = retval;
                                    //scope.$apply();
                                });

                        }

                        if (scope.transitionShilutScheduleList[0].busstopList[j][i].BoardingAlighting == strAlighting)
                            scope.transitionShilutScheduleList[0].shilutScheduleList[j].alightingBusstop = scope.transitionShilutScheduleList[0].busstopList[j][i];
                    }


                setTimeout(function () {
                    $rootScope.showTripSegments();
                }, 1500);
            }

            scope.showLineSchedule = function () {
                $rootScope.$broadcast('resultSubViewChanged', { newValue: "transition" });
                $rootScope.toggleMap(false);
                //$rootScope.isMapViewed = false;
            }

            scope.showFirstBusstop = function () {
                var selectedLineIndex = $rootScope.selectedLineIndex;
                if (selectedLineIndex == -1)
                    selectedLineIndex = 0;
                for (var i = 0; i < $rootScope.search.currentBusStopList[selectedLineIndex].length; i++) {
                    if ($rootScope.search.currentBusStopList[selectedLineIndex][i].BoardingAlighting == "עליה")
                        $rootScope.search.selectedBusStop = $rootScope.search.currentBusStopList[selectedLineIndex][i];
                }
            }

            scope.showPrevBusstop = function () {
                for (var j = 0; j < $rootScope.search.currentBusStopList.length; j++) {
                    for (var i = 0; i < $rootScope.search.currentBusStopList[j].length; i++) {
                        if ($rootScope.search.currentBusStopList[j][i].Makat == $rootScope.search.selectedBusStop.Makat) {
                            if (j == 0 && i == 0) return;

                            if ($rootScope.search.currentBusStopList[j][i].BoardingAlighting == "עליה") {
                                j--;
                                if (j >= 0)
                                    for (var i = 0; i < $rootScope.search.currentBusStopList[j].length; i++) {
                                        if ($rootScope.search.currentBusStopList[j][i].BoardingAlighting == "ירידה") {
                                            $rootScope.search.selectedBusStop = $rootScope.search.currentBusStopList[j][i];
                                            return;
                                        }
                                    }
                            }

                            if (j > 0 && i > $rootScope.search.currentBusStopList[j].length - 1) {
                                $rootScope.search.selectedBusStop = $rootScope.search.currentBusStopList[j - 1][$rootScope.search.currentBusStopList[j - 1].length - 1];
                            }
                            else {
                                $rootScope.search.selectedBusStop = $rootScope.search.currentBusStopList[j][i - 1];
                            }
                            return;
                        }
                    }
                }
            }

            scope.showNextBusstop = function () {
                for (var j = 0; j < $rootScope.search.currentBusStopList.length; j++) {
                    for (var i = 0; i < $rootScope.search.currentBusStopList[j].length; i++) {
                        if ($rootScope.search.currentBusStopList[j][i].Makat == $rootScope.search.selectedBusStop.Makat) {
                            if (j == $rootScope.search.currentBusStopList.length - 1 && i == $rootScope.search.currentBusStopList[j].length - 1) return;

                            if ($rootScope.search.currentBusStopList[j][i].BoardingAlighting == "ירידה") {
                                j++;
                                if (j < $rootScope.search.currentBusStopList.length)
                                    for (var i = 0; i < $rootScope.search.currentBusStopList[j].length; i++) {
                                        if ($rootScope.search.currentBusStopList[j][i].BoardingAlighting == "עליה") {
                                            $rootScope.search.selectedBusStop = $rootScope.search.currentBusStopList[j][i];
                                            return;
                                        }
                                    }
                            }

                            if (j < $rootScope.search.currentBusStopList.length - 1 && i == $rootScope.search.currentBusStopList[j].length - 1) {
                                $rootScope.search.selectedBusStop = $rootScope.search.currentBusStopList[j + 1][$rootScope.search.currentBusStopList[j + 1].length];
                            }
                            else {
                                $rootScope.search.selectedBusStop = $rootScope.search.currentBusStopList[j][i + 1];
                            }
                            return;
                        }
                    }
                }
            }

            scope.showLastBusstop = function () {
                var selectedLineIndex = $rootScope.search.currentBusStopList.length;
                for (var i = 0; i < $rootScope.search.currentBusStopList[selectedLineIndex - 1].length; i++) {
                    if ($rootScope.search.currentBusStopList[selectedLineIndex - 1][i].BoardingAlighting == "ירידה")
                        $rootScope.search.selectedBusStop = $rootScope.search.currentBusStopList[selectedLineIndex - 1][i];
                }
            }

            function getRealtimeToStop(i, j, solutionIndex, successCallback) {
                //if ($rootScope.isMapViewed != true) return;
                if (scope.transitionShilutScheduleList[solutionIndex] == null) return;
                var busstop = scope.transitionShilutScheduleList[solutionIndex].busstopList[j][i];
                var shilut = scope.transitionShilutScheduleList[solutionIndex].shilutScheduleList[j].Shilut;

                setTimeout(function () {
                    $rootScope.search.selectedBusstopId = busstop.Makat;
                    searchService.GetRealtimeBusLineListByBustop(scope.search.selectedBusstopId, scope.search.language, scope.search.isEggedDb,
                        function (RealtimeBusstopLinesInStationList) {
                            for (k = 0; k < RealtimeBusstopLinesInStationList.length; k++) {
                                var str2 = parseInt(RealtimeBusstopLinesInStationList[k].Shilut);
                                var str1 = parseInt(shilut);
                                if (str1 == str2) {
                                    scope.transitionShilutScheduleList[solutionIndex].shilutScheduleList[j].MinutesToArrival = RealtimeBusstopLinesInStationList[k].MinutesToArrival;
                                    //scope.$apply();
                                }
                                //successCallback(RealtimeBusstopLinesInStationList[i].MinutesToArrival);
                            }
                            //scope.$apply();
                        });
                }, 150);
            }

            function getClosestBusstop(busstopList, relationCoord) {

                var closestBusstop = null;
                var closestBusstopDistance = null;

                for (var j = 0 ; j < busstopList.length; j++) {
                    for (var i = 0 ; i < busstopList[j].length; i++) {
                        var coord = new google.maps.LatLng(
                            busstopList[j][i].Latitude,
                            busstopList[j][i].Longitude);
                        var distance = getDistance(coord, relationCoord);
                        if (closestBusstopDistance == null || closestBusstopDistance > distance) {
                            closestBusstop = busstopList[j][i];
                            closestBusstopDistance = distance;
                        }
                    }
                }

                return { busstop: closestBusstop, distance: closestBusstopDistance };
            }

            function getServiceBusstopList(schedule, successCallback) {
                //$rootScope.search.LineNumber = schedule.LineNumber;
                $rootScope.search.makat = schedule.Makat;
                $rootScope.search.chalufa = schedule.Chalufa;
                $rootScope.search.busStationArrangementD = schedule.BusStationArrangementD;
                $rootScope.search.busStationArrangementA = schedule.BusStationArrangementA;
                $rootScope.search.originTime = $filter('date')(new Date(schedule.OriginTime), 'dd/MM/yyyy HH:mm');
                transitionService.getBusStopList($rootScope.search.getJsonString(),
                    function (getBusStopListVal) {
                        successCallback(getBusStopListVal);
                    });
            }

            scope.showLineBusstops = function (lineIndex) {
                $rootScope.selectedLineIndex = lineIndex;
            }

            scope.hideLineBusstops = function () {
                $rootScope.selectedLineIndex = -1;
            }

            $rootScope.$watch("isMapViewed", function (newVal, oldVal) {
                if (newVal == true)
                    loadBusstopLists();
                else
                    $rootScope.selectedLineIndex = -1;

            });

            $rootScope.$watch("gridScheduleList", function (newVal, oldVal) {
                //if (newVal == null || newVal.length == 0 || newVal[0].fullTransitionList == null) {
                //    scope.transitionShilutScheduleList = [];
                //    $rootScope.search.currentBusStopList = null;
                //    setTimeout(function () {
                //        //scope.selectedTransitionShilutSchedule = null;
                //    }, 500);
                //    return;
                //}
                if ($rootScope.isMapViewed == true)
                    //setTimeout(function () {
                    loadBusstopLists();
                //}, 500);
            });

            function loadBusstopLists() {

                if ($rootScope.gridScheduleList == null || $rootScope.gridScheduleList.length == 0)
                    return;

                var startIndex = 0;
                var transitionShilutList = [];
                var busstopList1 = [], busstopList2 = [], busstopList3 = [];

                if ($rootScope.selectedLineList != null && $rootScope.selectedLineList.length > 0)
                    startIndex = $rootScope.selectedLineList[0].Id;
                else
                    startIndex = $rootScope.gridScheduleList[0].fullTransitionList[0].Id;

                transitionShilutScheduleList = [];
                //for (var k = startIndex ; k < $rootScope.gridScheduleList[0].fullTransitionList.length; k++) {
                var busstopListUnion = [];
                var dtMin = new Date();
                //dtMin.setMinutes(dtMin.getMinutes() - 30);
                var dtMax = new Date();
                dtMax.setMinutes(dtMax.getMinutes() + 30);

                var shilutScheduleList = [];


                if ($rootScope.gridScheduleList.length > 0) {
                    shilutScheduleList.push($rootScope.selectedLineList[0]);
                    getServiceBusstopList($rootScope.selectedLineList[0], function (busstopList1) {
                        busstopListUnion[0] = busstopList1;
                    });
                }
                if ($rootScope.gridScheduleList.length > 1) {
                    shilutScheduleList.push($rootScope.selectedLineList[1]);
                    getServiceBusstopList($rootScope.selectedLineList[1], function (busstopList2) {
                        busstopListUnion[1] = busstopList2;
                    });
                }
                if ($rootScope.gridScheduleList.length > 2) {
                    shilutScheduleList.push($rootScope.selectedLineList[2]);
                    getServiceBusstopList($rootScope.selectedLineList[2], function (busstopList3) {
                        busstopListUnion[2] = busstopList3;
                    });
                }

                transitionShilutScheduleList.push({
                    shilutScheduleList: shilutScheduleList,
                    busstopList: busstopListUnion,
                    fromBusstop: (function (busstopUnion1) {
                        //setTimeout(function () {
                        if ($rootScope.search.originMarker != null && $rootScope.search.destinationMarker != null) {
                            return getClosestBusstop(busstopUnion1, $rootScope.search.originMarker.position);
                        }
                        else {
                            for (var i = 0; i < busstopUnion1[0] && busstopUnion1[0].length; i++) {
                                if (busstopUnion1[0][i].BoardingAlighting == strBoarding)
                                    return busstopUnion1[0][i].BoardingAlighting;
                            }
                        }
                        //}, 50);
                    }(busstopList1)),
                    toBusstop: (function (busstopUnion2) {
                        //setTimeout(function () {
                        if ($rootScope.search.originMarker != null && $rootScope.search.destinationMarker != null) {
                            return getClosestBusstop(busstopUnion2, $rootScope.search.destinationMarker.position);
                        }
                        else {
                            for (var i = 0; i < busstopUnion2[busstopUnion2.length - 1] && busstopUnion2[busstopUnion2.length - 1].length; i++) {
                                if (busstopUnion2[busstopUnion2.length - 1][i].BoardingAlighting == strAlighting)
                                    return busstopUnion2[busstopUnion2.length - 1][i].BoardingAlighting;
                            }
                        }
                        //}, 50);
                    }(busstopList1)),
                    isVisible: false
                });

                if (transitionShilutScheduleList != null && transitionShilutScheduleList.length > 0) {
                    scope.transitionShilutScheduleList = transitionShilutScheduleList;
                    if (scope.transitionShilutScheduleList.length > 0) {
                        if ($rootScope.selectedLineIndex == -1)
                            setTimeout(function () {
                                scope.selectSolution(0);
                            }, 500);
                        else
                            setTimeout(function () {
                                scope.selectSolution($rootScope.selectedLineIndex);
                            }, 500);
                    }

                    //setTimeout(function () {
                    //    getRealtimeSchedule();
                    //}, 2000);
                }


            }

            function getRealtimeSchedule() {

                if ($rootScope.search.selectedBusStop == null) return;

                $rootScope.search.selectedBusstopId = $rootScope.search.selectedBusStop.Makat;
                searchService.GetRealtimeBusLineListByBustop(scope.search.selectedBusstopId, scope.search.language, scope.search.isEggedDb,
                    function (RealtimeBusstopLinesInStationList) {
                        scope.LinesInStationList = RealtimeBusstopLinesInStationList;

                        busstop.LinesInStationList = busstop.LinesInStationList.sort(function (a, b) {
                            if (a.MinutesToArrival == null) { return 1 };
                            if (parseInt(a.MinutesToArrival) < parseInt(b.MinutesToArrival)) { return -1 };
                            if (parseInt(a.MinutesToArrival) > parseInt(b.MinutesToArrival)) { return 1 };
                            return 0;
                        });
                        scope.$apply();
                    });
            }

            scope.toggleLinesInStationTableVisible = function () {
                scope.isLinesInStationTableVisible = !scope.isLinesInStationTableVisible;

                //for (var j = 0; j < scope.transitionShilutScheduleList.length; j++) 
                //    scope.transitionShilutScheduleList[j].realTime = "";

                if (scope.isLinesInStationTableVisible == true)
                    $timeout(function () {

                        //scope.search.selectedBusstopId = $rootScope.search.selectedBusStop.Makat;
                        //var retval = searchService.GetNextBus(scope.search.getJsonString());
                        //    $rootScope.search.nextBusList = retval;
                        //    for (var i = 0; i < $rootScope.search.nextBusList.length; i++) {
                        //        for (var j = 0; j < scope.LinesInStationList.length; j++) {
                        //            if (parseInt(scope.LinesInStationList[j].Shilut) == parseInt($rootScope.search.nextBusList[i].Shilut)) {
                        //                scope.LinesInStationList[j].MinutesToArrival = $rootScope.search.nextBusList[i].MinutesToArrival;
                        //            }
                        //        }
                        //    }

                        getRealtimeSchedule();
                    }, 500);
            }

            scope.$watch("selectedTransitionShilutSchedule", function (newVal, oldVal) {
                if (newVal == null) {
                    $rootScope.search.currentBusStopList = null;
                    $rootScope.search.selectedBusStop = null;
                    $rootScope.search.selectedNearBusStop = null;
                    if ($rootScope.search.directionsDisplayBoarding != null) {
                        var boardingDirections = $rootScope.search.directionsDisplayBoarding.directions;
                        if (boardingDirections != null) {
                            boardingDirections.routes = [];
                            $rootScope.search.directionsDisplayBoarding.setDirections(boardingDirections);
                        }
                    }
                    if ($rootScope.search.directionsDisplayAlighting != null) {
                        var alightingDirections = $rootScope.search.directionsDisplayAlighting.directions;
                        if (alightingDirections != null) {
                            alightingDirections.routes = [];
                            $rootScope.search.directionsDisplayAlighting.setDirections(alightingDirections);
                        }
                    }
                    scope.transitionShilutScheduleList = [];
                    return;
                }
                else {

                    for (var j = 0; j < newVal.busstopList.length; j++)
                        for (var i = 0; i < newVal.busstopList[j].length; i++) {
                            if (newVal.busstopList[j][i].BoardingAlighting == strBoarding) {
                                newVal.shilutScheduleList[j].boardingBusstop = newVal.busstopList[j][i];
                                //getRealtimeToStop(newVal.busstopList[j][i], newVal.shilutScheduleList[j].Shilut, function (retval) {
                                //    newVal.shilutScheduleList[j].boardingBusstop.MinutesToArrival = retval;
                                //});
                            }
                            if (newVal.busstopList[j][i].BoardingAlighting == strAlighting)
                                newVal.shilutScheduleList[j].alightingBusstop = newVal.busstopList[j][i];
                        }

                    $rootScope.search.currentBusStopList = newVal.busstopList;
                }

                //    var selectedShilutList = [];
                //    for (var i = 0; i < newVal.shilutScheduleList.length; i++) {
                //        selectedShilutList.push(parseInt(newVal.shilutScheduleList[i].Shilut).toString());
                //    }

                //    for (var i = 0; i < $rootScope.gridScheduleList.length; i++) {
                //        for (var j = newVal.shilutScheduleList[0].Id - 1; j < $rootScope.gridScheduleList[i].fullTransitionList.length; j++) {
                //            if (selectedShilutList[i] == parseInt($rootScope.gridScheduleList[i].fullTransitionList[j].Shilut).toString()) {
                //                $rootScope.SelectedIdList[i] = $rootScope.gridScheduleList[i].fullTransitionList[j].Id;
                //                break;
                //            }
                //        }
                //        scope.$apply();
                //    }
                //}

                ////scope.selectedSectionId = newVal.tableIndex;
                //$rootScope.search.LineNumber = newVal.LineNumber;
                //$rootScope.search.makat = newVal.Makat;
                //$rootScope.search.chalufa = newVal.Chalufa;
                //$rootScope.search.busStationArrangementD = newVal.BusStationArrangementD;
                //$rootScope.search.busStationArrangementA = newVal.BusStationArrangementA;
                //$rootScope.search.originTime = $filter('date')(new Date(newVal.OriginTime), 'dd/MM/yyyy HH:mm');
                //var busStopList = transitionService.getBusStopList($rootScope.search.getJsonString());

                //if ($rootScope.isMapViewed == true) {
                //    $rootScope.search.currentBusStopList = [];
                //    $rootScope.search.currentBusStopList.push(newVal.busstopList);
                //}
                //setTimeout(function () {
                //}, 1000);

                $rootScope.showPublicTransport();

                setTimeout(function () {
                    $rootScope.showTripSegments();
                }, 1000);

            });

            $rootScope.showPublicTransport = function () {
                if ($rootScope.search.selectedMapWidjetTab == "PublicTransport" && $rootScope.search.currentBusStopList != null && $rootScope.search.currentBusStopList.length > 0) {
                    //clearRoute();
                    if ($rootScope.search.autocompleteOrigin.coords)
                        generateBoardingWalkRoute();

                    if ($rootScope.search.autocompleteDestination.coords)
                        generateAlightingWalkRoute();
                }
            }

            function setZoomToIncludeAllMarkers(markerList) {
                if (markerList.length == 0) return;
                var bounds = new google.maps.LatLngBounds();
                for (i = 0; i < markerList.length; i++)
                    if (markerList[i].BoardingAlighting == strBoarding || markerList[i].BoardingAlighting == strAlighting)
                        bounds.extend(new google.maps.LatLng(markerList[i].Latitude, markerList[i].Longitude));
                $rootScope.search.map.fitBounds(bounds);
                $rootScope.search.map.setZoom($rootScope.search.map.zoom - 1);
                //$rootScope.search.map.panBy(30, 0);

                var listener = google.maps.event.addListener($rootScope.search.map, "idle", function () {
                    if ($rootScope.search.map.getZoom() < 7) $rootScope.search.map.setZoom(7);
                    google.maps.event.removeListener(listener);
                });

                google.maps.event.trigger($rootScope.search.map, "resize");

            }

            function generateBoardingWalkRoute() {

                googleMapsUtil.getNearestBusstopInTransition($rootScope.search.originMarker.position, $rootScope.search.currentBusStopList[0], function (busstop) {
                    calculateWalkingRoute($rootScope.search.originMarker.position, new google.maps.LatLng(busstop.Latitude, busstop.Longitude), function (response) {
                        $rootScope.search.directionsDisplayBoarding.setDirections(response);
                    });

                        for (var i = 0; i < scope.transitionShilutScheduleList[0].busstopList[0].length; i++) {
                            if (scope.transitionShilutScheduleList[0].busstopList[0][i].BoardingAlighting == strBoarding &&
                                scope.transitionShilutScheduleList[0].busstopList[0][i].Makat != busstop.Makat) {
                                scope.transitionShilutScheduleList[0].busstopList[0][i].BoardingAlighting = "";
                                busstop.BoardingAlighting = strBoarding;

                                infoBoxlist.hideItem(scope.transitionShilutScheduleList[0].busstopList[0][i].Makat);
                                infoBoxlist.add({
                                    id: busstop.BoardingAlighting + busstop.Makat.toString()
                                    , latlng: new google.maps.LatLng(busstop.Latitude, busstop.Longitude)
                                    , map: $rootScope.search.map
                                    , clickEvent: function (data) {
                                        $rootScope.search.selectedBusStop = data;
                                        $rootScope.currentLocation = { coords: { latitude: busstop.latitude, longitude: busstop.longitude }, description: "" };
                                        $rootScope.selectedBusstopType = 'trip';
                                    }
                                    , content: "<div style='font-size: 17px; text-align: center; color: darkgreen; '>" + busstop.BoardingAlighting + "</div>"
                                });
                                $rootScope.search.selectedBusStop = busstop;

                            }
                        }

                }, function () { });

            }

            function generateAlightingWalkRoute() {
                googleMapsUtil.getNearestBusstopInTransition(
                    $rootScope.search.destinationMarker.position,
                    $rootScope.search.currentBusStopList[$rootScope.search.currentBusStopList.length - 1], function (busstop) {
                        calculateWalkingRoute(
                            $rootScope.search.destinationMarker.position,
                            new google.maps.LatLng(busstop.Latitude, busstop.Longitude), function (response) {
                                $rootScope.search.directionsDisplayAlighting.setDirections(response);
                            });


                        var tempBusstopList = scope.transitionShilutScheduleList[scope.transitionShilutScheduleList.length - 1].busstopList[scope.transitionShilutScheduleList[scope.transitionShilutScheduleList.length - 1].busstopList.length-1]

                        for (var i = 0; i < tempBusstopList.length; i++) {
                            if (tempBusstopList[i].BoardingAlighting == strAlighting &&
                                    tempBusstopList[i].Makat != busstop.Makat)
                                {
                                    debugger;
                                    tempBusstopList[i].BoardingAlighting = "";
                                    busstop.BoardingAlighting = strAlighting;

                                    infoBoxlist.hideItem(tempBusstopList[i].Makat);
                                    infoBoxlist.add({
                                        id: busstop.BoardingAlighting + busstop.Makat.toString()
                                        , latlng: new google.maps.LatLng(busstop.Latitude, busstop.Longitude)
                                        , map: $rootScope.search.map
                                        , clickEvent: function (data) {
                                            $rootScope.search.selectedBusStop = data;
                                            $rootScope.currentLocation = { coords: { latitude: busstop.latitude, longitude: busstop.longitude }, description: "" };
                                            $rootScope.selectedBusstopType = 'trip';
                                        }
                                        , content: "<div style='font-size: 17px; text-align: center; color: darkred; '>" + busstop.BoardingAlighting + "</div>"
                                    });

                                }
                            }

                    }, function () { });

            }

            var rad = function (x) {
                return x * Math.PI / 180;
            }

            var getDistance = function (p1, p2) {
                var R = 6378137; // Earth’s mean radius in meter
                var dLat = rad(p2.lat() - p1.lat());
                var dLong = rad(p2.lng() - p1.lng());
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
                  Math.sin(dLong / 2) * Math.sin(dLong / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;
                return d; // returns the distance in meter
            }

            function calculateWalkingRoute(start, end, callbackFinally) {

                //var start = $rootScope.search.autocompleteOrigin.coords;
                //var end = $rootScope.search.autocompleteDestination.coords;
                //if (start == end) return;
                //if ($rootScope.search.destinationMarker)
                //    start = $rootScope.search.originMarker.position.lat() + "," + $rootScope.search.originMarker.position.lng();
                //if ($rootScope.search.destinationMarker)
                //    end = $rootScope.search.destinationMarker.position.lat() + "," + $rootScope.search.destinationMarker.position.lng();

                var request = {
                    origin: start,
                    destination: end,
                    optimizeWaypoints: true,
                    travelMode: google.maps.TravelMode.WALKING
                };
                googleMapsUtil.directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        callbackFinally(response);
                    }
                });
            }

        }
    }

});

