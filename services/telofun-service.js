    "use strict";

    mslApp.service('telofunService', function ($location, localize, globalFunctions) {

        var webserviceUrl = "";

        switch ($location.$$host) {

            case "localhost":
                webserviceUrl = 'http://' + $location.$$host + '/Egged.Mot.Service/siteService.svc/';
                break;
            case "tnuawebtst":
                webserviceUrl = 'http://' + $location.$$host + ':' + $location.$$port + '/Mot64WebApi/siteService.svc/';
                break;
            case "tnuawebtst.egged.intra":
                webserviceUrl = 'http://' + $location.$$host + ':' + $location.$$port + '/Mot64WebApi/siteService.svc/';
                break;
            case "infocenter01":
                webserviceUrl = 'http://' + $location.$$host + '/Mot64WebApi/siteService.svc/';
                break;
            default:
                webserviceUrl = 'http://' + $location.$$host + '/Mot64WebApi/siteService.svc/';
                break;
        }


        function getDetailsByStationId(stationId) {

            var result = "";
            $.ajax({
                type: "get",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                async: false,
                cache: false,
                url: webserviceUrl + "GetDetailsByStationId?StationId=" + stationId,
                //data: { StationId: stationId },
                success: function (data) {
                    result = data;
                },
                error: function (result) {
                    console.log(" error " + result.status + " " + result.responseText);
                }
            });
            return result;

            //$.ajax({
            //    url: telofunServiceUrl + "/" + "details" + "/?id=" + stationId,
            //    dataType: "jsonp",
            //    //jsonpCallback: "_testcb",
            //    cache: false,
            //    timeout: 5000,
            //    success: function (data) {
            //        debugger;
            //        //$("#test").append(data);
            //    },
            //    error: function (jqXHR, textStatus, errorThrown) {
            //        alert('error ' + textStatus + " " + errorThrown);
            //    }
            //});

            ////http://telofun.strawjackal.org/api/getnearest?lat=xxx&lng=yyy

            //var result = "";
            //$.ajax({
            //    type: "GET",
            //    //dataType: "json",
            //    contentType: "application/json; charset=utf-8",
            //    async: false,
            //    cache: false,
            //    url: telofunServiceUrl + "/" + "details" + "/?id=" + stationId,
            //    //data: tripSearch,
            //    success: function (data) {
            //        return data;
            //    },
            //    error: function (result) {
            //        console.log(" error " + result.status + " " + result.responseText);
            //    }
            //});
            //return result;

        }

        return ({ getDetailsByStationId: getDetailsByStationId });

    });
