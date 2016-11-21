mslApp.factory('userMsgFactory', function () {
    return {
        getMessage: function (scope, compile) {
            scope.$watch('userMsg', function (newVal, oldVal) {
                if (newVal) {
                    var sHtml = "<table><tr><td>" + newVal + "</td></tr>"
                    sHtml += "<tr><td align='center'>" + "<a ng-click='clearUserMsg()' i18n='_Close_' ></a>" + "</td></tr></table>";
                    var compiledHTML = compile("<div id='divUserMsg' style='position:absolute; border:solid 1px silver;padding:20px;'>" + sHtml + "<div>")(scope);


                    jQuery(document.body).append(
                           compiledHTML
                    );

                    var addedElement = $("#divUserMsg")

                    var tmpWidth = parseInt(addedElement.css("width"));
                    var tmpHeght = parseInt(addedElement.css("height"));

                    addedElement.css("left", "50%");
                    addedElement.css("margin-left", "-" + tmpWidth / 2 + "px");

                    addedElement.css("top", "50%");
                    addedElement.css("margin-top", "-" + tmpHeght / 2 + "px");
                    addedElement.css("position", "fixed");

                    scope.clearUserMsg = function () {
                        $('#divUserMsg').remove();
                        scope.userMsg = "";
                       
                    };
                }
                else
                    scope.clearUserMsg();
            });
        }
    };

    return {
        getMessage: getMessage,
    };
});


