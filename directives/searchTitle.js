
mslApp.directive('searchTitle', function ($compile, $location, localize) {
    return function (scope, element, attrs) {


        var slashDelimitedArr = $location.$$absUrl.split('/');
        if (slashDelimitedArr == null)
            return;
       
       
        scope.$on('$locationChangeSuccess', function () {
             var sHtml = "<ol class='breadcrumb'>";
            slashDelimitedArr = $location.$$absUrl.split('/');
            var searchType ;
            for (var i = 4 ; i < slashDelimitedArr.length; i++) {
                if (slashDelimitedArr[i] == "bydest") {
                    if (scope.searchByDest.toAddress.City.NAME) {
                        sHtml += "<li style='margin:2px;' >  " + scope.searchByDest.toAddress.City.NAME + "</li>";
                    }
                    if (scope.searchByDest.toAddress.Quarter.NAME) {
                        sHtml += "<li style='margin:2px;' >  " + scope.searchByDest.toAddress.Quarter.NAME + "</li>";
                    }
                    if (scope.searchByDest.fromAddress.City.NAME) {
                        sHtml += "<li style='margin:2px;' >  " + scope.searchByDest.fromAddress.City.NAME + "</li>";
                    }
                    if (scope.searchByDest.fromAddress.Quarter.NAME) {
                        sHtml += "<li style='margin:2px;' >  " + scope.searchByDest.fromAddress.Quarter.NAME + "</li>";
                    }

                }
                if (slashDelimitedArr[i] == "byline")
                {
                    if (scope.searchByLine.toAddress.City.NAME) {
                        sHtml += "<li style='margin:2px;' >  " + scope.searchByLine.toAddress.City.NAME + "</li>";
                    }
                    if (scope.searchByLine.toAddress.Quarter.NAME) {
                        sHtml += "<li style='margin:2px;' >  " + scope.searchByLine.toAddress.Quarter.NAME + "</li>";
                    }
                    if (scope.searchByLine.fromAddress.City.NAME) {
                        sHtml += "<li style='margin:2px;' >  " + scope.searchByLine.fromAddress.City.NAME + "</li>";
                    }
                    if (scope.searchByLine.fromAddress.Quarter.NAME) {
                        sHtml += "<li style='margin:2px;' >  " + scope.searchByLine.fromAddress.Quarter.NAME + "</li>";
                    }

                }
            }

            sHtml += "</ol>";
           


            var compiledHTML = $compile(sHtml)(scope);
            element.html("");
            element.append(compiledHTML);

        })
    }
});
