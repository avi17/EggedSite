"use strict";
mslApp.controller("FreetextQueryCtrl",
    function ($scope, $stateParams, $location, $timeout, $rootScope, localize) {

        if ($stateParams.isClear && $stateParams.isClear == "1") {
            setTimeout(function () {
                $location.path("/freetext/1/0");
            }, 50);
            return;
        }

        if ($location.$$absUrl.indexOf("freetext") > -1) {
            $scope.freeTextQuestion = $stateParams.freelang;
        }

        $scope.helpFreeText = function () {
            $scope.search.userMessageTitle = "_Title_";
            $scope.search.userMessage = "_HelpFreeTextParagraph1_," +
                "_HelpFreeTextParagraph2_," +
                "_HelpFreeTextParagraph3_," +
                "_HelpFreeTextParagraph4_," +
                "_HelpFreeTextParagraph5_," +
                "_HelpFreeTextParagraph6_," +
                "_HelpFreeTextParagraph7_," +
                "_HelpFreeTextParagraph8_," +
                "_HelpFreeTextParagraph9_," +
                "_HelpFreeTextParagraph10_," +
                "_HelpFreeTextParagraph11_," +
                "_HelpFreeTextParagraph12_," +
                "_HelpFreeTextParagraph13_";
            $timeout(function () {
                if ($rootScope.accessibilitySite == true && localize.language == "he-IL") $(".ui-dialog-titlebar-close").attr("title","סגור עזרה");
            }, 50);
        }

        $scope.helpFullInformation = function () {
            $scope.search.userMessageTitle = "_FullInformation_";
            $scope.search.userMessage = "_HelpFullInformationParagraph_";
        }

        $scope.helpSmsMessage = function () {
            $scope.search.userMessageTitle = "_SmsMessage_";
            $scope.search.userMessage = "_helpSmsMessageParagraph_";
        }

        $scope.enterPressed = function (x) {
            $location.path("/freetext/1/0/" + $scope.freeTextQuestion);
        }

    });


