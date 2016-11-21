mslApp.directive('printDailySchedule', function ($rootScope, $compile, $timeout, localize, globalFunctions) {
    return {
        scope: true,
        replace: true,
        transclude: true,
        templateUrl: '/app/views/directive/printDailySchedule.htm',
        link: function (scope, element, attrs) {

            var transitionlist = null;
            var minTime = null;
            var maxTime = null;
            scope.showPrintDaily = false;

            scope.selectedFromTime = null;
            scope.selectedToTime = null;
            scope.timeList = [];

            $rootScope.$on('transitionlistChanged', function (event, args) {
                transitionlist = args.newValue;
            });

            scope.parentButtonClicked = function () {

                init();

                if (transitionlist == null || transitionlist.length == 0)
                    return;

                if (transitionlist.length > 1) {
                    if (localize.language == "he-IL")
                        langDir = "rtl";
                    else
                        langDir = "ltr";
                    var sheduleView;
                    var printContent = '<div class="container" style="width:900px;margin-right:15px;"> <br /> ';
                    $(".ScheduleView").each(function () {
                        printContent += '<div style="height:300px;margin:6px;width:400px;border:2px gray solid;zoom:1.4;">';
                        printContent += $(this).html();
                        printContent += "</div>";
                    });

                    printContent += "</div>";

                    if (!printSection) {
                        printSection = document.createElement('div');
                        printSection.id = 'printSection';
                        document.body.appendChild(printSection);
                    }

                    $(printSection).html(printContent);
                    window.print();
                    $(printSection).html("");

                    //globalFunctions.printHtml(printContent);
                    return;
                }
                $timeout(function () {
                    scope.showPrintDaily = true;
                }, 150);

                setTimeout(function () {
                    //debugger;
                    $($(".printDailyScheduleMessage")[0]).focus();
                }, 1000);
            }

            //    }
            //});

            function convertTimeToNumber(time) {
                if (time == 0) time = 24;
                else if (time == 1) time = 25;
                else if (time == 2) time = 26;
                else if (time == 3) time = 27;
                return time;
            }

            function init() {

                scope.timeList = [];

                var startHour = transitionlist[0][0].DtOriginBusstop.split('T')[1];
                startHour = startHour.split(':')[0];
                startHour = startHour * 1;
                var startHourParam = transitionlist[0][0].DtOriginBusstop.split('T')[0];
                startHourParam = startHourParam.split('-')[2];
                startHourParam = startHourParam * 1;
                startHour = { hour: startHour, param: 0 };

                var endHour = transitionlist[0][transitionlist[0].length - 1].DtOriginBusstop.split('T')[1];
                endHour = endHour.split(':')[0];
                endHour = endHour * 1;
                var endHourParam = transitionlist[0][transitionlist[0].length - 1].DtOriginBusstop.split('T')[0];
                endHourParam = endHourParam.split('-')[2];
                endHourParam = endHourParam * 1;
                endHour = { hour: endHour, param: endHourParam - startHourParam };

                //var startHour = parseInt(transitionlist[0][0].TimeOriginBusstop.split(':')[0]);
                //var endHour = convertTimeToNumber(parseInt(transitionlist[0][transitionlist[0].length - 1].TimeOriginBusstop.split(':')[0]));

                var iStartHour = startHour.hour + (startHour.param * 24);
                var iEndHour = endHour.hour + (endHour.param * 24);

                for (var i = iStartHour; i < iEndHour + 2; i++) {
                    if (i < 24) {
                        scope.timeList.push({ ID: i.toString() + '-0', NAME: i + ':00' });
                        scope.timeList.push({ ID: i.toString() + '-0', NAME: i + ':30' });
                    }
                    else {
                        scope.timeList.push({ ID: i.toString() + '-1', NAME: (i - 24).toString() + ':00' });
                        scope.timeList.push({ ID: i.toString() + '-1', NAME: (i - 24).toString() + ':30' });
                    }
                }

                scope.selectedFromTime = scope.timeList[0];
                scope.selectedToTime = scope.timeList[0];

            }

            scope.close = function () {
                scope.showPrintDaily = false;
            }

            scope.print = function () {
                scope.transition = [];
                minTime = scope.selectedFromTime.NAME.split(':')[0] * 1 + (scope.selectedFromTime.ID.split('-')[1] * 24);
                maxTime = scope.selectedToTime.NAME.split(':')[0] * 1 + (scope.selectedToTime.ID.split('-')[1] * 24);

                for (var i = 0; i < transitionlist[0].length; i++) {
                    var itemHour = transitionlist[0][i].DtOriginBusstop.split('T')[1];
                    itemHour = itemHour.split(':')[0];
                    itemHour = itemHour * 1;
                    var iItemHour = itemHour;
                    if (transitionlist[0][i].isShowAftermidnightImg == true)
                        iItemHour = iItemHour + 24;

                    //var itemHourParam = transitionlist[0][i].DtOriginBusstop.split('T')[0];
                    //itemHourParam = itemHourParam.split('/')[1];
                    //itemHourParam = itemHourParam * 1;
                    //itemHourParam = itemHourParam - 1;
                    //itemHour = { hour: itemHour, param: itemHourParam };
                    //var iItemHour = itemHour.hour + (itemHour.param * 24);
                    if (iItemHour > maxTime) break;
                    if (iItemHour >= minTime) {
                        scope.transition.push(transitionlist[0][i]);
                    }
                }

                var strSchedule = localize.getLocalizedString("_Schedule_");
                var strTo = localize.getLocalizedString("_To_");
                var strFrom = localize.getLocalizedString("_From_");
                var strSchedule = localize.getLocalizedString("_Schedule_");
                var strEstimatedDepartureTime = localize.getLocalizedString("_EstimatedDepartureTime_");
                var strLine = localize.getLocalizedString("_line_");
                var strTime = localize.getLocalizedString("_Time_");
                var strOprator = localize.getLocalizedString("_Oprator_");
                var strPlatform = localize.getLocalizedString("_Platform_");
                var strArrivalTime = localize.getLocalizedString("_ArrivalTime_");
                
                

                var printContent = "";
                printContent += "<div class='container' style='width:100%; margin-right:15px;'>";
                printContent += "<br />";
                printContent += "<div style='margin:6px;'>";
                printContent += "<div>" + strSchedule + " " + strTo + " " + scope.transition[0].Date + "</div>";
                printContent += "<div>" + strFrom + scope.fromPlaceNameArray[0] + " " + strTo + scope.toPlaceNameArray[0] + "</div>";
                printContent += "<div>★ " + strEstimatedDepartureTime + "</div>";
                printContent += "<table style='width:100%'>";
                printContent += "<tr style='width:100%;height:37px;background-color:lightgray'>";
                printContent += "<th style='text-align:center;border:1px solid black;'>" + strLine + "</th>";
                printContent += "<th style='border:1px solid black;text-align:center;'>" + strTime + "</th>";
                printContent += "<th style='border:1px solid black;text-align:center;'>" + strOprator + "</th>";
                printContent += "<th style='border:1px solid black;text-align:center;width:50px;'>" + strPlatform + "</th>";
                printContent += "<th style='border:1px solid black;text-align:center;'>" + strArrivalTime + "</th>";
                printContent += "</tr>";
                for (var i = 0; i < scope.transition.length; i++) {
                    scope.transition[i]
                    printContent += "<tr>";
                    printContent += "<td style='border:1px solid black;text-align:center;font-size:18px;'>" + scope.transition[i].Shilut + "</td>";
                    printContent += "<td style='border:1px solid black;text-align:center;font-size:18px' >" + scope.transition[i].TimeOriginBusstop;
                    if (scope.transition[i].MazanToMoza != 0)
                        printContent += " <span>★</span>";
                    printContent += "</td>";
                    printContent += "<td style='border:1px solid black;text-align:center;font-size:18px'>" + scope.transition[i].Company.Name + "</td>";
                    if (scope.transition[i].PlatformNumber != 0)
                        printContent += "<td style='border:1px solid black;text-align:center;font-size:18px'>" + scope.transition[i].PlatformNumber + "</td>";
                    if (scope.transition[i].PlatformNumber == 0)
                        printContent += "<td style='border:1px solid black;text-align:center;font-size:18px'></td>";
                    printContent += "<td style='border:1px solid black;text-align:center;font-size:18px'>" + scope.transition[i].TimeDestinationBusstop + "</td>";
                    printContent += "</tr>";
                }
                printContent += "</table>";
                printContent += "</div>";
                printContent += "</div>";

                var printSection = document.getElementById('printSection');
                // if there is no printing section, create one

                if (!printSection) {
                    printSection = document.createElement('div');
                    printSection.id = 'printSection';
                    document.body.appendChild(printSection);
                }

                $(printSection).html(printContent);
                window.print();
                $(printSection).html("");

                //globalFunctions.printHtml(printContent);


                //        }
                //    });


            }

            //scope.$watch("selectedFromTime", function (newValue, oldValue) {
            //    if (newValue == null) return;
            //    scope.selectedToTime = newValue;
            //});

        }
    };
});




