mslApp.directive('comboFiltered2', function ($rootScope, $timeout, localize) {
    return {
        scope: true,
        replace: true,
        require: 'ngModel',
        templateUrl: '/app/views/directive/comboFiltered2.htm',
        link: function (scope, element, attrs, ngModel) {

            scope.elementId = element[0].id;
            scope.filterExpression = "";
            scope.nameColumnWidth = "100%";
            scope.isTable = false;
            scope.isPopupVisible = false;
            scope.inputSize = "7";
            scope.selectedItemDivText = null;
            scope.autoCompleteValue = { ID: 0, NAME: "" };
            scope.filteredList = [];
            scope.itemList = [];
            scope.autoCompleteWidth = "94.2%";
            scope.popupWidth = "370px";
            var isTable = attrs.isTable,
                isMouseOutOfElement = true,
                selectedItemIndex = -1,
                strSelect = localize.getLocalizedString("_Select_");

            strLine = localize.getLocalizedString("_line_");
            strDestination = localize.getLocalizedString("_destination_");
            strCompany = localize.getLocalizedString("_Company_");
            strTo = localize.getLocalizedString("_To_");
            scope.isTable = (isTable == "true");
            scope.autoCompleteValue = null;
            if (scope.isTable == true)
                scope.nameColumnWidth = "40px";

            element.data(element[0].id, true);

            //$($(element).find("button")[0]).attr("id", attrs.id);

            var labelElement = $("[for='" + attrs.id + "']");
            if (labelElement && labelElement.length > 0)
                scope.ariaLabel = labelElement[0].innerText;


            //$("html").click(function (e) {
            //    if (e.target.uniqueID == element[0].uniqueID) {
            //        scope.isPopupVisible = !scope.isPopupVisible;
            //        if (scope.isPopupVisible == true)
            //            $($(element).find("button")[0]).focus();
            //    }
            //    else {
            //        $timeout(function () {
            //            $($(element).find("button")[0]).focus();
            //            scope.isPopupVisible = false;
            //        }, 100)
            //    }
            //});

            //angular.element(".wrapperDiv").focus(function () {
            //    scope.isPopupVisible = true;
            //    $timeout(function () {
            //        $($(element).find("button")[0]).focus();
            //    }, 250)
            //});

            $($(element).find(".quarterList")[0]).mouseleave(function (e) {
                isMouseOutOfElement = true;
            });

            $($(element).find(".quarterList")[0]).mouseenter(function (e) {
                isMouseOutOfElement = false;
            });

            $($(element).find(".autoCompleteValue")[0]).blur(function () {
                $timeout(function () {
                    if (isMouseOutOfElement) {
                        $($(element).find("button")[0]).focus();
                        scope.isPopupVisible = false;
                    }
                }, 150)
            });

            scope.$watch(attrs.ngModel, function (newVal, oldVal) {
                if (newVal == null) { }
                else
                    scope.autoCompleteValue = newVal;
            });

            scope.$watch(attrs.uiItems, function (newVal, oldVal) {

                if (scope.$eval(attrs.hideSelection) == true) return;

                if (newVal == null || newVal.length == 0) {
                    scope.autoCompleteValue = { ID: 0, NAME: "" };
                    scope.filteredList = [];
                    scope.itemList = [];
                }
                else {
                    scope.filteredList = scope.itemList = newVal;
                    for (var i = 0; i < scope.itemList.length; i++)
                        scope.itemList[i].uniqueId = i;
                    scope.navItem = scope.itemList[0];
                }

                if (attrs.uiItems.indexOf("busLineList") > -1) {
                    scope.popupWidth = "100px";
                    scope.inputSize = "47";
                }
                else {
                    scope.popupWidth = "350px";
                    scope.inputSize = "32";
                }

                if ($(document).width() > 320 && $(document).width() < 759)
                    if (attrs.uiItems.indexOf("busLineList") > -1)
                        scope.popupWidth = "100px";
                    else
                        scope.popupWidth = "100%";

            });

            scope.$watch(attrs.hideSelection, function (newVal, oldVal) {

                if (newVal == null) return;
                if (newVal == true) {
                    scope.filteredList = [];
                    //scope.itemList = [];
                }
                else {
                    var arr = scope.$eval(attrs.uiItems);
                    if (arr == null) return;
                    scope.filteredList = scope.itemList = scope.$eval(attrs.uiItems);
                    for (var i = 0; i < scope.itemList.length; i++)
                        scope.itemList[i].uniqueId = i;
                    //scope.navItem = scope.itemList[0];
                }

            });

            scope.mouseEnterItem = function (e) {
                $(e.target).css("background-color", "#98d7ca");
            }

            scope.elementKeyup = function (e) {

                if (e.keyCode == 13) {

                    if (scope.isDisabled == true) return;
                    if (scope.itemList.length == 0) return;
                    scope.isPopupVisible = !scope.isPopupVisible;

                    if (scope.selectedItemDivText == null) return;
                    $($(element).find(".autoCompleteValue")[0]).val("");

                    //scope.autoCompleteValue = null;
                    if (scope.isPopupVisible == true) {
                        //scope.filteredList = scope.itemList;

                        //for (var i = 0; i < scope.filteredList.length; i++) {
                        //    if (scope.filteredList[i].ID == scope.autoCompleteValue.ID) {
                        //        scope.navItem = scope.filteredList[i];
                        //        break;
                        //    }
                        //}
                        //$timeout(function () {
                        //    $($(element).find(".autoCompleteValue")[0]).focus();
                        //}, 50);

                    }

                }
            }

            scope.comboClicked = function () {
                if (scope.isDisabled == true) return;
                if (scope.itemList.length == 0) return;
                scope.isPopupVisible = !scope.isPopupVisible;

                //if (scope.selectedItemDivText == null) return;
                $($(element).find(".autoCompleteValue")[0]).val("");
                //scope.autoCompleteValue = null;
                if (scope.isPopupVisible == true) {
                    scope.filteredList = scope.itemList;


                    if (attrs.ngModel.indexOf('.City') > -1) {
                        var compareValues = scope.autoCompleteValue.ID + '-' + scope.autoCompleteValue.iid;
                        for (var i = 0; i < scope.filteredList.length; i++) {
                            if (scope.filteredList[i].ID == compareValues) {
                                scope.navItem = scope.filteredList[i];
                                break;
                            }
                        }
                    }
                    else {
                        for (var i = 0; i < scope.filteredList.length; i++) {
                            if (scope.filteredList[i].ID == scope.autoCompleteValue.ID) {
                                scope.navItem = scope.filteredList[i];
                                break;
                            }
                        }
                    }
                    $timeout(function () {
                        $($(element).find(".autoCompleteValue")[0]).focus();
                    }, 50);
                }
            }

            scope.itemSelected = function (selectedObject) {

                if (attrs.uiItems.indexOf("fromPlaceList") > -1)
                    $rootScope.search.autocompleteOrigin = { coords: "", description: "" };
                if (attrs.uiItems.indexOf("toPlaceList") > -1)
                    $rootScope.search.autocompleteDestination = { coords: "", description: "" };
                if (attrs.uiItems.indexOf("busLineList") > -1) {
                    $rootScope.search.autocompleteOrigin = { coords: "", description: "" };
                    $rootScope.search.autocompleteDestination = { coords: "", description: "" };
                }
                $timeout(function () {
                    $($(element).find("button")[0]).focus();
                    scope.isPopupVisible = false;
                }, 50);
                $rootScope.$eval(attrs.ngModel + "=" + JSON.stringify(selectedObject));
                $rootScope.$broadcast('resultSubViewChanged', { newValue: "" });
            }

            scope.textFieldKeyDown = function (e) {

                //var interval1 = setInterval(function () {
                //    if (iskeyStillDown == true) clearInterval(interval1);

                switch (e.keyCode) {
                    case 13:        //enter
                        e.preventDefault();
                        if (scope.navItem != null) {
                            scope.itemSelected(scope.navItem);
                            setTimeout(function () {
                                //debugger;
                                if (appConfig.isEggedDb == true) return;
                                if (attrs.uiItems.indexOf("fromPlaceList") > -1)
                                    $("#bydestToCityCombo").focus();
                                if (attrs.uiItems.indexOf("toPlaceList") > -1)
                                    $("#bydestSearchButton").focus();
                                if (attrs.uiItems.indexOf("busLineList") > -1) {
                                    setTimeout(function () {
                                        $("#bylineSearchButton").focus();
                                    }, 150);
                                }
                                if (attrs.uiItems.indexOf("fromPlaceListByLine") > -1)
                                    $("#bylineToCity").focus();
                                if (attrs.uiItems.indexOf("toCityList") > -1)
                                    $("#bylineToPlace").focus();
                                if (attrs.uiItems.indexOf("toPlaceList") > -1)
                                    $("#bylineSearchButton").focus();

                            }, 250);
                        }
                        break;
                    case 38:        //arrow up
                        for (var i = 0; i < scope.filteredList.length; i++) {
                            if (scope.filteredList[i].uniqueId == scope.navItem.uniqueId)
                                if (i > 0) {
                                    setTimeout(function () {
                                        scope.navItem = scope.filteredList[i - 1];
                                        scope.filterExpression = scope.navItem.NAME;
                                        if (scope.navItem.CompanyName != null)
                                            scope.filterExpression = strLine + " " + scope.navItem.NAME + " " + scope.navItem.CompanyName + " " + strTo + scope.navItem.DestinationName;
                                    }, 50);
                                    break;
                                }
                        }
                        break;
                    case 40:        //arrow down
                        for (var i = 0; i < scope.filteredList.length; i++) {
                            if (scope.filteredList[i].uniqueId == scope.navItem.uniqueId)
                                if (i + 1 < scope.filteredList.length) {
                                    setTimeout(function () {
                                        scope.navItem = scope.filteredList[i + 1];
                                        scope.filterExpression = scope.navItem.NAME;
                                        if (scope.navItem.CompanyName != null)
                                            scope.filterExpression = strLine + " " + scope.navItem.NAME + " " + scope.navItem.CompanyName + " " + strTo + scope.navItem.DestinationName;
                                    }, 50);
                                    break;
                                }
                        }
                        break;
                }

                //}, 500);

            }

            scope.textFieldKeyUp = function (e) {
                //iskeyStillDown = false;
                switch (e.keyCode) {
                    case 13:        //enter

                        break;
                    case 38:        //arrow up
                        //for (var i = 0; i < scope.filteredList.length; i++) {
                        //    if (scope.filteredList[i].uniqueId == scope.navItem.uniqueId)
                        //        if (i > 0) {
                        //            scope.navItem = scope.filteredList[i - 1];
                        //            break;
                        //        }
                        //}
                        break;
                    case 40:        //arrow down
                        //for (var i = 0; i < scope.filteredList.length; i++) {
                        //    if (scope.filteredList[i].uniqueId == scope.navItem.uniqueId)
                        //        if (i + 1 < scope.filteredList.length) {
                        //            scope.navItem = scope.filteredList[i + 1];
                        //            break;
                        //        }
                        //}
                        break;
                    case 27:        //esc
                        scope.isPopupVisible = false;
                        break;
                    default:
                        $timeout(function () {
                            scope.filteredList = [];
                            for (var i = 0; i < scope.itemList.length; i++) {
                                if (scope.itemList[i].NAME.toLowerCase().indexOf(scope.filterExpression.toLowerCase()) > -1) {
                                    scope.filteredList.push(scope.itemList[i]);
                                }
                            }
                            scope.navItem = scope.filteredList[0];
                            if (scope.filteredList[0] == null) return;
                            if (!scope.isTable)
                                scope.cbOption = "cb_option" + scope.filteredList[0].ID + "";
                            else
                                scope.cbOption = "cb_option1" + scope.filteredList[0].ID + "";

                            if (scope.filteredList.length == 1 && attrs.uiItems.indexOf("busLineList") == -1 && $rootScope.isBezeqOnline != true) {
                                scope.navItem = scope.filteredList[0];
                                //scope.filterExpression = scope.navItem.NAME;
                                if (scope.navItem.CompanyName != null)
                                    scope.filterExpression = strLine + " " + scope.navItem.NAME + " " + scope.navItem.CompanyName + " " + strTo + scope.navItem.DestinationName;
                            }
                        }, 50);

                        break;
                }

            }


        }
    }
});