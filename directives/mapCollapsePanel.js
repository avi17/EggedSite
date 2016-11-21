mslApp.directive('mapCollapsePanel', function ($compile, $timeout, $rootScope, searchService, transitionService, globalFunctions) {
    return {
        templateUrl: '/app/views/directive/mapCollapsePanel.htm',
        link: function (scope, element, attrs, ctrl) {
            //if ($rootScope.isGoogleReachable == false) return;

            scope.visiblePaneName = 'tripSegments';
            $rootScope.search.nextBusList = null;

            scope.reverseAddresses = function () {

                //if ($rootScope.search.autocompleteDestination.coords == null || $rootScope.search.autocompleteDestination.coords == "")
                //    $rootScope.search.autocompleteDestination.coords =
                //if ($rootScope.search.autocompleteOrigin.coords == null || $rootScope.search.autocompleteOrigin.coords == "")
                //    $rootScope.search.autocompleteOrigin.coords =
                var tempCoords = $rootScope.search.autocompleteDestination.coords;
                var tempDescription = $rootScope.search.autocompleteDestination.description;
                $rootScope.search.autocompleteDestination.coords = $rootScope.search.autocompleteOrigin.coords;
                $rootScope.search.autocompleteDestination.description = $rootScope.search.autocompleteOrigin.description;
                $rootScope.search.autocompleteOrigin.coords = tempCoords;
                $rootScope.search.autocompleteOrigin.description = tempDescription;
            }

            scope.unReverseAddresses = function () {
                scope.reverseAddresses();
                scope.reverseAddresses();
            }

            $rootScope.showNearBusstopPane = function () {
                $rootScope.search.selectedBusStop = null;
                $rootScope.getNearBustopList();
            }

            $rootScope.showBusstopDataPane = function () {

                scope.visiblePaneName = 'mapBusstopData';

            }

            $rootScope.showTripSegments = function () {
                scope.visiblePaneName = 'tripSegments';
                $rootScope.search.nearBustopList = null;
            }

            $rootScope.$watch("search.fromBusStopMakatValue", function (newVal, oldVal) {

                if (!newVal) return;
                var isnum = /^\d+$/.test(newVal);
                if (isnum != true) {
                    $rootScope.search.userMessageTitle = "_Title_";
                    $rootScope.search.userMessage = "_FeedDigitsOnly_";
                    $rootScope.search.fromBusStopMakatValue = "";
                }

            });


            scope.selectedFromBusStopMakatChanged = function (e) {

                debugger;
                $rootScope.search.makat = e;
                transitionService.getBusStopByMakat(
                    $rootScope.search.makat,
                    $rootScope.search.language,
                    $rootScope.search.isEggedDb,
                    function (busStopMakatVal) {

                        if (busStopMakatVal.Makat == 0 || busStopMakatVal.Makat == null)
                        {
                            $rootScope.search.userMessageTitle = "_Title_";
                            $rootScope.search.userMessage = "_NoResultsFound_";
                        }
                        else {
                            var arr = [];
                            arr.push(busStopMakatVal);
                            $rootScope.search.nearBustopList = arr;
                        }
                    },
                    function () {
                        debugger;
                    });
            }


            scope.selectedToBusStopMakatChanged = function (e) {
                $rootScope.search.makat = e;
                transitionService.getBusStopByMakat(
                    $rootScope.search.makat,
                    $rootScope.search.language,
                    $rootScope.search.isEggedDb,
                    function (busStopByMakatVal) {
                        var busstop = busStopByMakatVal;
                        $rootScope.search.autocompleteDestination.coords = busstop.Latitude + "," + busstop.Longitude;
                    });
            }


            scope.showNextBusstop = function () {
                $rootScope.search.selectedBusStop = $rootScope.search.currentBusStopList[$rootScope.selectedLineIndex][$rootScope.search.selectedBusStop.Id];
                //$rootScope.search.isShowAllBusstops = false;
                //$rootScope.search.map.setCenter(new google.maps.LatLng($rootScope.search.selectedBusStop.Latitude, $rootScope.search.selectedBusStop.Longitude));
            }

            scope.showPrevBusstop = function () {
                $rootScope.search.selectedBusStop = $rootScope.search.currentBusStopList[$rootScope.selectedLineIndex][$rootScope.search.selectedBusStop.Id - 2];
                //$rootScope.search.isShowAllBusstops = false;
                //$rootScope.search.map.setCenter(new google.maps.LatLng($rootScope.search.selectedBusStop.Latitude, $rootScope.search.selectedBusStop.Longitude));
            }

            $rootScope.insertRealtimeToBusstop = function (busstop, successCallback) {

                $rootScope.search.selectedBusstopId = busstop.Makat;

                searchService.GetRealtimeBusLineListByBustop(scope.search.selectedBusstopId, scope.search.language, scope.search.isEggedDb,
                    function (RealtimeBusstopLinesInStationList) {
                        busstop.LinesInStationList = RealtimeBusstopLinesInStationList;

                        var temp = [];
                        for (var i = 0; i < busstop.LinesInStationList.length; i++) {
                            if (busstop.LinesInStationList[i].MinutesToArrival != null)
                                temp.push(busstop.LinesInStationList[i]);
                        }
                        busstop.LinesInStationList = temp;

                        busstop.LinesInStationList = busstop.LinesInStationList.sort(function (a, b) {
                            if (a.MinutesToArrival == null) { return -1 };
                            if (parseInt(a.MinutesToArrival) < parseInt(b.MinutesToArrival)) { return -1 };
                            if (parseInt(a.MinutesToArrival) > parseInt(b.MinutesToArrival)) { return 1 };
                            return 0;
                        });



                        if (successCallback != null)
                            successCallback();
                    });

            }

            scope.applyNearBusstopList = function (coord, successCallback, failCallback) {

                $rootScope.search.coordinateLat = coord.latitude;
                $rootScope.search.coordinateLng = coord.longitude;
                searchService.GetBusstopListByRadius(
                    $rootScope.search.currentDate != null ? $rootScope.search.currentDate.ID : 1,
                    $rootScope.search.coordinateLat,
                    $rootScope.search.coordinateLng,
                    300,
                    $rootScope.search.language,
                    $rootScope.search.isEggedDb,
                    function (nearBustopList) {
                        $rootScope.search.nearBustopList = nearBustopList;

                        for (var i = 0; i < $rootScope.search.nearBustopList.length; i++) {
                            //if ($rootScope.isMapViewed == true)
                            $rootScope.insertRealtimeToBusstop($rootScope.search.nearBustopList[i],
                                function (value) {

                                    successCallback($rootScope.search.nearBustopList);

                                });
                        }
                        successCallback($rootScope.search.nearBustopList);

                        //var points = [];
                        //for (var i = 0; i < $rootScope.search.nearBustopList.length; i++)
                        //    points.push(new google.maps.LatLng($rootScope.search.nearBustopList[i].Latitude, $rootScope.search.nearBustopList[i].Longitude));
                        //setZoomToIncludeAllMarkers(points);
                        //$scope.$apply();

                    },
                    function () {
                        failCallback();
                    });

            }

            $rootScope.getNearBustopList = function (isShowAllBusstops, successCallback, failCallback) {

                scope.visiblePaneName = 'mapNearBusstop';

                if (isShowAllBusstops != null && isShowAllBusstops == true)
                    $rootScope.search.selectedBusStop = null;
                $rootScope.search.nearBustopList = null;
                //scope.$apply();

                //if ($rootScope.currentLocation.coords.indexOf(',') > -1)
                //    $rootScope.currentLocation.coords = new google.maps.LatLng($rootScope.currentLocation.coords.split(',')[0], $rootScope.currentLocation.coords.split(',')[1]);

                if ($rootScope.currentLocation.coords != null && $rootScope.currentLocation.coords.latitude != null) {
                    scope.applyNearBusstopList($rootScope.currentLocation.coords, function (list) {
                        if (successCallback != null)
                            successCallback(list);
                    }, failCallback);
                }
                else {
                    globalFunctions.getCurrentPosition(function (position) {
                        $rootScope.currentLocation = { coords: { latitude: position.coords.latitude, longitude: position.coords.longitude }, description: "" };
                        scope.applyNearBusstopList($rootScope.currentLocation.coords, function (list) {
                            if (successCallback != null)
                                successCallback(list);
                        }, failCallback);
                    },
function () { });
                }
            }

            scope.nearBusstopPaneClicked = function (busstopMakat) {

                scope.visiblePaneName = 'mapBusstopData';
                $rootScope.search.makat = busstopMakat;
                transitionService.getBusStopByMakat(
                    $rootScope.search.makat,
                    $rootScope.search.language,
                    $rootScope.search.isEggedDb,
                    function (busStopMakatVal) {
                        $rootScope.search.selectedBusStop = busStopMakatVal;
                        $rootScope.insertRealtimeToBusstop($rootScope.search.selectedBusStop);
                        $rootScope.showBusstopDataPane();
                        //scope.$apply();
                    });
            }

            scope.busstopHeaderExpand = function () {
                scope.busstopHeaderExpanded = true;
            }

            scope.busstopHeaderCollapse = function () {
                scope.busstopHeaderExpanded = false;
            }

            function setZoomToIncludeAllMarkers(points) {
                var bounds = new google.maps.LatLngBounds();
                for (i = 0; i < points.length; i++) {
                    bounds.extend(points[i]);
                }
                scope.search.map.fitBounds(bounds);
            }

            scope.clearMap = function () {
                $rootScope.gridScheduleList = [];
                $rootScope.search.clearMap();
            }

            scope.addNewNavPoint = function () {
                debugger;
            }

            scope.focusMyLocation = function () {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        $rootScope.currentLocation = { coords: { latitude: position.coords.latitude, longitude: position.coords.longitude }, description: "" };
                        //$rootScope.currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        $rootScope.search.map.setCenter(new google.maps.LatLng(newVal.coords.latitude, newVal.coords.longitude));
                        $rootScope.search.map.setZoom(16);
                        if ($rootScope.search.nearBustopList != null)
                            $rootScope.getNearBustopList();
                    },
function () { });
                }
            }

            $rootScope.$watch("fromPlaceNameArray", function (newVal, oldVal) {
                if (newVal == null || newVal.length == 0) return;
                //$rootScope.search.autocompleteOrigin.description = newVal[0];
            }, true);

            $rootScope.$watch("toPlaceNameArray", function (newVal, oldVal) {
                if (newVal == null || newVal.length == 0) return;
                //for (var i = newVal.length - 1; i >= 0; i--) {
                //    if (newVal[i] != '')
                //        {
                //        $rootScope.search.autocompleteDestination.description = newVal[i];
                //        break;
                //    }
                //}
            }, true);

            scope.focusTripResults = function () {
                setTimeout(function () {
                    $($(".MapTripSolutionsHeader")[0]).focus();
                }, 1000);
            }

        }
    }
});

