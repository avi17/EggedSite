mslApp.directive('headerFilter', function ($document, $timeout, $rootScope, localize) {
    return {
        restrict: 'A',
        replace: true,
        scope: true,
        templateUrl: '/app/views/directive/headerFilter.htm',
        //compile: function (element, attributes) {

        //    return {
        //        pre: function (scope, element, attributes, controller, transcludeFn) {

        //        },
        //        post: function (scope, element, attributes, controller, transcludeFn) {

        //        }
        //    }
        //},
        link: function (scope, element, attrs, ctrl) {

            scope.contentstring = attrs.contentstring;

            var afterMidnightInserted = false;
            scope.isFiltered = false;
            scope.selectedItem = $rootScope.search.currentTime;
            scope.isShowPopup = false;
            //scope.filterType = scope.$eval(attrs.filtertype);
            var filterType = scope.$eval(attrs.filtertype);
            if (filterType == "") {
                scope.isFiltered = false;
                return;
            }
            else
                    scope.isFiltered = true;
            //$(element).css("pointer", "cursor");

            var gridIndex = scope.$eval(attrs.gridindex);
            var minValue = scope.$eval(attrs.minvalue);
            var maxValue = scope.$eval(attrs.maxvalue);

            var dtMinValue = new Date(minValue);
            var dtMaxValue = new Date(maxValue);

            var dtTempValue = new Date(minValue);
            dtTempValue.setMinutes(0);
            dtTempValue.setSeconds(0);

            scope.timeList = [];

            //if (localize.language == "en-US")
            //    scope.timeList.push({ ID: -1, NAME: 'select' });
            //else
            //    scope.timeList.push({ ID: -1, NAME: 'בחר' });

            for (; dtTempValue < dtMaxValue ; dtTempValue.setMinutes(dtTempValue.getMinutes() + 30)) {
                if (dtTempValue.getDay() == dtMinValue.getDay())
                    scope.timeList.push({ ID: dtTempValue.toString(), NAME: ('0' + dtTempValue.getHours()).slice(-2) + ':' + ('0' + dtTempValue.getMinutes()).slice(-2) });
                else
                {
                    if (afterMidnightInserted == false)
                    {
                        afterMidnightInserted = true;
                        var strAfterMidnight = localize.getLocalizedString("_AfterMidnightShort_");
                        scope.timeList.push({ ID: dtTempValue.toString(), NAME: strAfterMidnight });
                    }
                }
            }
            scope.selectedItem = scope.timeList[0];

            if (scope.timeList.length > 0)
                scope.isFiltered = true;
            else
                scope.isFiltered = false;

            //for (var i = 1; i < $rootScope.search.timeList.length ; i++)
            //    if (minValue < parseInt($rootScope.search.timeList[i].NAME.split(':')[0]) && maxValue > parseInt($rootScope.search.timeList[i].NAME.split(':')[0]))
            //        scope.timeList.push($rootScope.search.timeList[i]);

            //var minString = minValue.split(r':')[0] + ":00";
            //var maxString = maxValue.split(':')[0] + ":00";
            //var minObject = $.grep($rootScope.search.timeList, function (e) { return e.NAME == minString; })[0];
            //var maxObject = $.grep($rootScope.search.timeList, function (e) { return e.NAME == maxString; })[0];

            //$rootScope.search.timeList


            scope.headerClicked = function () {
                if (scope.timeList == null || scope.timeList.length == 0) return;
                $timeout(function () {
                    scope.isShowPopup = !scope.isShowPopup;
                }, 50);
            }

            scope.headerFilterSelected = function (item) {

                $timeout(function () {
                    scope.isShowPopup = !scope.isShowPopup;
                }, 50);

                scope.$eval(attrs.filterclosed + "(" + JSON.stringify(item) + ", " + gridIndex + ")");
            }

            var x = new Date();
            $(element).attr("id", "headerFilter" + x.getDate() + x.getHours() + x.getMinutes() + x.getSeconds() + x.getMilliseconds());
            element.data(element[0].id, true);

            angular.element($document[0].body).on('click', function (e) {
                var inThing = angular.element(e.target).inheritedData(element[0].id);
                if (inThing) {
                    //$window.alert('in');
                } else {
                    //$window.alert('out');
                    $timeout(function () {
                        scope.isShowPopup = false;
                    }, 100);
                }
            });

            //$('body').click(function () {
            //    $timeout(function () {
            //        scope.isShowPopup = false;
            //    }, 50);
            //});

            scope.$watch("selectedItem", function (newValue, oldValue) {
                if (newValue == null || newValue.ID == oldValue.ID) return;

                //$timeout(function () {
                //scope.isShowPopup = !scope.isShowPopup;
                //}, 50);

                //scope.__proto__.ScheduleLineHeader.ngFilterclosed = newValue;
                scope.$eval(attrs.filterclosed + "(" + JSON.stringify(newValue) + ")");

            });

        }
    }
});

