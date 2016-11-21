mslApp.factory('initSearchObject', function () {
    return {
        initTransitionSearchObject: function (scope, route, currentSearch) {

            currentSearch.date = angular.copy(scope.dateList[route.current.pathParams.day - 1]);
            currentSearch.fromAddress.City.ID = route.current.pathParams.fromCityId;
            currentSearch.fromAddress.Quarter.ID = route.current.pathParams.fromPlaceId;
            currentSearch.toAddress.City.ID = route.current.pathParams.toCityId;
            currentSearch.toAddress.Quarter.ID = route.current.pathParams.toPlaceId;
            currentSearch.firstConnection.ID = route.current.pathParams.firstConnectionId;
            currentSearch.secondConnection.ID = route.current.pathParams.secondConnectionId;
            currentSearch.lineNumber.ID = route.current.pathParams.lineNumber;
            return currentSearch;
        },
        initTransitionUrlParams: function (currentSearch,path) {

            currentSearch.lineNumber.ID = (currentSearch.lineNumber.ID == undefined ? 0 : currentSearch.lineNumber.ID);

            path += currentSearch.date.ID + "/"
                   + currentSearch.date.ID + "/"
                   + currentSearch.fromAddress.City.ID + "/"
                   + currentSearch.fromAddress.Quarter.ID + "/"
                   + currentSearch.toAddress.City.ID + "/"
                   + currentSearch.toAddress.Quarter.ID + "/"
                   + (currentSearch.firstConnection.ID == undefined ? 0 : currentSearch.firstConnection.ID) + "/"
		           + (currentSearch.secondConnection.ID == undefined ? 0 : currentSearch.secondConnection.ID) + "/"
		           + (currentSearch.lineNumber.ID == 0 ? 0 : currentSearch.lineNumber.ID + "-" + currentSearch.lineNumber.NAME);

            return path;
        },

        //init object in app-controller (initpathparams initbylineparams functions )
        initByDestUrlParams: function (currentSearch, route) {

            route.current.pathParams.fromCityId = currentSearch.fromAddress.City.ID;
            route.current.pathParams.toCityId = currentSearch.toAddress.City.ID;
            route.current.pathParams.date = currentSearch.date.ID;
            route.current.pathParams.fromPlaceId = currentSearch.fromAddress.Quarter.ID;
            route.current.pathParams.toPlaceId = currentSearch.toAddress.Quarter.ID;
            route.current.pathParams.hour = currentSearch.hour;

            return route.current.pathParams;
        },
        initByLineUrlParams: function (currentSearch, route) {

            route.current.pathParams.date = currentSearch.date.ID;
            route.current.pathParams.fromCityId = currentSearch.fromAddress.City.ID;
            route.current.pathParams.fromPlaceId = currentSearch.fromAddress.Quarter.ID;
            route.current.pathParams.toCityId = currentSearch.toAddress.City.ID;
            route.current.pathParams.toPlaceId = currentSearch.toAddress.Quarter.ID;
            route.current.pathParams.hour = currentSearch.hour == undefined ? "" : currentSearch.hour;
            route.current.pathParams.lineNumber = currentSearch.lineNumber;

            return route.current.pathParams;
        },

        initBusStopUrlParams: function (currentSearch, path) {

            path += currentSearch.date.ID.replace('/', '-').replace('/', '-') + "/"
                   + currentSearch.makat + "/"
                   + currentSearch.chalufa + "/"
                   + currentSearch.busStationArrangementD + "/"
                   + currentSearch.busStationArrangementA + "/"
                   + currentSearch.originTime.replace('/', '-').replace('/', '-') + "/"
                   + currentSearch.fromAddress.City.ID + "/"
                   + currentSearch.fromAddress.Quarter.ID + "/"
                   + currentSearch.toAddress.City.ID + "/"
                   + currentSearch.toAddress.Quarter.ID + "/"
                   + (currentSearch.lineNumber.ID == undefined ? "0" : currentSearch.lineNumber.ID + "-" + currentSearch.lineNumber.NAME) + "/"
                   + currentSearch.language;

            return path;
        },
        initBusStopSearchObject: function (scope, route, currentSearch) {

            if (route.current.action.split('.')[1] == "bydest") {
                scope.searchByDest.date.ID = route.current.pathParams.date;
                scope.searchByDest.makat = route.current.pathParams.makat;
                scope.searchByDest.chalufa = route.current.pathParams.chalufa;
                scope.searchByDest.busStationArrangementD = route.current.pathParams.busStationArrangementD;
                scope.searchByDest.busStationArrangementA = route.current.pathParams.busStationArrangementA;
                scope.searchByDest.originTime = route.current.pathParams.originTime;
                scope.searchByDest.fromAddress.City.ID = route.current.pathParams.fromCityId;
                scope.searchByDest.fromAddress.Quarter.ID = route.current.pathParams.fromPlaceId;
                scope.searchByDest.toAddress.City.ID = route.current.pathParams.toCityId;
                scope.searchByDest.toAddress.Quarter.ID = route.current.pathParams.toPlaceId;
                scope.searchByDest.language = route.current.pathParams.language;
            }
            else {
                scope.searchByLine.date.NAME = route.current.pathParams.date;
                scope.searchByLine.makat = route.current.pathParams.makat;
                scope.searchByLine.chalufa = route.current.pathParams.chalufa;
                scope.searchByLine.busStationArrangementD = route.current.pathParams.busStationArrangementD;
                scope.searchByLine.busStationArrangementA = route.current.pathParams.busStationArrangementA;
                scope.searchByLine.originTime = route.current.pathParams.originTime;
                scope.searchByLine.fromAddress.City.ID = route.current.pathParams.fromCityId;
                scope.searchByLine.fromAddress.Quarter.ID = route.current.pathParams.fromPlaceId;
                scope.searchByLine.toAddress.City.ID = route.current.pathParams.toCityId;
                scope.searchByLine.toAddress.Quarter.ID = route.current.pathParams.toPlaceId;
                scope.searchByLine.lineNumber.ID = route.current.pathParams.lineNumber;
                scope.searchByLine.language = route.current.pathParams.language;
            }

        },

        initPathPlanUrlParams: function (currentSearch, path) {

            path += "/search/" + scope.search.currentTabName + "/result/path-plan" + "/"
                     + currentSearch.date.ID + "/" //NAME.replace('/', '-').replace('/', '-') + "/"
                     + currentSearch.fromAddress.City.ID + "/"
                     + currentSearch.fromAddress.Quarter.ID + "/"
                     + currentSearch.toAddress.City.ID + "/"
                     + currentSearch.toAddress.Quarter.ID + "/"
                     + currentSearch.originTime.split(" ")[1];

            return path;
        },

        initDetailsUrlParams: function (currentSearch, path) {

        },
        initDetailsSearchObject: function (scope, route, currentSearch) {

        },

        initDirectLinesUrlParams: function (currentSearch, path) {

            path += currentSearch.date.ID.replace("/", "-").replace("/", "-") + "/"
                + currentSearch.fromAddress.City.ID + "/"
                + currentSearch.fromAddress.Quarter.ID + "/"
                + currentSearch.toAddress.City.ID + "/"
                + currentSearch.toAddress.Quarter.ID + "/"
                + currentSearch.originTime;
            

            return path;

    },
        initDirectLinesSearchObject: function (scope, route, currentSearch) {

            currentSearch.fromAddress.City.ID = route.current.pathParams.fromCityId;
            currentSearch.fromAddress.Quarter.ID = route.current.pathParams.fromPlaceId;
            currentSearch.toAddress.City.ID = route.current.pathParams.toCityId;
            currentSearch.toAddress.Quarter.ID = route.current.pathParams.toPlaceId;
            currentSearch.date.ID = route.current.pathParams.date;
            currentSearch.hour = route.current.pathParams.hour;
        }
    }
});
