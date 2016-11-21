mslApp.provider('globalFunctions', function globalFunctionsProvider() {

    var self = this;

    this.$get = function ($timeout, $rootScope, localize) {

        var geocoder = null;
        if (Object.getOwnPropertyDescriptor(self, 'geocoder') == null) {
            Object.defineProperty(self, 'geocoder',
            {
                get: function () {
                    if (geocoder == null)
                        geocoder = new google.maps.Geocoder();
                    return geocoder;
                },
                set: function (value) {
                    geocoder = value;
                }
            });
        }

        return {

            getParameterByName: function (name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(location);
                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            },

            printHtml: function (htmlContent) {
                var dir;
                if (localize.language == "he-IL") dir = "rtl";
                else dir = "ltr";
                var mywindow = window.open('', 'to_print', 'height=700,width=1200');
                var html = '<html><head><title></title>' +
                           '<link href="app/css/' + $rootScope.currentCssFilename + '.css" rel="stylesheet" />' +
                            //'<style>.no-print{display:none}</style>' +
                           '</head><body style="direction: ' + dir + ';" onload="window.focus(); window.print(); window.close();">' +
                           htmlContent +
                           '</body></html>';
                mywindow.document.write(html);
                mywindow.document.close();
                return true;
            },

            getAddressFromCoords: function (lat, lng, successCallback) {
                var latlng = new google.maps.LatLng(lat, lng);
                self.geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            $timeout(function () {
                                successCallback(results[1].formatted_address);
                            }, 50);
                        }
                    }
                });
            },

            getCurrentPosition: function (successCallback, errorCallback) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        successCallback(position);
                    },
                    function (error) {
                        var errorMessage = "";
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                //errorMessage += "_GeolocationPermissionDenied_";
                                break;
                            case error.POSITION_UNAVAILABLE:
                                errorMessage += "_GeolocationPositionUnavailable_";
                                break;
                            case error.TIMEOUT:
                                errorMessage += "_GeolocationTimeout_";
                                break;
                            case error.UNKNOWN_ERROR:
                                errorMessage += "_GeolocationUnknownError_";
                                break;
                        }
                        if ($rootScope.isMobileBrowser == true)
                            errorMessage += ",_TurnOnLocationServices_";
                        $rootScope.search.userMessageTitle = "_CurrentPosition_";
                        $rootScope.search.userMessage = errorMessage;
                        $rootScope.$apply();
                        errorCallback();
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000, // 10s
                        //maximumAge : 0
                    });
                }
                else {
                    //$rootScope.search.userMessage = "_GeolocationNotSupported_";
                }
            },

            TimeBiggerThan: function (time1, time2) {
                var hour1 = parseInt(time1.split(':')[0]);
                var hour2 = parseInt(time2.split(':')[0]);
                var minute1 = parseInt(time1.split(':')[1]);
                var minute2 = parseInt(time2.split(':')[1]);

                total1 = hour1 * 60 + minute1;
                total2 = hour2 * 60 + minute2;

                if (total1 > total2)
                    return true;
                else
                    return false;
            },

            TimeSmallerThan: function (DtOriginBusstop, DtDestinationBusstop) {

                var tempdate = DtOriginBusstop.split('T')[0];
                var temptime = DtOriginBusstop.split('T')[1];
                var tempyear = tempdate.split('-')[0];
                var tempmonth = tempdate.split('-')[1];
                var tempday = tempdate.split('-')[2];
                var temphour = temptime.split(':')[0];
                var tempminute = temptime.split(':')[1];
                var originDate = new Date(tempyear, tempmonth - 1, tempday, temphour, tempminute, 0, 0);

                tempdate = DtDestinationBusstop.split('T')[0];
                temptime = DtDestinationBusstop.split('T')[1];
                tempyear = tempdate.split('-')[0];
                tempmonth = tempdate.split('-')[1];
                tempday = tempdate.split('-')[2];
                temphour = temptime.split(':')[0];
                tempminute = temptime.split(':')[1];
                var destinationDate = new Date(tempyear, tempmonth - 1, tempday, temphour, tempminute, 0, 0);

                if (originDate < destinationDate)
                    return true;
                else
                    return false;
            },

            roundTwoDigits: function (inputValue) {
                var retVal = inputValue.toString() + ".00";
                if (inputValue.toString().indexOf(".") > -1)
                    retVal = inputValue.toString().substring(0, inputValue.toString().indexOf(".") + 3);
                return retVal;
            },

            roundOneDigit: function (inputValue) {
                var retVal = inputValue.toString() + ".0";
                if (inputValue.toString().indexOf(".") > -1)
                    var retVal = inputValue.toString().substring(0, inputValue.toString().indexOf(".") + 2);
                return retVal;
            },

            convertMinutesTohours: function (totalMinutes) {
                var iHour = 0;
                var iMinute = 0;
                var sHour = "";
                var sMinute = "";
                iHour = totalMinutes / 60;
                iHour = parseInt(iHour);
                iMinute = totalMinutes - 60 * iHour;
                //iMinute = iMinute * 60;
                //iMinute = iMinute * 100;
                //iMinute = parseInt(iMinute);
                if (iHour < 10)
                    sHour = "0" + iHour.toString();
                else
                    sHour = iHour.toString();
                if (iMinute < 10)
                    sMinute = "0" + iMinute.toString();
                else
                    sMinute = iMinute.toString();
                return sHour + ":" + sMinute;
            },

            parse: function (nameToParse) {
                var tempName = angular.copy(nameToParse);
                if (tempName == null)
                    return "";
                if (tempName.indexOf('<') == -1)
                    return tempName;

                var startIndex = tempName.indexOf("<span");
                var endIndex = tempName.indexOf("</span>");

                tempName = tempName.substring(startIndex, endIndex + 7);

                if ($(tempName).length > 0) {
                    pureName = $(tempName)[0].title;
                    var separatorPos = pureName.indexOf(":");
                    if (separatorPos > -1)
                        pureName = pureName.slice(0, separatorPos - 1);
                }

                return pureName;
            },

            getDistanceAndDirection: function (lat1, long1, lat2, long2) {

                //http://stackoverflow.com/questions/15890081/calculate-distance-in-x-y-between-two-gps-points
                //long1 = -71.02; lat1 = 42.33;
                //long2 = -73.94; lat2 = 40.66;

                var dlong = (long2 - long1) * Math.PI / 180;
                var dlat = (lat2 - lat1) * Math.PI / 180;

                // Haversine formula:
                var R = 6371;
                var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlong / 2) * Math.sin(dlong / 2)
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;

                //var dy = lat2 - lat1;
                //var dx = Math.cos(Math.PI / 180 * lat1) * (long2 - long1);
                //var angle = Math.atan2(dy, dx);

                //var angle = Math.atan((long1 - long2) / (lat2 - lat1)) * (180 / Math.PI);

                var deltaY = long2 - long1;
                var deltaX = lat2 - lat1;

                //deltaX = (deltaX > 0 ? deltaX : (2 * Math.PI + deltaX)) * 180 / Math.PI;
                //deltaY = (deltaY > 0 ? deltaY : (2 * Math.PI + deltaY)) * 180 / Math.PI;

                var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;


                return { distance: d, direction: angle };
            }

        }

    }

});
