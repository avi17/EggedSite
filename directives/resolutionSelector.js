
mslApp.directive('resolutionSelector', function ($timeout, localize) {
    return function (scope, element, attrs) {

        var strButtonLetter;
        var elemTable;
        var elemTr;
        scope.$watch("language", function (e) {
            if (localize.language == "en-US")
                strButtonLetter = 'A';
            else
                strButtonLetter = 'א';
            init();
        });


        function init() {

            $(element)[0].innerHTML = "";
            elemTable = $("<table>").appendTo(element);
            elemTr = $("<tr>").appendTo(elemTable);

            $("<td><div style='height: 14px; width: 14px; overflow:hidden;'>" + strButtonLetter + "</div></td>")
                .addClass("LargeResolution")
                .appendTo(elemTr)
                .click(function () {
                    setResolution(2, this);
                });

            $("<td><div style='height: 8px; width: 8px; overflow:hidden;'></div></td>")
                .appendTo(elemTr);

            $("<td><div style='height: 14px; width: 14px; overflow:hidden;'>" + strButtonLetter + "</div></td>")
                .addClass("MidResolution")
                .appendTo(elemTr)
                .click(function () {
                    setResolution(1.5, this);
                });

            $("<td><div style='height: 8px; width: 8px; overflow:hidden;'></div></td>")
            .appendTo(elemTr);

            $("<td><div style='height: 14px; width: 14px; overflow:hidden;'>" + strButtonLetter + "</div></td>")
                .css("color", "#009d7d")
                .css("border-color", "#009d7d")
                .addClass("SmallResolution")
                .appendTo(elemTr)
                .click(function () {
                    setResolution(1, this);
                });

            //$(element).css("float", "left");
        }


        function setResolution(resolutionValue, SelectedElement) {

            $(elemTr).children().each(function () {
                $(this).css("color", "black");
                $(this).css("border-color", "black");
            });

            $(SelectedElement).css("color", "#009d7d");
            $(SelectedElement).css("border-color", "#009d7d");

            $('.mainContent').css('zoom', (resolutionValue * 100).toString() + '%');
            $('.mainContent').css('overflow-x', 'scroll');
        }

    }
});
