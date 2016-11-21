
mslApp.directive('progressBar', function ($compile, $location, localize, $rootScope, searchService, transitionService) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {

            var dialogElement;
            var progressBarBusElem;
            var progressBarFirstTextElem;
            var progressBarSecondTextElem;
            var progressBarThirdTextElem;
            var progressBarFourthElem;
            var progressBarFifthElem;
            var progressBarSixthElem;
            var progressBarFirstSpacer;
            var progressBarSecondSpacer;

            var strTripOptions = localize.getLocalizedString("_TripOptions_");
            var strLinesBetweenCities = localize.getLocalizedString("_LinesBetweenCities_");
            var strTripSummary = localize.getLocalizedString("_details_");
            var strSchedule = localize.getLocalizedString("_bus-stop_");

            var langDir = "rtl";
            var strPrint = localize.getLocalizedString("_Print_");
            var strSendByMail = localize.getLocalizedString("_SendByEmail_");
            var strViewDailySchedule = localize.getLocalizedString("_DailySchedule_");
            var strViewWeeklySchedule = localize.getLocalizedString("_WeeklySchedule_");
            var strWeeklySchedule = localize.getLocalizedString("_WeeklySchedule_");
            var strPleaseProvideMailAddress = localize.getLocalizedString("_PleaseProvideMailAddress_");
            var strWeeklyScheduleMessagePart1 = localize.getLocalizedString("_WeeklyScheduleMessagePart1_");
            var strWeeklyScheduleMessagePart2 = localize.getLocalizedString("_WeeklyScheduleMessagePart2_");
            var strFromSingleLetter = localize.getLocalizedString("_From_");
            var strToSingleLetter = localize.getLocalizedString("_To_");


            //$rootScope.$watch("search.resultViewName", function (newValue, oldValue) {

            //    if (newValue == 'transition')
            //        $(".DailySchedule").css("display", "inline-block");
            //    else
            //        $(".DailySchedule").css("display", "none");

            //});



            //scope.$watch(attrs.ngTabName, function (newValue, oldValue) {
            //    if (newValue == "byfreetext") {
            //        $(element).hide();
            //        return;
            //    }
            //});


            scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                if (newValue == null || newValue == "" || newValue == 'byfreetext' || newValue == 'byrealtime') {
                    $(element).hide();
                    return;
                }
                else {
                    $(element).show();
                }

                init();

                switch (newValue) {
                    case "path-plan":
                        $(progressBarFirstTextElem)[0].className = 'progressBarGreenText';
                        if (localize.language == "he-IL")
                            $(progressBarFirstSpacer)[0].className = 'progressBarCToAHeb';
                        else
                            $(progressBarFirstSpacer)[0].className = 'progressBarCToAEng';

                        $(progressBarSecondTextElem)[0].className = 'progressBarGrayText';
                        if (localize.language == "he-IL")
                            $(progressBarSecondSpacer)[0].className = 'progressBarCToCHeb';
                        else
                            $(progressBarSecondSpacer)[0].className = 'progressBarCToCEng';
                        $(progressBarThirdTextElem)[0].className = 'progressBarGrayText';
                        $(progressBarBusElem).css("background-color", "#209b7a");
                        $(element).css("background-color", "#d5dbda");
                        strTripOptions = localize.getLocalizedString("_TripOptions_");
                        progressBarFirstTextElem.children()[0].innerText = strTripOptions;
                        break;
                    case "transition":
                        $(progressBarFirstTextElem)[0].className = 'progressBarLightGreenText';
                        if (localize.language == "he-IL")
                            $(progressBarFirstSpacer)[0].className = 'progressBarAToBHeb';
                        else
                            $(progressBarFirstSpacer)[0].className = 'progressBarAToBEng';
                        $(progressBarSecondTextElem)[0].className = 'progressBarGreenText';
                        if (localize.language == "he-IL")
                            $(progressBarSecondSpacer)[0].className = 'progressBarCToAHeb';
                        else
                            $(progressBarSecondSpacer)[0].className = 'progressBarCToAEng';
                        $(progressBarThirdTextElem)[0].className = 'progressBarGrayText';
                        $(progressBarBusElem).css("background-color", "#aeccc5");
                        $(element).css("background-color", "#d5dbda");
                        break;
                    case "bus-stop":
                        $(progressBarFirstTextElem)[0].className = 'progressBarLightGreenText';
                        if (localize.language == "he-IL")
                            $(progressBarFirstSpacer)[0].className = 'progressBarAToBHeb';
                        else
                            $(progressBarFirstSpacer)[0].className = 'progressBarAToBEng';
                        $(progressBarSecondTextElem)[0].className = 'progressBarGreenText';
                        if (localize.language == "he-IL")
                            $(progressBarSecondSpacer)[0].className = 'progressBarCToAHeb';
                        else
                            $(progressBarSecondSpacer)[0].className = 'progressBarCToAEng';
                        $(progressBarThirdTextElem)[0].className = 'progressBarGrayText';
                        $(progressBarBusElem).css("background-color", "#aeccc5");
                        $(element).css("background-color", "#d5dbda");
                        break;
                    case "details":
                        $(progressBarFirstTextElem)[0].className = 'progressBarLightGreenText';
                        if (localize.language == "he-IL")
                            $(progressBarFirstSpacer)[0].className = 'progressBarBToBHeb';
                        else
                            $(progressBarFirstSpacer)[0].className = 'progressBarBToBEng';
                        $(progressBarSecondTextElem)[0].className = 'progressBarLightGreenText';
                        if (localize.language == "he-IL")
                            $(progressBarSecondSpacer)[0].className = 'progressBarAToBHeb';
                        else
                            $(progressBarSecondSpacer)[0].className = 'progressBarAToBEng';
                        $(progressBarThirdTextElem)[0].className = 'progressBarGreenText';
                        $(progressBarBusElem).css("background-color", "#aeccc5");
                        $(element).css("background-color", "#209b7a");
                        break;
                    case "direct-lines":
                        $(progressBarFirstTextElem)[0].className = 'progressBarGreenText';
                        if (localize.language == "he-IL")
                            $(progressBarFirstSpacer)[0].className = 'progressBarCToAHeb';
                        else
                            $(progressBarFirstSpacer)[0].className = 'progressBarCToAEng';
                        $(progressBarSecondTextElem)[0].className = 'progressBarGrayText';
                        if (localize.language == "he-IL")
                            $(progressBarSecondSpacer)[0].className = 'progressBarCToCHeb';
                        else $(progressBarSecondSpacer)[0].className = 'progressBarCToCEng';
                        $(progressBarThirdTextElem)[0].className = 'progressBarGrayText';
                        $(progressBarBusElem).css("background-color", "#209b7a");
                        $(element).css("background-color", "#d5dbda");
                        strLinesBetweenCities = localize.getLocalizedString("_LinesBetweenCities_");
                        progressBarFirstTextElem.children()[0].innerText = strLinesBetweenCities;
                        break;
                }
            });

            function init() {

                $(element).html("");

                if (localize.dictionary.length > 0) {
                    strSchedule = localize.getLocalizedString("_bus-stop_");
                    strTripSummary = localize.getLocalizedString("_details_");
                    strLinesBetweenCities = localize.getLocalizedString("_LinesBetweenCities_");
                    strTripOptions = localize.getLocalizedString("_TripOptions_");
                }

                if (localize.language == "he-IL")
                    progressBarBusElem = $("<div>").addClass("progressBarBusHeb");
                else
                    progressBarBusElem = $("<div>").addClass("progressBarBusEng");
                progressBarBusElem.appendTo(element);

                progressBarFirstTextElem = $("<div>").addClass("progressBarGrayText");
                $("<span>" + strTripOptions + "</span>").appendTo(progressBarFirstTextElem);
                progressBarFirstTextElem.appendTo(element);

                progressBarFirstSpacer = $("<div>").addClass("progressBarCToA");
                progressBarFirstSpacer.appendTo(element);

                progressBarSecondTextElem = $("<div>").addClass("progressBarGrayText");
                $("<span>" + strSchedule + "</span>").appendTo(progressBarSecondTextElem);
                progressBarSecondTextElem.appendTo(element);

                progressBarSecondSpacer = $("<div>").addClass("progressBarCToC");
                progressBarSecondSpacer.appendTo(element);

                progressBarThirdTextElem = $("<div>").addClass("progressBarGrayText");
                $("<span>" + strTripSummary + "</span>").appendTo(progressBarThirdTextElem);
                progressBarThirdTextElem.appendTo(element);

                //progressBarFourthElem = $("<div>").addClass("btnGreen").css("width", "157px");
                //$("<div>").addClass("PrintImg").appendTo(progressBarFourthElem);
                //$("<div>הדפס רשימת תחנות מלאה</div>").appendTo(progressBarFourthElem);
                //progressBarFourthElem.appendTo(element);

                if ($scope.resultViewName == 'transition') {
                    progressBarFifthElem = $("<div>").
                        addClass("btnGreen").
                        addClass("HideOnMobile").
                        //css("width", "97px").
                        css("height", "20px").
                        css("margin", "10px").
                        css("vertical-align", "top").
                        click(function () {

                            if (localize.language == "he-IL")
                                langDir = "rtl";
                            else
                                langDir = "ltr";

                            var content =
                                "<div style='direction: " + langDir + ";'>" +
                                "<br />" + $(".TripHeader").html() +
                                "<br />" + $(".transitionTable").html() +
                                "<br />" +
                                "<div>";

                            //if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {   // Chrome Browser Detected?
                            //    chromePrint(printContent);
                            //}
                            //else {
                            //    Popup(printContent);
                            //}
                            printHorizontally(content);

                        }).
                        appendTo(element);

                    strViewDailySchedule = localize.getLocalizedString("_DailySchedule_");
                    strPrint = localize.getLocalizedString("_Print_");

                    $("<div>").
                        addClass("PrintImg HideOnMobile").
                        appendTo(progressBarFifthElem);
                    $("<div>" + strPrint + " " + strViewDailySchedule + "</div>")
                    .css("line-height", "120%")
                    .css("display", "inline-block")
                    .appendTo(progressBarFifthElem);
                }



                if ($rootScope.search.lineNumber != null && $rootScope.search.lineNumber.ID != 0) {
                    progressBarSixthElem = $("<div>").
                        addClass("btnGreen").
                        //css("width", "103px").
                        css("height", "20px").
                        css("margin", "10px").
                        css("vertical-align", "top");
                    $("<div>").addClass("PrintImg").appendTo(progressBarFourthElem);
                    strViewWeeklySchedule = localize.getLocalizedString("_WeeklySchedule_");
                    $("<div>" + strViewWeeklySchedule + "</div>").
                        css("line-height", "120%").
                        appendTo(progressBarSixthElem);
                    progressBarSixthElem.click(function () {
                        searchService.getWeeklyReportTable(
                            $rootScope.search.fromAddress.Quarter.ID,
                            $rootScope.search.toAddress.Quarter.ID,
                            $rootScope.search.lineNumber.ID,
                            $rootScope.search.language,
                            $rootScope.search.isEggedDb,
                            function (weeklyReportData) {
                                generateWeeklyReport(weeklyReportData);
                            });
                    }).appendTo(element);
                }

                if (dialogElement == null)
                    dialogElement = initDialog();
                $(element).addClass("progressBar");

            }

            function initDialog() {


                if (localize.language == "he-IL")
                    langDir = "rtl";
                else
                    langDir = "ltr";

                strWeeklySchedule = localize.getLocalizedString("_WeeklySchedule_");
                var dialogElement = $("<div id='weeklyScheduleDialog' ></div>").css("direction", langDir).appendTo(element);
                $(dialogElement)[0].title = strWeeklySchedule;
                $(dialogElement).dialog({
                    //autoResize: true,
                    //'buttons': {
                    //    'X': function (event) {

                    //    }
                    //},
                    closeOnEscape: false,
                    open: function (event, ui) {
                        strWeeklySchedule = localize.getLocalizedString("_WeeklySchedule_");
                        strPrint = localize.getLocalizedString("_Print_");
                        strSendByMail = localize.getLocalizedString("_SendByEmail_");
                        $(this).parent().find(".ui-dialog-titlebar-close").hide();
                        $(this).parent().find(".ui-dialog-title").text(strWeeklySchedule);
                        $(this).parent().find(".PrintText").html(strPrint);
                        $(this).parent().find(".MailText").html(strSendByMail);

                        if (localize.language == "he-IL")
                            langDir = "rtl";
                        else
                            langDir = "ltr";

                        $(this).parent().find(".PrintText").parent().css("direction", langDir);
                        $(this).parent().find(".MailText").parent().css("direction", langDir);

                        $(this).parent().find("table").each(function () {
                            $(this).css("direction", langDir);
                        });

                        //.html("<div class='btnDialogClose'></div>")
                        //.click(function ()
                        //{
                        //    $(this).dialog("close");
                        //});
                        //$(".ui-dialog-titlebar-close", ui.dialog || ui).hide();
                    },
                    width: $(window).width() * 0.75,
                    height: $(window).height() * 0.75,
                    modal: true,
                    dialogClass: 'DialogWindow',
                    autoOpen: false,
                    show: {
                        effect: "blind",
                        duration: 100
                    },
                    hide: {
                        effect: "blind",
                        duration: 100
                    }
                });

                var btnDialogClose = $("#weeklyScheduleDialog").prev().find('.ui-dialog-titlebar-close');

                var operationPanel = $("<div>").
                    css("display", "inline-block").
                    css("margin", "8px 30px 8px 30px").
                    css("position", "absolute").
                    css("left", "0px").
                    css("top", "2px").
                insertBefore(btnDialogClose);

                //$("<div>שמור ל PDF</div>")
                //    .addClass("btnRed")
                //    .css("margin", "0px 10px 0px 10px")
                //.click(function () {

                //    var pdf = new jsPDF('l', 'pt', 'a4');
                //    var options = { width: 2560, height: 2048 };
                //    pdf.addHTML($(dialogElement), options, function () { pdf.save("WeeklyReport.pdf"); });

                //    //////////////////////////////////////////////////////////////////

                //}).appendTo(operationPanel);

                strSendByMail = localize.getLocalizedString("_SendByEmail_");
                $("<div class='btnRed'><div class='MailImg'></div><div class='MailText' style='display: inline-block;' >" + strSendByMail + "</div></div>")
                .css("margin", "0px 10px 0px 10px")
                .click(function () {

                    strPleaseProvideMailAddress = localize.getLocalizedString("_PleaseProvideMailAddress_");
                    var address = "";
                    if ($rootScope.userDetails != null && $rootScope.userDetails.emailAddress != null)
                        address = $rootScope.userDetails.emailAddress;
                    var destinationMailAddress = prompt(strPleaseProvideMailAddress, address);
                    if (destinationMailAddress != null && destinationMailAddress.indexOf('@') > -1) {

                        $rootScope.userDetails.emailAddress = destinationMailAddress
                        if ($rootScope.isStorageActive)
                            localStorage.setItem("emailAddress", $rootScope.userDetails.emailAddress);

                        var strEggedSite = localize.getLocalizedString("_Title_");
                        strWeeklySchedule = localize.getLocalizedString("_WeeklySchedule_");
                        var bodyContent = dialogElement.html();

                        var printObject =
                        {
                            ToAddress: destinationMailAddress
                            , ToName: ""
                            , Subject: strEggedSite + " - " + strWeeklySchedule //+ " - " + weeklyReportData.Shilut + "מ:" + weeklyReportData.DestinationName + " ל:" + weeklyReportData.OriginName
                            , Body: bodyContent
                        };
                        var jsonString = JSON.stringify(printObject);
                        var mailSendResult = transitionService.sendMail(jsonString);
                        if (mailSendResult == true) {
                            $rootScope.search.userMessageTitle = "_SendByEmail_";
                            $rootScope.search.userMessage = "_MessageSuccessfullySent_";
                        }
                        else {
                            $rootScope.search.userMessageTitle = "_SendByEmail_";
                            $rootScope.search.userMessage = "_MessageSendFailed_";
                        }

                        scope.$apply();
                    }
                }).appendTo(operationPanel);

                strPrint = localize.getLocalizedString("_Print_");
                $("<div class='btnRed HideOnMobile'><div class='PrintImg'></div><div class='PrintText' style='display: inline-block;' >" + strPrint + "</div></div>")
                .css("margin", "0px 10px 0px 10px")
                .click(function () {

                    var content = $(dialogElement).html();
                    $(content).find("table").each(function () {
                        $(this).css("table-layout", "static");
                    });
                    printHorizontally(content);

                }).appendTo(operationPanel);

                $("<div class='btnDialogClose'></div>")
                .css("margin", "0px 10px 0px 10px")
                .css("display", "inline-block")
                .css("vertical-align", "middle")
                .css("cursor", "pointer")
                //.css("height", "30px")
                //.css("width", "30px")
                .click(function () {
                    $(dialogElement).dialog("close");
                }).appendTo(operationPanel);

                return dialogElement;
            }

            function printHorizontally(content) {

                //var deltaWidth = a4Width - clientWidth;
                //var deltaHeight = a4Height - clientHeight;

                //var deltaWidth = 0;
                //var deltaHeight = 0;

                var printContent = "";
                //if (navigator.vendor != null && navigator.vendor.toLowerCase().indexOf('google') > -1) {
                //if (isDailySchedule == true) {
                //    printContent += '<div style="';
                //    if (localize.language == "he-IL") {
                //        printContent += 'transform: rotate(90deg) translate(400px, 50px); ';
                //        printContent += '-ms-transform: rotate(90deg) translate(400px, 50px); ';
                //        printContent += '-webkit-transform: rotate(90deg) translate(200px, 100px); ';
                //        printContent += '-moz-transform:rotate(90deg) translate(300px, -150px); ';
                //    }
                //    else {
                //        printContent += 'transform: rotate(-90deg) translate(-400px, 50px); ';
                //        printContent += '-ms-transform: rotate(-90deg) translate(-400px, 50px); ';
                //        printContent += '-webkit-transform: rotate(-90deg) translate(-400px, -50px); ';
                //        printContent += '-moz-transform:rotate(-90deg) translate(-300px, 0px); ';
                //    }
                //    //printContent += 'width: 115%;';
                //    printContent += 'zoom: 0.8;';
                //    printContent += 'position: absolute;';
                //    printContent += '" >';
                //    printContent += content;
                //    printContent += '</div>';
                //}
                //else {
                printContent += '<div style="';
                //if (localize.language == "he-IL") {
                //printContent += 'transform: rotate(90deg); ';
                //printContent += '-ms-transform: rotate(90deg); ';
                //printContent += '-webkit-transform: rotate(90deg); ';
                //printContent += '-moz-transform:rotate(90deg); ';
                //}
                //else {
                //    printContent += 'transform: rotate(-90deg) translate(' + deltaWidth + 'px, ' + deltaHeight + 'px); ';
                //    printContent += '-ms-transform: rotate(-90deg) translate(' + deltaWidth + 'px, ' + deltaHeight + 'px); ';
                //    printContent += '-webkit-transform: rotate(-90deg) translate(' + deltaWidth + 'px, ' + deltaHeight + 'px); ';
                //    printContent += '-moz-transform:rotate(-90deg) translate(' + deltaWidth + 'px, ' + deltaHeight + 'px); ';
                //}
                //printContent += 'width: 115%;';
                printContent += 'zoom: 0.8;';
                //printContent += 'position: absolute;';
                //printContent += 'bottom: 0px;';
                //printContent += 'width: 297mm; height: 210mm; ';
                printContent += '" >';
                printContent += content;
                printContent += '</div>';
                //}

                Popup(printContent);

            }

            //function printHorizontally(content) {

            //    var printContent = "";
            //    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            //        $(content).css("transform", "rotate(-90deg) translate(-200px, 70px");
            //        $(content).css("-ms-transform", "rotate(-90deg) translate(-200px, 70px");
            //        $(content).css("-webkit-transform", "rotate(-90deg) translate(-200px, 70px");
            //        $(content).css("-moz-transform:rotate(-90deg) translate(-200px, 70px");
            //        $(content).css("zoom", "0.8;");
            //    }
            //    else {
            //        $(content).css("transform", "rotate(-90deg) translate(-200px, 70px");
            //        $(content).css("-ms-transform", "rotate(-90deg) translate(-200px, 70px");
            //        $(content).css("-webkit-transform", "rotate(-90deg) translate(-200px, 70px");
            //        $(content).css("-moz-transform", "rotate(-90deg) translate(-200px, 70px");
            //    }
            //    Popup(printContent);

            //}

            function generateWeeklyReport(weeklyReportData) {

                dialogElement.html("");

                if (weeklyReportData.Shilut == null) {
                    alert("אין נתונים, נסה שוב מאוחר יותר.");
                    return;
                }

                //var weeklyReportTitle = "דוח שבועי עבור קו " + weeklyReportData.Shilut + "מ: " + weeklyReportData.DestinationName + " ל: " + weeklyReportData.OriginName;
                //$(dialogElement)[0].title = weeklyReportTitle;

                //var weeklyReportDiv = $("<div>").
                //    css("background-color", "white").
                //    //css("padding", "10px").
                //    //css("width", "1150px").
                //    addClass("weeklyReportDiv");

                var weeklyReportTable = $("<table>").css("direction", "rtl");

                $(weeklyReportTable).css("table-layout", "auto");

                var topRow = $("<tr>").appendTo(weeklyReportTable);

                if ($rootScope.search.busStationArrangementD != 1) {


                    var strTripTimesAreEstimated = localize.getLocalizedString("_TripTimesAreEstimated_");
                    var strOrigin = localize.getLocalizedString("_origin_");
                    var strLine = localize.getLocalizedString("_line_");

                    var lineOrigin = strLine + " " + strOrigin;
                    if (localize.language == "he-IL")
                        lineOrigin = strOrigin + " " + strLine;

                    var topRow2 = $("<tr><td colspan='3'>" + "" + lineOrigin + ": " + weeklyReportData.LineOriginName + "(" + strTripTimesAreEstimated + ")." + "</td></tr>").
                        css("text-align", "center").
                        css("font-weight", "bold").
                        appendTo(weeklyReportTable);
                }

                var topRowRightDiv = $("<td>").
                    css("display", "table-cell").
                    css("vertical-align", "middle").
                    //css("width", "33%").
                    appendTo(topRow);
                var topRowCenterDiv = $("<td>").
                    css("display", "table-cell").
                    css("text-decoration", "underline").
                    css("vertical-align", "middle").
                    //css("width", "33%").
                    appendTo(topRow);
                var topRowLeftDiv = $("<td>").
                    css("display", "table-cell").
                    css("vertical-align", "middle").
                    css("width", "380px").
                    css("font-size", "10px").
                    appendTo(topRow);

                var topRowRightDivInnerTable = $("<table>").
                    css("display", "table").
                    css("width", "100%").
                    css("vertical-align", "middle").
                    appendTo(topRowRightDiv);

                var topRowRightDivInner = $("<tr>").
                    css("display", "table").
                    css("width", "100%").
                    css("vertical-align", "middle").
                    appendTo(topRowRightDivInnerTable);

                var eggedLogoImageTd = $("<td>").
                    css("width", "40px").
                    appendTo(topRowRightDivInner);



                $("<img src='../../Content/images/BusOperatorsBig/company_" + $rootScope.search.selectedScheduleLine.Company.Id.toString() + ".png' />").
                    //addClass("eggedLogoImage").
                    css("width", "40px").
                    css("height", "40px").
                    appendTo(eggedLogoImageTd);

                //$("<div>").
                //    css("display", "table-cell").
                //    css("width", "10px").
                //    appendTo(topRowRightDivInner);
                var shilutTd = $("<td>").css("width", "60px").appendTo(topRowRightDivInner);
                $("<div>" + weeklyReportData.Shilut + "</div>").
                    //css("display", "table-cell").
                    css("border", "5px double black").
                    //css("padding", "10px").
                    css("font-size", "16px").
                    css("vertical-align", "middle").
                    css("text-align", "center").
                    css("font-weight", "bold").
                    appendTo(shilutTd);
                //$("<div>").
                //    css("display", "table-cell").
                //    css("width", "10px").
                //    appendTo(topRowRightDivInner);

                strFromSingleLetter = localize.getLocalizedString("_From_");
                strToSingleLetter = localize.getLocalizedString("_To_");

                $("<td><div style='white-space: nowrap; width: 100%;'>" + strFromSingleLetter + ": " + weeklyReportData.OriginName + "</div><div style='white-space: nowrap; width: 100%;'>" + strToSingleLetter + ":" + weeklyReportData.DestinationName + "</div></td>").
                    //css("display", "table-cell").
                    css("font-weight", "bold").
                    css("vertical-align", "middle").
                    appendTo(topRowRightDivInner);
                //$("<div>לוח זמנים שבועי</div>").
                //    css("text-align", "center").
                //    css("font-weight", "bold").
                //    css("font-size", "25px").
                //    css("vertical-align", "middle").
                //    appendTo(topRowCenterDiv);

                strWeeklyScheduleMessagePart1 = localize.getLocalizedString("_WeeklyScheduleMessagePart1_");
                strWeeklyScheduleMessagePart2 = localize.getLocalizedString("_WeeklyScheduleMessagePart2_");

                $("<div style='width: 380px; background-color: lightgray; border: 1px black solid; '>" + strWeeklyScheduleMessagePart1 + "<br/>" + strWeeklyScheduleMessagePart2 + "</div>").
                    appendTo(topRowLeftDiv);

                var weekly = createWeeklyTable(weeklyReportData.WeeklySchedule);
                var firstTableTr = $("<tr>").appendTo(weeklyReportTable);
                var firstTableTd = $("<td colspan='3'>").appendTo(firstTableTr);
                $(weekly).appendTo(firstTableTd);

                var firstTableTitleTr = $("<tr>").appendTo(weeklyReportTable);
                var firstTableTitleTd = $("<td colspan='3'>").appendTo(firstTableTitleTr);
                $("<div><span>" + "מ:" + weeklyReportData.DestinationName + "</span><span> ל:" + weeklyReportData.OriginName + "</span></div>").
                    css("display", "block").
                    css("font-weight", "bold").
                    css("vertical-align", "middle").
                    appendTo(firstTableTitleTd);

                if (weeklyReportData.ReversedWeeklySchedule != null) {
                    var reversedWeekly = createWeeklyTable(weeklyReportData.ReversedWeeklySchedule);
                    var secondTableTr = $("<tr>").appendTo(weeklyReportTable);
                    var secondTableTd = $("<td colspan='3'>").appendTo(secondTableTr);
                    $(reversedWeekly).appendTo(secondTableTd);
                }
                //$(dialogElement).find(".ui-dialog-titlebar").each(function () {
                //    $(this).css("padding-top", "0px").css("padding-bottom", "0px");
                //});



                $(weeklyReportTable).appendTo(dialogElement);
                $(dialogElement).dialog("open");

            }

            function Popup(data) {

                if (navigator.userAgent.indexOf('Firefox') != -1)
                    //if (navigator.appName != null && navigator.appName == "Netscape")
                    alert("שים לב! תוכן רחב, מומלץ להדפיס לרוחב.");

                var mywindow = window.open('', 'to_print', '');
                var html = "";
                if (navigator.vendor != null && navigator.vendor.toLowerCase().indexOf('google') > -1)
                    html += '<html><head><title></title>';
                else
                    html += '<html style="width: 210mm; height: 297mm; transform: rotate(90deg);"><head><title></title>';
                html += '<link href="app/css/' + $rootScope.currentCssFilename + '.css" rel="stylesheet" />';
                html += '<style type="text/css" >@page{size: landscape;}</style>';
                //'</head><body style="direction: ' + langDir + '; margin:0px; width: 210mm; height: 297mm;" onload="window.focus(); window.print(); window.close(); ">' +
                if (navigator.vendor != null && navigator.vendor.toLowerCase().indexOf('google') > -1)
                    html += '</head><body style="direction: ' + langDir + '; " ';
                else
                    html += '</head><body style="direction: ' + langDir + '; width: 297mm; height: 210mm;" ';
                //if (localize.language == "he-IL")
                //    html += 'transform: rotate(90deg); -ms-transform: rotate(90deg); -webkit-transform: rotate(90deg); -moz-transform:rotate(90deg);" ';
                //else
                //    html += 'transform: rotate(-90deg); -ms-transform: rotate(-90deg); -webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);" ';
                html += 'onload="window.focus(); window.print(); window.close(); ">';
                //html += '">';
                html += data;
                html += '</body></html>';
                mywindow.document.write(html);
                mywindow.document.close();
                return true;
            }

            function chromePrint(data) {

                window.PPClose = false;                                     // Clear Close Flag
                window.onbeforeunload = function () {                         // Before Window Close Event
                    if (window.PPClose === false) {                           // Close not OK?
                        return 'עזיבת חלון זה תחסום את חלון האפליקציה !\n יש לבחור ב "הישאר בדף זה " ולהשתמש ב \nכפתור הביטול .\n';
                    }
                }
                window.print();                                             // Print preview
                window.PPClose = true;                                      // Set Close Flag to OK.

            }

            function createWeeklyTable(dsWeekly) {
                var weeklyTable = $("<table>").
                    css("width", "100%").
                    css("direction", langDir).
                    css("font-size", "11.5px");

                $(weeklyTable).css("table-layout", "auto");


                var i = 0;
                for (var j = 0; i < dsWeekly.length && j < dsWeekly[i].length; j++) {
                    var weeklyTr = $("<tr>").appendTo(weeklyTable);
                    for (i = 0; i < dsWeekly.length; i++) {
                        if (j == 0) {
                            var minHour = "";
                            var maxHour = "";
                            for (var k = 1; k < dsWeekly[i].length; k++) {
                                var splittedItem = dsWeekly[i][k].split(',');

                                if (minHour == "") {
                                    if (splittedItem.length > 1)
                                        minHour = splittedItem[0];
                                    else
                                        if (dsWeekly[i][k] != "-")
                                            minHour = dsWeekly[i][k];
                                }

                                if (splittedItem.length > 1) {
                                    var splittedItem = splittedItem;
                                    maxHour = splittedItem[splittedItem.length - 1];
                                }
                                else
                                    if (dsWeekly[i][k] != "-")
                                        maxHour = dsWeekly[i][k];
                            }
                            $("<td><span>" + dsWeekly[i][j] + "</span><br/><span>" + minHour + "-" + maxHour + "</span></td>").
                                css("background-color", "lightgrey").
                                css("text-align", "center").
                                css("padding", "1px").
                                css("border", "1px solid black").
                                appendTo(weeklyTr);
                        }
                        else {
                            if (j % 2 == 0) {
                                $("<td>" + dsWeekly[i][j] + "</td>").
                                    css("background-color", "lightgrey").
                                    css("text-align", "center").
                                    css("padding", "1px").
                                    css("border", "1px solid black").
                                    appendTo(weeklyTr);
                            }
                            else {
                                $("<td>" + dsWeekly[i][j] + "</td>").
                                    css("background-color", "white").
                                    css("text-align", "center").
                                    css("padding", "1px").
                                    css("border", "1px solid black").
                                    appendTo(weeklyTr);
                            }
                        }
                    }
                    $(weeklyTr).appendTo(weeklyTable);
                    i = 0;
                }
                return weeklyTable;
            }

            init();
        }

    };
});
