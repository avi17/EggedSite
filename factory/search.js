function codeObject(id, name) {
    self.ID = id;
    self.NAME = name;
}

function quarter(id, city, name, priority) {
    this.ID = id;
    this.NAME = name;
    this.PRIORITY = priority;
    this.CITY = city;
}

function city(id, name, priority) {
    this.ID = id;
    this.NAME = name;
    this.PRIORITY = priority;
}

function address(cityObj, positionObj, quarterObj, street) {
    this.City = new city();
    this.Quarter = new quarter();
}

function position(lat, lng) {
    self.LAT = lat;
    self.LNG = lng;
}

function search(date, lineNumber, searchCityId, searchPlaceId, hour, language, firstConnection, secondConnection, makat, chalufa, busStationArrangementD, busStationArrangementA, originTime, fromAddress, toAddress) {
    var self = this;
    self.backNextClicked = 0;
    self.date = date;
    self.lineNumber = lineNumber;
    self.searchCityId = searchCityId;
    self.searchPlaceId = searchPlaceId;
    self.hour = hour;
    self.language = "he";
    self.makat = makat;
    self.chalufa = chalufa;
    self.busStationArrangementD = busStationArrangementD;
    self.busStationArrangementA = busStationArrangementA;
    self.originTime = originTime;
    self.selectedFromAddress;
    self.selectedToAddress;
    self.fromAddress = new address();
    self.toAddress = new address();
    self.searchToSelector;
    self.searchFromSelector;
    self.dateList;
 
    self.timeList;
    self.cityList;
    self.currentDate;
    self.currentTime;
    self.isShowResultFocused = false;
    self.isNextButtonFocused = false;

    self.isDirectLine = false;
    self.resultViewName = "";
    self.selectedPathPlan = null;
    self.selectedRadioPathPlan = null;
    self.selectedDirectLine = null;
    self.mapSelectedLocation = null;
    self.currentTabName = 'bydest';
    self.focusedcurrentTabName = '';
    self.currentPanelIndex = -1;
    self.byFreeTextResult = "";
    self.freeTextQuestion = null;
    self.freeTextOptionId = "";
    self.alternativeSourceList;
    self.alternativeDestinationList;
    self.coordinateLat;
    self.coordinateLng;
    self.coordinateDistance;
    self.selectedBusStop;
    self.selectedScheduleLine;
    self.currentBusStopList = [];
    self.selectedBusstopId;
    self.map;
    self.nearBustopList;
    self.isMapViewed = false;

    self.directionsDisplay;

    self.autocompleteOrigin = { coords: null, description: "" };
    self.autocompleteDestination = { coords: null, description: "" };
    self.autocompleteExtra = { coords: null, description: "" };

    self.autocompleteBylineOrigin = { coords: null, description: "" };
    self.autocompleteBylineDestination = { coords: null, description: "" };

    self.foundBustop;
    self.isPedestrianTab = false;
    self.currentRouteResponse;

    self.googleAddressFrom = null;
    self.googleAddressTo = null;

    //self.isClearSelectedAddressFrom = false;
    //self.isClearSelectedAddressTo = false;
    //self.isShowFilter = true;
    self.isMouseOverPanel = false;

    self.pedestrianDistance;
    self.pedestrianDuration;
    self.selectedMapWidjetTab = "PublicTransport";

    self.selectedMapAddressFrom;
    self.selectedMapAddressTo;
    self.originMarker;
    self.destinationMarker;

    self.currentScheduleGridIndex = 0;

    self.predictionList = [];

    self.cityPlaceExpression = "";

    self.autocompleteOrigin.description = "";
    self.autocompleteDestination.description = "";
    self.autocompleteExtra.description = "";

    self.isFilterHeaderFocused = false;

    self.pathplanPanelIndex = -1;

    self.streetId;
    self.houseNumber;

    self.activeDayList = [];

    self.fromBusStopMakatValue = "";
    self.nextBusList = null;


    self.poiBylineFromStreetNumber = "";
    self.poiBylineToStreetNumber = "";
    self.poiBydestFromStreetNumber = "";
    self.poiBydestToStreetNumber = "";

    self.userMessageTitle = "";
    self.userMessage = "";

    self.isShowAllBusstops = false;
    self.isShowAllTransitions = false;

    self.clearMap = function () {
        self.nearBustopList = [];
        self.autocompleteOrigin = { coords: null, description: "" };
        self.autocompleteDestination = { coords: null, description: "" };
        self.autocompleteExtra = { coords: null, description: "" };
        self.selectedBusStop = null;
        self.selectedMapAddressFrom = null;
        self.selectedMapAddressTo = null;
        self.currentBusStopList = null;

        if (self.originMarker) {
            self.originMarker.setMap(null);
            self.originMarker = null;
        }
        if (self.destinationMarker) {
            self.destinationMarker.setMap(null);
            self.destinationMarker = null;
        }
    }

    self.getJsonString = function () {

        var obj = new Object();
        obj.isEggedDb = self.isEggedDb.toString();
        obj.Language = self.language != null ? self.language : "he";
        obj.FromAddress = self.fromAddress!= null ? self.fromAddress: "";
        obj.ToAddress = self.toAddress!= null ? self.toAddress: "";
        obj.DayOrder = self.currentDate != null ? self.currentDate.ID : "";
        obj.DateOrder = self.currentDate != null ? self.currentDate.NAME.split('-')[0].trim() : "";
        obj.LineNumberId = self.lineNumber == null ? 0 : self.lineNumber.ID;
        obj.SearchCityId = self.searchCityId!= null ? self.searchCityId: "";
        obj.SearchPlaceId = self.searchPlaceId!= null ? self.searchPlaceId: "";
        obj.Hour = self.hour!= null ? self.hour: "";
        obj.FirstConnectionId = (self.firstConnection == null ? 0 : self.firstConnection.ID);
        obj.SecondConnectionId = (self.secondConnection == null ? 0 : self.secondConnection.ID);
        //obj.FromCityName = self.fromCityName;
        //obj.ToCityName = self.toCityName;
        obj.Makat = self.makat!= null ? self.makat: "";
        obj.Chalufa = self.chalufa!= null ? self.chalufa: "";
        obj.BusStationArrangementD = self.busStationArrangementD!= null ? self.busStationArrangementD: "";
        obj.BusStationArrangementA = self.busStationArrangementA!= null ? self.busStationArrangementA: "";
        obj.OriginTime = self.originTime!= null ? self.originTime: "";
        obj.CoordinateLat = self.coordinateLat!= null ? self.coordinateLat: "";
        obj.CoordinateLng = self.coordinateLng!= null ? self.coordinateLng: "";
        obj.CoordinateDistance = self.coordinateDistance!= null ? self.coordinateDistance: "";
        obj.FreeTextQuestion = self.freeTextQuestion != null ? self.freeTextQuestion : "";
        obj.FreeTextOptionId = self.freeTextOptionId!= null ? self.freeTextOptionId: "";
        obj.FreeTextSessionId = self.freeTextSessionId!= null ? self.freeTextSessionId: "";
        obj.SelectedBusstopId = self.selectedBusstopId!= null ? self.selectedBusstopId: "";
        obj.CityPlaceExpression = self.cityPlaceExpression!= null ? self.cityPlaceExpression: "";
        obj.StreetId = self.streetId!= null ? self.streetId: "";
        obj.HouseNumber = self.houseNumber!= null ? self.houseNumber: "";

        if (obj.FromAddress.City.ID != null)
            obj.FromAddress.City.ID = obj.FromAddress.City.ID != 0 ? obj.FromAddress.City.ID.split('-')[0] : obj.FromAddress.City.ID;
        if(obj.ToAddress.City.ID != null)
            obj.ToAddress.City.ID = obj.ToAddress.City.ID != 0 ? obj.ToAddress.City.ID.split('-')[0] : obj.ToAddress.City.ID;
        if (obj.SearchCityId != null)
            obj.SearchCityId = obj.SearchCityId != 0 ? obj.SearchCityId.split('-')[0] : obj.SearchCityId;

        var jsonString = JSON.stringify(obj);
        return jsonString;
    }

    self.getTripJsonString = function (queryObject) {

        var obj = new Object();

        obj.CompanyIDArray = queryObject.companyIDArray;
        obj.CompanyNameArray = queryObject.companyNameArray;
        obj.DtOriginBusstopArray = queryObject.dtOriginBusstopArray;
        obj.DtDestinationBusstopArray = queryObject.dtDestinationBusstopArray;
        obj.DistanceArray = queryObject.distanceArray;
        obj.MakatOriginBusstopArray = queryObject.makatOriginBusstopArray;
        obj.MakatDestinationBusstopArray = queryObject.makatDestinationBusstopArray;
        obj.MazanDestinationArray = queryObject.mazanDestinationArray;
        obj.PriceArray = queryObject.priceArray;
        obj.MigunArray = queryObject.migunArray;
        obj.MilitaryAreaArray = queryObject.militaryAreaArray;
        obj.MakatArray = queryObject.makatArray;
        obj.OriginQuarterIdArray = queryObject.originQuarterIdArray;
        obj.DestinationQuarterIdArray = queryObject.destinationQuarterIdArray;
        obj.PlatformArray = queryObject.platformArray;
        obj.ShilutArray = queryObject.shilutArray
        obj.DtValidity = queryObject.dtValidity;
        obj.SpecialPrice = queryObject.specialPrice;
        obj.IsEggedDb = self.isEggedDb.toString();
        obj.Language = self.language;

        var jsonString = JSON.stringify(obj);
        return jsonString;
    };

}

mslApp.factory('search', function ($injector) {
    return function (date, lineNumber, searchCityId, searchPlaceId, hour, language, firstConnection, secondConnection, makat, chalufa, busStationArrangementD, busStationArrangementA, originTime, fromAddress, toAddress) {
        return $injector.instantiate(search,
            {

                date: date,
                lineNumber: lineNumber,
                searchCityId: searchCityId,
                searchPlaceId: searchPlaceId,
                hour: hour,
                language: language,
                firstConnection: firstConnection,
                secondConnection: secondConnection,
                makat: makat,
                chalufa: chalufa,
                busStationArrangementD: busStationArrangementD,
                busStationArrangementA: busStationArrangementA,
                originTime: originTime,
                //fromCity: fromCity,
                //toCity: toCity,
                fromAddress: fromAddress,
                toAddress: toAddress
            });
    };
});
