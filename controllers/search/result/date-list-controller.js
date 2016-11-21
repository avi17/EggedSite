(function (ng, app) {

    "use strict";

    mslApp.controller(
		"search.result.DateListController",
		function ($rootScope, $location, $scope, requestContext, _, $q, searchService, $route, initSearchObject) {

		    $scope.selectedDateList = $rootScope.search.dateList;

		    // Get the render context local to this controller (and relevant params).
		    var renderContext = requestContext.getRenderContext("search." + $route.current.action.split('.')[1] + ".result.date-list"); //"index.search.bydest"

		    // The subview indicates which view is going to be rendered on the page.
		    $scope.subview = renderContext.getNextSection();

		    // I handle changes to the request context.
		    $scope.$on(
                "requestContextChanged",
                function () {

                    // Make sure this change is relevant to this controller.
                    if (!renderContext.isChangeRelevant()) {

                        return;

                    }

                    // Update the view that is being rendered.
                    $scope.subview = renderContext.getNextSection();

                }
            );

		    $scope.showSearchResult = function (date) {

		        $rootScope.search.currentDate = $rootScope.search.dateList[date - 1];
		        $scope.$apply();
		        switch ($rootScope.prevSubView) {

		            case "bus-stop":
		                {
		                    var path = "/search/" + $rootScope.currentTabName + "/result/bus-stop";
		                    $rootScope.search.originTime = $rootScope.search.currentDate.NAME.split(' ')[0] + " " + $rootScope.prevPathParam.originTime.split(' ')[1]
		                    initSearchObject.initPathPlanUrlParams($rootScope.search, path);
		                };
		                break;
		        }
		        
		        $location.path("search/" + $route.current.action.split('.')[1] + "/result/" + $rootScope.prevSubView);
		        $rootScope.prevSubView = "date-list";
		        $scope.$apply();
		    }
		}
	);


})(angular, app);