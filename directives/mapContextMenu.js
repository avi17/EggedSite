mslApp.directive('mapContextMenu', function ($rootScope, localize) {
    return {
        templateUrl: '/app/views/directive/mapContextMenu.htm',
        link: function (scope, element, attrs, ctrl) {

            var rightClickLat;
            var rightClickLng;

            var geocoder;

            setTimeout(function () {
                scope.strShow = localize.getLocalizedString("_Show_");
                scope.strStationsInTheArea = localize.getLocalizedString("_StationsInTheArea_");
                scope.strNavigateFrom = localize.getLocalizedString("_NavigateFrom_");
                scope.strNavigateTo = localize.getLocalizedString("_NavigateTo_");
            }, 1000);

            $rootScope.$watch("isGoogleReachable", function (newVal, oldVal) {
                if (newVal == true) {

                    geocoder = new google.maps.Geocoder();


                    //scope.autocompleteFromCoords;
                    //scope.autocompleteDestination.coords;

                    //$rootScope.$watch("search.autocompleteOrigin.coords", function (newVal, oldVal) {
                    //    if (!newVal) return;
                    //    rightClickLat = newVal.split(',')[0];
                    //    rightClickLng = newVal.split(',')[1];
                    //    scope.setOriginPoint();
                    //});

                    //$rootScope.$watch("search.autocompleteDestination.coords", function (newVal, oldVal) {
                    //    if (!newVal) return;
                    //    rightClickLat = newVal.split(',')[0];
                    //    rightClickLng = newVal.split(',')[1];
                    //    scope.setDestinationPoint();
                    //});

                    google.maps.event.addListener($rootScope.search.map, "rightclick", function (event) {
                        rightClickLat = event.latLng.lat();
                        rightClickLng = event.latLng.lng();
                        scope.clickedCoords = rightClickLat.toString() + ',' + rightClickLng.toString();
                        scope.$apply();
                        if ($rootScope.israelBounds == null) {
                            $rootScope.israelBounds = $rootScope.initIsraelBounds();
                            //return;
                        }

                        if ($rootScope.israelBounds.contains(new google.maps.LatLng(rightClickLat, rightClickLng))) {

                            $(element)
                                .css("display", "block")
                                .css("left", (event.pixel.x - 111).toString() + "px")
                                .css("top", event.pixel.y + "px");
                        }
                    });

                    google.maps.event.addListener($rootScope.search.map, "click", function () {
                        $(element).css("display", "none");
                        //$rootScope.search.isMouseOverPanel = false;
                        scope.$apply();
                    });

                    google.maps.event.addListener($rootScope.search.map, 'zoom_changed', function () {
                        $(element).hide();
                        //$rootScope.search.isMouseOverPanel = false;
                        //scope.$apply();
                    });

                    google.maps.event.addListener($rootScope.search.map, 'dragstart', function () {
                        $(element).hide();
                        $(".MapCollapsePanel").fadeOut("1000");
                        $(".ToggleMapIconWrapper").fadeOut("1000");

                        //$rootScope.search.isMouseOverPanel = false;
                        scope.$apply();
                    });

                    google.maps.event.addListener($rootScope.search.map, 'dragend', function () {
                        $(".MapCollapsePanel").fadeIn("1000");
                        $(".ToggleMapIconWrapper").fadeIn("1000");

                        //$rootScope.search.isMouseOverPanel = false;
                        scope.$apply();
                    });

                }
            });


            scope.setOriginPoint = function (e) {
                $(element).css("display", "none");
                //$rootScope.search.isMouseOverPanel = false;
                $rootScope.search.autocompleteOrigin.coords = rightClickLat + "," + rightClickLng;

                var latlng = new google.maps.LatLng(rightClickLat, rightClickLng);
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            $rootScope.search.autocompleteOrigin.description = results[0].formatted_address;
                            scope.$apply();
                        }
                    } else {
                        //alert("Geocoder failed due to: " + status);
                    }
                });
            }

            scope.setDestinationPoint = function (e) {
                $(element).css("display", "none");
                //$rootScope.search.isMouseOverPanel = false;
                $rootScope.search.autocompleteDestination.coords = rightClickLat + "," + rightClickLng;

                var latlng = new google.maps.LatLng(rightClickLat, rightClickLng);
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            $rootScope.search.autocompleteDestination.description = results[0].formatted_address;
                            scope.$apply();
                        }
                    } else {
                        //alert("Geocoder failed due to: " + status);
                    }
                });
            }

            scope.getBustopListNearPlace = function (e) {
                $(element).css("display", "none");
                //$rootScope.search.isMouseOverPanel = false;
                //$rootScope.search.coordinateLat = rightClickLat;
                //$rootScope.search.coordinateLng = rightClickLng;
                //$rootScope.search.nearBustopList = searchService.GetBusstopListByRadius($rootScope.search.getJsonString());
                $rootScope.currentLocation = { coords: { latitude: rightClickLat, longitude: rightClickLng }, description: "" };
                //$rootScope.currentLocation = new google.maps.LatLng(rightClickLat, rightClickLng);
                $rootScope.showNearBusstopPane();

                //scope.$apply();
            }

            scope.measureWalkDistance = function () {
                $(element).css("display", "none");
                var currentLocation = rightClickLat + "," + rightClickLng;
                $rootScope.$broadcast('measureWalkDistanceClicked', { origin: '', destination: '' });
            }

            scope.measureWalkDistanceFromHere = function () {
                $(element).css("display", "none");
                var currentLocation = rightClickLat + "," + rightClickLng;
                $rootScope.$broadcast('measureWalkDistanceClicked', { origin: scope.clickedCoords, destination: '' });
            }

            scope.measureWalkDistanceToHere = function () {
                $(element).css("display", "none");
                var currentLocation = rightClickLat + "," + rightClickLng;
                $rootScope.$broadcast('measureWalkDistanceClicked', { origin: '', destination: scope.clickedCoords });
            }

        }
    }
});

