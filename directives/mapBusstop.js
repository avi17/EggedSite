mslApp.directive('mapBusstop', function ($compile, $timeout, $rootScope, googleMapsUtil, searchService, transitionService) {
    return {
        templateUrl: '/app/views/directive/mapBusstop.htm',
        link: function (scope, element, attrs, ctrl) {

            //if ($rootScope.isGoogleReachable == false) return;

            scope.currentBusstopTabName = "";
            scope.LinesInStationList;
            //scope.nextBusList;
            scope.pedestrianDestination;
            scope.selectedMakat;
            scope.busstopHeaderEntered = false;
            scope.currentBusStopList = [];

            scope.mouseLeftBusstopHeader = function () {
                scope.busstopHeaderEntered = false;
            }

            scope.mouseEnteredBusstopHeader = function () {
                scope.busstopHeaderEntered = true;
            }

            google.maps.event.addListener($rootScope.search.map, 'click', function (e) {
                scope.currentBusstopTabName = '';
            });

            scope.$watch("pedestrianDestination", function (newVal, oldVal) {
                if (newVal != null)
                    scope.calculatePedestrianRoute();
            });

            //googleMapsUtil.directionsService = new google.maps.DirectionsService();
            //scope.directionsDisplay = new google.maps.DirectionsRenderer();
            //scope.directionsDisplay.setMap(scope.search.map);

            scope.selectedBusstopChanged = function (busstop) {
                $rootScope.search.selectedBusStop = busstop;
            }

            function setZoomToIncludeAllMarkers(points) {
                var bounds = new google.maps.LatLngBounds();
                for (i = 0; i < points.length; i++) {
                    bounds.extend(points[i]);
                }
                scope.search.map.fitBounds(bounds);
            }

            scope.calculatePedestrianRoute = function () {

                var start = $rootScope.search.autocompleteOrigin.coords;
                var end = $rootScope.search.autocompleteDestination.coords;

                var request = {
                    origin: start,
                    destination: end,
                    travelMode: google.maps.TravelMode.WALKING
                };
                googleMapsUtil.directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        $rootScope.search.directionsDisplay.setDirections(response);
                        var points = [];
                        points.push(new google.maps.LatLng(response.Zb.origin.split(',')[0], response.Zb.origin.split(',')[1]));
                        points.push(new google.maps.LatLng(response.Zb.destination.split(',')[0], response.Zb.destination.split(',')[1]));
                        setZoomToIncludeAllMarkers(points);
                    }
                });
                if ($rootScope.search.originMarker)
                    $rootScope.search.originMarker.setMap(null);
                if ($rootScope.search.destinationMarker)
                    $rootScope.search.destinationMarker.setMap(null);
            }

            scope.showNextBusstop = function () {
                $rootScope.search.selectedBusStop = $rootScope.search.currentBusStopList[$rootScope.search.selectedBusStop.Id];
            }

            scope.showPrevBusstop = function () {
                $rootScope.search.selectedBusStop = $rootScope.search.currentBusStopList[$rootScope.search.selectedBusStop.Id - 2];
            }

            scope.getNearBustopList = function () {
                if ($rootScope.search.nearBustopList != null && $rootScope.search.nearBustopList.length > 0) {
                    $rootScope.search.nearBustopList = [];
                    //$rootScope.search.selectedBusStop = $rootScope.search.selectedMapAddressFrom;
                    //scope.$apply();
                }
                else {
                    $rootScope.search.coordinateLat = $rootScope.search.selectedBusStop.Latitude;
                    $rootScope.search.coordinateLng = $rootScope.search.selectedBusStop.Longitude;
                    searchService.GetBusstopListByRadius(
                    $rootScope.search.currentDate != null ? $rootScope.search.currentDate.ID : 1,
                        $rootScope.search.coordinateLat,
                        $rootScope.search.coordinateLng,
                        300,
                        $rootScope.search.language,
                        $rootScope.search.isEggedDb,
                        function (rootScopesearchnearbustopList) {
                        $rootScope.search.nearBustopList = rootScopesearchnearbustopList;

                        var points = [];
                        for (var i = 0; i < $rootScope.search.nearBustopList.length; i++)
                            points.push(new google.maps.LatLng($rootScope.search.nearBustopList[i].Latitude, $rootScope.search.nearBustopList[i].Longitude));
                        //setZoomToIncludeAllMarkers(points);
                    });
                }

            }

            scope.busstopHeaderExpand = function () {
                scope.busstopHeaderExpanded = true;
            }

            scope.busstopHeaderCollapse = function () {
                scope.busstopHeaderExpanded = false;
            }

            scope.toggleVisibility = function (selectedMasterLine) {
                var line = $.grep(scope.LinesInStationList, function (e) { return e.$$hashKey == selectedMasterLine.$$hashKey; })[0];
                if (line.isDetailVisible == null)
                    line.isDetailVisible = false;
                line.isDetailVisible = !line.isDetailVisible;
            }

        }
    }
});

