
mslApp.service('googleMapsUtil', function ($rootScope, searchService, localize) {

    var that = this;
    this.directionsRenderer = null;
    this.distanceMatrixService = null;
    this.directionsService = null;
    this.placesService = null;
    this.autocompleteService = null;

    this.setMap = function (mapInstance) {
        that.map_ = mapInstance;
        that.directionsRenderer = new google.maps.DirectionsRenderer();
        that.directionsRenderer.setMap(that.map_);
        that.distanceMatrixService = new google.maps.DistanceMatrixService();
        that.directionsService = new google.maps.DirectionsService();
        that.placesService = new google.maps.places.PlacesService(that.map_);
        that.autocompleteService = new google.maps.places.AutocompleteService();

    }

    this.getNearestBusstop = function (point, busstopList, successCallback, failCallback) {

        var origin = point;
        var destinationArr = [];
        var matchedBusstopList = [];

        $rootScope.search.coordinateLat = point.lat();
        $rootScope.search.coordinateLng = point.lng();
        searchService.GetBusstopListByRadius(
            $rootScope.search.currentDate != null ? $rootScope.search.currentDate.ID : 1,
            $rootScope.search.coordinateLat,
            $rootScope.search.coordinateLng,
            800,
            $rootScope.search.language,
            $rootScope.search.isEggedDb,
            function (nearBustopList) {

                for (var k = 0; k < nearBustopList.length; k++)
                    for (var j = 0; j < busstopList.length; j++)
                        for (var i = 0; i < busstopList[j].length; i++)
                            if (busstopList[j][i].Makat == nearBustopList[k].Makat)
                                matchedBusstopList.push(busstopList[j][i]);

                for (var i = 0; i < matchedBusstopList.length; i++)
                    destinationArr.push(new google.maps.LatLng(matchedBusstopList[i].Latitude, matchedBusstopList[i].Longitude));

                that.distanceMatrixService.getDistanceMatrix({
                    origins: [origin],
                    destinations: destinationArr,
                    travelMode: google.maps.TravelMode.WALKING,
                    //transitOptions: google.maps.TravelMode.TRANSIT,
                    //drivingOptions: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.METRIC
                },
                function (response, status) {
                    if (status != "OK") {
                        //$rootScope.search.userMessage = "_NoResultsFound_";
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

                    successCallback(matchedBusstopList[minimalDistanceIndex]);

                });
            },
            function () {
                failCallback();
            });

    }

    this.getNearestBusstopInTransition = function (point, busstopList, successCallback, failCallback) {

        var origin = point;
        var destinationArr = [];
        var matchedBusstopList = [];

        $rootScope.search.coordinateLat = point.lat();
        $rootScope.search.coordinateLng = point.lng();
        searchService.GetBusstopListByRadius(
            $rootScope.search.currentDate != null ? $rootScope.search.currentDate.ID : 1,
            $rootScope.search.coordinateLat,
            $rootScope.search.coordinateLng,
            800,
            $rootScope.search.language,
            $rootScope.search.isEggedDb,
            function (nearBustopList) {
                for (var k = 0; k < nearBustopList.length; k++)
                        for (var i = 0; i < busstopList.length; i++)
                            if (busstopList[i].Makat == nearBustopList[k].Makat)
                                matchedBusstopList.push(busstopList[i]);

                for (var i = 0; i < matchedBusstopList.length; i++)
                    destinationArr.push(new google.maps.LatLng(matchedBusstopList[i].Latitude, matchedBusstopList[i].Longitude));

                that.distanceMatrixService.getDistanceMatrix({
                    origins: [origin],
                    destinations: destinationArr,
                    travelMode: google.maps.TravelMode.WALKING,
                    //transitOptions: google.maps.TravelMode.TRANSIT,
                    //drivingOptions: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.METRIC
                },
                function (response, status) {
                    if (status != "OK") {
                        //$rootScope.search.userMessage = "_NoResultsFound_";
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

                    successCallback(matchedBusstopList[minimalDistanceIndex]);

                });
            },
            function () {
                failCallback();
            });

    }

});
