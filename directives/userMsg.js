
mslApp.directive('userMessage', function ($rootScope, $compile, $location, localize) {
    return {
        restrict: 'EA', // only activate on element attribute 
        link: function postLink(scope, element, attrs) {

            var currentMessageCode = "";
            var dialogElement = null;
            scope.$watch(attrs.ngModel, function (newVal, oldVal) {
                if (newVal == null || newVal == "") return;
                if (newVal != "") {
                    currentMessageCode = scope.$eval(attrs.ngModel);

                    scope.$eval(attrs.ngModel + "=''");
                    if (dialogElement != null)
                            $(element).dialog("open");
                    else
                        init();
                    fillUserMessage();
                    //$($(dialogElement).find(".ui-dialog-titlebar-close")[0]).focus();
                }
                else
                    $(element).css("display", "none");

            });

            function init() {

                if (localize.language == "he-IL")
                    btnCancel = "סגור";
                else
                    btnCancel = "Close";

                var dialogTitleStr = "";
                dialogTitleStr = localize.getLocalizedString($rootScope.search.userMessageTitle);
                $rootScope.search.userMessageTitle = "";
                if (dialogTitleStr == "")
                    dialogTitleStr = localize.getLocalizedString('_Title_');

                dialogElement = $(element).dialog({
                    //width: 600,
                    //height: 500,
                    //dialogClass: 'dlgfixed',
                    //position: "center",
                    width: '80%',
                    resizable: false,
                    title: dialogTitleStr,
                    modal: true,
                    open: function (event, ui) {
                        $('.ui-widget-overlay').bind('click', function () {
                            $(event.target).dialog('close');
                        });
                        var currentHeaderText = $($(event.target).prev().find(".ui-dialog-title")[0]).html();
                        var h3Element = $("<h3 tabindex='0' style='font-size: 18px; margin: 0px 20px;'>").html(currentHeaderText);
                        setTimeout(function () {
                            $(h3Element).focus();
                        }, 500);

                        $($(event.target).prev().find(".ui-dialog-title")[0]).html("");
                        h3Element.appendTo($($(event.target).prev().find(".ui-dialog-title")[0]));

                        $($(event.target).prev().find(".ui-dialog-titlebar-close")[0]).attr("title", btnCancel);
                        

                    }
                    , close: function (event, ui) {
                        //$(".siteLogoImage").focus();
                        //setTimeout(function () {
                        //    return false;
                        //}, 3000);
                    }
                    , beforeClose: function myCloseDialog() {
                        //$(".siteLogoImage").focus();
                        //e.preventDefaults();
                        //return false;
                    }


                });

                //$(element).dialog('option', 'position', 'center');

                //$(element).dialog("option", "aria-labelledby", "Egged origin destination alert message");
                //$(element).dialog("option", "role", "alertdialog");
                //$(element).dialog("option", "aria-live", "assertive");
            }

            function fillUserMessage() {
                if (currentMessageCode != null && currentMessageCode != "") {

                    var CodeMessageArray = currentMessageCode.split(',');
                    $(element)[0].innerHTML = "";
                    for (var j = 0; j < CodeMessageArray.length; j++) {
                        var str = CodeMessageArray[j].replace("href='javascript:UnicellInteraction", "onclick='choiceSelected");
                        var processedContent = "";
                        var paramArray = str.split('|');
                        if (paramArray.length > 1) {
                            processedContent = localize.getLocalizedString(paramArray[0]);
                            for (var i = 1; i < paramArray.length; i++) {
                                switch (i) {
                                    case 1:
                                        processedContent = processedContent.replace("{0}", paramArray[1]);
                                        break;
                                    case 2:
                                        processedContent = processedContent.replace("{1}", paramArray[2]);
                                        break;
                                    case 3:
                                        processedContent = processedContent.replace("{2}", paramArray[3]);
                                        break;
                                }
                            }
                        }
                        else
                            processedContent = localize.getLocalizedString(str);

                        if (processedContent == "")
                            $(element)[0].innerHTML = str;
                        else
                            //$("<div>" + processedContent + "</div><br />").appendTo(element);
                            $(element)[0].innerHTML += processedContent + "<br />";
                    }

                        if ($rootScope.isMobileBrowser == true)
                            setTimeout(function () {
                                $(element).dialog("close");
                                alert($(element)[0].innerText);
                        }, 50);
                }
            }

        }
    }
});

