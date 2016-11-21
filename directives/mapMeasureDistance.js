mslApp.directive('mapMeasureDistance', function ($rootScope, $timeout, infoBoxlist, googleMapsUtil, globalFunctions, localize) {
    return {
        scope: true,
        //replace: true,
        //transclude: true,
        templateUrl: '/app/views/directive/mapMeasureDistance.htm',
        link: function (scope, element, attrs) {

            scope.isShowMeasureDistancePopup = false;

            scope.walkAddressOrigin = { coords: "", description: "" };
            scope.walkAddressDestination = { coords: "", description: "" };

            scope.close = function () {
                scope.isShowMeasureDistancePopup = false;
            }

            scope.measure = function () {
                if (scope.walkAddressDestination != null && scope.walkAddressDestination.coords != "" && scope.walkAddressOrigin != null && scope.walkAddressOrigin.coords != "") {
                    calculatePedestrianRoute(scope.walkAddressOrigin.coords, scope.walkAddressDestination.coords);
                }
                scope.isShowMeasureDistancePopup = false;
            }


            scope.$watch("walkAddressOrigin.coords", function (newVal, oldVal) {

                if (newVal == null || newVal == "") {
                    //clear line
                }
                else {
                    //if (scope.walkAddressDestination != null && scope.walkAddressDestination.coords != "") {
                    //    calculatePedestrianRoute(scope.walkAddressOrigin.coords, scope.walkAddressDestination.coords);
                    //}
                }

            });

            scope.$watch("walkAddressDestination.coords", function (newVal, oldVal) {

                if (newVal == null || newVal == "") {
                    //clear line
                }
                else {
                    //if (scope.walkAddressOrigin != null && scope.walkAddressOrigin.coords != "") {
                    //    calculatePedestrianRoute(scope.walkAddressOrigin.coords, scope.walkAddressOrigin.coords);
                    //}
                }

            });


            function calculatePedestrianRoute(originPoint, destinationPoint) {

                clearRoute();
                //if (googleMapsUtil.directionsRenderer == null)
                //{
                //    googleMapsUtil.directionsRenderer = new google.maps.DirectionsRenderer();
                //    googleMapsUtil.directionsRenderer.setMap(googleMapsUtil.map);
                //    //googleMapsUtil.directionsRenderer.setOptions({ suppressMarkers: true });
                //}

                var request = {
                    origin: originPoint,
                    destination: destinationPoint,
                    travelMode: google.maps.TravelMode.WALKING
                };
                googleMapsUtil.directionsService.route(request, function (response, status) {

                    if (status == google.maps.DirectionsStatus.OK) {
                        scope.routePedestrianResponse = response;
                        googleMapsUtil.directionsRenderer.setDirections(response);
                        var length = response.routes[0].overview_path.length / 2;
                        length = parseInt(length);

                        debugger;
                        infoBoxlist.itemList.forEach(function (item) {
                            if (item.id == "walkRoute")
                                item.isVisible = false;
                        });

                        infoBoxlist.add({
                            id: "walkRoute"
                            , latlng: response.routes[0].overview_path[length]
                            , map: $rootScope.search.map
                            , clickEvent: function (data) { }
                            , content: "<div style='color: darkgreen; font-weight: bold;'>" +
                                response.routes[0].legs[0].distance.text + " " +
                                response.routes[0].legs[0].duration.text + "</div>"
                        });

                    }

                });
            }

            function clearRoute() {
                if (googleMapsUtil.directionsRenderer != null) {
                    var boardingDirections = googleMapsUtil.directionsRenderer.directions;
                    if (boardingDirections != null) {
                        boardingDirections.routes = [];
                        googleMapsUtil.directionsRenderer.setDirections(boardingDirections);
                    }
                }
            }

            $rootScope.$on('measureWalkDistanceClicked', function (event, args) {

                scope.isShowMeasureDistancePopup = true;
                
                var originPoint = args.origin;
                var destinationPoint = args.destination;

                //scope.walkAddressOrigin = { coords: "", description: "" };
                //scope.walkAddressDestination = { coords: "", description: "" };

                if (originPoint != "")
                    scope.walkAddressOrigin = { coords: originPoint, description: originPoint };

                if (destinationPoint != "")
                    scope.walkAddressDestination = { coords: destinationPoint, description: destinationPoint };

                globalFunctions.getAddressFromCoords(scope.walkAddressOrigin.coords.split(',')[0], scope.walkAddressOrigin.coords.split(',')[1],
                    function (resultAddress) {
                        
                        scope.walkAddressOrigin.description = resultAddress;
                        scope.$apply();
                    });

                globalFunctions.getAddressFromCoords(scope.walkAddressDestination.coords.split(',')[0], scope.walkAddressDestination.coords.split(',')[1],
                    function (resultAddress) {
                        
                        scope.walkAddressDestination.description = resultAddress;
                        scope.$apply();
                    });

                $timeout(function () {
                    scope.isShowMeasureDistancePopup = true;
                }, 150);

            });

        }
    }
});

