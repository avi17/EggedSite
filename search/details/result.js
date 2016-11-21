"use strict";

mslApp.controller(
    "DetailsController",
    function ($rootScope, transitionService, globalFunctions, localize) {

        var vm = this;
        $rootScope.isNavigatedFromDetails = true;

        $rootScope.$watch("selectedLineList", function (newVal, oldVal) {
            var tempCompanyIDArray = [];
            var tempCompanyNameArray = [];
            var tempDtOriginBusstopArray = [];
            var tempDtDestinationBusstopArray = [];
            var tempDistanceArray = [];
            var tempMakatOriginBusstopArray = [];
            var tempMakatDestinationBusstopArray = [];
            var tempMazanDestinationArray = [];
            var tempPriceArray = [];
            var tempMigunArray = [];
            var tempMilitaryAreaArray = [];
            var tempMakatArray = [];
            var tempOriginQuarterIdArray = [];
            var tempPlatformArray = [];
            var tempShilutArray = [];
            var tempDestinationQuarterIdArray = [];

            $rootScope.segmentList = [];

            var lines = newVal;

            var FromPlaceName = $rootScope.FromPlaceName;
            var ToPlaceName = $rootScope.ToPlaceName;


            vm.departureTime = lines[0].TimeOriginBusstop;
            vm.ArrivalTime = lines[lines.length - 1].TimeDestinationBusstop;

            vm.routeTo = function (route) {
                vm.resultViewName = route;
            }

            vm.totalTime = 0;
            vm.totalWaitingTime = 0;
            vm.totalTravelTime = 0;
            vm.totalPrice = 0;
            vm.isShowEstimatedDepartureTimeRemark = false;
            vm.isAirlineDependentFrom = false;
            vm.isAirlineDependentTo = false;
            vm.isShowMigunRemark = false;
            vm.isShowPlatformHeader = false;
            vm.isShowPassageCardRemark = false;
            vm.isShowContinuationCardRemark = false;


            for (var i = 0 ; i < lines.length ; i++) {
                //vm.totalWaitingTime += lines[i].WaitingTime;
                //vm.totalTravelTime += lines[i].TimeToDestination;
                //vm.totalPrice += lines[i].Price;

                //var tmpFromStop;
                //var tmpToStop;

                //switch (lines.length) {
                //    case 1:

                //        tmpFromStop = globalFunctions.parse(FromPlaceName[0]);
                //        tmpToStop = globalFunctions.parse(ToPlaceName[2]);
                //        break;
                //    case 2:
                //        if (i == 0) {
                //            tmpFromStop = globalFunctions.parse(FromPlaceName[0]);
                //            tmpToStop = globalFunctions.parse(ToPlaceName[0]);//firstConnection
                //        }
                //        else {
                //            tmpFromStop = globalFunctions.parse(FromPlaceName[1]); //firstConnection
                //            tmpToStop = globalFunctions.parse(ToPlaceName[2]);
                //        }
                //        break;
                //    case 3:
                //        if (i == 0) {
                //            tmpFromStop = globalFunctions.parse(FromPlaceName[0]);
                //            tmpToStop = globalFunctions.parse(ToPlaceName[0]);
                //        }
                //        else if (i == 1) {
                //            tmpFromStop = globalFunctions.parse(FromPlaceName[1]);
                //            tmpToStop = globalFunctions.parse(ToPlaceName[1]);
                //        }
                //        else {
                //            tmpFromStop = globalFunctions.parse(FromPlaceName[2]);
                //            tmpToStop = globalFunctions.parse(ToPlaceName[2]);
                //        }
                //        break;
                //}

                ////lines[0].Migun
                if (lines[i].Migun == 3) vm.isShowMigunRemark = true;
                if (lines[i].PlatformNumber != '' && lines[i].PlatformNumber != '0') vm.isShowPlatformHeader = true;
                if (lines[i].MazanToMoza != 0) vm.isShowEstimatedDepartureTimeRemark = true;
                if (lines[i].Makat == $rootScope.airlineDependent.makatFrom) vm.isAirlineDependentFrom = true;
                if (lines[i].Makat == $rootScope.airlineDependent.makatTo) vm.isAirlineDependentTo = true;

                //var strNoData = localize.getLocalizedString("_NoData_");

                tempCompanyIDArray.push(lines[i].Company.Id);
                tempCompanyNameArray.push(lines[i].Company.Name);
                tempDtOriginBusstopArray.push(lines[i].DtOriginBusstop);
                tempDtDestinationBusstopArray.push(lines[i].DtDestinationBusstop);
                tempDistanceArray.push(lines[i].Distance);
                tempMakatOriginBusstopArray.push(lines[i].MakatOriginBusstop);
                tempMakatDestinationBusstopArray.push(lines[i].MakatDestinationBusstop);
                tempMazanDestinationArray.push(lines[i].MazanToYaad);
                tempPriceArray.push(lines[i].Price);
                tempMigunArray.push(lines[i].Migun);
                tempMilitaryAreaArray.push(lines[i].MilitaryArea);
                tempMakatArray.push(lines[i].Makat);
                tempOriginQuarterIdArray.push(lines[i].OriginQuarterId);
                tempDestinationQuarterIdArray.push(lines[i].DestinationQuarterId);
                tempPlatformArray.push(lines[i].PlatformNumber);
                tempShilutArray.push(lines[i].Shilut);
            }

            for (var i = 0 ; i < 3 - lines.length ; i++) {
                tempCompanyIDArray.push(null);
                tempCompanyNameArray.push(null);
                tempDtOriginBusstopArray.push(null);
                tempDtDestinationBusstopArray.push(null);
                tempDistanceArray.push(null);
                tempMakatOriginBusstopArray.push(null);
                tempMakatDestinationBusstopArray.push(null);
                tempMazanDestinationArray.push(null);
                tempPriceArray.push(null);
                tempMigunArray.push(null);
                tempMilitaryAreaArray.push(null);
                tempMakatArray.push(null);
                tempOriginQuarterIdArray.push(null);
                tempDestinationQuarterIdArray.push(null);
                tempPlatformArray.push(null);
                tempShilutArray.push(null);
            }

            var specialPriceIndex = 0;
            if ($rootScope.search.selectedPathPlan != null)
                specialPriceIndex = $rootScope.search.selectedPathPlan.SpecialPriceIndex;

            var queryObject = {
                companyIDArray: tempCompanyIDArray,
                companyNameArray: tempCompanyNameArray,
                dtOriginBusstopArray: tempDtOriginBusstopArray,
                dtDestinationBusstopArray: tempDtDestinationBusstopArray,
                distanceArray: tempDistanceArray,
                makatOriginBusstopArray: tempMakatOriginBusstopArray,
                makatDestinationBusstopArray: tempMakatDestinationBusstopArray,
                mazanDestinationArray: tempMazanDestinationArray,
                priceArray: tempPriceArray,
                migunArray: tempMigunArray,
                militaryAreaArray: tempMilitaryAreaArray,
                makatArray: tempMakatArray,
                originQuarterIdArray: tempOriginQuarterIdArray,
                destinationQuarterIdArray: tempDestinationQuarterIdArray,
                platformArray: tempPlatformArray,
                shilutArray: tempShilutArray,
                dtValidity: $rootScope.search.currentDate.NAME.split('-')[0].trim(),
                specialPrice: specialPriceIndex,
                isEggedDb: $rootScope.search.language,
                language: $rootScope.search.isEggedDb,
            };

            transitionService.getTripLogDetails(
                $rootScope.search.getTripJsonString(queryObject),
                function (getTripLogDetailsVal) {

                    var DetailList = getTripLogDetailsVal;
                    for (var i = 0; i < lines.length; i++) {

                        var waitTime = 0;
                        if (i + 1 < lines.length)
                            waitTime = DetailList[i + 1].BusstopWaitTime;
                        if (waitTime < 0)
                            waitTime = 1440 + waitTime;
                        var x = {
                            Id: i + 1,
                            OriginTime: lines[i].OriginTime,
                            LineNumber: lines[i].Shilut,
                            PlatformNumber: lines[i].PlatformNumber,
                            BoardingTime: lines[i].TimeOriginBusstop,
                            MazanToMoza: lines[i].MazanToMoza,
                            BoardingBusStop: DetailList[i].BusstopOriginName,
                            AlightTime: lines[i].TimeDestinationBusstop,
                            AlightBusStop: DetailList[i].BusstopDestinationName,
                            Price: lines[i].Price,
                            Makat: lines[i].Makat,
                            TravelTime: globalFunctions.convertMinutesTohours(lines[i].MazanToYaad),
                            WaitingTime: globalFunctions.convertMinutesTohours(waitTime),
                            CompanyHebrewName: lines[i].CompanyHebrewName,
                            CompanyEnglishName: lines[i].CompanyEnglishName,
                            Company: lines[i].Company,
                            IsShowAfterMidnightImg: lines[i].isShowAftermidnightImg
                        };

                        $rootScope.segmentList[i] = x;

                    }

                    vm.totalPrice = DetailList[0].Price;

                    if ($rootScope.search.selectedPathPlan && $rootScope.search.selectedPathPlan.SpecialPriceIndex != 0) {
                        if ($rootScope.search.selectedPathPlan.SpecialPriceIndex == 2 || $rootScope.search.selectedPathPlan.SpecialPriceIndex == 3)
                            vm.isShowPassageCardRemark = true;
                        if ($rootScope.search.selectedPathPlan.SpecialPriceIndex == 1)
                            vm.isShowContinuationCardRemark = true;
                        //vm.totalPrice = $rootScope.search.selectedPathPlan.SpecialPrice;
                    }

                    //for (var i = 0 ; i < lines.length ; i++) {
                    //    if (lines[i].Price == 0) {
                    //        vm.totalPrice = 0;
                    //        break;
                    //    }
                    //}

                    vm.totalWaitingTime = globalFunctions.convertMinutesTohours(DetailList[0].WaitTime);
                    vm.totalTravelTime = globalFunctions.convertMinutesTohours(DetailList[0].TravelTime);

                    vm.totalTime = globalFunctions.convertMinutesTohours(DetailList[0].MassTime);

                });


        function initMailContent() {
            var langDir = "rtl";
            if (localize.language == "he-IL")
                langDir = "rtl";
            else
                langDir = "ltr";
            var mailContainer = "";
            mailContainer += "<table style='direction: " + langDir + "; width: 100%; font-family: arial;'>";
            mailContainer += "<tr>";
            mailContainer += "<td>";
            mailContainer += localize.getLocalizedString("_Departure_");
            mailContainer += " : ";
            mailContainer += vm.departureTime;
            mailContainer += " ";
            mailContainer += localize.getLocalizedString("_ArrivalWithColon_");
            mailContainer += vm.ArrivalTime;
            mailContainer += " ";
            mailContainer += localize.getLocalizedString("_TotalTimeGross_");
            mailContainer += vm.totalTime;
            mailContainer += "</td>";
            mailContainer += "</tr>";

            /////////////////////////

            mailContainer += "<tr>";
            mailContainer += "<td>";
            mailContainer += "<table style='width: 100%; '>";
            mailContainer += "<tr style='color: #00715a; height: 24px; font-size: 11px; background-color:rgb(222, 240, 236);'>";
            mailContainer += "<td>";
            mailContainer += localize.getLocalizedString("_Section_");
            mailContainer += "</td>";
            mailContainer += "<td>";
            mailContainer += localize.getLocalizedString("_byline_");
            mailContainer += "</td>";
            mailContainer += "<td>";
            mailContainer += localize.getLocalizedString("_BoardingTime_");
            mailContainer += "</td>";
            mailContainer += "<td>";
            mailContainer += localize.getLocalizedString("_BoardingBusStop_");
            mailContainer += "</td>";
            mailContainer += "<td>";
            mailContainer += localize.getLocalizedString("_Company_");
            mailContainer += "</td>";
            mailContainer += "<td>";
            mailContainer += localize.getLocalizedString("_AlightTime_");
            mailContainer += "</td>";
            mailContainer += "<td>";
            mailContainer += localize.getLocalizedString("_AlightBusStop_");
            mailContainer += "</td>";
            mailContainer += "<td>";
            mailContainer += localize.getLocalizedString("_Price_");
            mailContainer += "</td>";
            mailContainer += "<td>";
            mailContainer += localize.getLocalizedString("_TravelTime_");
            mailContainer += "</td>";
            if ($rootScope.segmentList.length > 1) {
                mailContainer += "<td>";
                mailContainer += localize.getLocalizedString("_WaitDuration_");
                mailContainer += "</td>";
            }
            mailContainer += "</tr>";

            /////////////////////////

            for (var i = 0; i < $rootScope.segmentList.length; i++) {
                mailContainer += "<tr>";
                mailContainer += "<td>";
                mailContainer += (i + 1).toString();
                mailContainer += "</td>";
                mailContainer += "<td>";
                mailContainer += $rootScope.segmentList[i].LineNumber;
                mailContainer += "</td>";
                mailContainer += "<td>";
                mailContainer += $rootScope.segmentList[i].BoardingTime;
                mailContainer += "</td>";
                mailContainer += "<td>";
                mailContainer += $rootScope.segmentList[i].BoardingBusStop;
                mailContainer += "</td>";
                mailContainer += "<td>";
                mailContainer += $rootScope.segmentList[i].Company.Name;
                mailContainer += "</td>";
                mailContainer += "<td>";
                mailContainer += $rootScope.segmentList[i].AlightTime;
                mailContainer += "</td>";
                mailContainer += "<td>";
                mailContainer += $rootScope.segmentList[i].AlightBusStop;
                mailContainer += "</td>";
                mailContainer += "<td>";
                mailContainer += $rootScope.segmentList[i].Price;
                mailContainer += "</td>";
                mailContainer += "<td>";
                mailContainer += $rootScope.segmentList[i].TravelTime;
                mailContainer += "</td>";
                if ($rootScope.segmentList.length > 1) {
                    mailContainer += "<td>";
                    mailContainer += $rootScope.segmentList[i].WaitingTime;
                    mailContainer += "</td>";
                }
                mailContainer += "</tr>";
            }
            mailContainer += "</table>";
            mailContainer += "</td>";
            mailContainer += "</tr>";
            mailContainer += "<tr style='background-color: rgb(0, 173, 131); height: 35px; font-weight: bold; font-size: 12px; color: white;'>";
            mailContainer += "<td style='width: 100%; '>";
            mailContainer += localize.getLocalizedString("_TotalPrice_");
            mailContainer += " : ";
            mailContainer += vm.totalPrice + " ";
            mailContainer += localize.getLocalizedString("_TotalTravelTime_");
            mailContainer += " : ";
            mailContainer += vm.totalTravelTime;
            mailContainer += "</td>";
            mailContainer += "</tr>";
            mailContainer += "<tr>";
            mailContainer += "<td>";

            if (vm.isShowAftermidnightMessage == true) {
                var strAfterMidnight = localize.getLocalizedString("_AfterMidnight_");
                mailContainer += "<div>" + "º" + " " + strAfterMidnight + "</div>";     //☽ º ☾
            }
            if (vm.isShowEstimatedDepartureTimeRemark == true) {
                var strEstimatedDepartureTime = localize.getLocalizedString("_EstimatedDepartureTime_");
                mailContainer += "<div>" + "★" + " " + strEstimatedDepartureTime + "</div>";
            }
            if (vm.isShowPassageCardRemark == true) {
                var strPriceConditionedOnTransCard = localize.getLocalizedString("_PriceConditionedOnTransCard_");
                mailContainer += "<div>" + " " + "★★" + strPriceConditionedOnTransCard + "</div>";
            }
            if (vm.isShowContinuationCardRemark == true) {
                var strTotalPriceAfterDiscount = localize.getLocalizedString("_TotalPriceAfterDiscount_");
                var strConditionedOnPurchasingContCard = localize.getLocalizedString("_ConditionedOnPurchasingContCard_");
                mailContainer += "<div>" + "★" + " " + strTotalPriceAfterDiscount + " " + vm.totalPrice + " " + strConditionedOnPurchasingContCard + "</div>";
            }
            if (vm.isShowMigunRemark == true) {
                var strAfterShieldDiscount = localize.getLocalizedString("_AfterShieldDiscount_");
                mailContainer += "<div>" + "★" + " " + strAfterShieldDiscount + "</div>";
            }

            mailContainer += "</td>";
            mailContainer += "</tr>";
            mailContainer += "</table>";

            return mailContainer;

        }
        function printAndMailContect() {
            //$(".TableHeader").css("font-size", "18px")
            //                                         .css("border", "1px solid black")
            //                                         .css("padding", "2px")
            //                                         .css("font-weight", "bold")
            //                                         .css("text-align", "center");
            //$(".TableHeaders table tr td").css("font-size", "13.5px")
            //                                   .css("border", "1px solid black")
            //                                   .css("padding", "2px")
            //                                   .css("font-weight", "bold")
            //                                   .css("text-align", "center");
            //$(".detailsPrintableView table tr td").css("font-size", "13.5px")
            //                                        .css("border", "1px solid black")
            //                                        .css("padding", "2px")
            //                                        .css("font-weight", "bold")
            //                                        .css("text-align", "center");
            var printContent =
                 '<div class="container" style="width:1000px;">' +
                 '<img src="Content/images/headermenu/logo_egged.png" class="siteLogoImage" style="line-height: 185px; font-weight: bolder;" data-ng-class="{true: FloatRight, false: FloatLeft}[dir]"></div>' +
                 '<br /> ' +
                 '<div style="font-size:20px;">' + $rootScope.search.currentDate.NAME + '</div><br />' +
                 $(".detailsPrintableView").html();

            return printContent;
        }
        vm.print = function () {
            if (navigator.userAgent.indexOf('Firefox') != -1) alert("שים לב! תוכן רחב, מומלץ להדפיס לרוחב.");
            var printContent = printAndMailContect();
            globalFunctions.printHtml(printContent);
            //cleanPrintCss();

        }

        function getCleanText(rawText) {
            if (rawText != null && rawText.indexOf('<') > -1 && $(rawText).length > 0)
                rawText = $(rawText)[0].title;
            return rawText;
        }

        vm.getSearchResultsForString = function () {

            var mailEnvelope = "";
            mailEnvelope += localize.getLocalizedString("_SearchResultsFor_");
            mailEnvelope += " ";
            mailEnvelope += localize.getLocalizedString("_From_");
            mailEnvelope += " ";
            mailEnvelope += getCleanText($rootScope.search.fromAddress.City.NAME);
            mailEnvelope += " ";
            mailEnvelope += getCleanText($rootScope.search.fromAddress.Quarter.NAME);
            mailEnvelope += " ";
            mailEnvelope += localize.getLocalizedString("_To_");
            mailEnvelope += " ";
            mailEnvelope += getCleanText($rootScope.search.toAddress.City.NAME);
            mailEnvelope += " ";
            mailEnvelope += getCleanText($rootScope.search.toAddress.Quarter.NAME);
            mailEnvelope += " ";
            mailEnvelope += localize.getLocalizedString("_OnDate_");
            mailEnvelope += " ";
            mailEnvelope += $rootScope.search.currentDate.NAME;
            mailEnvelope += " ";
            mailEnvelope += $rootScope.search.currentTime.NAME;
            return mailEnvelope;
        }

        vm.sendMail = function () {
            var strPleaseProvideMailAddress = localize.getLocalizedString("_PleaseProvideMailAddress_");
            var address = "";
            if ($rootScope.userDetails != null && $rootScope.userDetails.emailAddress != null)
                address = $rootScope.userDetails.emailAddress;
            var destinationMailAddress = prompt(strPleaseProvideMailAddress, address);
            if (destinationMailAddress == null) return;
            if (destinationMailAddress.indexOf('@') > -1) {


                $rootScope.userDetails.emailAddress = destinationMailAddress
                if ($rootScope.isStorageActive)
                    localStorage.setItem("emailAddress", $rootScope.userDetails.emailAddress);
                var strEggedSite = localize.getLocalizedString("_Title_");
                var strWeeklySchedule = localize.getLocalizedString("_WeeklySchedule_");
                var bodyContent = initMailContent();

                var printObject =
                  {
                      ToAddress: destinationMailAddress
                      , ToName: ""
                      , Subject: strEggedSite //+ " - " + strWeeklySchedule //+ " - " + weeklyReportData.Shilut + "מ:" + weeklyReportData.DestinationName + " ל:" + weeklyReportData.OriginName
                      , Body: bodyContent
                  };
                var jsonString = JSON.stringify(printObject);
                transitionService.sendMail(jsonString,
                    function (data) {
                        $rootScope.search.userMessageTitle = "_SendByEmail_";
                        $rootScope.search.userMessage = "_MessageSuccessfullySent_";
                    },
                    function (result) {
                        $rootScope.search.userMessageTitle = "_SendByEmail_";
                        $rootScope.search.userMessage = "_MessageSendFailed_";
                    });

            }
            else {
                $rootScope.search.userMessageTitle = "_SendByEmail_";
                $rootScope.search.userMessage = "_IlegalMailAddress_";
            }
        }

        }, true);

    });

