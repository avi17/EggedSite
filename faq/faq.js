"use strict";

mslApp.controller(
    "FaqCtrl",
    function ($scope) {

        var generalFaqGridList = [];
        var luggageFaqGridList = [];

        for (var i = 1; i < 6; i++) {

            generalFaqGridList.push({
                headerString: "_FaqGeneral_",
                isCollapsed: true,
                Question: "_Question" + i.toString() + "_",
                Answer: "_Answer" + i.toString() + "_",
                AnswerImage: "FaqAnswer" + i.toString() + ".png"
            });

        }

        generalFaqGridList[0].isCollapsed = false;

        $scope.faqGridList = [];

        $scope.faqGridList.push({
            headerString: "_FaqGeneral_",
            isCollapsed: false,
            innerFaqGridList: generalFaqGridList
        });
      
    }
);
