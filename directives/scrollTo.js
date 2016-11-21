
mslApp.directive('scrollTo', function ($compile, $location, localize) {
    return function (scope, element, attrs) {

        scope.$watch(attrs.isscroll, function (newVal, oldVal) {

            if (newVal == true) {

                //$(element).closest(".scrollableParent").animate({
                //    scrollTop: $(element)[0].offsetTop - $(element)[0].clientHeight * 2
                //}, 10);

                setTimeout(function () { 
                $(element).closest(".scrollableParent").scrollTop($(element)[0].offsetTop - $(element)[0].clientHeight * 2);
                }, 50);

            }

        });

    };
});
