mslApp.directive('compass', function ($compile, $rootScope, $location, localize, globalFunctions) {
    return {
        templateUrl: '/app/views/directive/compass.htm',
        link: function (scope, element, attrs, ctrl) {

            scope.alpha = "";
            scope.beta = "";
            scope.gamma = "";

            var windowWidth = $(window).width();

            scope.angleDestinationToNorth = 0;
            scope.angleNorthToMyDir = 0;
            if (!window.DeviceOrientationEvent) 
            {
                $(element).hide();
                return;
            }

            var p = navigator.platform;

            if (p === 'iPad' || p === 'iPhone' || p === 'iPod') {
                $(element).hide();
                return;
            }

            var destinationPosition;
            var destination = scope.$eval(attrs.ngDestination);

            //drawwArc();


            //globalFunctions.getCurrentPosition(function (position) {
            //        $rootScope.currentLocation = { coords: { latitude: position.coords.latitude, longitude: position.coords.longitude }, description: "" };

            if ($rootScope.currentLocation.coords == null) return;

                    var relationData = globalFunctions.getDistanceAndDirection(
                        $rootScope.currentLocation.coords.latitude,
                        $rootScope.currentLocation.coords.longitude,
                        destination.Latitude,
                        destination.Longitude);

                    //var angleToDestination = 360 * relationData.direction;
                    scope.angleDestinationToNorth = relationData.direction;
                    scope.distanceDestinationToNorth = relationData.distance;

                    //relationData.distance	216.14687938354245	Number


                    window.addEventListener('deviceorientation', function (eventData) {

                        //if (eventData.alpha == null)
                        //{
                        //    $(element).hide();
                        //    return;
                        //}

                        scope.angleNorthToMyDir = eventData.alpha;
                        //scope.angleNorthToMyDir = compassHeading(eventData.alpha, eventData.beta, eventData.gamma);
                        
                        var sum = scope.angleDestinationToNorth + scope.angleNorthToMyDir;
                        if (sum > 360)
                            sum = sum - 360;

                        //$(element).find(".floatLabel").each(function () {
                        //    if (sum > 340 || sum < 20)
                        //    {
                        //        $(this).show();
                        //        var angle = sum;
                        //        if (angle > 340) angle = angle - 360;
                        //        if (sum < 20) angle = angle +20;

                        //        var skewPercent = angle / 40;
                        //        var skew = windowWidth * skewPercent;
                        //        $(this).css("left", skew.toString() + "%");
                        //    }
                        //    else
                        //        $(this).hide();
                        //});

                        $(element).find(".compassImage").each(function () {
                            var r = 'rotate(' + sum + 'deg)';
                            $(this).css({
                                '-moz-transform': r,
                                '-webkit-transform': r,
                                '-o-transform': r,
                                '-ms-transform': r
                            });
                        });

                        $(element).find(".compassText").each(function () {
                            //var strDistanceOf = localize.getLocalizedString("_DistanceOf_");
                            var strMeters = localize.getLocalizedString("_Meters_");
                            scope.distanceDestinationToNorth = scope.distanceDestinationToNorth * 1000;
                            scope.distanceDestinationToNorth = Math.round(scope.distanceDestinationToNorth);
                            //scope.distanceDestinationToNorth = parseInt(scope.distanceDestinationToNorth);

                            //if (scope.distanceDestinationToNorth > 500) {
                            //    $(element).hide();
                            //    return;
                            //}

                            if (scope.distanceDestinationToNorth < 1000)
                            $(this).html(scope.distanceDestinationToNorth + " " + strMeters);
                            $(this).attr("title", scope.distanceDestinationToNorth + " " + strMeters);
                        });

                    }, false);

                //});

            function drawwArc()
            {
                var c = $(element)[0];
                var ctx = c.getContext("2d");
                ctx.beginPath();
                ctx.arc(100, 75, 50, 0, 2 * Math.PI);
                ctx.stroke();
            }

            function compassHeading(alpha, beta, gamma) {

                // Convert degrees to radians
                var alphaRad = alpha * (Math.PI / 180);
                var betaRad = beta * (Math.PI / 180);
                var gammaRad = gamma * (Math.PI / 180);

                // Calculate equation components
                var cA = Math.cos(alphaRad);
                var sA = Math.sin(alphaRad);
                var cB = Math.cos(betaRad);
                var sB = Math.sin(betaRad);
                var cG = Math.cos(gammaRad);
                var sG = Math.sin(gammaRad);

                // Calculate A, B, C rotation components
                var rA = -cA * sG - sA * sB * cG;
                var rB = -sA * sG + cA * sB * cG;
                var rC = -cB * cG;

                // Calculate compass heading
                var compassHeading = Math.atan(rA / rB);

                // Convert from half unit circle to whole unit circle
                if (rB < 0) {
                    compassHeading += Math.PI;
                } else if (rA < 0) {
                    compassHeading += 2 * Math.PI;
                }

                // Convert radians to degrees
                compassHeading *= 180 / Math.PI;

                return compassHeading;

            }

            window.addEventListener('deviceorientation', function (evt) {

                var heading = null;

                if (evt.absolute === true && evt.alpha !== null) {
                    heading = compassHeading(evt.alpha, evt.beta, evt.gamma);
                }


                //scope.alpha = evt.alpha;
                //scope.beta = evt.beta;
                //scope.gamma = evt.gamma;
                //// Do something with 'heading'...

                //$(element).find(".floatLabel").each(function () {
                //    if (evt.alpha > 340 || evt.alpha < 20) {
                //        $(this).show();
                //        var angle = evt.alpha;
                //        if (angle > 340) angle = 360 - angle;
                //        else
                //            if (evt.alpha < 20) angle = angle + 20;

                //        var skewPercent = angle / 40;
                //        var skew = windowWidth * skewPercent;
                //        $(this).css("left", skew.toString() + "px");
                //    }
                //    else
                //        $(this).hide();
                //});


            }, false);

            scope.showRealtimeConpassMessage = function () {
                $rootScope.search.userMessageTitle = "_Help_" + "," + "_NextBus_";
                $rootScope.search.userMessage = "_HelpRealtimeCompassMessage_";
            }

        }
    }
});

