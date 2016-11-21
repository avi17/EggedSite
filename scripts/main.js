"use strict";

require.config({
    baseUrl: 'app',

    paths: {
     jQueryUi:'scripts/jquery-ui-1.10.2'
    , lodash: 'scripts/lodash'
    
    }

 
});
require(
    [
        'jQueryUi',
        //'lodash',
        //'scripts/select2/select2',
        //'scripts/select2/select2_locale_he',
        'scripts/less-1.4.1.min',
        'scripts/getLessVars',
        'beans/render-context',
        'components/localize/localize',
        //'components/map/angular-google-maps',
        'provider/globalFunctions-provider',
        'factory/search',
        'factory/infoBoxlist',
        'factory/mapMarker',
        'factory/mapMarkerlist',
        //'factory/initSearchObject',
        //'services/googlemaps',
        'services/search-service',
        'services/transition-service',
        'services/telofun-service',
        'services/googlemapsutil',
        'services/request-context',
        'services/lodash',
        'directives/compass',
        'directives/headerFilter',
        'directives/ngEnter',
        'directives/ngPrint',
        'directives/scrollTo',
        'directives/ngKeyPress',
        'directives/ngBindHtml',
        'directives/browserCompatibility',
        'directives/accessibilityMessage',
        'directives/googleAutocomplete',
        'directives/newsTicker',
        'directives/resolutionSelector',
        'directives/autoComplete',
        'directives/cityBox',
        'directives/comboFiltered2',
        'directives/mapControl',
        'directives/mapNearBusstop',
        'directives/mapBusstopData',
        'directives/mapCollapsePanel',
        'directives/mapContextMenu',
        'directives/mapMeasureDistance',
        'directives/addNavPoint',
        'directives/mapaSearchWindow',
        //'directives/mapBusstop',
        'directives/mapTransition',
        'directives/tripHeader',
        'directives/ngSelected',
        'directives/progressBar',
        'directives/progressBar2',
        'directives/loadGoogleMaps',
        'directives/alternativeLocationPopup',
        'directives/xngFocus',
        'directives/userMsg',
        'directives/searchTitle',
        'directives/activeDates',
        'directives/navigationMenu',
        'directives/eggedAdBanner',
        'directives/gridView',
        'directives/printDailySchedule',
        'directives/weeklySchedule',
        'controllers/app-controller',
        'controllers/search/minimized-controller',
        'controllers/search/result/map-controller',
        'controllers/search/result/search-selection-controller',
    ],
    function () {
        angular.bootstrap(document, ['mslApp']);
    });



