
mslApp.directive('tripHeader', function ($compile, $location, localize) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {

            $(element).addClass("TripHeader");


            scope.$watch("language", function (e) {
                setTimeout(function () {
                    init();
                }, 100);
            });

            scope.$watch(attrs.resultViewName, function (e) {
                setTimeout(function () {
                    init();
                }, 100);
            });

            function init() {
                element[0].innerHTML = "";
                var strFrom = localize.getLocalizedString("_From_");
                var strTo = localize.getLocalizedString("_To_");
                var strDate = localize.getLocalizedString("_OnDate_");
                var strFromCity = scope.$eval(attrs.fromCity);
                var strToCity = scope.$eval(attrs.toCity);
                var strFromPlace = scope.$eval(attrs.fromPlace);
                var strToPlace = scope.$eval(attrs.toPlace);

                if (strFromPlace != null && strFromPlace.indexOf('<') > -1 && $(strFromPlace).length > 0)
                    strFromPlace = $(strFromPlace)[0].title;
                if (strToPlace != null && strToPlace.indexOf('<') > -1 && $(strToPlace).length > 0)
                    strToPlace = $(strToPlace)[0].title;

                if (scope.$eval(attrs.isDirectLine) == true) {
                    strFromPlace = "";
                    strToPlace = "";
                }

                //if (strFromPlace.indexOf("<") > -1)
                //    strFromPlace = $(strFromPlace)[0].title;
                //if (strToPlace.indexOf("<") > -1)
                //    strToPlace = $(strToPlace)[0].title;

                var strTripDate;
                if (scope.$eval(attrs.tripDate) != null)
                    strTripDate = scope.$eval(attrs.tripDate).NAME;
                //var strTripTime;
                //if (scope.$eval(attrs.tripTime) != null && scope.$eval(attrs.tripTime).ID != -1)
                //    strTripTime = scope.$eval(attrs.tripTime).NAME;
                if (strFromCity == null || strFromCity == "" || strToCity == null || strToCity == "" ||
                    strFromPlace == null || strToPlace == null) {
                    return;
                }

                //strFromPlace = strFromPlace.replace(strFromCity, "");
                //strToPlace = strToPlace.replace(strToCity, "");

                var mergedFrom = mergeStrings(strFromCity, strFromPlace);
                var mergedTo = mergeStrings(strToCity, strToPlace);

                var retVal = "";
                retVal += "<span style='display: inline-block; font-weight: bold;'>" + strFrom;
                if (localize.language != "he-IL")
                    retVal += " ";
                retVal += mergedFrom + "</span>";

                retVal += "<span style='display: inline-block; font-weight: bold;'>" + " &nbsp " + strTo;
                if (localize.language != "he-IL")
                    retVal += " ";
                retVal += mergedTo + "</span>";

                retVal += "<span style='display: inline-block; font-weight: bold;'>" + " &nbsp " + strDate + " &nbsp " + "</span>";
                retVal += "<span style='display: inline-block; '>" + strTripDate + " &nbsp " + "</span>";

                $(retVal).appendTo(element);
            }

            init();

            function mergeStrings(innerString, outerString)
            {
                var strInner = innerString.trim().replace('-', ' ');
                var strOuter = outerString.trim().replace('-', ' ');
                if (strOuter.indexOf(strInner) > -1)
                    return outerString;
                else
                return innerString + " " + outerString;
            }

        }
    };
});
