mslApp.directive('browserCompatibility', function ($rootScope, $location, localize) {
    return {
        scope: true,
        replace: true,
        templateUrl: '/app/views/directive/browserCompatibility.htm',
        link: function (scope, element, attrs) {

            scope.isStopShowingMessage = false;
            $rootScope.enumCompatibilityMessage = 0;

            scope.closeElement = function () {
                $rootScope.enumCompatibilityMessage = 0;
            }

            function checkbrowserCompatibility() {

                var langDir;
                var appVersionArray = navigator.appVersion.split("; ");

                for (var i = 0; i < appVersionArray.length; i++) {
                    if (appVersionArray[i].indexOf("MSIE") > -1) {
                        var sVersionNumber = appVersionArray[i].split(" ")[1];
                        var iVersionNumber = parseInt(sVersionNumber);
                        if (iVersionNumber <= 8) {

                            if (localize.language == "he-IL")
                                langDir = "rtl";
                            else
                                langDir = "ltr";

                            var selectedLanguage = getParameterByName('language');
                            switch (selectedLanguage) {
                                case "he":
                                    langDir = "rtl";
                                    break;
                                case "en":
                                    langDir = "ltr";
                                    break;
                            }

                            var strUnSupportedBrowser = "דפדפן בגרסה לא נתמכת, מומלץ לשדרג את הדפדפן לאחת הגירסאות הבאות : ";
                            var strUnSupportedBrowserTitle = "הודעות אתר";
                            if (langDir == "rtl") {
                                strUnSupportedBrowser = "דפדפן בגרסה לא נתמכת, מומלץ לשדרג את הדפדפן לאחת הגירסאות הבאות : ";
                                strUnSupportedBrowserTitle = "הודעות אתר";
                            }
                            else {
                                strUnSupportedBrowser = "Browser version Not supported, a newer browser version is advised : ";
                                strUnSupportedBrowserTitle = "Site messages";
                            }

                            $("body").html("");

                            var browserCompatibilityMessage = "";
                            var ua = navigator.userAgent.toLowerCase();
                            var isWinXP = ua.indexOf('windows nt 5.1') > 0;
                            if (isWinXP == true)
                                browserCompatibilityMessage = "/app/views/directive/browserCompatibilitySmall.htm";
                            else
                                browserCompatibilityMessage = "/app/views/directive/browserCompatibility.htm"

                            $.get(browserCompatibilityMessage, function (data) {

                                var messageBody = $(data).find(".MessageBody").html();
                                messageBody = messageBody.replace("{{currentMessage}}", strUnSupportedBrowser);

                                $("<div style='direction: " + langDir + ";' title=" + strUnSupportedBrowserTitle + ">" + messageBody + "</div>").
                                    dialog({
                                        autoResize: true,
                                        resizable: false,
                                        modal: true,
                                        width: 'auto',
                                        height: 'auto'
                                    }).
                                    bind('dialogclose', function (event) {
                                        window.close();
                                    });
                                //$(".ui-widget-overlay").hide();
                            });

                            return;
                        }
                        else {
                            if (iVersionNumber > 8 && iVersionNumber < 10) {
                                var strUnSupportedBrowser = "לחווית גלישה טובה יותר, מומלץ לשדרג את הדפדפן לאחת הגירסאות הבאות : ";
                                if (localize.language == "he-IL")
                                    strUnSupportedBrowser = "לחווית גלישה טובה יותר, מומלץ לשדרג את הדפדפן לאחת הגירסאות הבאות : ";
                                else
                                    strUnSupportedBrowser = "For better user experience, a newer browser version is advised : ";
                                scope.currentMessage = strUnSupportedBrowser;
                                if (scope.currentMessage != null)
                                    $rootScope.enumCompatibilityMessage = 2;
                                return;
                            }
                        }
                    }
                }

            }
            setTimeout(function () {
                if ($(document).width() > 320 && $(document).width() < 759) {
                    if ($rootScope.search.language != 'he') return;
                    if ($rootScope.isStorageActive == null) return;
                    //if (document.referrer.indexOf("mobi.egged.co.il") > -1) return;
                    if ($rootScope.isStorageActive == true) {
                        isStopShowingMessage = localStorage.getItem("isStopShowingMessage");
                        isStopShowingMessage = "false";
                        if (isStopShowingMessage == "false") {
                            $('#browserCompatibilityDialog').focus();
                            $rootScope.enumCompatibilityMessage = 1;
                            if ($location.$$path.indexOf("freelang") == 0) {
                                $rootScope.enumCompatibilityMessage = 0;
                            }

                        }
                    }
                    else {
                        checkbrowserCompatibility();
                    }
                }
            }, 500);

            scope.$watch("isStopShowingMessage", function (newValue, oldValue) {
                if (newValue == null) return;
                scope.isStopShowingMessage = newValue;
                //localStorage.setItem("isStopShowingMessage", newValue);
            });

            scope.stopShowingMessageClicked = function () {
                localStorage.setItem("isStopShowingMessage", scope.isStopShowingMessage);
            }

            scope.hidePopup = function () {
                $rootScope.enumCompatibilityMessage = 0;
            }

            scope.redirectToMobimsl = function () {
                location.href = "http://mobimsl.egged.co.il/";
            }

            $(document).keydown(function (event) {
                if (!$(event.target).closest('#browserCompatibilityDialog').length && !$(event.target).is('#browserCompatibilityDialog'))
                {
                    if ($('#browserCompatibilityDialog').is(":visible")) {
                        $('#browserCompatibilityDialog').focus();
                    }
                }
            });

        }
    }
});
