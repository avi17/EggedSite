/// <reference path="../views/directive/mapaSearchWindow.htm" />
/// <reference path="../views/directive/mapaSearchWindow.htm" />
mslApp.directive('mapaSearchWindow', function ($compile, $timeout, $rootScope, searchService) {
    return {
        //templateUrl: '/app/views/directive/mapaSearchWindow.htm',
        link: function (scope, element, attrs, ctrl) {

            var selectedQuarter;
            var popupDivElement;
            function init() {

                if (popupDivElement == null) {
                    scope.$watch(attrs.ngDisabled, function (newVal, oldVal) {
                        if (newVal == true) {
                            $(element).attr("disabled", "disabled");
                            $(element).css("cursor", "default");
                        }
                        else {
                            $(element).removeAttr("disabled");
                            $(element).css("cursor", "pointer");
                        }
                    });

                    popupDivElement = $("<div>");
                    $(popupDivElement).load('/app/views/directive/mapaSearchWindow.htm');
                    $(popupDivElement).dialog({
                        autoOpen: false,
                        height: 300,
                        width: 600,
                        modal: true
                    });
                }

                $(element).click(function () {

                    if ($(element).css("cursor") == "default") return;

                    initPoiList();
                    initStreetList();
                    initSelectButton();
                    initRadioButtons();
                    $(popupDivElement).find(".tbHouseNumber")[0].value = "";
                    $($(popupDivElement).find(".tbHouseNumber")[0]).attr('disabled', 'disabled');
                    $(popupDivElement).find("#selectedPlaceName")[0].innerHTML = "";
                    $(popupDivElement).find("#ErrorMsg")[0].innerHTML = "";
                    initSelectedPlaceLabel();
                    $(popupDivElement).find(".mapaSearchByAddress").prop('checked', true);
                    handleRadioChange(".mapaSearchByAddress");

                    $(popupDivElement).find(".tbHouseNumber").unbind('keyup').bind('keyup', function (e) {
                        $(popupDivElement).find("#ErrorMsg")[0].innerHTML = "";
                        var quarterId = getQuarterFromAddress();
                        if (attrs.ngQuarterField.indexOf("fromAddress") > -1) {
                            if ($rootScope.search.currentTabName == "bydest")
                                selectedQuarter = $.grep($rootScope.search.fromPlaceList, function (e) { return e.ID == quarterId; })[0];
                            else
                                selectedQuarter = $.grep($rootScope.search.fromPlaceListByLine, function (e) { return e.ID == quarterId; })[0];
                        }
                        else
                            selectedQuarter = $.grep($rootScope.search.toPlaceList, function (e) { return e.ID == quarterId; })[0];
                        if (selectedQuarter == null) {
                            if ($rootScope.search.currentTabName == "bydest")
                                $(popupDivElement).find("#ErrorMsg")[0].innerHTML = "כתובת לא נמצאה עבור העיר שהוזנה.";
                            else
                                $(popupDivElement).find("#ErrorMsg")[0].innerHTML = "המקום לא קיים במסלול הקו שביקשת.";
                        }
                        else
                            $(popupDivElement).find("#selectedPlaceName")[0].innerHTML = selectedQuarter.NAME;
                        initSelectedPlaceLabel();
                    });

                    var newTitle = "";
                    if (attrs.ngQuarterField.indexOf("fromAddress") > -1)
                        newTitle = "נקודות עניין עבור העיר " + $rootScope.search.fromAddress.City.NAME;
                    else
                        newTitle = "נקודות עניין עבור העיר " + $rootScope.search.toAddress.City.NAME;

                    $(popupDivElement).dialog('option', 'title', newTitle);
                    $(popupDivElement).dialog("open");
                });

            }

            function initSelectedPlaceLabel() {
                //$($(popupDivElement).find("#selectedPlaceName")[0]).bind('DOMSubtreeModified', function () {
                if ($(popupDivElement).find("#selectedPlaceName")[0].innerHTML == "") {
                    $($(popupDivElement).find("#btnSelectMapaLocation")[0]).attr('disabled', 'disabled');
                    $($(popupDivElement).find("#btnSelectMapaLocation")[0]).addClass("btnGreenDisabled");
                    $($(popupDivElement).find("#btnSelectMapaLocation")[0]).removeClass("btnGreen");
                }
                else {
                    $($(popupDivElement).find("#btnSelectMapaLocation")[0]).removeAttr("disabled");
                    $($(popupDivElement).find("#btnSelectMapaLocation")[0]).addClass("btnGreen");
                    $($(popupDivElement).find("#btnSelectMapaLocation")[0]).removeClass("btnGreenDisabled");
                }
                //});
            }

            function initSelectButton() {

                $($(popupDivElement).find("#btnSelectMapaLocation")[0]).unbind('click').bind('click', function (e) {

                    $timeout(function () {
                        if (attrs.ngQuarterField.indexOf("fromAddress") > -1)
                            $rootScope.search.fromAddress.Quarter = selectedQuarter;
                        else
                            $rootScope.search.toAddress.Quarter = selectedQuarter;
                    }, 200);
                    $(popupDivElement).dialog("close");
                });
            }

            function enableSelect2ByClassName(className) {
                //$($(popupDivElement).find(className)[0]).removeAttr('disabled');
                $($(popupDivElement).find(className)[0]).select2('enable');
                $($(popupDivElement).find(className)[0]).select2("val", "");
                setTimeout(function () {
                    $($(popupDivElement).find(className)[0]).prev().removeAttr("disabled");
                    //$($(popupDivElement).find(className)[0]).prev().find(".select2-chosen").each(function () {
                    //    $(this).show();
                    //});
                }, 100);
            }

            function disableSelect2ByClassName(className) {
                //$($(popupDivElement).find(className)[0]).attr('disabled', 'disabled');
                $($(popupDivElement).find(className)[0]).select2('disable');
                $($(popupDivElement).find(className)[0]).select2("val", "");
                setTimeout(function () {
                    $($(popupDivElement).find(className)[0]).prev().attr("disabled", "disabled");
                    //$($(popupDivElement).find(className)[0]).prev().find(".select2-chosen").each(function () {
                    //    $(this).hide();
                    //});
                }, 100);
            }

            function handleRadioChange(className) {
                if (className == ".mapaSearchPoi") {
                    disableSelect2ByClassName(".tbStreetList");
                    $($(popupDivElement).find(".tbHouseNumber")[0]).attr('disabled', 'disabled');
                    enableSelect2ByClassName(".tbPoiList");
                }

                if (className == ".mapaSearchByAddress") {
                    enableSelect2ByClassName(".tbStreetList");
                    //$($(popupDivElement).find(".tbHouseNumber")[0]).removeAttr('disabled');
                    disableSelect2ByClassName(".tbPoiList");
                }
            }

            function initRadioButtons() {

                $($(popupDivElement).find(".mapaSearchByAddress")[0]).unbind('click').bind('click', function (e) {
                    $(popupDivElement).find(".tbHouseNumber").val("");
                    $(popupDivElement).find("#selectedPlaceName")[0].innerHTML = "";
                    $(popupDivElement).find("#ErrorMsg")[0].innerHTML = "";
                    initSelectedPlaceLabel();
                    handleRadioChange(".mapaSearchByAddress");
                });

                $($(popupDivElement).find(".mapaSearchPoi")[0]).unbind('click').bind('click', function (e) {
                    $(popupDivElement).find(".tbHouseNumber").val("");
                    $(popupDivElement).find("#selectedPlaceName")[0].innerHTML = "";
                    $(popupDivElement).find("#ErrorMsg")[0].innerHTML = "";
                    initSelectedPlaceLabel();
                    handleRadioChange(".mapaSearchPoi");
                });

            }

            function initStreetList() {
                var retVal = [];
                if (attrs.ngQuarterField.indexOf("fromAddress") > -1)
                    $rootScope.search.searchCityId = $rootScope.search.fromAddress.City.ID;
                else
                    $rootScope.search.searchCityId = $rootScope.search.toAddress.City.ID;
                $rootScope.search.CityPlaceExpression = "";

                searchService.getStreetList($rootScope.search.getJsonString(), function (retList) {
                    for (var i = 0; i < retList.length; i++) {
                        retVal.push({ id: retList[i].ID, text: retList[i].NAME });
                    }
                });
                $(popupDivElement).find("#tbStreetList")[0].value = "";

                //if ($(popupDivElement).find(".tbStreetList").length > 1) {
                //    $($(popupDivElement).find(".tbStreetList")[0]).select2({
                //        data: retVal
                //    });
                //}
                //else {
                $($(popupDivElement).find("#tbStreetList")[0]).select2({
                    minimumInputLength: 2,
                    data: retVal
                })
                .on("change", function (e) {
                    $(popupDivElement).find(".tbHouseNumber").val("");
                    $($(popupDivElement).find(".tbHouseNumber")[0]).removeAttr("disabled");
                    $(popupDivElement).find("#selectedPlaceName")[0].innerHTML = "";
                    $(popupDivElement).find("#ErrorMsg")[0].innerHTML = "";
                    initSelectedPlaceLabel();
                    $rootScope.search.streetId = e.added.id;
                });
                $.ui.dialog.prototype._allowInteraction = function (e) {
                    return !!$(e.target).closest('.ui-dialog, .ui-datepicker, .select2-drop').length;
                };
                //}
            }

            function initPoiList() {
                var retVal = [];

                if (attrs.ngQuarterField.indexOf("fromAddress") > -1)
                    $rootScope.search.searchCityId = $rootScope.search.fromAddress.City.ID;
                else
                    $rootScope.search.searchCityId = $rootScope.search.toAddress.City.ID;
                $rootScope.search.CityPlaceExpression = "";

                searchService.getRovaListForYeshuv($rootScope.search.getJsonString(), function (retList) {

                    for (var i = 0; i < retList.length; i++) {
                        retList[i].id = retList[i].ID;
                        retList[i].text = retList[i].NAME;
                    }
                });
                $(popupDivElement).find("#tbPoiList")[0].value = "";

                //if ($(popupDivElement).find(".tbPoiList").length > 1) {
                //    $($(popupDivElement).find(".tbPoiList")[0]).select2({
                //        formatResult: reFormatResult,
                //        formatSelection: reFormatSelection,
                //        data: retList
                //    });
                //}
                //else {
                $($(popupDivElement).find("#tbPoiList")[0]).select2({
                    minimumInputLength: 2,
                    formatResult: reFormatResult,
                    formatSelection: reFormatSelection,
                    data: retList
                })
                    .on("change", function (e) {
                        var quarterId = e.added.QuarterId;

                        if (attrs.ngQuarterField.indexOf("fromAddress") > -1) {
                            if ($rootScope.search.currentTabName == "bydest")
                                selectedQuarter = $.grep($rootScope.search.fromPlaceList, function (e) { return e.ID == quarterId; })[0];
                            else
                                selectedQuarter = $.grep($rootScope.search.fromPlaceListByLine, function (e) { return e.ID == quarterId; })[0];
                        }
                        else
                            selectedQuarter = $.grep($rootScope.search.toPlaceList, function (e) { return e.ID == quarterId; })[0];
                        if (selectedQuarter == null) {
                            if ($rootScope.search.currentTabName == "bydest")
                                $(popupDivElement).find("#ErrorMsg")[0].innerHTML = "כתובת לא נמצאה עבור העיר שהוזנה.";
                            else
                                $(popupDivElement).find("#ErrorMsg")[0].innerHTML = "המקום לא קיים במסלול הקו שביקשת.";
                        }
                        else
                            $(popupDivElement).find("#selectedPlaceName")[0].innerHTML = selectedQuarter.NAME;

                        $(popupDivElement).find("#selectedPlaceName")[0].innerHTML = e.added.NAME + "-" + e.added.QuarterName;
                        initSelectedPlaceLabel();
                    });
                $.ui.dialog.prototype._allowInteraction = function (e) {
                    return !!$(e.target).closest('.ui-dialog, .ui-datepicker, .select2-drop').length;
                };

                //}
            }

            function getQuarterFromPoi() {
                var retVal = $($(popupDivElement).find("#tbPoiList")[0]).select2('data');
                return retVal.id;
            }

            function getQuarterFromAddress() {
                $rootScope.search.houseNumber = $(popupDivElement).find(".tbHouseNumber").val();
                searchService.getRovaByStreet($rootScope.search.getJsonString(), function (retval) {
                    retVal = retval;
                    return retVal;
                });
               
            }

            function reFormatSelection(item) {
                if (item.NAME != null)
                    return item.NAME;
            }

            function reFormatResult(item) {
                var retVal = "";
                retVal += "<div>";

                retVal += "<div class='TableCell' style='width: 60px; '>";
                retVal += item.TypeName;
                retVal += "</div>";

                if (item.NAME.length > 15) {
                    retVal += "<div class='TableCell' title='" + item.NAME + "' style='width: 150px; overflow: hidden; '>";
                    retVal += item.NAME.substring(0, 15);
                    retVal += "...</div>";
                }
                else {
                    retVal += "<div class='TableCell' style='width: 150px; overflow: hidden; '>";
                    retVal += item.NAME;
                    retVal += "</div>";
                }

                if (item.QuarterName.length > 15) {
                    retVal += "<div class='TableCell' title='" + item.QuarterName + "' style='width: 150px; overflow: hidden; '>";
                    retVal += item.QuarterName.substring(0, 15);
                    retVal += "...</div>";
                }
                else {
                    retVal += "<div class='TableCell' style='width: 150px; overflow: hidden; '>";
                    retVal += item.QuarterName + "</div>";
                }

                retVal += "</div>";

                return retVal;
            }

            init();
        }
    }
});
