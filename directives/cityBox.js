mslApp.directive('cityBox', function ($rootScope, $templateRequest, $templateCache, $compile, $timeout, localize, $stateParams) {
    return {
        scope: true,
        //templateUrl: '/app/views/directive/cityBox.htm',
        //controller: function ($scope) {

        //    $scope.itemSelected = function (selectedId) {
        //        $rootScope.$eval(attrs.ngModel.replace(".NAME", "") + "=" + JSON.stringify(scope.cityList[selectedId]));
        //        scope.filteredList = [];
        //    }

        //},
        link: function (scope, element, attrs) {

            scope.timeoutKey = null;
            var isElementFocused = false;
            scope.filteredList = [];
            scope.cityList = [];
            var isFirstTime = true;

            scope.itemSelected = function (selectedId, event) {
                if (event.which != 13 && event.which != 1 && event.which != 9) return;
                if (attrs.ngModel.indexOf("from") != -1)
                    $rootScope.search.autocompleteOrigin = { coords: "", description: "" };
                else
                    $rootScope.search.autocompleteDestination = { coords: "", description: "" };

                $rootScope.$eval(attrs.ngModel.replace(".NAME", "") + "=" + JSON.stringify(scope.cityList[selectedId]));
                $rootScope.$broadcast('resultSubViewChanged', { newValue: "" });
                scope.filteredList = [];
                isElementFocused = false;
                if ($rootScope.isBezeqOnline != true) $(element).focus();
                return;
            }

            $rootScope.$watch(attrs.uiItems, function (newValue, oldValue) {
                if (newValue == null) return;
                scope.cityList = [];
                for (var i = 0; i < newValue.length; i++) {
                    scope.cityList.push({
                        iid: newValue[i].iid,
                        ID: newValue[i].ID,
                        NAME: newValue[i].NAME,
                        Priority: newValue[i].PRIORITY
                    });
                }

            });

            $(element).focus(function (e) {
                $timeout(function () {
                    isFirstTime = false;
                    scope.popupPosition = "absolute";
                    scope.popupTop = $(e.target).position().top + 30;
                    scope.popupLeft = $(e.target).position().left;
                    scope.popupWidth = e.target.clientWidth;
                    scope.popupTop = scope.popupTop + "px";
                    scope.popupLeft = scope.popupLeft + "px";
                    scope.popupWidth = scope.popupWidth + "px";

                    if ($(document).width() > 320 && $(document).width() < 759) {
                        //    scope.popupPosition = "fixed";
                        //    scope.popupTop = "0px";
                        scope.popupLeft = "0px";
                        scope.popupWidth = "100%";
                    }

                }, 250);

                //$(element).focus();
            });


            function closeFilteredList() {
                isFirstTime = true;
                if ($rootScope.$eval(attrs.ngModel.replace(".NAME", "")).ID != 0 &&
                 scope.cityList[$rootScope.$eval(attrs.ngModel.replace(".NAME", "")).iid].NAME == $(element).val()) {
                    isElementFocused = false;
                    scope.filteredList = [];
                    scope.$apply();
                    return;
                }
                else {
                    isElementFocused = false;
                    if ($(element).val().length == 0) {
                        scope.filteredList = [];
                        scope.$apply();
                        return;
                    }
                    if ($rootScope.$eval(attrs.ngModel.replace(".NAME", "")).ID != 0) $rootScope.$eval(attrs.ngModel + "=''");
                    scope.filteredList = [];
                    $(element).val("");
                    $(element).focus();
                    scope.$apply();
                    if ($rootScope.isBezeqOnline != true) {
                        $rootScope.search.userMessageTitle = "_Help_" + "," + "_Feeding_" + "," + "_City_";
                        if (attrs.ngModel.indexOf("from") != -1)
                            $rootScope.search.userMessage = "_MakeSureEntrySelected_" + "," + "_origin_";
                        else
                            $rootScope.search.userMessage = "_MakeSureEntrySelected_" + "," + "_destination_";
                    }
                    return;
                }
            }

            $(element).blur(function () {
                setTimeout(function () {
                    if (isElementFocused != true && isFirstTime != true) closeFilteredList();
                    else if (isElementFocused) $(element).focus();
                }, 50);
                //else if (scope.itemSelectedFromList && scope.isElementFocused != true) scope.filteredList = [];
            });

            $templateRequest('/app/views/directive/cityBox.htm')
            .then(function (templateContainer) {
                $compile(templateContainer);
            })
            .then(function () {
                var template = $templateCache.get('/app/views/directive/cityBox.htm');
                if (template) {
                    popupElement = $compile(template)(scope);
                    //$("body").append($(popupElement));
                    $(popupElement).insertAfter(element);
                }
            });

            setTimeout(function () {
                $(".scrollableParentParnet").mouseleave(function (e) {
                    isElementFocused = false;
                });

                $(".scrollableParentParnet").mouseenter(function (e) {
                    isElementFocused = true;
                });

            }, 500);

            $(element).keyup(function (e) {

                switch (e.keyCode) {
                    case 13:    //enter
                        //$timeout(function () {
                        //scope.itemSelected(scope.navItem.iid);
                        //}, 150);
                        break;
                    case 27:        //esc
                        scope.filteredList = [];
                        break;
                    case 38:
                        return;
                    case 40:
                        return;
                    case 9:     //tab
                        //scope.itemSelected(scope.navItem.iid);
                        break;
                    default:
                        isElementFocused = false;
                        if (scope.timeoutKey != null)
                            clearTimeout(scope.timeoutKey);
                        scope.timeoutKey = setTimeout(function () {
                            scope.filteredList = [];
                            if ($(element).val().length > 1) {

                                if ($rootScope.search.language == "he") {
                                    for (var i = 0; i < scope.cityList.length; i++)
                                        if (scope.cityList[i].NAME.indexOf($(element).val()) > -1) {
                                            if (scope.cityList[i].NAME.indexOf($(element).val()) == 0)
                                                //if (scope.cityList[i].NAME == $(element).val())
                                                scope.filteredList.unshift(scope.cityList[i]);
                                            else
                                                scope.filteredList.push(scope.cityList[i]);
                                        }
                                }
                                else {
                                    for (var i = 0; i < scope.cityList.length; i++)
                                        if (angular.lowercase(scope.cityList[i].NAME).indexOf(angular.lowercase($(element).val())) > -1) {
                                            if (angular.lowercase(scope.cityList[i].NAME).indexOf($(element).val()) == 0)
                                                //if (scope.cityList[i].NAME == $(element).val())
                                                scope.filteredList.unshift(scope.cityList[i]);
                                            else
                                                scope.filteredList.push(scope.cityList[i]);
                                        }
                                }
                                scope.navItem = scope.filteredList[0];
                            }
                            scope.$apply();
                        }, 50);

                        break;
                }
            });

            $(element).keydown(function (e) {
                switch (e.keyCode) {
                    case 8:
                            if ($rootScope.$eval(attrs.ngModel.replace(".NAME", "")).ID != 0) {
                                var elementText = $(element).val();
                                $rootScope.$eval(attrs.ngModel.replace(".NAME", "") + "={ID: 0, NAME: ''}");
                                $timeout(function () {
                                    if (elementText.length > 1)
                                    $(element)[0].value = elementText.slice(0, elementText.length - 1);
                                }, 1);
                            }
                        break;
                    case 9:        //tab
                        //if ($rootScope.isBezeqOnline != true) return;
                        if (scope.navItem == null || $(element).val().length == 0) return;
                        scope.itemSelected(scope.navItem.iid, e)
                        //e.preventDefault();
                        break;
                    case 13:        //enter
                        //e.preventDefault();
                        if (scope.navItem == null) return;
                        scope.itemSelected(scope.navItem.iid, e)
                        e.preventDefault();
                        break;
                    case 38:        //arrow up
                        for (var i = 0; i < scope.filteredList.length; i++) {
                            if (scope.filteredList[i].iid == scope.navItem.iid)
                                if (i > 0) {
                                    scope.navItem = scope.filteredList[i - 1];
                                    $rootScope.$eval(attrs.ngModel + "=" + JSON.stringify(scope.navItem.NAME));
                                    e.preventDefault();
                                    break;
                                }
                        }
                        break;
                    case 40:        //arrow down
                        for (var i = 0; i < scope.filteredList.length; i++) {
                            if (scope.filteredList[i].iid == scope.navItem.iid)
                                if (i + 1 < scope.filteredList.length) {
                                    scope.navItem = scope.filteredList[i + 1];
                                    $rootScope.$eval(attrs.ngModel + "=" + JSON.stringify(scope.navItem.NAME));
                                    e.preventDefault();
                                    break;
                                }
                        }
                        break;
                }
                scope.$apply();
            });

        }
    }
});
