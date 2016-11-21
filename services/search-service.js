
(function () {
    "use strict";

    function searchServiceFunction($http, $q, $location, localize) {

        var webserviceUrl = appConfig.baseApiUri;
        var isEggedDb = appConfig.isEggedDb;

        function getDataFromServerFunc(methodName, parameters, successCallback, failureCallback)
        {
            var url = webserviceUrl + "api/passengerinfo/" + methodName;
            for (var i = 0; i < parameters.length; i++) {
                url = url + "/" + parameters[i];
            }
            $http.get(url)
             .then(
                 function (data) {

                     var retVal = data.data;

                     switch (methodName) {
                         case"getCityList": 
                             for (var i = 0; i < retVal.length; i++) {
                                 retVal[i].iid = i;
                                 retVal[i].ID = retVal[i].ID + '-' + i;
                             }
                             break;
                         case "123":
                             break;
                     }
                     successCallback(retVal);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        }

        function getRovaDetails(searchPlaceId, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetRovaDetails/" + searchPlaceId + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        };

        function getCityName(searchCityId, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetCityName/" + searchCityId + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        };

        function getTimeList(successCallback) {
            var strAll = "הכל";
            var result = [];
            var hour = 0;
            if (localize.language == "en-US")
                strAll = "All";
            result.push({ ID: -1, NAME: strAll });
            for (var i = 0; i < 48; i++) {
                result.push({ ID: i, NAME: hour.toString() + ':' + '00' });
                i++;
                result.push({ ID: i, NAME: hour.toString() + ':' + '30' });
                hour++;
            }
            successCallback(result);
        };

        function GetBusLineListByYeshuv(fromCityID, dayOrderID, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetBusLineListByYeshuv/" + fromCityID + "/" + dayOrderID + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        };

        function GetRealtimeBusLineListByBustop(selectedBusstopId, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetRealtimeBusLineListByBustop/" + selectedBusstopId + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        };

        function GetBusLineListByBustop(dateOrder, selectedBusstopId, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetBusLineListByBustop/" + dateOrder + "/" + selectedBusstopId + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        };

        function GetBusstopListByRadius(dateOrder, coordinateLat, coordinateLng, scanRadius, language, isEggedDb, successCallback, failureCallback) {
            //dateOrder = dateOrder.replace(/\//g, "-");
            var url = webserviceUrl + "api/passengerinfo/" + "GetBusstopListByRadius/" + dateOrder + "/" + coordinateLat + "/" + coordinateLng + "/" + scanRadius + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        };

        function getPlacesList(dayOrder, searchCityId, searchPlaceId, lineNumberId, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetPlacesList/" + dayOrder + "/" + searchCityId + "/" + searchPlaceId + "/" + lineNumberId + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {

                     var placeList = data.data;

                     for (var i = 0; i < placeList.length; i++) {
                         if (placeList[i].NAME != "" || placeList[i].DESCRIPTION != "") {
                             placeList[i].DESCRIPTION = placeList[i].DESCRIPTION.replace("'", "\`");
                             placeList[i].NAME = placeList[i].NAME.replace("'", "\`");
                             var descLen = placeList[i].DESCRIPTION.length;
                             var nameLen = placeList[i].NAME.length;
                             if (placeList[i].DESCRIPTION != "")
                                 placeList[i].NAME = placeList[i].NAME + " : " + placeList[i].DESCRIPTION;
                             else
                                 placeList[i].NAME = placeList[i].NAME;
                         }

                     }
                     successCallback(placeList);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        };

        function getPlacesByLine(dayOrder, searchCityId, searchPlaceId, lineNumberId, language, isEggedDb, setToolTip, successCallback, failureCallback) {

            var url = webserviceUrl + "api/passengerinfo/" + "GetPlacesList/" + dayOrder + "/" + searchCityId + "/" + searchPlaceId + "/" + lineNumberId + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     if (setToolTip) {

                         var placeList = data.data;

                         for (var i = 0; i < placeList.length; i++) {
                             if (placeList[i].DESCRIPTION != "") {
                                 var descLen = placeList[i].DESCRIPTION.length;
                                 var nameLen = placeList[i].NAME.length;
                                 if (placeList[i].DESCRIPTION != "")
                                     placeList[i].NAME = placeList[i].NAME + " : " + placeList[i].DESCRIPTION;
                                 else
                                     placeList[i].NAME = placeList[i].NAME;
                             }
                         }
                     }
                     successCallback(placeList);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        };

        function GetToYeshuvByLine(dayOrder, fromQuarterId, lineNumberId, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetToYeshuvByLine/" + dayOrder + "/" + fromQuarterId + "/" + lineNumberId + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     var cityList = data.data;
                     successCallback(cityList);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        };

        function getPathPlan(dayOrder, fromQuarterId, toQuarterId, hour, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetDirectSolutions/" + dayOrder + "/" + fromQuarterId + "/" + toQuarterId + "/" + hour + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        }

        function getPathPlanWithOneConnection(dayOrder, fromQuarterId, toQuarterId, hour, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetSolution1/" + dayOrder + "/" + fromQuarterId + "/" + toQuarterId + "/" + hour + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        };

        function getPathPlanWithTwoConnections(dayOrder, fromQuarterId, toQuarterId, hour, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetSolutions2/" + dayOrder + "/" + fromQuarterId + "/" + toQuarterId + "/" + hour + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        }

        function getDirectLines(dayOrder, fromCityId, toCityId, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "DirectLines/" + dayOrder + "/" + fromCityId + "/" + toCityId + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        };

        function getFreeLanguageResult(freeTextOptionId, freeTextQuestion, freeTextSessionId, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetFreeLanguageResult/" +
                        freeTextOptionId + "/" +
                        freeTextSessionId + "/" +
                        freeTextQuestion + "/" +
                        language + "/" +
                        isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        };

        function QuarterByXy(coordinateLat, coordinateLng, coordinateDistance, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "QuarterByXy/" + coordinateLat + "/" + coordinateLng + "/" + coordinateDistance + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        };

        function getWeeklyReportTable(fromQuarterId, toQuarterId, lineNumberId, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetWeeklyReportTable/" + fromQuarterId + "/" + toQuarterId + "/" + lineNumberId + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        };

        function GetActiveDateList(searchCityId, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetActiveDateList/" + searchCityId + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        }

        function GetPoligonByQuarterID(QuarterID, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetPoligonByQuarterID/" + QuarterID + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        }

        function getEmergencyMessageData(language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetEmergencyMessageData/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        };

        return ({
            getDataFromServer: getDataFromServerFunc,
            getTimeList: getTimeList,
            GetBusLineListByYeshuv: GetBusLineListByYeshuv,
            GetRealtimeBusLineListByBustop: GetRealtimeBusLineListByBustop,
            GetBusLineListByBustop: GetBusLineListByBustop,
            GetBusstopListByRadius: GetBusstopListByRadius,
            getPlacesList: getPlacesList,
            getPlacesByLine: getPlacesByLine,
            getToYeshuvByLine: GetToYeshuvByLine,
            getPathPlan: getPathPlan,
            getPathPlanWithOneConnection: getPathPlanWithOneConnection,
            getPathPlanWithTwoConnections: getPathPlanWithTwoConnections,
            getCityName: getCityName,
            getRovaDetails: getRovaDetails,
            getDirectLines: getDirectLines,
            getFreeLanguageResult: getFreeLanguageResult,
            QuarterByXy: QuarterByXy,
            GetActiveDateList: GetActiveDateList,
            getWeeklyReportTable: getWeeklyReportTable,
            GetPoligonByQuarterID: GetPoligonByQuarterID,
            getEmergencyMessageData: getEmergencyMessageData
        });
    }

    searchServiceFunction.$inject = ["$http", "$q", "$location", "localize"];
    mslApp.service("searchService", searchServiceFunction);

})();