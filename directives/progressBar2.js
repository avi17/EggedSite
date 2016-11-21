mslApp.directive('progressBar2', function ($rootScope, searchService, localize, globalFunctions, transitionService) {
    return {
        scope: true,
        templateUrl: '/app/views/directive/progressBar2.htm',
        link: function (scope, element, attrs, ctrl, event) {

            var weeklyReportDataShilut;
            var weeklyReportDataOriginName;
            var weeklyReportDataDestinationName;
            //var dialogElement;
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
            var languageStr = "Heb";

            if (localize.language == "en-US")
                languageStr = "Eng";

            scope.divBackgroundColor = "#d5dbda";
            scope.lineBackgroundcolor = "#209b7a";
            scope.showOnTransitionChoosen = false;

            scope.$watch(attrs.ngModel, function (newValue, oldValue) {

                init();

                switch (newValue) {
                    case "pathplan":
                        $(element).css("background-color", "rgb(213, 219, 218)");
                        scope.showOnTransitionChoosen = false;
                        if (localize.language == "he-IL") {
                            scope.progressBarFirstTextElem = 'progressBarBus' + languageStr;
                            scope.progressBarFifthTextElem = "progressBarCToC" + languageStr;

                        }
                        else {
                            scope.progressBarFirstTextElem = 'progressBarBusEng';
                            scope.progressBarFifthTextElem = "progressBarCToCEng"
                        }
                        scope.progressBarSecondTextElem = 'progressBarGreenText';
                        scope.progressBarThirdTextElem = 'progressBarCToA' + languageStr;
                        scope.progressBarFourthTextElem = 'progressBarGrayText';
                        scope.progressBarSixthTextElem = "progressBarGrayText";
                        scope.lineBackgroundcolor = "#209b7a";
                        if($rootScope.isBusGovIl)
                            scope.lineBackgroundcolor = "#4090C9";
                        break;

                    case "transition":
                        $(element).css("background-color", "rgb(213, 219, 218)");
                        if (localize.language == "he-IL") {
                            scope.progressBarFirstTextElem = 'progressBarBus' + languageStr;
                            scope.progressBarThirdTextElem = 'progressBarAToB' + languageStr;
                            scope.progressBarFifthTextElem = "progressBarCToA" + languageStr;

                        }
                        else {
                            scope.progressBarFirstTextElem = 'progressBarBusEng';
                            scope.progressBarThirdTextElem = 'progressBarAToBEng';
                            scope.progressBarFifthTextElem = "progressBarCToAEng";
                        }
                        scope.progressBarSecondTextElem = 'progressBarLightGreenText';
                        scope.progressBarFourthTextElem = 'progressBarGreenText';
                        scope.progressBarSixthTextElem = "progressBarGrayText";
                        scope.lineBackgroundcolor = "#aeccc5";
                        scope.divBackgroundColor = "#d5dbda";
                        if ($rootScope.isBusGovIl)
                            scope.lineBackgroundcolor = "lightBlue";
                        break;

                    case "busstop":
                        $(element).css("background-color", "rgb(213, 219, 218)");
                        scope.showOnTransitionChoosen = false;
                        if (localize.language == "he-IL") {
                            scope.progressBarFirstTextElem = 'progressBarBus' + languageStr;
                            scope.progressBarThirdTextElem = 'progressBarAToB' + languageStr;
                            scope.progressBarFifthTextElem = "progressBarCToA" + languageStr;

                        }
                        else {
                            scope.progressBarFirstTextElem = 'progressBarBusEng';
                            scope.progressBarThirdTextElem = 'progressBarAToBEng';
                            scope.progressBarFifthTextElem = "progressBarCToAEng";
                        }
                        scope.progressBarSecondTextElem = 'progressBarLightGreenText';
                        scope.progressBarFourthTextElem = 'progressBarGreenText';
                        scope.progressBarSixthTextElem = "progressBarGrayText";
                        scope.lineBackgroundcolor = "#aeccc5";
                        scope.divBackgroundColor = "#d5dbda";
                        break;

                    case "details":
                        $(element).css("background-color", "#4090C9");
                        if (localize.language == "he-IL") {
                            scope.showOnTransitionChoosen = false;
                            scope.progressBarFirstTextElem = 'progressBarBus' + languageStr;
                            scope.progressBarThirdTextElem = 'progressBarBToB' + languageStr;
                            scope.progressBarFifthTextElem = "progressBarAToB" + languageStr;

                        }
                        else {
                            scope.progressBarFirstTextElem = 'progressBarBusEng';
                            scope.progressBarThirdTextElem = 'progressBarBToBEng';
                            scope.progressBarFifthTextElem = "progressBarAToBEng";
                        }
                        scope.progressBarSecondTextElem = 'progressBarLightGreenText';
                        scope.progressBarFourthTextElem = 'progressBarLightGreenText';
                        scope.progressBarSixthTextElem = "progressBarGreenText";
                        scope.lineBackgroundcolor = "#aeccc5";
                        scope.divBackgroundColor = "#209b7a";
                        if ($rootScope.isBusGovIl) {
                            scope.lineBackgroundcolor = "lightBlue";
                            scope.divBackgroundColor = "#4090C9";
                        }
                        break;
                    case "directlines":
                        if (localize.language == "he-IL") {
                            scope.showOnTransitionChoosen = false;
                            scope.progressBarFirstTextElem = 'progressBarBus' + languageStr;
                            scope.progressBarThirdTextElem = 'progressBarCToA' + languageStr;
                            scope.progressBarFifthTextElem = "progressBarCToC" + languageStr;

                        }
                        else {
                            scope.progressBarFirstTextElem = 'progressBarBusEng';
                            scope.progressBarThirdTextElem = 'progressBarCToAEng';
                            scope.progressBarFifthTextElem = "progressBarCToCEng";
                        }
                        scope.progressBarSecondTextElem = 'progressBarGreenText';
                        scope.progressBarFourthTextElem = 'progressBarGrayText';
                        scope.progressBarSixthTextElem = "progressBarGrayText";
                        scope.lineBackgroundcolor = "#209b7a";
                        scope.divBackgroundColor = "#d5dbda";
                        

                        break;
                }
            });

            function init() {

                $(element).css("background-color", "rgb(213, 219, 218)");
                scope.progressBarFirstTextElem = "progressBarBus" + languageStr;
                scope.progressBarSecondTextElem = "progressBarGrayText";
                scope.progressBarThirdTextElem = "progressBarCToA";
                scope.progressBarFourthTextElem = "progressBarGrayText";
                scope.progressBarFifthTextElem = "progressBarCToC";
                scope.progressBarSixthTextElem = "progressBarGrayText";

                if ($rootScope.search.lineNumber != null && $rootScope.search.lineNumber.ID != 0) scope.showOnTransitionChoosen = true;

            }

            init();
        }

    };
});
