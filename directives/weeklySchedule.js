mslApp.directive('weeklySchedule', function ($rootScope, $timeout, localize, globalFunctions, searchService, transitionService) {
    return {
        scope: true,
        replace: true,
        transclude: true,
        templateUrl: '/app/views/directive/weeklySchedule.htm',
        link: function (scope, element, attrs) {

            scope.showWeeklySchedule = false;
            scope.parentButtonClicked = function () {

                searchService.getWeeklyReportTable(
                    $rootScope.search.fromAddress.Quarter.ID,
                    $rootScope.search.toAddress.Quarter.ID,
                    $rootScope.search.lineNumber.ID,
                    $rootScope.search.language,
                    $rootScope.search.isEggedDb,
                    function (weeklyReportData) {
                        scope.weeklyReportData = weeklyReportData;
                        scope.weeklyReportData.WeeklySchedule = invertTable(scope.weeklyReportData.WeeklySchedule);
                        scope.weeklyReportData.ReversedWeeklySchedule = invertTable(scope.weeklyReportData.ReversedWeeklySchedule);
                        setTimeout(function(){
                        $('#weeklyDialogHeader').focus();
                    }, 300);
                    });
                scope.showWeeklySchedule = true;

            }

            scope.closeClicked = function () {
                scope.showWeeklySchedule = false;
            }

            function invertTable(dsWeekly) {

                var tempTable = [];
                var i = 0;
                for (var j = 0; i < dsWeekly.length && j < dsWeekly[i].length; j++) {
                    var tempLine = [];
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
                            tempLine.push({ day: dsWeekly[i][j], range: minHour + "-" + maxHour });
                        }
                        else {
                            tempLine.push(dsWeekly[i][j].toString());
                        }
                    }

                    tempTable.push(tempLine);
                    i = 0;
                }
                return tempTable;
            }

            function printHorizontally(content) {
                var printContent = "";
                printContent += '<div style="zoom:0.95">'
                printContent += content;
                printContent += '</div>';

                globalFunctions.printHtml(printContent);
            }

            scope.printClicked = function () {
                var content = $($(element).find(".WeeklyScheduleDiv")[0]).html();
                $(content).find("table").each(function () {
                    $(this).css("table-layout", "static");
                });
                printHorizontally(content);
            }

            scope.sendMailClicked = function () {
                strPleaseProvideMailAddress = localize.getLocalizedString("_PleaseProvideMailAddress_");
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
                    strWeeklySchedule = localize.getLocalizedString("_WeeklySchedule_");
                    var bodyContent = $($(element).find(".WeeklyScheduleDiv")[0]).html();

                    bodyContent = '<html><head><title></title>' +
                    '<style>' +
                    '.WeeklyScheduleDivTable { width: 100%; font-size: 11.5px; table-layout: auto;}' +
                    '.WeeklyScheduleDivTh { background-color: lightgrey; text-align: center; padding: 1px; border: 1px solid black; }' +
                    '.WeeklyScheduleDivTr:nth-child(odd) { background-color: white; }' +
                    '.WeeklyScheduleDivTr:nth-child(even) { background-color: lightgrey; }' +
                    '.WeeklyScheduleDivTd { text-align: center; padding: 1px; border: 1px solid black; white-space: nowrap; }' +
                    '</style>' +
                    '<link href="app/css/egged.css" rel="stylesheet" />' +
                    //'<style>.no-print{display:none}</style>' +
                    '</head><body style="direction: rtl;" onload="window.focus(); window.print(); window.close();">' +
                    bodyContent +
                    '</body></html>';


                    var printObject =
                    {
                        ToAddress: destinationMailAddress
                        , ToName: ""
                        , Subject: strEggedSite + " - " + strWeeklySchedule //+ " - " + weeklyReportData.Shilut + "מ:" + weeklyReportData.DestinationName + " ל:" + weeklyReportData.OriginName
                        , Body: bodyContent
                    };
                    var jsonString = JSON.stringify(printObject);

                    transitionService.sendMail(jsonString,
                        function (data) {
                            $rootScope.search.userMessageTitle = "_SendByEmail_";
                            $rootScope.search.userMessage = "_MessageSuccessfullySent_";
                        },
                        function (result) {
                            $rootScope.search.userMessageTitle = "_SendByEmail_";
                            $rootScope.search.userMessage = "_MessageSendFailed_";
                        });

                    scope.$apply();
                }
                else {
                    $rootScope.search.userMessageTitle = "_SendByEmail_";
                    $rootScope.search.userMessage = "_IlegalMailAddress_";
                }
            }

            $(document).keydown(function (event) {
                if (!$(event.target).closest('#weeklyDialogHeader').length && !$(event.target).is('#weeklyDialogHeader')) {
                    if ($('#weeklyDialogHeader').is(":visible")) {
                        $('#weeklyDialogHeader').focus();
                    }
                }
            });


        }
    };
});




