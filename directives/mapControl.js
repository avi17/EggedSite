mslApp.directive('mapControl', function ($rootScope, $timeout, $filter, $location, localize, globalFunctions, infoBoxlist, googleMapsUtil, searchService) {

    return function (scope, element, attrs) {

        var currentStationsInRange = null;
        var currentStationsInLine = null;
        var mapContainer;
        var strBoarding = localize.getLocalizedString("_Boarding_");
        var strAlighting = localize.getLocalizedString("_Alighting_");


        $rootScope.$watch("isGoogleReachable", function (newVal, oldVal) {
            if (newVal == true && $rootScope.search.map == null) {
                initMap();
            }
        });

        function initMap() {
            strBoarding = localize.getLocalizedString("_Boarding_");
            strAlighting = localize.getLocalizedString("_Alighting_");

            if ($rootScope.search.map == null) {
                $(element).css("position", "relative");
                mapContainer = $("<div>")
                    .css("height", "100%")
                    .css("padding", "0px")
                    .css("margin", "0px")
                    .appendTo(element);
            }

            var featureType =
            [{
                "featureType": "transit.station",
                "stylers": [{ "visibility": "off" }]
            },
            {
                "featureType": "poi",
                "stylers": [{ "visibility": "off" }]
            }];

            var mapOptions = {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                //mapTypeControlOptions: {
                //    //style:google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                //    mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.TERRAIN]
                //},
                //zoomControlOptions: {
                //    style:google.maps.ZoomControlStyle.SMALL
                //},
                styles: featureType,
                //zoom: 7,
                minZoom: 7,
                //scaleControl: false,
                //zoomControl: false,
                panControl: false,
                //mapTypeControl: false,
                streetViewControl: false,
                //center: new google.maps.LatLng(scope.$eval(attrs.lat), scope.$eval(attrs.len))
                //center: new google.maps.LatLng(scope.$eval(attrs.len), scope.$eval(attrs.lat))
            };

            $rootScope.search.map = new google.maps.Map(mapContainer[0], mapOptions);

            googleMapsUtil.setMap($rootScope.search.map);

            $rootScope.search.directionsDisplayBoarding = new google.maps.DirectionsRenderer();
            $rootScope.search.directionsDisplayBoarding.setMap($rootScope.search.map);
            $rootScope.search.directionsDisplayBoarding.setOptions({ suppressMarkers: true, preserveViewport: true });
            $rootScope.search.directionsDisplayAlighting = new google.maps.DirectionsRenderer();
            $rootScope.search.directionsDisplayAlighting.setMap($rootScope.search.map);
            $rootScope.search.directionsDisplayAlighting.setOptions({ suppressMarkers: true, preserveViewport: true });
            $rootScope.search.directionsDisplayPedestrian = new google.maps.DirectionsRenderer();
            $rootScope.search.directionsDisplayPedestrian.setMap($rootScope.search.map);
            $rootScope.search.directionsDisplayPedestrian.setOptions({ suppressMarkers: true });
            $rootScope.search.map.setCenter(new google.maps.LatLng(scope.$eval(attrs.lat), scope.$eval(attrs.len)));

            var listener = google.maps.event.addListener($rootScope.search.map, "idle", function () {
                $rootScope.isMapViewed = false;
                google.maps.event.removeListener(listener);
                scope.$apply();
                //setTimeout(function () {
                //    var bounds = new google.maps.LatLngBounds();
                //    bounds.extend(new google.maps.LatLng(31.773873, 35.183309));
                //    bounds.extend(new google.maps.LatLng(31.799334, 34.652833));
                //    $rootScope.search.map.fitBounds(bounds);
                //    google.maps.event.trigger($rootScope.search.map, "resize");
                //}, 3000);
            });

            google.maps.event.addListener($rootScope.search.map, 'dragend', function (e) {

                if ($rootScope.israelBounds == null) {
                    $rootScope.israelBounds = $rootScope.initIsraelBounds();
                    return;
                }

                if ($rootScope.israelBounds.contains($rootScope.search.map.getCenter())) return;

                var c = $rootScope.search.map.getCenter(),
                    x = c.lng(),
                    y = c.lat(),
                    maxX = $rootScope.israelBounds.getNorthEast().lng(),
                    maxY = $rootScope.israelBounds.getNorthEast().lat(),
                    minX = $rootScope.israelBounds.getSouthWest().lng(),
                    minY = $rootScope.israelBounds.getSouthWest().lat();

                if (x < minX) x = minX;
                if (x > maxX) x = maxX;
                if (y < minY) y = minY;
                if (y > maxY) y = maxY;

                $rootScope.search.map.setCenter(new google.maps.LatLng(y, x));
            });

            $rootScope.$watch("search.autocompleteExtra.coords", function (newVal, oldVal) {

                if (newVal == null || newVal == "") {
                    //infoBoxlist.hideAll();
                    clearRoute();
                    return;
                }

                var start = newVal;
                var end;
                var minimalDistance = null;
                var origin = new google.maps.LatLng(newVal.split(',')[0], newVal.split(',')[1]);
                var destinationArr = [];
                var matchedBusstopList = [];


                for (var j = 0; j < $rootScope.search.currentBusStopList.length; j++)
                    for (var i = 0; i < $rootScope.search.currentBusStopList[j].length; i++) {
                        var retval = globalFunctions.getDistanceAndDirection(
                            $rootScope.search.currentBusStopList[j][i].Latitude,
                            $rootScope.search.currentBusStopList[j][i].Longitude,
                            parseFloat(newVal.split(',')[0]),
                            parseFloat(newVal.split(',')[1]));
                        if (minimalDistance == null || minimalDistance > retval.distance) {
                            minimalDistance = retval.distance;
                            end = $rootScope.search.currentBusStopList[j][i].Latitude + ',' + $rootScope.search.currentBusStopList[j][i].Longitude;
                        }
                    }

                $rootScope.search.coordinateLat = end.split(',')[0];
                $rootScope.search.coordinateLng = end.split(',')[1];
                searchService.GetBusstopListByRadius(
                    $rootScope.search.currentDate != null ? $rootScope.search.currentDate.ID : 1,
                    $rootScope.search.coordinateLat,
                    $rootScope.search.coordinateLng,
                    300,
                    $rootScope.search.language,
                    $rootScope.search.isEggedDb,
                    function (nearBustopList) {

                        for (var k = 0; k < nearBustopList.length; k++) {
                            for (var j = 0; j < $rootScope.search.currentBusStopList.length; j++)
                                for (var i = 0; i < $rootScope.search.currentBusStopList[j].length; i++) {
                                    if ($rootScope.search.currentBusStopList[j][i].Makat == nearBustopList[k].Makat) {
                                        matchedBusstopList.push($rootScope.search.currentBusStopList[j][i]);
                                    }
                                }
                        }

                        if (matchedBusstopList.length == 0) {
                            $rootScope.search.userMessage = "לא נמצאו תחנות קו בקרבת המיקום שהוזן";
                            return;
                        }

                        for (var i = 0; i < matchedBusstopList.length; i++) {
                            destinationArr.push(new google.maps.LatLng(matchedBusstopList[i].Latitude, matchedBusstopList[i].Longitude));
                        }

                        googleMapsUtil.distanceMatrixService.getDistanceMatrix({
                            origins: [origin],
                            destinations: destinationArr,
                            travelMode: google.maps.TravelMode.WALKING,
                            //transitOptions: google.maps.TravelMode.TRANSIT,
                            //drivingOptions: google.maps.TravelMode.DRIVING,
                            unitSystem: google.maps.UnitSystem.METRIC,
                            avoidHighways: false,
                            avoidTolls: false,
                        },
                        function (response, status) {
                            if (status != "OK") {
                                $rootScope.search.userMessage = "_NoResultsFound_";
                                return;
                            }
                            var minimalDistance = 100000;
                            var minimalDistanceIndex = 0;
                            for (var i = 0; i < response.rows[0].elements.length; i++)
                                if (minimalDistance > response.rows[0].elements[i].distance.value) {
                                    minimalDistanceIndex = i;
                                    minimalDistance = response.rows[0].elements[i].distance.value;
                                }
                            response.destinationAddresses[minimalDistanceIndex]


                            var request = {
                                origin: start,
                                destination: matchedBusstopList[minimalDistanceIndex].Latitude + ',' + matchedBusstopList[minimalDistanceIndex].Longitude,
                                travelMode: google.maps.TravelMode.WALKING
                            };
                            googleMapsUtil.directionsService.route(request, function (response, status) {
                                if (status == google.maps.DirectionsStatus.OK) {
                                    scope.routePedestrianResponse = response;
                                    $rootScope.search.directionsDisplayPedestrian.setDirections(response);
                                    var length = response.routes[0].overview_path.length / 2;
                                    length = parseInt(length);
                                    infoBoxlist.add({
                                        id: "extraAddress"
                                        , latlng: response.routes[0].overview_path[length]
                                        , map: $rootScope.search.map
                                        , clickEvent: function (data) { }
                                        , content: "<div style='color: darkgreen; font-weight: bold;'>" +
                                            response.routes[0].legs[0].distance.text + " " +
                                            response.routes[0].legs[0].duration.text + "</div>"
                                    });

                                    if (!$rootScope.currentPositionMarker)
                                        $rootScope.currentPositionMarker = overlayMarker(response.routes[0].overview_path[0], "current");
                                    else
                                        $rootScope.currentPositionMarker.setPosition(response.routes[0].overview_path[0]);


                                }
                            });

                        });
                    },
                    function () {
                        failCallback();
                    });

            });

            $rootScope.$watch("search.selectedScheduleLine", function (newVal, oldVal) {
                //if (newVal == null || $rootScope.isMapViewed == true) return;
                if (newVal == null) return;
                $rootScope.search.LineNumber = newVal.LineNumber;
                $rootScope.search.makat = newVal.Makat;
                $rootScope.search.chalufa = newVal.Chalufa;
                $rootScope.search.busStationArrangementD = newVal.BusStationArrangementD;
                $rootScope.search.busStationArrangementA = newVal.BusStationArrangementA;
                $rootScope.search.originTime = $filter('date')(new Date(newVal.OriginTime), 'dd/MM/yyyy HH:mm');
                //$rootScope.search.currentBusStopList = transitionService.getBusStopList($rootScope.search.getJsonString());

            });

            $rootScope.$watch("selectedLineIndex", function (newVal, oldVal) {
                if ($rootScope.search.currentBusStopList == null || $rootScope.search.currentBusStopList.length == 0) {
                    //busstopMarkersArray = clearMarkers(busstopMarkersArray);
                    //currentStationsInRange = clearMarkers(currentStationsInRange);
                    //clearRoute();
                    return;
                }
                //busstopMarkersArray = clearMarkers(busstopMarkersArray);
                markBusstops($rootScope.search.currentBusStopList);
            });

            $rootScope.$watch("search.currentBusStopList", function (newVal, oldVal) {
                if (newVal == null || newVal.length == 0) {
                    //busstopMarkersArray = clearMarkers(busstopMarkersArray);
                    infoBoxlist.hideAll();
                    //currentStationsInRange = clearMarkers(currentStationsInRange);
                    //clearRoute();
                    if (currentStationsInLine != null)
                        currentStationsInLine.clear();
                    return;
                }
                //busstopMarkersArray = clearMarkers(busstopMarkersArray);

                //if ($rootScope.search.autocompleteOrigin.coords != null && $rootScope.search.autocompleteOrigin.coords != "")
                //    googleMapsUtil.getNearestBusstop($rootScope.search.autocompleteOrigin.coords, newVal, function (busstop) {
                //        //alert(busstop.BoardingAlighting);
                //        debugger;
                //    }, function () { });
                //if ($rootScope.search.autocompleteDestination.coords != null && $rootScope.search.autocompleteDestination.coords != "")
                //    googleMapsUtil.getNearestBusstop($rootScope.search.autocompleteDestination.coords, newVal, function (busstop) {
                //        //alert(busstop.BoardingAlighting);
                //        debugger;
                //    }, function () { });


                markBusstops(newVal);
            });

            $rootScope.$watch("currentLocation.coords", function (newVal, oldVal) {
                if (newVal == null || newVal == "") {
                    if ($rootScope.currentPositionMarker != null) $rootScope.currentPositionMarker.setMap(null);
                    $rootScope.currentPositionMarker = null;
                    return;
                }

                if (!$rootScope.currentPositionMarker)
                    $rootScope.currentPositionMarker = overlayMarker(new google.maps.LatLng(newVal.latitude, newVal.longitude), "current");
                else
                    $rootScope.currentPositionMarker.setPosition(new google.maps.LatLng(newVal.latitude, newVal.longitude));

            });

            $rootScope.$watch("search.autocompleteOrigin.coords", function (newVal, oldVal) {
                if (newVal == null || newVal == "") {
                    //$rootScope.search.clearFromCity();
                    if ($rootScope.search.originMarker != null) $rootScope.search.originMarker.setMap(null);
                    $rootScope.search.originMarker = null;

                    $rootScope.showTripSegments();
                    $rootScope.search.selectedScheduleLine = null;
                    //busstopMarkersArray = clearMarkers(busstopMarkersArray);
                    infoBoxlist.hideAll();
                    //currentStationsInRange = clearMarkers(currentStationsInRange);
                    clearRoute();

                    //infoBoxlist.hideAll();

                    return;
                }

                var coords = $rootScope.search.autocompleteOrigin.coords.split(',');
                //$rootScope.search.onSelectedAddressFrom({ lat: coords[0], lng: coords[1] });
                if (!$rootScope.search.originMarker) {
                    $rootScope.search.originMarker = overlayMarker(new google.maps.LatLng(coords[0], coords[1]), "origin");
                    $rootScope.currentLocation = { coords: { latitude: coords[0], longitude: coords[1] }, description: "" };
                    //$rootScope.currentLocation = new google.maps.LatLng(coords[0], coords[1]);
                }
                else
                    $rootScope.search.originMarker.setPosition(new google.maps.LatLng(coords[0], coords[1]));

                //$rootScope.search.coordinateLat = coords[0];
                //$rootScope.search.coordinateLng = coords[1];
                //searchService.GetBusstopListByRadius($rootScope.search.getJsonString(), function (rootScopesearchoriginMarkernearBustopList) {
                //    $rootScope.search.originMarker.nearBustopList = rootScopesearchoriginMarkernearBustopList;
                //});

                //setTimeout(function () {
                //    var latlng = new google.maps.LatLng(coords[0], coords[1]);
                //    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                //        if (status == google.maps.GeocoderStatus.OK) {
                //            if (results[0]) {
                //                $rootScope.search.autocompleteOrigin.description = results[0].formatted_address;
                //                scope.$apply();
                //            }
                //        } else {
                //            //alert("Geocoder failed due to: " + status);
                //        }
                //    });
                //});
                //clearRoute();

                if ($rootScope.search.isShowAllBusstops != true && $rootScope.isMapViewed == true) {
                    $rootScope.search.map.setCenter(new google.maps.LatLng(coords[0], coords[1]));
                    $rootScope.search.map.setZoom(15);
                    var listener = google.maps.event.addListener($rootScope.search.map, "idle", function () {
                        $rootScope.search.map.setCenter(new google.maps.LatLng(coords[0], coords[1]));
                        google.maps.event.removeListener(listener);
                    });
                }

                if ($rootScope.search.isShowPedestrianTab == true && $rootScope.search.autocompleteOrigin.coords && $rootScope.search.autocompleteDestination.coords) {
                    clearRoute();
                    calculatePedestrianRoute();
                }

                $rootScope.search.autocompleteExtra = { coords: null, description: "" };

            });

            $rootScope.$watch("search.autocompleteDestination.coords", function (newVal, oldVal) {
                if (newVal == null || newVal == "") {
                    //$rootScope.search.clearToCity();
                    if ($rootScope.search.destinationMarker != null) $rootScope.search.destinationMarker.setMap(null);
                    $rootScope.search.destinationMarker = null;

                    $rootScope.search.selectedScheduleLine = null;
                    //busstopMarkersArray = clearMarkers(busstopMarkersArray);
                    infoBoxlist.hideAll();
                    //currentStationsInRange = clearMarkers(currentStationsInRange);
                    clearRoute();

                    //infoBoxlist.hideAll();
                    return;
                }

                var coords = $rootScope.search.autocompleteDestination.coords.split(',');
                //$rootScope.search.onSelectedAddressTo({ lat: coords[0], lng: coords[1] });
                if (!$rootScope.search.destinationMarker)
                    $rootScope.search.destinationMarker = overlayMarker(new google.maps.LatLng(coords[0], coords[1]), "destination");
                else
                    $rootScope.search.destinationMarker.setPosition(new google.maps.LatLng(coords[0], coords[1]));

                //$rootScope.search.coordinateLat = coords[0];
                //$rootScope.search.coordinateLng = coords[1];
                //searchService.GetBusstopListByRadius($rootScope.search.getJsonString(), function (rootScopesearchdestinationMarkernearBustopList) {
                //    $rootScope.search.destinationMarker.nearBustopList = rootScopesearchdestinationMarkernearBustopList;
                //});

                //setTimeout(function () { 
                //var latlng = new google.maps.LatLng(coords[0], coords[1]);
                //geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                //    if (status == google.maps.GeocoderStatus.OK) {
                //        if (results[0]) {
                //            $rootScope.search.autocompleteDestination.description = results[0].formatted_address;
                //            scope.$apply();
                //        }
                //    } else {
                //        //alert("Geocoder failed due to: " + status);
                //    }
                //});
                //}, 2000);
                //clearRoute();

                if ($rootScope.isMapViewed == true) {
                    $rootScope.search.map.setCenter(new google.maps.LatLng(coords[0], coords[1]));
                    var listener = google.maps.event.addListener($rootScope.search.map, "idle", function () {
                        $rootScope.search.map.setCenter(new google.maps.LatLng(coords[0], coords[1]));
                        google.maps.event.removeListener(listener);
                    });
                }

                //if ($rootScope.search.isShowPedestrianTab == true && $rootScope.search.autocompleteOrigin.coords && $rootScope.search.autocompleteDestination.coords) {
                //    clearRoute();
                //    calculatePedestrianRoute();
                //}

                $rootScope.search.autocompleteExtra = { coords: null, description: "" };
            });

            $rootScope.$watch("search.selectedMapWidjetTab", function (newVal, oldVal) {
                if (newVal == null) return;
                clearRoute();

                //if ($rootScope.search.originMarker != null)
                //    $rootScope.search.autocompleteOrigin.coords = $rootScope.search.originMarker.position.lat() + "," + $rootScope.search.originMarker.position.lng();
                //if ($rootScope.search.destinationMarker != null)
                //    $rootScope.search.autocompleteDestination.coords = $rootScope.search.destinationMarker.position.lat() + "," + $rootScope.search.destinationMarker.position.lng();

                if ($rootScope.search.autocompleteOrigin.coords && $rootScope.search.autocompleteDestination.coords && newVal == "Pedestrian") {
                    var start = $rootScope.search.autocompleteOrigin.coords;
                    var end = $rootScope.search.autocompleteDestination.coords;
                    calculatePedestrianRoute(start, end);
                }
                else {
                    $rootScope.search.pedestrianDistance = "";
                    $rootScope.search.pedestrianDuration = "";
                    $rootScope.showPublicTransport();
                    //scope.$apply();
                }
            });

            $rootScope.$watch("search.nearBustopList", function (newVal, oldVal) {

                if (currentStationsInRange == null)
                    currentStationsInRange = new mapMarkerlist({
                        map: $rootScope.search.map,
                        imagePath: "/Content/images/Popup/",
                        imageName: "Busstop1.png",
                        clickEvent: function (args) {
                            for (var i = 0; i < $rootScope.search.nearBustopList.length; i++) {
                                if ($rootScope.search.nearBustopList[i].Makat == args.makat_) {
                                    $rootScope.search.selectedBusStop = $rootScope.search.nearBustopList[i];
                                    $rootScope.currentLocation = { coords: { latitude: $rootScope.search.selectedBusStop.latitude, longitude: $rootScope.search.selectedBusStop.longitude }, description: "" };
                                    $rootScope.selectedBusstopType = 'near';
                                    //$rootScope.search.map.setZoom(15);
                                    scope.$apply();
                                    break;
                                }
                            }
                        }
                    });
                else
                    currentStationsInRange.clear();

                if (newVal == null || newVal.length == 0)
                    return;

                currentStationsInRange.setMarkerList(newVal);

                if (newVal.length == 1)
                    $rootScope.search.selectedBusStop = newVal[0];
            });

            $rootScope.$watch("search.selectedBusStop", function (newVal, oldVal) {

                if (newVal == null) return;


                if ($rootScope.isMapViewed == true)
                    $rootScope.insertRealtimeToBusstop($rootScope.search.selectedBusStop);

                $rootScope.search.map.setCenter(new google.maps.LatLng(newVal.Latitude, newVal.Longitude));
                //$rootScope.search.map.setZoom(15);

                for (var i = 0; currentStationsInLine != null && i < currentStationsInLine.markerList.length; i++)
                    if (currentStationsInLine.markerList[i].makat_ == $rootScope.search.selectedBusStop.Makat) {
                        currentStationsInLine.setSelectedBusstop(currentStationsInLine.markerList[i]);
                        return;
                    }
                for (var i = 0; currentStationsInRange != null && i < currentStationsInRange.markerList.length; i++)
                    if (currentStationsInRange.markerList[i].makat_ == $rootScope.search.selectedBusStop.Makat) {
                        currentStationsInRange.setSelectedBusstop(currentStationsInRange.markerList[i]);
                        return;
                    }

                //for (var i = 0; i < busstopMarkersArray.length; i++) {
                //    if (oldVal != null && busstopMarkersArray[i].makat == oldVal.Makat) {
                //        var pinIcon = {
                //            url: busstopMarkersArray[i].icon.url,
                //            size: null, /* size is determined at runtime */
                //            origin: null, /* origin is 0,0 */
                //            anchor: new google.maps.Point(8, 8),
                //            scaledSize: new google.maps.Size(16, 16)
                //        };
                //        busstopMarkersArray[i].setIcon(pinIcon);
                //    }
                //    if (busstopMarkersArray[i].makat == newVal.Makat) {
                //        var pinIcon = {
                //            url: busstopMarkersArray[i].icon.url,
                //            size: null, /* size is determined at runtime */
                //            origin: null, /* origin is 0,0 */
                //            anchor: new google.maps.Point(16, 16),
                //            scaledSize: new google.maps.Size(32, 32)
                //        };
                //        busstopMarkersArray[i].setIcon(pinIcon);
                //        $rootScope.search.map.setCenter(new google.maps.LatLng(newVal.Latitude, newVal.Longitude));
                //    }
                //}
                //for (var i = 0; i < currentStationsInRange.length; i++) {
                //    if (oldVal != null && currentStationsInRange[i].makat == oldVal.Makat) {
                //        var pinIcon = {
                //            url: currentStationsInRange[i].icon.url,
                //            size: null, /* size is determined at runtime */
                //            origin: null, /* origin is 0,0 */
                //            anchor: new google.maps.Point(8, 8),
                //            scaledSize: new google.maps.Size(16, 16)
                //        };
                //        currentStationsInRange[i].setIcon(pinIcon);
                //    }
                //    if (currentStationsInRange[i].makat == newVal.Makat) {
                //        var pinIcon = {
                //            url: currentStationsInRange[i].icon.url,
                //            size: null, /* size is determined at runtime */
                //            origin: null, /* origin is 0,0 */
                //            anchor: new google.maps.Point(16, 16),
                //            scaledSize: new google.maps.Size(32, 32)
                //        };
                //        currentStationsInRange[i].setIcon(pinIcon);
                //        $rootScope.search.map.setCenter(new google.maps.LatLng(newVal.Latitude, newVal.Longitude));
                //    }
                //}

                //currentStationsInRange.setSelectedBusstop(newVal);

            });

            $rootScope.$watch("isMapViewed", function (newVal, oldVal) {


                if (!newVal) return;
                setTimeout(function () {
                    if ($rootScope.isMapViewed == true) {
                        if ($rootScope.search.currentBusStopList && $rootScope.search.currentBusStopList.length > 0) {

                            //var bounds = new google.maps.LatLngBounds();
                            //bounds.extend(new google.maps.LatLng(31.773873, 35.183309));
                            //bounds.extend(new google.maps.LatLng(31.797086, 34.038095));
                            //$rootScope.search.map.fitBounds(bounds);
                            //setTimeout(function () {
                            //    setZoomToIncludeAllMarkers(busstopMarkersArray);
                            //}, 1000);

                            //if ($rootScope.search.isShowAllBusstops != true && $rootScope.search.selectedBusStop != null)
                            //{

                            //    $rootScope.search.map.setCenter(new google.maps.LatLng($rootScope.search.selectedBusStop.Latitude, $rootScope.search.selectedBusStop.Longitude));
                            //    $rootScope.search.map.setZoom(16);
                            //    var listener = google.maps.event.addListener($rootScope.search.map, "idle", function () {
                            //        $rootScope.search.map.setCenter(new google.maps.LatLng($rootScope.search.selectedBusStop.Latitude, $rootScope.search.selectedBusStop.Longitude));
                            //        $rootScope.search.map.setZoom(16);
                            //        google.maps.event.removeListener(listener);
                            //    });

                            //}
                            //else {
                            //    var busstopArray = [];
                            //    for (var i = 0; i < $rootScope.search.currentBusStopList.length; i++)
                            //        if ($rootScope.search.currentBusStopList[i].BoardingAlighting == strBoarding || $rootScope.search.currentBusStopList[i].BoardingAlighting == strAlighting)
                            //            busstopArray.push($rootScope.search.currentBusStopList[i]);
                            //    setZoomToIncludeAllMarkers(busstopArray);
                            //}
                        }
                        else {
                            var bounds = new google.maps.LatLngBounds();
                            bounds.extend(new google.maps.LatLng(31.773873, 35.183309));
                            bounds.extend(new google.maps.LatLng(31.797086, 34.038095));
                            $rootScope.search.map.fitBounds(bounds);
                            //$rootScope.search.map.setZoom($rootScope.search.map.zoom - 1);
                            //$rootScope.search.map.panBy(30, 0);
                        }
                    }
                    setTimeout(function () {
                        google.maps.event.trigger($rootScope.search.map, "resize");
                    }, 1000);
                }, 100);

            });

        }

        function clearMarkers(MarkerArray) {
            for (var j = 0; j < MarkerArray.length; j++) {
                MarkerArray[j].setMap(null);
            }
            MarkerArray = [];

            //while (infoWindowList.length > 0)
            //{
            //    infoWindowList[0].remove();
            //    infoWindowList.splice(0, 1);
            //}

            //for (var i = 0; i < infoWindowList.length; i++) {
            //    infoWindowList[i].remove();
            //}
            //infoWindowList = [];

            return [];
        }

        function clearRoute() {

            if ($rootScope.search.directionsDisplayPedestrian != null) {
                var boardingDirections = $rootScope.search.directionsDisplayPedestrian.directions;
                if (boardingDirections != null) {
                    boardingDirections.routes = [];
                    $rootScope.search.directionsDisplayPedestrian.setDirections(boardingDirections);
                }
            }
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
            //scope.$apply();

        }

        function calculatePedestrianRoute(start, end) {
            //var start = $rootScope.search.autocompleteOrigin.coords;
            //var end = $rootScope.search.autocompleteDestination.coords;
            //if (start == end) return;
            if ($rootScope.search.destinationMarker)
                start = $rootScope.search.originMarker.position.lat() + "," + $rootScope.search.originMarker.position.lng();
            if ($rootScope.search.destinationMarker)
                end = $rootScope.search.destinationMarker.position.lat() + "," + $rootScope.search.destinationMarker.position.lng();

            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.WALKING
            };
            googleMapsUtil.directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    scope.routePedestrianResponse = response;
                    $rootScope.search.directionsDisplayPedestrian.setDirections(response);
                    var length = response.routes[0].overview_path.length / 2;
                    length = parseInt(length);
                    infoBoxlist.add({
                        id: "extraAddress"
                        , latlng: response.routes[0].overview_path[length]
                        , map: $rootScope.search.map
                        , clickEvent: function (data) { }
                        , content: "<div style='color: darkgreen; font-weight: bold;'>" +
                            response.routes[0].legs[0].distance.text + " " +
                            response.routes[0].legs[0].duration.text + "</div>"
                    });
                    $rootScope.search.pedestrianDistance = response.routes[0].legs[0].distance.text;
                    $rootScope.search.pedestrianDuration = response.routes[0].legs[0].duration.text;
                    scope.$apply();

                    //var points = [];
                    //points.push(new google.maps.LatLng(response.Wb.origin.split(',')[0], response.Yb.origin.split(',')[1]));
                    //points.push(new google.maps.LatLng(response.Wb.destination.split(',')[0], response.Yb.destination.split(',')[1]));
                    //setZoomToIncludeAllMarkers(points);
                }
            });
        }

        function setZoomToIncludeAllMarkers(markerList) {
            if (markerList.length == 0) return;
            var bounds = new google.maps.LatLngBounds();
            for (i = 0; i < markerList.length; i++)
                bounds.extend(new google.maps.LatLng(markerList[i].position.lat(), markerList[i].position.lng()));
            $rootScope.search.map.fitBounds(bounds);
            //$rootScope.search.map.setZoom($rootScope.search.map.zoom - 1);
            //if (localize.language == "he-IL")
            //    $rootScope.search.map.panBy(0, -30);
            //else
            //    $rootScope.search.map.panBy(0, 30);
        }

        function overlayMarker(position, markerType) {
            var markerIcon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
            if (!position) return;
            if (markerType == "current")
                //markerIcon = { url: "/Content/images/MyLocationBlack.png", scaledSize: markerSize }
                markerIcon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
            //markerIcon = "/Content/images/MyLocationBlack.png";
            if (markerType == "origin")
                markerIcon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
            if (markerType == "destination")
                markerIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

            var newBusstop = new google.maps.Marker({
                icon: markerIcon,
                position: new google.maps.LatLng(position.lat(), position.lng()),
                zIndex: 100,
                map: $rootScope.search.map
                //,title: "",
                //icon: {
                //    url: "/Content/images/Popup/" + imageName,
                //    scaledSize: markerSize
                //}
            });
            return newBusstop;
        }

        function markBusstops(busStationList) {

            var lastAlightbusstop = null;
            var boundStations = [];
            var imageName = "Busstop.png";
            var busstopMarkersArray = [];

            infoBoxlist.hideAll();

            if (currentStationsInLine == null)
                currentStationsInLine = new mapMarkerlist({
                    map: $rootScope.search.map,
                    imagePath: "/Content/images/Popup/",
                    imageName: imageName,
                    clickEvent: function (args) {

                        for (var j = 0; j < $rootScope.search.currentBusStopList.length; j++) {
                            for (var i = 0; i < $rootScope.search.currentBusStopList[j].length; i++) {
                                if ($rootScope.search.currentBusStopList[j][i].Makat == args.makat_) {
                                    $rootScope.search.selectedBusStop = $rootScope.search.currentBusStopList[j][i];
                                    $rootScope.currentLocation = { coords: { latitude: $rootScope.search.selectedBusStop.latitude, longitude: $rootScope.search.selectedBusStop.longitude }, description: "" };
                                    //$rootScope.currentLocation = new google.maps.LatLng($rootScope.search.selectedBusStop.Latitude, $rootScope.search.selectedBusStop.Longitude);
                                    $rootScope.selectedBusstopType = 'trip';
                                    //$rootScope.search.map.setZoom(15);
                                    break;
                                }
                            }
                        }
                    }
                });
            else
                currentStationsInLine.clear();

            for (var j = 0; j < busStationList.length; j++) {
                if ($rootScope.selectedLineIndex == -1 || $rootScope.selectedLineIndex == j) {
                    switch (j) {
                        case 0:
                            imageName = "BusstopGreenBorder.png";
                            break;
                        case 1:
                            imageName = "BusstopYellowBorder.png";
                            break;
                        case 2:
                            imageName = "BusstopRedBorder.png";
                            break;
                    }
                }
                else
                    continue;

                var isOverlayBusstop = true;

                if (j != 0)
                    isOverlayBusstop = false;

                for (var i = 0; i < busStationList[j].length; i++) {

                    if (busStationList[j][i].BoardingAlighting == strBoarding)
                        isOverlayBusstop = true;

                    if (isOverlayBusstop == true || $rootScope.selectedLineIndex != -1) {

                        if (busStationList[j][i].BoardingAlighting == strBoarding) {

                            if (j == 0 && $rootScope.search.selectedBusStop == null) {
                                $rootScope.search.selectedBusStop = busStationList[j][i];
                                $rootScope.selectedBusstopType = 'trip';
                            }

                            infoBoxlist.add({
                                id: busStationList[j][i].Makat
                                , latlng: new google.maps.LatLng(busStationList[j][i].Latitude, busStationList[j][i].Longitude)
                                , map: $rootScope.search.map
                                , marker: busStationList[j][i]
                                , clickEvent: function (data) {
                                    $rootScope.search.selectedBusStop = data;
                                    $rootScope.currentLocation = { coords: { latitude: $rootScope.search.selectedBusStop.latitude, longitude: $rootScope.search.selectedBusStop.longitude }, description: "" };
                                    $rootScope.selectedBusstopType = 'trip';
                                    //$rootScope.search.map.setZoom(15);
                                }
                                , content: "<div style='font-size: 17px; text-align: center; color: darkgreen; '>" + busStationList[j][i].BoardingAlighting + "</div>"
                            });
                        }

                        if (busStationList[j][i].BoardingAlighting == strAlighting) {
                            infoBoxlist.add({
                                id: busStationList[j][i].Makat
                                , latlng: new google.maps.LatLng(busStationList[j][i].Latitude, busStationList[j][i].Longitude)
                                , map: $rootScope.search.map
                                , marker: busStationList[j][i]
                                , clickEvent: function (data) {
                                    $rootScope.search.selectedBusStop = data;
                                    $rootScope.currentLocation = { coords: { latitude: $rootScope.search.selectedBusStop.latitude, longitude: $rootScope.search.selectedBusStop.longitude }, description: "" };
                                    $rootScope.selectedBusstopType = 'trip';
                                    //$rootScope.search.map.setZoom(15);
                                }
                                , content: "<div style='font-size: 17px; text-align: center; color: darkred; '>" + busStationList[j][i].BoardingAlighting + "</div>"
                            });
                        }
                    }

                    if (isOverlayBusstop == true || $rootScope.selectedLineIndex != -1)
                        busstopMarkersArray.push(busStationList[j][i]);

                    if (busStationList[j][i].BoardingAlighting == strAlighting)
                        isOverlayBusstop = false;

                    if (j == busStationList.length - 1 && busStationList[j][i].BoardingAlighting == strAlighting)
                        isOverlayBusstop = true;

                }

                currentStationsInLine.setImageName(imageName);
                currentStationsInLine.setMarkerList(busstopMarkersArray);


            }
            //scope.$apply();
        }

    }
});

