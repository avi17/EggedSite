
var isEggedDb = true;
var isBusGovIl = false;
var serverUrl = "http://mslworld.egged.co.il/MslWebApi/";
if (document.URL.indexOf("localhost") > -1)
    serverUrl = "http://localhost/Egged.MotClient.Api/";
if (document.URL.indexOf("tnuawebtst") > -1)
    //serverUrl = "http://tnuawebtst:9081/Mot64Service/";
    serverUrl = "http://tnuawebtst.egged.intra:9081/Mot64WebApi/";
if (document.URL.indexOf("tnuawebtst.egged.intra") > -1)
    //serverUrl = "http://tnuawebtst.egged.intra:9081/Mot64Service/";
    serverUrl = "http://tnuawebtst.egged.intra:9081/Mot64WebApi/";
if (document.URL.indexOf("motbal") > -1)
    serverUrl = "http://motbal/MOT64Service/";
if (document.URL.indexOf("motbalbarman") > -1)
    serverUrl = "http://motbalbarman/MOT64Service/";
if (document.URL.indexOf("motbaltest") > -1)
    serverUrl = "http://tnuawebtst.egged.intra:9081/Mot64WebApi/";
if (document.URL.indexOf("91.223.11.66:93") > -1)
    serverUrl = "http://91.223.11.66:93/Mot64WebApi/";
if (document.URL.indexOf("tnuawebtst:93/") > -1)
    serverUrl = "http://tnuawebtst:93/Mot64WebApi/";
if (document.URL.indexOf("91.223.11.62") > -1)
    serverUrl = "http://91.223.11.62/MslWebApi/";
//serverUrl = "http://mslworld.egged.co.il/MslWebApi/";
if (document.URL.indexOf("motbal") > -1)   //Bezeq Online
    isEggedDb = false;

if (document.URL.indexOf("motbalbarman") > -1 )   //busgovil
    isBusGovIl = true;

//isEggedDb = false;

var appConfig = {
    versionNumber: "110416-1",
    baseApiUri: serverUrl,
    isEggedDb: isEggedDb,
    bunnerSwitchInterval: 5000
};

var mslApp = angular.module('mslApp', ['ui.router', 'localization', 'angulartics'])

mslApp.config(['$analyticsProvider', function ($analyticsProvider) {

    $analyticsProvider.settings.trackRelativePath = true;

    $analyticsProvider.registerPageTrack(function (path) {
        if (window._gaq) _gaq.push(['_trackPageview', path]);
        if (window.ga) ga('send', 'pageview', path);
    });

    $analyticsProvider.registerEventTrack(function (action, properties) {

        var balString = "";
        if (appConfig.isEggedDb == false)
            balString = "Bal";

        if (!properties || !properties.category) {
            return;
        }
        if (properties.value) {
            var parsed = parseInt(properties.value, 10);
            properties.value = isNaN(parsed) ? 0 : parsed;
        }

        if (window._gaq) {
            _gaq.push(['_trackEvent', properties.category + balString, action, properties.label, properties.value, properties.noninteraction]);
        }
        else
            if (window.ga) {
                if (properties.noninteraction) {
                    ga('send', 'event', properties.category + balString, action, properties.label, properties.value, { nonInteraction: 1 });
                }
                else {
                    ga('send', 'event', properties.category + balString, action, properties.label, properties.value);
                }
            }
    });
}])
    .constant("APP_CONFIG", appConfig);

mslApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/origindestination/1/0');

    $stateProvider
        .state('faq',
        {
            url: '/faq',
            views: {
                '': { templateUrl: 'app/faq/faq.htm' + '?versionNumber=' + appConfig.versionNumber }
            }
        })
        .state('origindestination',
        {
            url: '/origindestination/:isShowFilter/:isClear/:isDirectLines/:fromAddressCityId/:fromAddressQuarterId/:toAddressCityId/:toAddressQuarterId/:dayOrder/:Hour/:originCoords/:destinationCoords',
            views: {
                '': { templateUrl: 'app/views/layouts/index.htm' + '?versionNumber=' + appConfig.versionNumber },
                'query@origindestination': {
                    templateUrl: 'app/search/origindestinationQuery.html' + '?versionNumber=' + appConfig.versionNumber,
                    controller: 'SearchCtrl'
                },
                'result@origindestination': {
                    templateUrl: 'app/search/result.html' + '?versionNumber=' + appConfig.versionNumber
                    , controller: 'ResultCtrl'
                }
            },
            params:
                {
                    isDirectLines: { squash: true, value: null }
                    , fromAddressCityId: { squash: true, value: null }
                    , fromAddressQuarterId: { squash: true, value: null }
                    , toAddressCityId: { squash: true, value: null }
                    , toAddressQuarterId: { squash: true, value: null }
                    , dayOrder: { squash: true, value: null }
                    , Hour: { squash: true, value: null }
                    , isClear: { squash: true, value: null }
                    , isShowFilter: { squash: true, value: null }
                    , originCoords: { squash: true, value: null }
                    , destinationCoords: { squash: true, value: null }

                }
        })
        .state('linenumber',
        {
            url: '/linenumber/:isShowFilter/:isClear/:fromAddressCityId/:fromAddressQuarterId/:toAddressCityId/:toAddressQuarterId/:busStopMakat/:dayOrder/:Hour',
            views:
                {
                    '': { templateUrl: 'app/views/layouts/index.htm' + '?versionNumber=' + appConfig.versionNumber },
                    'query@linenumber':
                        {
                            templateUrl: 'app/search/linenumberQuery.html' + '?versionNumber=' + appConfig.versionNumber,
                            controller: 'SearchCtrl'
                        },
                    'result@linenumber':
                        {
                            templateUrl: 'app/search/result.html' + '?versionNumber=' + appConfig.versionNumber
                            , controller: 'ResultCtrl'
                        }
                },
            params:
                {
                    fromAddressCityId: { squash: true, value: null }
                    , fromAddressQuarterId: { squash: true, value: null }
                    , toAddressCityId: { squash: true, value: null }
                    , toAddressQuarterId: { squash: true, value: null }
                    , dayOrder: { squash: true, value: null }
                    , Hour: { squash: true, value: null }
                    , busStopMakat: { squash: true, value: null }
                    , isClear: { squash: true, value: null }
                    , isShowFilter: { squash: true, value: null }
                }
        })
        .state('realtime',
        {
            url: '/realtime/:isShowFilter/:isClear/:typeIndex/:dataString',
            views:
                {
                    '': { templateUrl: 'app/views/layouts/index.htm' + '?versionNumber=' + appConfig.versionNumber },
                    'query@realtime':
                        {
                            templateUrl: 'app/realtime/query.html' + '?versionNumber=' + appConfig.versionNumber,
                            controller: 'RealtimeQueryCtrl'
                        },
                    'result@realtime':
                        {
                            templateUrl: 'app/realtime/result.html' + '?versionNumber=' + appConfig.versionNumber,
                            controller: 'RealtimeResultCtrl'
                        }
                },
            params:
                {
                    typeIndex: { squash: true, value: null }
                    , dataString: { squash: true, value: null }
                    , isClear: { squash: true, value: null }
                    , isShowFilter: { squash: true, value: null }
                }
        })
        .state('freetext',
        {
            url: '/freetext/:isShowFilter/:isClear/:freelang',
            views:
                {
                    '': { templateUrl: 'app/views/layouts/index.htm' + '?versionNumber=' + appConfig.versionNumber },
                    'query@freetext':
                        {
                            templateUrl: 'app/freetext/query.html' + '?versionNumber=' + appConfig.versionNumber,
                            controller: 'FreetextQueryCtrl'
                        },
                    'result@freetext':
                        {
                            templateUrl: 'app/freetext/result.html' + '?versionNumber=' + appConfig.versionNumber,
                            controller: 'FreetextResultCtrl'
                        }
                },
            params:
                {
                    freelang: { squash: true, value: null }
                    , isClear: { squash: true, value: null }
                    , isShowFilter: { squash: true, value: null }
                }
        });

});

mslApp.factory('appModels', function appModelsFactory() {

    function Address() {
        return { City: { ID: 0, NAME: "" }, Quarter: { ID: 0, NAME: "" }, Position: { LAT: 0, LNG: "" } };
    }

    function City(id, name) {
        return { ID: 0, NAME: "" };
    }

    function Quarter(id, name) {
        return { ID: 0, NAME: "" };
    }

    function Position(lat, lng) {
        return { LAT: 0, LNG: "" };
    }

    return {
        Address: Address,
        City: City,
        Quarter: Quarter,
        Position: Position
    }

});

mslApp.run(function ($rootScope, $state, $stateParams, $location, localize, $window) {

    //if (document.URL.indexOf("newversion") > -1)
    //{
    //    var password = prompt("נא הכנס סיסמה", "");
    //    if (password != "Mslnew") {
    //        window.location.href = "http://mslworld.egged.co.il";
    //    }
    //}

    $rootScope.currentTabName = 1;

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

        if (fromState.name == toState.name) return;
        setTimeout(function () {

        var searchByString = "";
        switch (toState.name) {
            case "origindestination":
                $rootScope.currentTabName = 1;
                searchByString = localize.getLocalizedString("_SearchByDestination_");
                break;
            case "linenumber":
                $rootScope.currentTabName = 2;
                searchByString = localize.getLocalizedString("_SearchByLineNumber_");
                break;
            case "freetext":
                $rootScope.currentTabName = 3;
                searchByString = localize.getLocalizedString("_SearchByFreeTextValue_");
                break;
            case "realtime":
                $rootScope.currentTabName = 4;
                searchByString = localize.getLocalizedString("_SearchByRealTimeValue_");
                break;
            default:
                break;r
        }

        if (fromState.name != "") {
                $($(".searchSubView")[0]).focus();
        }

        if (searchByString != "") {
            $rootScope.pageTitle = localize.getLocalizedString("_Title_") + "-" + searchByString;
            document.title = localize.getLocalizedString("_Title_") + "-" + searchByString;
        }

        //console.log(Object.keys($rootScope).length);
        }, 50);


        if ($window.ga)
            $window.ga('send', toState.name, { page: $location.path() });

    });

    //function setLanguage(queriedLanguage) {

    //    switch (queriedLanguage) {
    //        case "he":
    //            localize.setLanguage('he-IL');
    //            $rootScope.dir = "true";
    //            setTimeout(function () {
    //                localize.setLanguage('he-IL');
    //                $rootScope.dir = "true";
    //            }, 500);
    //            break;
    //        case "en":
    //            localize.setLanguage('en-US');
    //            $rootScope.dir = "false";
    //            setTimeout(function () {
    //                localize.setLanguage('en-US');
    //                $rootScope.dir = "false";
    //            }, 500);
    //            break;
    //    }

    //}

});
