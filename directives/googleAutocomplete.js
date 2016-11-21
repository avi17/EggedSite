mslApp.directive('googleAutocomplete', function ($timeout, $rootScope, transitionService, globalFunctions, localize, googleMapsUtil) {
    return {
        replace: true,
        scope: {
            "selectedValue": "=",
            "ngModel": "="
        },
        templateUrl: '/app/views/directive/googleAutocomplete.html',
        link: function (scope, element, attrs, ctrl) {

            scope.inputValue = "";
            scope.isPopupVisible = false;
            scope.predictionList = [];
            scope.selectedPrediction = null;
            scope.isSearchByAddress = true;
            scope.popupWidth = "30px";
            var elementText = "",
                stoppedTyping;


            scope.$watch("inputValue", function (newValue, oldValue) {
                if (newValue == null || newValue.length == 0) {
                    scope.predictionList = [];
                }
            });

            scope.inputFocused = function () {
                $timeout(function () {
                    scope.isPopupVisible = true;
                    scope.popupWidth = $(element)[0].clientWidth;
                    //scope.selectedValue = '';
                }, 300);
            }

            scope.inputBlured = function () {
                $timeout(function () {
                    scope.isPopupVisible = false;
                    //if (scope.selectedValue == '' && scope.inputValue != '')
                    //$rootScope.search.userMessage = "_ExittedWithoutSelectingAddress_";
                }, 300);
            }

            scope.inputKeyUp = function (e) {

                if (scope.selectedPrediction == null) {
                    //scope.selectedValue = '';
                }

                switch (e.which) {
                    case 13:        //enter
                        if ($($(element).find(".txtGoogleSearch")[0]).val() == "")
                            scope.showCurrentLocation();
                        else {
                            if (scope.isSearchByAddress != true) {
                                var makat = $($(element).find(".txtGoogleSearch")[0]).val();
                                scope.predictionSelected({ description: makat });
                            }
                            else
                                scope.predictionSelected(scope.selectedPrediction);
                        }
                        break;
                    case 36:        //home
                        setSelectedPrediction(0);
                        break;
                    case 35:        //end
                        setSelectedPrediction(scope.predictionList.length - 1);
                        break;
                    case 27:        //escape
                        $($(element).find(".txtGoogleSearch")[0]).blur();
                        break;
                    case 38:        //up
                        if (scope.predictionList.length == 0) return;
                        if (scope.selectedPrediction != null) {
                            for (var i = 0; i < scope.predictionList.length; i++) {
                                if (scope.predictionList[i].id == scope.selectedPrediction.id)
                                    if (i == 0) {
                                        setSelectedPrediction(scope.predictionList.length - 1);
                                        break;
                                    }
                                    else {
                                        setSelectedPrediction(i - 1);
                                        break;
                                    }
                            }
                        }
                        else {
                            setSelectedPrediction(scope.predictionList.length - 1);
                        }
                        //element[0].value = scope.selectedPrediction.name;
                        break;
                    case 40:        //down
                        if (scope.predictionList.length == 0) {
                            scope.currentPosition = true;
                            return;
                        }
                        else scope.currentPosition = false;
                        if (scope.selectedPrediction != null) {
                            for (var i = 0; i < scope.predictionList.length; i++) {
                                if (scope.predictionList[i].id == scope.selectedPrediction.id)
                                    if (i == scope.predictionList.length - 1) {
                                        setSelectedPrediction(0);
                                        break;
                                    }
                                    else {
                                        setSelectedPrediction(i + 1);
                                        break;
                                    }
                            }
                        }
                        else {
                            setSelectedPrediction(0);
                        }
                        break;
                    default:
                        if (stoppedTyping) clearTimeout(stoppedTyping);
                        stoppedTyping = setTimeout(function () {
                            if (scope.inputValue != "") {
                                scope.predictionList = [];
                                googleMapsUtil.autocompleteService.getPlacePredictions({
                                    input: scope.inputValue,
                                    componentRestrictions: { country: "il" }
                                }, serviceCallback);
                                googleMapsUtil.autocompleteService.getPlacePredictions({
                                    input: scope.inputValue,
                                    componentRestrictions: { country: "ps" }
                                }, serviceCallback);
                            }
                        }, 50);
                        break;
                }

            }

            scope.predictionSelected = function (selectedPrediction) {
                if (selectedPrediction == null) return;

                if (scope.isSearchByAddress != true) {
                    if (scope.predictionList.length > 0)
                        $rootScope.search.makat = scope.predictionList[0].description;
                    else
                        $rootScope.search.makat = selectedPrediction.description;

                    transitionService.getBusStopByMakat(
                        $rootScope.search.makat,
                        $rootScope.search.language,
                        scope.isEggedDb,
                        function (busStopByMakatVal) {
                            var busstop = busStopByMakatVal;
                            scope.selectedValue = busstop.Latitude + "," + busstop.Longitude;
                            $timeout(function () {
                                scope.predictionList = [];
                            }, 500)
                        });
                }
                else {
                    var resultAddress = selectedPrediction.description;
                    var request = { reference: selectedPrediction.reference };
                    googleMapsUtil.placesService.getDetails(request, function (place, status) {
                        $timeout(function () {
                            scope.predictionList = [];
                        }, 500)
                        scope.selectedValue = place.geometry.location.lat() + "," + place.geometry.location.lng();
                        scope.ngModel = resultAddress;
                        scope.inputValue = resultAddress;
                    });
                }

                setTimeout(function () {
                    if (appConfig.isEggedDb == true) return;
                    if (attrs.ngModel.indexOf("autocompleteOrigin") > -1)
                        $($("#bydestToAddress").find(":input[type=text]")[0]).focus();
                    if (attrs.ngModel.indexOf("autocompleteDestination") > -1)
                        $("#bydestSearchButton").focus();
                }, 500);

            }

            scope.showCurrentLocation = function () {
                globalFunctions.getCurrentPosition(function (position) {
                    $rootScope.currentLocation = { coords: { latitude: position.coords.latitude, longitude: position.coords.longitude }, description: "" };
                    globalFunctions.getAddressFromCoords(position.coords.latitude, position.coords.longitude,
                        function (resultAddress) {
                            if (position.coords.latitude != "" && position.coords.longitude != "")
                                coords = position.coords.latitude + "," + position.coords.longitude;
                            scope.selectedValue = coords;
                            scope.ngModel = resultAddress;
                            //if (resultAddress.indexOf("'") > -1)
                            //    $rootScope.$eval(attrs.ngModel + '="' + resultAddress + '"');
                            //else
                            //    $rootScope.$eval(attrs.ngModel + "='" + resultAddress + "'");
                            scope.inputValue = resultAddress;
                        });
                },
function () { });

            }

            function initialize() {


                //$($(element).find(".txtGoogleSearch")[0]).focus(function () {
                //    $timeout(function () {
                //        scope.isPopupVisible = true;
                //        scope.popupWidth = $(element)[0].clientWidth;
                //    }, 500);
                //});

                //$($(element).find(".txtGoogleSearch")[0]).blur(function () {
                //    $timeout(function () {
                //        scope.isPopupVisible = false;
                //    }, 500);
                //});

                $($(element).find(".txtGoogleSearch")[0]).attr("id", element[0].id);

                scope.isEggedDb = appConfig.isEggedDb;

                $rootScope.$watch("isGoogleReachable", function (newVal, oldVal) {
                    if (newVal == true) {
                        //map = new google.maps.Map(mapContainer[0]);
                    }
                });

                scope.$watch("isSearchByAddress", function (newValue, oldValue) {

                    if (newValue == true)
                    {
                        $($(element).find(".txtGoogleSearch")[0]).attr("placeholder", attrs.ngPlaceholder);
                    }
                    else
                    {
                        var strStationNumber = localize.getLocalizedString("_StationNumber_");
                        $($(element).find(".txtGoogleSearch")[0]).attr("placeholder", strStationNumber);
                    }

                    //$($(element).find(".txtGoogleSearch")[0]).focus();
                });

                scope.$watch("ngModel", function (newVal, oldVal) {
                    if (newVal == null) return;
                    $(element).find(".txtGoogleSearch")[0].value = newVal;
                });

            }

            initialize();

            function setSelectedPrediction(prectionIndex) {
                $timeout(function () {
                    scope.selectedPrediction = scope.predictionList[prectionIndex];
                    scope.inputValue = scope.selectedPrediction.description;
                    //scope.$apply()
                    //predictionListDiv.find(".predictionDiv").each(function () { $(this).css("background-color", "white"); });
                    //predictionListDiv.find(".predictionDiv:nth-child(" + (prectionIndex + 1).toString() + ")").css("background-color", "#ebf2fe");
                }, 50);
            }

            function serviceCallback(predictions, status) {

                if (predictions == null || scope.isSearchByAddress != true) return;
                scope.selectedPrediction = null;
                scope.predictionList = [];
                for (var j = 0; j < predictions.length; j++) {
                    var isDuplicated = false;
                    for (var i = 0; i < scope.predictionList.length; i++) {
                        if (scope.predictionList[i].id == predictions[j].id)
                            isDuplicated = true;
                    }
                    if (isDuplicated != true)
                        scope.predictionList.push(predictions[j]);
                }
                if (scope.predictionList.length > 0)
                    scope.selectedPrediction = scope.predictionList[0];
                scope.$apply();
            }

        }

    }
});
