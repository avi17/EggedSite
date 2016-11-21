
(function () {
    "use strict";

    function transitionServiceFunction($http, $q, $location, localize, globalFunctions) {

        var webserviceUrl = appConfig.baseApiUri;

        var SelectedLineList;
        var FromPlaceName = [];
        var ToPlaceName = [];

        function setFromPlaceName(value) {
            this.FromPlaceName = value;
        }

        function setToPlaceName(value) {
            this.ToPlaceName = value;
        }

        function getFromPlaceName() {
            return this.FromPlaceName;
        }

        function getToPlaceName() {
            return this.ToPlaceName;
        }

        function setSelectedLineList(value) {
            this.SelectedLineList = value;
        }

        function getSelectedLineList() {
            return this.SelectedLineList;
        }

        function getBusStopByMakat(makat, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetBusStopByMakat/" + makat + "/" + language + "/" + isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     var busstopList = data.data;
                     successCallback(busstopList);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        }

        function sendMail(postObject, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "SendMail";
            $http.post(url, postObject)
             .then(
                 function (data) {
                     successCallback(data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        }

        function getTripLogDetails(parameterObject, successCallback, failureCallback) {

            var url = webserviceUrl + "api/passengerinfo/" + "GetTripLogDetails";
            $http.post(url, parameterObject)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        }

        function getBusStopList(queryObject, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetBusStopList/";
            $http.post(url, queryObject)
             .then(
                 function (data) {
                     var busstopList = data.data;
                     busstopList = reformatBusstopList(busstopList)
                     successCallback(busstopList);
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
                     successCallback(data);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        }

        function getScheduleGridData(dayOrder, fromQuarterId, firstConnectionId, secondConnectionId, toQuarterId, lineNumberId, language, isEggedDb, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + "GetScheduleList/" +
                dayOrder + "/" +
                fromQuarterId + "/" +
                firstConnectionId + "/" +
                secondConnectionId + "/" +
                toQuarterId + "/" +
                lineNumberId + "/" +
                language + "/" +
                isEggedDb;
            $http.get(url)
             .then(
                 function (data) {
                     var busstopList = data.data;
                     successCallback(busstopList);
                 },
                 function (data) {
                     if (failureCallback != null)
                         failureCallback(data);
                 });
        }

        function postToServer(methodName, parameterObject, successCallback, failureCallback) {
            var url = webserviceUrl + "api/passengerinfo/" + methodName;

            $http.post(url, parameterObject)
             .then(
                 function (data) {
                     successCallback(data.data);
                 },
                 function (data) {
                     failCallback(data);
                 });

        }

        function initScheduleResults(data) {
            //init json server data for schedule table
            // ScheduleResults == data
            var list = [];
            var transitions = [];
            for (var j = 0; j < data.Transitions.length; j++) {

                for (var i = 0 ; i < data.Transitions[j].ScheduleList.length ; i++) {
                    var schedule = data.Transitions[j].ScheduleList[i];
                    var obj = new Object();
                    //var timeTo = new Date(parseInt(schedule.DtDestinationBusstop.substr(6)));
                    //var timeFrom = new Date(parseInt(schedule.DtOriginBusstop.substr(6)));
                    //obj.DtDestinationBusstop = timeTo.getHours() + ":" + timeTo.getMinutes();
                    //obj.DtOriginBusstop = timeFrom.getHours() + ":" + timeFrom.getMinutes();

                    obj.Id = schedule.Id;
                    obj.Name = schedule.Name;
                    obj.LineNumber = schedule.Transport.LineNumber;
                    obj.Shilut = schedule.Transport.LineNumber;
                    obj.Migun = schedule.Migun;
                    obj.OriginQuarterId = schedule.OriginQuarterId;
                    obj.DestinationQuarterId = schedule.DestinationQuarterId;
                    obj.Makat = schedule.Makat;
                    obj.Chalufa = schedule.Chalufa;
                    obj.DtOriginBusstop = schedule.StringDepartureDateTime;
                    obj.DtDestinationBusstop = schedule.StringArrivalDateTime;
                    obj.TimeOriginBusstop = schedule.TimeOriginBusstop;
                    obj.TimeDestinationBusstop = schedule.TimeDestinationBusstop;
                    obj.OriginTime = schedule.OriginTime;
                    obj.MazanToMoza = schedule.MazanToMoza;
                    obj.MazanToYaad = schedule.MazanToYaad;
                    obj.BusStationArrangementD = schedule.BusStationArrangementD;
                    obj.BusStationArrangementA = schedule.BusStationArrangementA;
                    obj.PlatformNumber = schedule.PlatformNumber;
                    obj.Company = { Id: schedule.Company.Id, Name: schedule.Company.Name };
                    obj.Grade = schedule.Grade;
                    obj.MakatOriginBusstop = schedule.MakatOriginBusstop;
                    obj.MakatDestinationBusstop = schedule.MakatDestinationBusstop;
                    obj.Distance = schedule.Distance;
                    obj.Price = schedule.Price;
                    obj.MilitaryArea = schedule.MilitaryArea;
                    obj.Date = schedule.Date;
                    obj.KosherLine = schedule.KosherLine;
                    obj.ViaRoad6 = schedule.ViaRoad6;


                    //obj.BusStations = schedule.BusStations;
                    obj.TransitionId = schedule.TransitionId;
                    obj.NextTransitionId = schedule.NextTransitionId;
                    obj.PreviousTransitionId = schedule.PreviousTransitionId;
                    obj.TimeToDestinationFormatted = schedule.TimeToDestinationFormatted;
                    obj.WaitingTime = schedule.WaitingTime;

                    obj.Accessibility = schedule.Accessibility;
                    list.push(obj);
                }
                if (list.length > 0) transitions.push(list);
                list = [];
            }

            return transitions;
        }

        function initBusStopResults(data) {
            //init json server data for busStop table
            var list = [];
            for (var i = 0 ; i < data.length ; i++) {
                data.Id;
                data.EnglishName;
                data.HebrewName;
                data.EnglishPlaceDescription;
                data.HebrewPlaceDescription;
                data.ArrivalTime;
                data.PlatformId;
                data.PlaceId;
                data.Distance;
                data.BusStopTypeId;
                data.BoardingAlighting;
                list.push(obj);
            }
            return list;
        }

        function reformatBusstopList(busStopList) {

            var strNum = localize.getLocalizedString("_Num_");
            var strPlaceInSettlement = localize.getLocalizedString("_PlaceInSettlement_");
            var strStationName = localize.getLocalizedString("_StationName_");
            var strStationNumber = localize.getLocalizedString("_StationNumber_");
            var strType = localize.getLocalizedString("_Type_");
            var strArrival = localize.getLocalizedString("_Arrival_");
            var strDistance = localize.getLocalizedString("_Distance_");
            var strPlatform = localize.getLocalizedString("_Platform_");
            var strBoardingAlighting = localize.getLocalizedString("_BoardingAlighting_");
            var strMap = localize.getLocalizedString("_Map_");
            var strBoarding = localize.getLocalizedString("_Boarding_");
            var strAlighting = localize.getLocalizedString("_Alighting_");
            var strRefreshmentStation = localize.getLocalizedString("_RefreshmentStation_");

            for (var i = 0 ; i < busStopList.length; i++) {

                if (localize.language.indexOf('he') > -1) {
                    busStopList[i].PlaceDescription = busStopList[i].HebrewPlaceDescription;
                    busStopList[i].Name = busStopList[i].HebrewName;
                    busStopList[i].BusStopType = busStopList[i].HebrewBusStopType;
                }
                else {
                    busStopList[i].PlaceDescription = busStopList[i].EnglishPlaceDescription;
                    busStopList[i].Name = busStopList[i].EnglishName;
                    busStopList[i].BusStopType = busStopList[i].EnglishBusStopType;
                }

                busStopList[i].titleString =
                    strNum + " " +
                    busStopList[i].Id + " " +
                strPlaceInSettlement + " " +
                busStopList[i].PlaceDescription + " " +
            strStationName + " " +
                busStopList[i].Name + " " +
strStationNumber + " " +
                busStopList[i].Makat + " " +
            strType + " " +
                busStopList[i].BusStopType + " " +
strArrival + " " +
                busStopList[i].ArrivalTime + " " +
            strDistance + " " +
                busStopList[i].Distance + " " +
strPlatform + " " +
                busStopList[i].PlatformId + " " +
            strBoardingAlighting + " " +
                busStopList[i].BoardingAlighting;


                if (busStopList[i].Distance != "0")
                    busStopList[i].Distance = globalFunctions.roundOneDigit(busStopList[i].Distance);

                if (busStopList[i].BoardingAlighting.indexOf(strRefreshmentStation) > -1)

                    if (busStopList[i].MazanToMoza != "0")
                        busStopList[i].isShowStarImg = true;
                    else
                        busStopList[i].isShowStarImg = false;

                if (busStopList[i].Id > 1) {

                    busStopList[i].TimeEstimatedText = localize.getLocalizedString('_EstimatedDepartureTime_') + ". " + busStopList[i].MazanToMoza + " " + localize.getLocalizedString('_FromTripBegining_')//.slice(10, 16);
                }
            }

            return busStopList;
        }
        return ({
            setFromPlaceName: setFromPlaceName,
            setToPlaceName: setToPlaceName,
            getFromPlaceName: getFromPlaceName,
            getToPlaceName: getToPlaceName,
            getTripLogDetails: getTripLogDetails,
            getSelectedLineList: getSelectedLineList,
            setSelectedLineList: setSelectedLineList,
            getScheduleGridData: getScheduleGridData,
            getBusStopList: getBusStopList,
            getBusStopByMakat: getBusStopByMakat,
            getRovaDetails: getRovaDetails,
            sendMail: sendMail
        });

    }
    transitionServiceFunction.$inject = ["$http", "$q", "$location", "localize", "globalFunctions"];
    mslApp.service("transitionService", transitionServiceFunction);

})();

