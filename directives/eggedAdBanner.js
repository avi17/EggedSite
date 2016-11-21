mslApp.directive('eggedAdBanner', function ($rootScope, localize) {
    return {
        templateUrl: '/app/views/directive/eggedAdBanner.htm',
        replace: true,
        link: function (scope, element, attrs) {
           
            scope.isRavKavBannerVisible = false;

            setInterval(function () {
                if ($(".eggedBunner").css("display") == "none")
                {
                    $(".eggedBunner").show();
                    $(".ravKavBunner").hide();
                }
                else {
                    $(".eggedBunner").hide();   
                    $(".ravKavBunner").show();
                }
            }, appConfig.bunnerSwitchInterval);

            $rootScope.$watch("search.toAddress.City", function (newValue, oldValue) {        
                if (localize.language == "he-IL")
                    scope.EggedHesseimBanner = { image: "Content/images/Banners/EggedToursBannerHeb.jpg", link: "http://hotels.eggedtours.co.il/" };
                else
                    scope.EggedHesseimBanner = { image: "Content/images/Banners/EggedToursBannerEng.jpg", link: "http://www.eggedtours.com/" };

                if (newValue == null || newValue.ID == 0 || newValue.ID == null) {
                    $(".eggedBunner").attr("href", scope.EggedHesseimBanner.link);
                    $(".eggedBunnerChild").attr("src", scope.EggedHesseimBanner.image);
                    return;

                }
                if (newValue.ID.indexOf('-') > 0)
                    selectEggedHesseimBanner(newValue.ID.split('-')[0]);


                $(".eggedBunner").attr("href", scope.EggedHesseimBanner.link);
                $(".eggedBunnerChild").attr("src", scope.EggedHesseimBanner.image);
               
            });

            function selectEggedHesseimBanner(cityId) {               
                if (localize.language != "he-IL") return;

                switch (cityId) {
                    case '2600':
                        scope.EggedHesseimBanner = { image: "Content/images/Banners/Eilat.jpg", link: "http://www.eggedtours.co.il/israel/eilat_deals.html" };
                        break;
                    case '7019':
                        scope.EggedHesseimBanner = { image: "Content/images/Banners/DeadSea.jpg", link: "http://www.eggedtours.co.il/israel/dead_sea_deals.html" };
                        break;
                    case '2800':
                        scope.EggedHesseimBanner = { image: "Content/images/Banners/KiryatShmona.jpg", link: "http://www.eggedtours.co.il/israel/north_deals.html" };
                        break;
                    case '3000':
                        scope.EggedHesseimBanner = { image: "Content/images/Banners/Jerusalem.jpg", link: "http://www.eggedtours.co.il/israel/jerusalem_ashdod_ashkelon.html" };
                        break;
                    case '5000':
                        scope.EggedHesseimBanner = { image: "Content/images/Banners/TelAviv.jpg", link: "http://www.eggedtours.co.il/israel/tel_aviv_herzliya_netanya_bat_yam.html" };
                        break;
                    case '4000':
                        scope.EggedHesseimBanner = { image: "Content/images/Banners/Haifa.jpg", link: "http://www.eggedtours.co.il/israel/north_deals.html" };
                        break;
                    case '7600':
                        scope.EggedHesseimBanner = { image: "Content/images/Banners/Naharya.jpg", link: "http://www.eggedtours.co.il/israel/north_deals.html" };
                        break;
                    case '9100':
                        scope.EggedHesseimBanner = { image: "Content/images/Banners/Naharya.jpg", link: "http://www.eggedtours.co.il/israel/north_deals.html" };
                        break;
                    case '7100':
                        scope.EggedHesseimBanner = { image: "Content/images/Banners/AshkelonAshdod.jpg", link: "http://www.eggedtours.co.il/israel/jerusalem_ashdod_ashkelon.html" };
                        break;
                    case '70':
                        scope.EggedHesseimBanner = { image: "Content/images/Banners/AshkelonAshdod.jpg", link: "http://www.eggedtours.co.il/israel/jerusalem_ashdod_ashkelon.html" };
                        break;
                }
            }

        }
    };
});


