mslApp.directive('alternativeLocationPopup', function ($rootScope, localize) {
    return {
        templateUrl: '/app/views/directive/alternativeLocationPopup.htm',
        link: function postLink(scope, element, attrs) {

            //if ($rootScope.isGoogleReachable == false) return;

            var map;
            var mapContainer = null;
            var busstopMarkersArray = [];
            var currentSelectionMarker;
            var dialogAlternativeLocationPopup;
            var isSourceAddress = true;

            function handleNewLocationList() {

                scope.$eval(attrs.ngSourceList + "=''");
                scope.$eval(attrs.ngDestinationList + "=''");
                //if ($(".AlternativeLocationPopup").length > 0)
                //    $(element).dialog('open');
                //else

                //$rootScope.$watch("isGoogleReachable", function (newVal, oldVal) {
                //    if (newVal == true) {
                //        init();
                //    }
                //});

                init();
            }

            function changeLanguage() {
                ////debugger;
                //$(element).find(".ui-button").each(function () {
                //    //debugger;
                //    //$(this).
                //});
                //if (localize.language == "en-US") {

                //}
                //else {

                //}
            }

            scope.$watch(localize.language, function (newVal, oldVal) {
                changeLanguage();
            });

            scope.$watch(attrs.ngSourceList, function (newVal, oldVal) {
                if (newVal == null || newVal == "") return;
                if (newVal != "") {
                    isSourceAddress = true;
                    scope.locationArray = scope.$eval(attrs.ngSourceList);
                    handleNewLocationList();
                }
                else
                    $(element).css("display", "none");

                setTimeout(function () {
                    $(".btnRadio:first", element).focus();
                }, 150);

            });

            scope.$watch(attrs.ngDestinationList, function (newVal, oldVal) {
                if (newVal == null || newVal == "") return;
                if (newVal != "") {
                    isSourceAddress = false;
                    scope.locationArray = scope.$eval(attrs.ngDestinationList);
                    handleNewLocationList();
                }
                else
                    $(element).css("display", "none");

                setTimeout(function () {
                    $(".btnRadio:first", element).focus();
                }, 150);

            });

            scope.locationChanged = function (selectedItem) {
                scope.selectedQuarter = $.grep(scope.locationArray, function (e) { return e.Quarter.ID == selectedItem.Quarter.ID; })[0];
                markBusStations(scope.selectedQuarter.BusStopList);
            }

            //scope.mouseLeft = function () {
            //    scope.isMouseOverSelectBox = false;
            //}
            //scope.mouseEntered = function () {
            //    scope.isMouseOverSelectBox = true;
            //}

            scope.btnOkClicked = function () {
                if (!scope.selectedQuarter) return;
                var retCity = scope.selectedQuarter.City;
                var retQuarter = scope.selectedQuarter.Quarter;
                if (isSourceAddress == true) {
                    $rootScope.alternativeSourceSelected(retCity, retQuarter);
                }
                else {
                    $rootScope.alternativeDestinationSelected(retCity, retQuarter);
                }
                $(dialogAlternativeLocationPopup).dialog("close");
            }

            function init() {
                var strAlternativeStationsNearby = localize.getLocalizedString("_AlternativeStationsNearby_");

                if (dialogAlternativeLocationPopup == null) {
                    $(element)[0].title = strAlternativeStationsNearby;
                    dialogAlternativeLocationPopup = $(element)
                        .dialog({
                            width: $(window).width() * 0.75,
                            height: $(window).height() * 0.75,
                            modal: true,
                            dialogClass: 'DialogWindow',
                            open: function (event, ui) {
                                $('.ui-widget-overlay').bind('click', function () {
                                    $(event.target).dialog('close');
                                });

                                var btnCancel = "Close";
                                if (localize.language == "he-IL")
                                    btnCancel = "סגור";
                                $($(event.target).prev().find(".ui-dialog-titlebar-close")[0]).attr("title", btnCancel);
                            }
                    , close: function (event, ui) {
                        $(".siteLogoImage").focus();
                        //setTimeout(function () {
                        //    return false;
                        //}, 3000);
                    }
                    , beforeClose: function myCloseDialog(e) {
                        $(".siteLogoImage").focus();
                        //e.preventDefaults();
                        //return false;
                    },
                            show: {
                                effect: "blind",
                                duration: 100
                            },
                            hide: {
                                effect: "blind",
                                duration: 100
                            }
                        })
                        .bind('dialogclose', function (event) {
                            $rootScope.search.searchFromSelector = "egged";
                            $rootScope.search.searchToSelector = "egged";
                            //scope.$apply();
                        });

                    var featureType =
                    [{
                        "featureType": "transit.station",
                        "stylers": [{ "visibility": "off" }]
                    }, {
                        "featureType": "poi",
                        "stylers": [{ "visibility": "off" }]
                    }];


                    var mapOptions =
                        {
                            styles: featureType,
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            scaleControl: false,
                            zoomControl: false,
                            panControl: false,
                            mapTypeControl: false,
                            streetViewControl: false,
                            center: new google.maps.LatLng(31.773873, 35.183309),
                            minZoom: 9,
                            zoom: 12
                        };
                    mapContainer = $(element).find(".AlternativeLocationPopup");

                    map = new google.maps.Map(mapContainer[0], mapOptions);
                    //var styles = [{
                    //    "featureType": "transit.station.bus",
                    //    "stylers": [{ "visibility": "off" }]
                    //}];
                    //map.setOptions({ styles: styles });
                }

                setMarkerPosition(new google.maps.LatLng(attrs.originalLocation.split(',')[0], attrs.originalLocation.split(',')[1]));
                $(".AlternativeLocationPopup").parent().parent().css("padding", "0");
                $(".AlternativeLocationPopup").parent().show();
                scope.selectedQuarter = scope.locationArray[0];

                setTimeout(function () {

                    google.maps.event.trigger(map, "resize");
                    var btnNext = $(".btnGreen", element);

                    $(".btnRadio:first", element).focus();

                    //$(".btnRadio").each(function () {
                    //    $(this).bind("keydown keypress", function (event) {
                    //        if (event.which == 9) {
                    //            $(btnNext).focus();
                    //            event.preventDefault();
                    //        }
                    //    });
                    //});

                    $(btnNext).bind("focus", function (event) {
                        $(this).css("border", "1px solid red");
                    });

                    $(btnNext).bind("blur", function (event) {
                        $(this).css("border", "0");
                    });

                }, 100);
                scope.locationChanged(scope.selectedQuarter);
                //scope.isMouseOverSelectBox = true;
                $(dialogAlternativeLocationPopup).dialog("open");
            }

            function setMarkerPosition(pos) {
                map.setCenter(pos);

                if (currentSelectionMarker == null) {
                    currentSelectionMarker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        title: ""
                    });
                }
                else
                    currentSelectionMarker.setPosition(pos);
            }

            function clearMarkers(MarkerArray) {
                for (var j = 0; j < MarkerArray.length; j++)
                    MarkerArray[j].setMap(null);
                MarkerArray = [];
            }

            function markBusStations(busStationList) {
                clearMarkers(busstopMarkersArray);
                for (var i = 0; i < busStationList.length; i++) {
                    var newBusstop = new google.maps.Marker({
                        position: new google.maps.LatLng(busStationList[i].Latitude, busStationList[i].Longitude),
                        map: map,
                        title: "תחנה " + busStationList[i].Name,
                        icon: "/Content/images/Popup/Busstop.png"
                    });
                    busstopMarkersArray.push(newBusstop);
                }
                setTimeout(function () {
                    setZoomToIncludeAllMarkers(busStationList);
                }, 1000);
            }

            function setZoomToIncludeAllMarkers(busStationList) {
                var bounds = new google.maps.LatLngBounds();
                bounds.extend(new google.maps.LatLng(attrs.originalLocation.split(',')[0], attrs.originalLocation.split(',')[1]));
                for (i = 0; i < busStationList.length; i++) {
                    bounds.extend(new google.maps.LatLng(busStationList[i].Latitude, busStationList[i].Longitude));
                }
                map.fitBounds(bounds);
                google.maps.event.trigger(map, "resize");

            }

        }
    }
});

