

mslApp.directive('radioButton', function ($timeout) {
    return function (scope, element, attrs) {
        $scope.toggleShowSchedule;

        $(element).children("input[type=radio]").each(function () {
            $(this).addClass("ui-helper-hidden-accessible");
        });
        var labelElements = $(element).children("label");
        $(labelElements).each(function () {
            $(this).click(function () {
                $(labelElements).removeClass("ui-state-active");
                $(this).addClass("ui-state-active");
                //$scope.toggleShowSchedule = 1;
                //$scope.toggleShowSchedule = 2;
            });
            $(this).addClass("btn ui-widget ui-state-default ui-button-text-only ");
            $( "<span>" )
             .addClass( "custom-combobox" )
             .appendTo(this);
        });
        $($(labelElements)[0]).addClass("ui-corner-right");
        $($(labelElements)[1]).addClass("ui-corner-left ui-state-active");
    }
});
