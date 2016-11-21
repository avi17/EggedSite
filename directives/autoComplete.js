
mslApp.directive('autoComplete', function ($timeout, $rootScope, localize) {
    return function (scope, element, attrs) {

        var selctedItem = new Object;
        scope.$watch(attrs.ngInit, function () {
            var str;
            if (scope.$eval(attrs.ngInit) == null)
                str = "";
            else
                str = scope.$eval(attrs.ngInit);
            $(element).val(str);
        });

        $(element).autocomplete({
            open: function (event, ui) {
                selctedItem = null;
                if (localize.language == "he-IL")
                    $('.ui-autocomplete').css({ 'direction': 'rtl' });
                else
                    $('.ui-autocomplete').css({ 'direction': 'ltr' });

            },
            autoFocus: true,
            //source: scope[attrs.uiItems],

            source: function (request, response) {
                //scope.$watch(scope.cityList, function (newVal, oldVal) {
                //    if (newVal && newVal !== oldVal)
                //        scope.cityList = newVal;
                //});

                if (request.term.length <= 1) return;

                var list = [];
                var itemList = scope.$eval(attrs.uiItems);
                $.each(itemList, function (index, value) {   //init city list 
                    list.push({ label: value.NAME, id: value.ID });
                });

                var results = [];

                results = $.ui.autocomplete.filter(list, request.term);
                for (var i = 0; i < results.length; i++)
                    if (results[i].label === request.term) {
                        var temp = results[i];
                        results[i] = results[0];
                        results[0] = temp;
                    }
                //response(results.slice(0, 5));
                response(results);
            },
            change: function (event, ui) {
                if (ui.item == null) {
                    $timeout(function () {
                        $(element).val("");
                        scope.$eval(attrs.ngModel.slice(0, attrs.ngModel.indexOf(".NAME")) + "={ID:0, NAME:''}");
                    }, 200);
                    //scope.$apply();
                }

            },
            select: function (event, ui) {
                selctedItem = ui.item;
                $timeout(function () {
                    //var processedName = ui.item.value.replace("'", "&apos;");
                    if (ui.item.value.indexOf('"') > -1) {
                        scope.$eval(attrs.ngModel + "='" + ui.item.value + "'");
                        scope.$eval(attrs.ngModel.slice(0, attrs.ngModel.indexOf(".NAME")) + "={ID:" + ui.item.id + ", NAME:'" + ui.item.value + "'}");
                    }
                    else {
                        if (ui.item.value.indexOf("'") > -1) {
                            scope.$eval(attrs.ngModel + '="' + ui.item.value + '"');
                            scope.$eval(attrs.ngModel.slice(0, attrs.ngModel.indexOf(".NAME")) + '={ID:' + ui.item.id + ', NAME:"' + ui.item.value + '"}');
                        }
                        else {
                            scope.$eval(attrs.ngModel + '="' + ui.item.value + '"');
                            scope.$eval(attrs.ngModel.slice(0, attrs.ngModel.indexOf(".NAME")) + '={ID:' + ui.item.id + ', NAME:"' + ui.item.value + '"}');
                        }
                    }
                }, 200);
                //scope.$apply();
            },

        }).change(function (event, ui) {
            if (selctedItem == null) {
                var strMakeSureEntrySelected = localize.getLocalizedString("_MakeSureEntrySelected_");
                $rootScope.search.userMessage = strMakeSureEntrySelected;
                //alert(strMakeSureEntrySelected);
            }
        });

        $(".ui-autocomplete").
            css("max-height", "145px").
            css("overflow-y", "auto").
                    css("overflow-x", "hidden");


        $(".ui-autocomplete-input").css("margin", "0");
        //$(".ui-autocomplete-input").css("padding", "0px 5px 0px 5px");

        $(".ui-autocomplete-input").css("height", "29px");
        $(".ui-autocomplete-input").css("line-height", "29px");

        //$(".ui-autocomplete-input").css("border-width", "0");
        $(".ui-autocomplete-input").css("border-radius", "3px");


        //$(".ui-autocomplete-input").css("padding-right", "0px");
        //$(".ui-autocomplete-input").css("padding-left", "0px");

        $(".ui-autocomplete-input").change(function () {
            //$(".ui-autocomplete-input").
            //if (element[0].value.length == 0)
            //    scope.clearQuarterSelect(element);

        });

        //$('.ui-autocomplete-input').on('keyup', function (e) {

        //    if (element[0].value.length == 0)
        //        if (scope.clearQuarterSelect != null)
        //            scope.$eval(attrs.eventCleared);
        //            //scope.clearQuarterSelect(element);

        //});

        $('.ui-autocomplete-input').on('keydown', function (e) {

            scope.$eval("search.searchFromSelectorisShowResultFocused=false");
            scope.$eval("isNextButtonFocused=false");

            //if ($rootScope.language.indexOf("he") > -1)
            //{
            //    var Reg = /^[\b\s\u0591-\u05F40-9."-]+$/;
            //}
            //else if ($rootScope.language.indexOf("en") > -1)
            //{
            //    var Reg = /^[\b\sa-zA-Z0-9."-]+$/;
            //}
            //while (e.char != null && !Reg.test(e.char) && e.char.length > 0) {
            //    e.char = e.char.substring(0, e.char - 1);
            //    e.preventDefault();
            //}
        });

    }

    function EngToHeb(char) {
        return e.keyCode = 40;
    }
});

