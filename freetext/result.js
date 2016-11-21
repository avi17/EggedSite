"use strict";
mslApp.controller("FreetextResultCtrl",
    function ($scope, $rootScope, $stateParams, localize, searchService, transitionService, globalFunctions) {

        if ($stateParams.isShowFilter == null || $stateParams.isShowFilter == 1)
            $rootScope.isShowFilter = true;
        else
            $rootScope.isShowFilter = false;

        var freeTextQuestion = $stateParams.freelang;
        if (freeTextQuestion != null)
            localStorage.setItem('freelang', $stateParams.freelang);

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                       .toString(16)
                       .substring(1);
        };

        function guid() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                   s4() + '-' + s4() + s4() + s4();
        }

        function getData(optionId) {

            var _GUID = guid();

            if (freeTextQuestion == null || freeTextQuestion == "")
                return;

            if (optionId == null) {
                $scope.freeTextSessionId = _GUID;
                $scope.freeTextOptionId = null;
            }
            else {
                $scope.freeTextOptionId = optionId;
            }

            $scope.search.freeTextQuestion = freeTextQuestion;
            $scope.search.freeTextSessionId = $scope.freeTextSessionId;
            $scope.search.freeTextOptionId = $scope.freeTextOptionId;

            searchService.getFreeLanguageResult(
                $scope.search.freeTextOptionId,
                $scope.search.freeTextQuestion,
                $scope.search.freeTextSessionId,
                $scope.search.language,
                $scope.search.isEggedDb,
                function (sAnswer) {
                    setTimeout(function () {
                        $("#freetextSectionList").focus();
                    }, 500);
                    if (sAnswer == null || sAnswer == "קיימת תקלה בשירות") {
                        $rootScope.search.userMessage = "_freeTextServiceIsUnavailable_";
                        return;
                    }
                    else initResult(sAnswer);
                },
                function () {
                    alert("אין נתונים, נסה שוב מאוחר יותר.");
                });
        }

        getData();

        function initResult(newValue) {


            $scope.questionItemList = [];
            $scope.sectionList = [];

            var strContent = newValue;
            if (strContent == null) return;
            var strContentArray = strContent.split("<br>");

            if (strContentArray.length == 1)
                $scope.questionItemList.push({ value: "", text: strContentArray[0] });
            else {
                if (strContent.indexOf("Interaction(") == -1) {
                    if (strContent.indexOf("מקטע") == -1) {
                        //strContentArray.unshift("מקטע  ראשון  בנסיעה");
                        //strContentArray.unshift("");
                        //strContentArray.push("");

                        var SectionList = [];
                        var resultSectionObject = new byFreeTextSectionObject();
                        resultSectionObject.ContentString = strContent;
                        SectionList.push(resultSectionObject);
                        $scope.sectionList = SectionList;
                    }
                    else
                        $scope.sectionList = parseSectionList(strContentArray);
                }
                else
                    $scope.questionItemList = parseQuestionItemList(strContentArray);
            }

            if ($scope.questionItemList.length > 0) {
                $scope.ulElem = $("<ul style='list-style-type: circle; margin: 10px;'>");
                var liElem;
                for (var i = 0; i < $scope.questionItemList.length; i++) {
                    if ($scope.questionItemList[i].value == '')
                        liElem = $("<div>" + $scope.questionItemList[i].text + "</div>");
                    else {
                        liElem = $("<li style='display: list-item; list-style-type: circle;'><button type='button' targetIndex='" + i + "'>" + $scope.questionItemList[i].text + "</button></li>")
                            .click(function (e) {
                                $scope.optionClicked($scope.questionItemList[e.target.attributes.targetIndex.value].value);
                                $("#freetextDialog").dialog('close');
                            });
                    }
                    $(liElem).appendTo($scope.ulElem);
                }

                var strSiteMessages = localize.getLocalizedString("_SiteMessages_");

                var freetextDialogElem = $("#freetextDialog");
                if (freetextDialogElem.length > 0) {
                    $("#freetextDialog").dialog('open');
                }
                else {
                    $("<div title='" + strSiteMessages + "' id='freetextDialog'>" + "</div>").dialog({
                        autoResize: true,
                        resizable: false,
                        modal: true,
                        width: 'auto',
                        height: 'auto',
                        open: function (event, ui) {
                            $('.ui-widget-overlay').bind('click', function () {
                                $(event.target).dialog('close');
                            });
                            var currentHeaderText = $($(event.target).prev().find(".ui-dialog-title")[0]).html();
                            var h3Element = $("<h3 tabindex='0' style='font-size: 18px; margin: 0px 20px;'>").html(currentHeaderText);
                            setTimeout(function () {
                                $(h3Element).focus();
                            }, 500);
                            $($(event.target).prev().find(".ui-dialog-title")[0]).html("");
                            h3Element.appendTo($($(event.target).prev().find(".ui-dialog-title")[0]));

                        },
                        close: function (event, ui) {
                            $("#realtimeAddressText")[0].focus();
                        }
                    });
                }

                $("#freetextDialog").html("");
                $($scope.ulElem).appendTo("#freetextDialog");


            }

            //setTimeout(function () { 
            //if ($scope.questionItemList.length > 0)
            //    $("#freetextQuestionList").focus();
            //if ($scope.sectionList.length > 0)
            //    $("#freetextSectionList").focus();
            //}, 500);

        }

        /// Region Section List

        function parseSectionList(ContentArray) {
            var SectionList = [];
            var previousMiktaIndex = null;
            ContentArray.push("");
            for (var i = 0; i < ContentArray.length; i++) {
                if (ContentArray[i].indexOf("מקטע") > -1 || i == ContentArray.length - 1) {
                    if (previousMiktaIndex != null)
                        SectionList.push(parseSection(ContentArray.slice(previousMiktaIndex, i)));
                    previousMiktaIndex = i;
                }
            }
            return SectionList;
        }

        function parseSection(sectionArray) {
            var resultSectionObject = new byFreeTextSectionObject();

            for (var i = 0; i < sectionArray.length; i++) {
                if (sectionArray[i].indexOf("מקטע") > -1) {
                    if (sectionArray[i].indexOf("ראשון") > -1) {
                        resultSectionObject.Id = 1;
                        if (localize.language == "he-IL") resultSectionObject.ariaLabel = "חלק 1 של הנסיעה";
                        else resultSectionObject.ariaLabel = "Part 1 of the drive";
                        $scope.FromToString = sectionArray[i + 1];
                    }
                    if (sectionArray[i].indexOf("שני") > -1) {
                        resultSectionObject.Id = 2;
                        if (localize.language == "he-IL") resultSectionObject.ariaLabel = "חלק 2 של הנסיעה";
                        else resultSectionObject.ariaLabel = "Part 2 of the drive";
                    }
                    if (sectionArray[i].indexOf("שלישי") > -1) {
                        resultSectionObject.Id = 3;
                        if (localize.language == "he-IL") resultSectionObject.ariaLabel = "חלק 3 של הנסיעה";
                        else resultSectionObject.ariaLabel = "Part 3 of the drive";
                    }
                }
                else
                    if (sectionArray[i].indexOf("<li>") > -1)
                        resultSectionObject.BusLineList = parseBusLineList(sectionArray[i]);
                    else
                        //if (sectionArray[i].indexOf("בתאריך") > -1 || sectionArray[i].indexOf("משך") > -1)
                    {
                        if (resultSectionObject.ContentString == null)
                            resultSectionObject.ContentString = " ";
                        resultSectionObject.ContentString += " ";
                        resultSectionObject.ContentString += sectionArray[i];
                    }
                //if (sectionArray[i].indexOf("בתאריך") > -1)
                //    $scope.DateString = sectionArray[i].substring(sectionArray[i].indexOf("בתאריך") + 7, 17);
                //if (sectionArray[i].indexOf("משך") > -1)
                //    resultSectionObject.DurationString = sectionArray[i].substring(sectionArray[i].indexOf("משך") + 12);
            }
            return resultSectionObject;
        }

        function parseBusLineList(BusLineListString) {
            var ResultBusLineList = [];
            var BusLineList = BusLineListString.split("<li>");
            for (var i = 0; i < BusLineList.length; i++) {
                if (BusLineList[i] == " ") continue;
                //var newBusLine = new BusLine();
                //var lineData = BusLineList[i].split(' ');
                //newBusLine.Id = i;
                //for (var j = 0; j < lineData.length; j++) {
                //    if (lineData[j] == "קו") {
                //        j++;
                //        newBusLine.LineNumber = lineData[j];
                //    }
                //    if (lineData[j].indexOf("<COMPANY>") != -1)
                //        newBusLine.CompanyName = $(lineData[j])[0].innerHTML;
                //    if (lineData[j][0] == "מ")
                //        newBusLine.FromTime = lineData[j].substring(1);
                //    if (lineData[j] == "עד") {
                //        j++;
                //        newBusLine.ToTime = lineData[j];
                //    }
                //    if (lineData[j] == "כל") {
                //        j++;
                //        newBusLine.Frequency = lineData[j];
                //    }
                //    if (lineData[j].length == 6 && lineData[j][5] == ";")
                //        newBusLine.PointInTime.push(lineData[j].substring(0, 5));
                //}
                //ResultBusLineList.push(newBusLine);
                ResultBusLineList.push(BusLineList[i]);
            }
            return ResultBusLineList;
        }

        function parseHourList(HourListString) {
            var resultHourList = [];
            var HourList = HourListString.split(" ");
            for (var i = 0; i < HourList.length; i++)
                if (HourList[i] == "" || HourList[i] == ",") HourList.splice(i, 1);
            for (var i = 0; i < HourList.length; i++) {
                switch (HourList[i]) {
                    case "עד":
                        resultHourList.splice(i - 1, 1);
                        var newLineHour = new LineHour();
                        newLineHour.FromTime = HourList[i - 1].substring(1);
                        newLineHour.ToTime = HourList[i + 1];
                        i++;
                        resultHourList.push(newLineHour);
                        break;
                    case "כל":
                        var newLineHour = new LineHour();
                        i++;
                        newLineHour.Frequency = HourList[i];
                        i++;
                        resultHourList.push(newLineHour);
                        break;
                    default:
                        var newLineHour = new LineHour();
                        newLineHour.PointInTime = HourList[i].substring(0, HourList[i].length - 1);
                        resultHourList.push(newLineHour);
                        break;
                }
            }
            return resultHourList;
        }

        /// End Region Section List


        /// Region Question Items

        function parseQuestionItemList(ContentArray) {
            var questionItemList = [];
            for (var i = 0; i < ContentArray.length; i++) {
                if (ContentArray[i].indexOf("</a>") == -1)
                    questionItemList.push({ value: '', text: ContentArray[i] });
                else {
                    var optionNameStartIndex = ContentArray[i].indexOf("</a>") + 4;
                    var optionName = ContentArray[i].substring(optionNameStartIndex);
                    var optionValueStartIndex = ContentArray[i].indexOf("Interaction(") + 12;
                    var optionValueEndIndex = ContentArray[i].indexOf(")'>");
                    var optionValue = ContentArray[i].substring(optionValueStartIndex, optionValueEndIndex);
                    questionItemList.push({ value: optionValue, text: optionName });
                }
            }
            return questionItemList;
        }

        $scope.optionClicked = function (optionIndex) {
            for (var i = 0; i < $scope.questionItemList.length; i++) {
                if ($scope.questionItemList[i].value == optionIndex) {
                    if ($scope.questionItemList[0].text.indexOf("היכן תרצה להגיע") > -1) {
                        if ($scope.search.freeTextQuestion.indexOf("מחיר") > -1)
                            $scope.search.freeTextQuestion = $scope.questionItemList[0].text.replace("היכן תרצה להגיע", $scope.questionItemList[i].text) + " מחיר";
                        else
                            $scope.search.freeTextQuestion = $scope.questionItemList[0].text.replace("היכן תרצה להגיע", $scope.questionItemList[i].text);
                        getData(optionIndex);
                    }
                  else if($scope.questionItemList[0].text.indexOf("לאן תרצה להגיע ") > -1) {
                        var newQuestion = $scope.questionItemList[0].text.replace("לאן תרצה להגיע ", "");
                        if ($scope.search.freeTextQuestion.indexOf("מחיר") > -1)
                            $scope.search.freeTextQuestion = newQuestion + " ל" + $scope.questionItemList[i].text + " מחיר";
                        else
                            $scope.search.freeTextQuestion = newQuestion + " ל" + $scope.questionItemList[i].text;
                        getData(optionIndex);
                    }
                  else if ($scope.questionItemList[0].text.indexOf("מהי תחנת העליה") > -1) {
                        if ($scope.search.freeTextQuestion.indexOf("מחיר") > -1)
                            $scope.search.freeTextQuestion = $scope.questionItemList[0].text.replace("מהי תחנת העליה", $scope.questionItemList[i].text) + " מחיר";
                        else
                            $scope.search.freeTextQuestion = $scope.questionItemList[0].text.replace("מהי תחנת העליה", $scope.questionItemList[i].text);
                        getData(optionIndex);
                    }
                else if ($scope.questionItemList[0].text.indexOf("מהי תחנת הירידה") > -1) {
                        var newQuestion = $scope.questionItemList[0].text.replace("מהי תחנת הירידה", "");
                        if ($scope.search.freeTextQuestion.indexOf("מחיר") > -1)
                            $scope.search.freeTextQuestion = newQuestion + " ל" + $scope.questionItemList[i].text + " מחיר";
                        else
                            $scope.search.freeTextQuestion = newQuestion + " ל" + $scope.questionItemList[i].text;
                        getData(optionIndex);
                    }
                   else getData(optionIndex);
                }
            }
        }

        /// EndRegion Question Items


        /// Region Print and Mail Methods

        //function initPrintContent() {
        //    var printContainer = $("<div>").css("width", "1300px");
        //    var logoSrc = "Content/images/headermenu/logo_egged.png";
        //    $('<img>').attr('src', logoSrc).appendTo(printContainer);
        //    $("<div>תוצאות חיפוש עבור : </div>").appendTo(printContainer);
        //    $("<br />").appendTo(printContainer);
        //    var QuestionDiv = $("<div>");
        //    QuestionDiv[0].innerHTML = $(".byFreeTextQuestion")[0].innerHTML;
        //    $(QuestionDiv).addClass("byFreeTextQuestion").appendTo(printContainer);
        //    $("<br />").appendTo(printContainer);
        //    var ResultDiv = $("<table>").css("width", "100%");
        //    for (var i = 0; i < $(".byFreeTextResult").length; i++) {
        //        var resultElem = $(".byFreeTextResult")[i].outerHTML;
        //        $(resultElem).appendTo(ResultDiv);
        //    }
        //    $(ResultDiv).appendTo(printContainer);
        //    return printContainer;
        //}

        function initMailContent() {

            var langDir = "rtl";
            if (localize.language == "he-IL")
                langDir = "rtl";
            else
                langDir = "ltr";

            var mailContainer = "";
            mailContainer += '<table style="width: 100%; direction: ' + langDir + ';">';
            mailContainer += '<tr style="background-color: #ececec; height: 43px;">';
            mailContainer += '<td>';
            mailContainer += '<div style="padding: 1px; color: #00715a; ">';
            mailContainer += $scope.search.freeTextQuestion;
            mailContainer += '</div>';
            mailContainer += '</td>';
            mailContainer += '</tr>';
            for (var i = 0; i < $scope.sectionList.length; i++) {
                mailContainer += '<tr style="background-color: white; margin: 10px; border-radius: 10px; border: 1px solid green;">';
                mailContainer += '<td>';
                mailContainer += '<table>';
                mailContainer += '<tr style="background-color: rgb(222, 240, 236); margin: 10px; ">';
                mailContainer += '<td>';
                mailContainer += '<table>';
                mailContainer += '<tr>';
                mailContainer += '<td style="width: 35px;" >';
                mailContainer += '<div style="width: 35px; height: 44px; text-align: center; vertical-align: middle; background-color: #00715a; color: white; font-size:15px;"> ';
                mailContainer += $scope.sectionList[i].Id.toString();
                mailContainer += ' </div>';
                mailContainer += '</td>';
                mailContainer += '<td>';
                mailContainer += '<div style="vertical-align: middle; display: inline-block; color: #00715a;" > ';
                mailContainer += $scope.sectionList[i].ContentString;
                mailContainer += ' </div>';
                mailContainer += '</td>';
                mailContainer += '</tr>';
                mailContainer += '</table>';
                mailContainer += '</td>';
                mailContainer += '</tr>';
                mailContainer += '<tr>';
                mailContainer += '<td>';
                mailContainer += '<table>';
                for (var j = 0; j < $scope.sectionList[i].BusLineList.length; j++) {
                    mailContainer += '<tr>';
                    mailContainer += '<td>';
                    mailContainer += '<div>';
                    mailContainer += $scope.sectionList[i].BusLineList[j];
                    mailContainer += '</div>';
                    mailContainer += '</td>';
                    mailContainer += '</tr>';
                }
                mailContainer += '</table>';
                mailContainer += '</td>';
                mailContainer += '</tr>';
                mailContainer += '</table>';
                mailContainer += '</td>';
                mailContainer += '</tr>';
            }
            mailContainer += '</table>';

            return mailContainer;
        }

        //function printContact() {
        //    var printAndMailHtml = "<div style";
        //    $(".tableResultScroll2").css("height", "")
        //                            .css("overflow-y", "");
        //    if (localize.language == "he-IL") printAndMailHtml = '<div style="direction: rtl;">'
        //    else printAndMailHtml = '<div style="direction: ltr;">'
        //    printAndMailHtml += '<img src="Content/images/headermenu/logo_egged.png" class="siteLogoImage" style="line-height: 185px; font-weight: bolder;" data-ng-class="{true: FloatRight, false: FloatLeft}[dir]"></div>'
        //                        + '<br /> '
        //                        + $(".egged .view").html();
        //                        +"<br /></div>";
        //    return printAndMailHtml;
        //}


        $scope.print = function () {
            var printContent = initMailContent();
            globalFunctions.printHtml(printContent);
        }

        $scope.sendMail = function () {
            var strPleaseProvideMailAddress = localize.getLocalizedString("_PleaseProvideMailAddress_");
            var address = "";
            if ($rootScope.userDetails != null && $rootScope.userDetails.emailAddress != null)
                address = $rootScope.userDetails.emailAddress;
            var destinationMailAddress = prompt(strPleaseProvideMailAddress, address);
            if (destinationMailAddress == null) return;
            if (destinationMailAddress.indexOf('@') > -1) {


                $rootScope.userDetails.emailAddress = destinationMailAddress
                if ($rootScope.isStorageActive)
                    localStorage.setItem("emailAddress", $rootScope.userDetails.emailAddress);
                var strEggedSite = localize.getLocalizedString("_Title_");
                var strWeeklySchedule = localize.getLocalizedString("_WeeklySchedule_");
                var bodyContent = initMailContent();

                var printObject =
                {
                    ToAddress: destinationMailAddress
                    , ToName: ""
                    , Subject: strEggedSite //+ " - " + strWeeklySchedule //+ " - " + weeklyReportData.Shilut + "מ:" + weeklyReportData.DestinationName + " ל:" + weeklyReportData.OriginName
                    , Body: bodyContent
                };
                var jsonString = JSON.stringify(printObject)
                transitionService.sendMail(jsonString,
                    function (data) {
                        $rootScope.search.userMessageTitle = "_SendByEmail_";
                        $rootScope.search.userMessage = "_MessageSuccessfullySent_";
                    },
                    function (result) {
                        $rootScope.search.userMessageTitle = "_SendByEmail_";
                        $rootScope.search.userMessage = "_MessageSendFailed_";
                    });
            }
            else {
                $rootScope.search.userMessageTitle = "_SendByEmail_";
                $rootScope.search.userMessage = "_IlegalMailAddress_";
            }

        }

        /// EndRegion Print and Mail Methods


        //var renderContext = requestContext.getRenderContext("search.result.byfreetext");
        //$scope.subview = renderContext.getNextSection();

    });

function byFreeTextSectionObject() {
    this.Id = "";
    this.BusLineList = "";
    this.DurationString = "";
}

function LineHour() {
}

