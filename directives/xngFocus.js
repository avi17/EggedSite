mslApp.directive('xngFocus', function ($timeout, $rootScope) {
    return function (scope, element, attrs) {
        scope.$watch(attrs.xngFocus,
          function (newValue) {
              if (newValue)
                  element.focus();

              scope.$eval("search.isShowResultFocused=false");
              scope.$eval("isNextButtonFocused=false");
              scope.$eval("search.isFilterHeaderFocused=false");
              
          }, true);

    };
});
