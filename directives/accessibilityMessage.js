
mslApp.directive('accessibilityMessage', function ($compile, $location, $rootScope, localize) {
    return function (scope, element, attrs) {

        $rootScope.$watch("accessibilityMessage", function (newValue, oldValue) {
            var strSelect = "";
            if (newValue != null) {
                $(element).show();
                switch (newValue) {
                    case "skipToMainMenu":
                        strSelect = "_SkipToMainMenu_";
                        break;
                    case "skipToEggedNews":
                        strSelect = "_SkipToEggedNews_";
                        break;
                    case "skipToFilters":
                        strSelect = "_SkipToSearchType_";
                        break;
                    case "":
                        $(element)[0].innerHTML = "";
                        break;
                }

                if (localize.dictionary.length > 0) {
                    strSelect = localize.getLocalizedString("_Select_");
                    $(element)[0].innerHTML = strSelect;
                }

            }
            else
            {
                //$(element).hide();
            }
        });

    }
});
