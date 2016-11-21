mslApp.directive('loadGoogleMaps', ['$window', '$q', '$rootScope', '$timeout', function ($window, $q, $rootScope, $timeout) {

    var newLanguageValue = 'he';

    function load_script() {

        $timeout(function () {
            var oldScript = document.getElementById("google-maps-script");
            if ($window.google && $window.google.maps) {
                if (oldScript)
                    oldScript.parentNode.removeChild(oldScript);
                delete google.maps;
            }
        }, 200);

        $timeout(function () {
            var s = document.createElement('script'); // use global document since Angular's $document is weak
            s.id = "google-maps-script";
            //s.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&callback=initialize';
            s.src = 'https://maps.googleapis.com/maps/api/js?v=3.24&libraries=places&language=' + $rootScope.search.language + '&key=AIzaSyChn0YOwyy1Q3AcP08g0mlk-1ojsrbN03k&callback=initialize';
            document.body.appendChild(s);
        }, 200);

    }

    function lazyLoadApi(key) {
        var deferred = $q.defer();

        $window.initialize = function () {

            $timeout(function () {
                deferred.resolve();
            }, 200);

        };

        load_script();

        return deferred.promise;
    }

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {


            function callLazyLoadApi() {
                $rootScope.isGoogleReachable = false;

                lazyLoadApi().then(function () {
                    //console.log('promise resolved');
                    if ($window.google && $window.google.maps) {
                        $rootScope.isGoogleReachable = true;
                        //console.log('gmaps loaded');
                    }
                    else {
                        //console.log('gmaps not loaded');
                    }
                },
                function () {
                    //console.log('promise rejected');
                });


            }

            callLazyLoadApi();

        }
    };
}]);
