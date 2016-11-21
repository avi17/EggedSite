"use strict";

mslApp.controller("AppCtrl",
    function ($rootScope, $scope, $stateParams, $timeout, $location, localize, searchService, $window) {


        $rootScope.airlineDependent =
            {
                makatFrom: 122822,
                makatTo: 122821,
                hebrewLegendMessageFrom: "<div>שינוי בשעות נחיתת המטוס, יביא לשינוי במועד  יציאת האוטובוס. <a target='_blank' href='http://www.egged.co.il/מאמר-4917-קו-חדש-קו--משדה-התעופה-עובדה.aspx?nc=1'>לפרטים נוספים</a></div>",
                hebrewLegendMessageTo: "<div>שינוי שעת המראת המטוס, יביא לשינוי במועד יציאת האוטובוס מתחנת המוצא ותחנות הביניים. <a target='_blank' href='http://www.egged.co.il/מאמר-4917-קו-חדש-קו--משדה-התעופה-עובדה.aspx?nc=1'>לפרטים נוספים</a></div>",
                englishLegendMessageFrom: "<div>Changes in the airplane landing times will bring about corresponding changes in the bus departure times. <a target='_blank' href='http://www.egged.co.il/Article-4917-Transfer-Ovda-Eilat.aspx#1'>For detailed information</a></div>",
                englishLegendMessageTo: "<div>Changes in the airplane departure times will bring about corresponding changes in the bus departure times from the bus terminal and intermediate stops. <a target='_blank' href='http://www.egged.co.il/Article-4917-Transfer-Ovda-Eilat.aspx#1'>For detailed information</a></div>"
            };

        $rootScope.versionNumber = appConfig.versionNumber;
        $rootScope.search = new search();
        $rootScope.isBusGovIl = isBusGovIl;

        $rootScope.search.searchService = searchService;
        $rootScope.search.isEggedDb = appConfig.isEggedDb;

        if ($rootScope.search.isEggedDb == true) {
            $rootScope.currentCssFilename = "egged";
            $rootScope.isBezeqOnline = false;
        }
        else {
            $rootScope.currentCssFilename = "mot";
            $rootScope.isBezeqOnline = true;
        }

        $rootScope.currentVersion = "300616-1";

        var link = document.createElement("link");
        link.href = 'app/css/' + $rootScope.currentCssFilename + '.css?' + $rootScope.currentVersion;
        link.type = "text/css";
        link.rel = "stylesheet";
        link.media = "screen,print";
        document.getElementsByTagName("head")[0].appendChild(link);

        if ($rootScope.isBusGovIl) {
            var link2 = document.createElement("link");
            link2.href = 'app/css/bus.css?' + $rootScope.currentVersion;
            link2.type = "text/css";
            link2.rel = "stylesheet";
            link2.media = "screen,print";
            document.getElementsByTagName("head")[0].appendChild(link2);
        }

        $rootScope.dir = "true";

        //$timeout(function () {
        var queriedLanguage = getParameterByName('language');
        $rootScope.search.language = queriedLanguage || "he";
        switch ($rootScope.search.language) {
            case "he":
                localize.setLanguage('he-IL');
                $rootScope.dir = "true";
                //setTimeout(function () { 
                $("html")[0].setAttribute("lang", "he");
                document.title = "אגד - מידע לנוסע";
                if ($rootScope.isMobileBrowser == true)
                    $(".ToggleMapIconWrapper").css("left", "0px");
                //}, 500);
                break;
            case "en":
                localize.setLanguage('en-US');
                $rootScope.dir = "false";
                //setTimeout(function () { 
                $("html")[0].setAttribute("lang", "en");
                document.title = "Egged - Passenger Information";
                if ($rootScope.isMobileBrowser == true)
                    $(".ToggleMapIconWrapper").css("right", "0px");
                //}, 500);
                break;
        }
        //}, 50);

        $rootScope.isMapViewed = false;
        $rootScope.isShowFilter = true;
        $rootScope.accessibilitySite = false;

        $rootScope.accessibilitySiteEvent = function () {
            $rootScope.accessibilitySite = !$rootScope.accessibilitySite;
            if ($rootScope.accessibilitySite == true) {
                location.href = "#/freetext/1/0/";
                $timeout(function () {
                    $("#realtimeAddressText").focus();
                }, 200);
                $rootScope.currentTabName = 3;
            }
            else {
                location.href = "#/origindestination/1/0/";
                $rootScope.currentTabName = 1;
            }
        }

        $scope.pathplan = new Object;
        setTimeout(function () {
            $rootScope.pageTitle = localize.getLocalizedString("_Title_");
            $rootScope.i18nMoveToAccessibilitySite = localize.getLocalizedString("_moveToAccessibilitySite_");
            $rootScope.i18nCloseAccessibilitySite = localize.getLocalizedString("_closeAccessibilitySite_");
            $rootScope.i18nSkipToSearchArea = localize.getLocalizedString("_skipToSearchArea_");
            $rootScope.i18nSkipToResultArea = localize.getLocalizedString("_skipToResultArea_");
            $rootScope.i18nSkipToMainMenu = localize.getLocalizedString("_SkipToMainMenu_");
            $rootScope.i18nSkipToFooter = localize.getLocalizedString("_SkipToFooter_");
            $scope.i18nEggedSite = localize.getLocalizedString("_EggedSite_");
            $scope.i18nEggedSiteUrl = localize.getLocalizedString("_EggedSiteUrl_");
            $scope.i18nTitle = localize.getLocalizedString("_Title_");
            $scope.i18nSiteMessages = localize.getLocalizedString("_SiteMessages_");
            $scope.i18nPrevSiteUrl = localize.getLocalizedString("_PrevSiteUrl_");
            $scope.i18nToPrevSite = localize.getLocalizedString("_ToPrevSite_");
            $scope.i18nToSearchPage = localize.getLocalizedString("_ToSearchPage_");
            $scope.i18nLinesBetweenCities = localize.getLocalizedString("_LinesBetweenCities_");
            $scope.i18nDirectLines = localize.getLocalizedString("_DirectLines_");
            $scope.i18nFaq = localize.getLocalizedString("_FAQ_");
            $scope.i18nContactUs = localize.getLocalizedString("_ContactUs_");
            $scope.i18nContactUsUrl = localize.getLocalizedString("_ContactUsUrl_");
            $scope.i18nShowMenu = localize.getLocalizedString("_ShowMenu_");
            $scope.i18nHideMenu = localize.getLocalizedString("_HideMenu_");
            $scope.i18nCustomerService = localize.getLocalizedString("_CustomerService_");
            $scope.i18nDownLoadApp = localize.getLocalizedString("_DownLoadApp_");
            $scope.i18nEggedToursBannerTitle = localize.getLocalizedString("_EggedToursBannerTitle_");
            $scope.i18nFeedbackSiteUrl = localize.getLocalizedString("_FeedbackSiteUrl_");
            $scope.i18nFeedback = localize.getLocalizedString("_Feedback_");
            $scope.i18nSubsidisedTicketsUrl = localize.getLocalizedString("_SubsidisedTicketsUrl_");
            $scope.i18nSubsidisedTickets = localize.getLocalizedString("_SubsidisedTickets_");
            $scope.i18nGoogleConnectionOff = localize.getLocalizedString("_GoogleConnectionOff_");
            $scope.i18nDbConnectionOff = localize.getLocalizedString("_DbConnectionOff_");
            $scope.i18nHideMap = localize.getLocalizedString("_HideMap_");
            $scope.i18nEggedFacebookLogoLink = localize.getLocalizedString("_EggedFacebookLogoLink_");

        }, 1000);
        $rootScope.busstopList = [];



        var currentLocation = { coords: null, description: "" };
        if (Object.getOwnPropertyDescriptor($rootScope, 'currentLocation') == null) {
            Object.defineProperty($rootScope, 'currentLocation',
            {
                get: function () {
                    //if (currentLocation == null) {
                    //    globalFunctions.getCurrentPosition(
                    //        function (position) {
                    //            currentLocation = { coords: { latitude: position.coords.latitude, longitude: position.coords.longitude }, description: "" };
                    //        });
                    //}
                    return currentLocation;
                },
                set: function (value) {
                    currentLocation = value;
                }
            });
        }

        var isMobileBrowser = null;
        if (Object.getOwnPropertyDescriptor($rootScope, 'isMobileBrowser') == null) {
            Object.defineProperty($rootScope, 'isMobileBrowser',
            {
                get: function () {
                    if (isMobileBrowser == null) {
                        (function (a) {
                            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
                                isMobileBrowser = true;
                                $rootScope.isMobileBrowser1 = true;
                            }
                            else {
                                isMobileBrowser = false;
                                $rootScope.isMobileBrowser1 = false;
                            }
                        })(navigator.userAgent || navigator.vendor || window.opera);
                    }
                    return isMobileBrowser;
                },
                set: function (value) {
                    //isMobileBrowser = value;
                }
            });
        }

        var isBrowserSafari = null;
        if (Object.getOwnPropertyDescriptor($rootScope, 'isBrowserSafari') == null) {
            Object.defineProperty($rootScope, 'isBrowserSafari',
            {
                get: function () {
                    if (isBrowserSafari == null) {
                        (function (a) {
                            if (navigator.userAgent.search("Safari") > -1 && navigator.userAgent.search("Chrome") == -1) {
                                isBrowserSafari = true;
                            }
                            else {
                                isBrowserSafari = false;
                            }
                        })(navigator.userAgent || navigator.vendor || window.opera);
                    }
                    return isBrowserSafari;
                },
                set: function (value) {
                    //isMobileBrowser = value;
                }
            });
        }

        var isBrowserFirefox = null;
        if (Object.getOwnPropertyDescriptor($rootScope, 'isBrowserFirefox') == null) {
            Object.defineProperty($rootScope, 'isBrowserFirefox',
            {
                get: function () {
                    if (isBrowserFirefox == null) {
                        (function (a) {
                            if (navigator.userAgent.search('Firefox') > -1) {
                                isBrowserFirefox = true;
                            }
                            else {
                                isBrowserFirefox = false;
                            }
                        })(navigator.userAgent || navigator.vendor || window.opera);
                    }
                    return isBrowserFirefox;
                },
                set: function (value) {
                    //isMobileBrowser = value;
                }
            });
        }

        var isTileBrowser = null;
        if (Object.getOwnPropertyDescriptor($rootScope, 'isTileBrowser') == null) {
            Object.defineProperty($rootScope, 'isTileBrowser',
            {
                get: function () {
                    if (isTileBrowser == null) {
                        (function (a) {
                            if (navigator.userAgent.indexOf('InfoPath') != -1) {
                                isTileBrowser = false;
                            }
                            else {
                                isTileBrowser = false;
                            }
                        })(navigator.userAgent || navigator.vendor || window.opera);
                    }
                    return isTileBrowser;
                },
                set: function (value) {
                    //isMobileBrowser = value;
                }
            });
        }

        //function initSiteRefresh() {
        //    $scope.inactivityTimeout = null;
        //    resetTimeout();

        //    function resetTimeout() {
        //        clearTimeout($scope.
        //            inactivityTimeout);
        //        $scope.inactivityTimeout = setTimeout(function () {
        //            location.reload();
        //        }, 1000 * 3600);
        //    }
        //    $("body").
        //    mousemove(function () {
        //        resetTimeout();
        //    }).
        //    mousedown(function () {
        //        resetTimeout();
        //    }).
        //    bind('mousewheel', function () {
        //        resetTimeout();
        //    }).
        //    keydown(function () {
        //        resetTimeout();
        //    });

        //}
        //initSiteRefresh();

        $rootScope.showPublicTransport = function () { };
        $rootScope.selectedLineIndex = -1;

        var isStorageActive = null;
        if (Object.getOwnPropertyDescriptor($rootScope, 'isStorageActive') == null) {
            Object.defineProperty($rootScope, 'isStorageActive',
            {
                get: function () {
                    if (isStorageActive == null) {
                        try {
                            localStorage.setItem("text", "text");
                            localStorage.removeItem("text");
                            isStorageActive = true;
                        } catch (exception) {
                            isStorageActive = false;
                        }
                    }
                    return isStorageActive;
                },
                set: function (value) {
                    //isStorageActive = value;
                }
            });
        }

        function initUserDetails() {

            if (!$rootScope.isStorageActive) return;

            var firstName = "";
            var lastName = "";
            var emailAddress = "";

            firstName = localStorage.getItem("firstName");
            lastName = localStorage.getItem("lastname");
            emailAddress = localStorage.getItem("emailAddress");

            $rootScope.userDetails =
                {
                    firstName: firstName
                    , lastName: lastName
                    , emailAddress: emailAddress
                    , currentLocation: ''
                }

        }

        function checkVersion() {

            if (!$rootScope.isStorageActive) return;

            var currentVersion = "";
            currentVersion = localStorage.getItem("currentVersion");
            if (currentVersion != $rootScope.currentVersion) {
                //window.applicationCache.swapCache();
                //if (confirm('A new version of this site is available. Load it?')) {
                localStorage.setItem("currentVersion", $rootScope.currentVersion);
                if (currentVersion != null)
                    window.location.reload();
                //}
            }
        }

        // --- Initialize. ---------------------------------- //

        function init() {
            $rootScope.isGoogleReachable = false;
            $rootScope.isDbReachable = true;
            $rootScope.dbReachableExp = "dbIsNotReachable";

            searchService.getDataFromServer("getDateList",
                [$rootScope.search.language, $rootScope.search.isEggedDb],
                function (daysList) {
                    if (daysList != null && daysList.length > 0) {
                        $rootScope.isDbReachable = true;
                        $rootScope.dbReachableExp = "";
                    }
                    else {
                        $rootScope.isDbReachable = false;
                        $rootScope.dbReachableExp = "dbIsNotReachable";
                    }
                }, function (daysList) {
                    $rootScope.isDbReachable = false;
                    $rootScope.dbReachableExp = "dbIsNotReachable";
                });

            setTimeout(function () {
                $("body").show();
            }, 100);

            //setTimeout(function () {
            //    $(".LanguageSelectorItem:visible").focus();
            //}, 1000);

            $scope.resetByLineSubView = true;
            $scope.href = "";
            $scope.fontsize = 0;


            //$scope.$apply();

            //$scope.stylesheets = [{ href: 'app/css/bootstrap-rtl.css', type: 'text/css' }];

            //$rootScope.initSiteTracking();


            initUserDetails();
            checkVersion();

            //initActiveBanner();
        }

        if ($rootScope.isGoogleReachable != true)
            init();

        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        Array.prototype.indexOfId = function (id, prop) {
            if (prop == "FirstConnectionId") {
                for (var i = 0; i < this.length; i++)
                    if (this[i].Transitions[0].ConnectionPointId === id)
                        return this[i].Transitions[0].ConnectionPointDescription;
                return -1;
            }
            else {
                for (var i = 0; i < this.length; i++)
                    if (this[i].Transitions[1].ConnectionPointId === id)
                        return this[i].Transitions[1].ConnectionPointDescription;
                return -1;
            }
        }

        setTimeout(function () {
            if ($rootScope.isBezeqOnline == true) { }
            else {
                if ($scope.emergencyMessageViewed != null && $scope.emergencyMessageViewed == true) return;
                $scope.emergencyMessageViewed = true;
                //    if (localStorage.getItem("EmergencyMessageId") != null) {
                //    if (localStorage.getItem("EmergencyMessageId").split("-")[1]== "0")
                //        return;
                //}
                if (typeof (Storage) != null) {
                    if (localStorage != null) $scope.showSiteMessages("EmergencyMessage");
                }
            }
        }, 200);

        $scope.showSiteMessages = function (e) {
            var EmergencyMessageId = "";
            var msgEmergency = "";
            searchService.getEmergencyMessageData($rootScope.search.language, $rootScope.search.isEggedDb,
                function (msgEmergency) {
                    if (localStorage.getItem("EmergencyMessageId") != null)
                        EmergencyMessageId = localStorage.getItem("EmergencyMessageId");

                    if (msgEmergency == null || msgEmergency == "") return;

                    msgEmergency = msgEmergency.split('$splitter$');
                    if (msgEmergency[0] == 281215 && e == "EmergencyMessage") {
                        if (EmergencyMessageId != null)
                            localStorage.removeItem('EmergencyMessageId');
                        return;
                    }
                    var strSiteMessages = localize.getLocalizedString("_SiteMessages_");
                    var strDontShowThisMessage = localize.getLocalizedString("_DontShowThisMessage_");
                    var msgEmergencyLanguages = msgEmergency[1].split("<splitter/>");
                    var msg = "";
                    if (localize.language == "he-IL") msg = msgEmergencyLanguages[0];
                    else msg = msgEmergencyLanguages[1];

                    var strSiteMessages = localize.getLocalizedString("_SiteMessages_");

                    if (e == "EmergencyMessage") {
                        if (!$rootScope.isStorageActive) return;
                        if (EmergencyMessageId != null && EmergencyMessageId.split('-')[0] == msgEmergency[0] && EmergencyMessageId.indexOf('-') > -1) return;
                        EmergencyMessageId = msgEmergency[0];
                        if (typeof (Storage) != null) {
                            if (localStorage != null) {
                                localStorage.setItem("EmergencyMessageId", EmergencyMessageId);
                            }
                        }
                        if ($("#isShowEmergencyMessage")[0] != null) {
                            $("#isShowEmergencyMessage").dialog('open');
                            return;
                        }
                        $("<div title='" + strSiteMessages + "'>" + msg + "<br/>" + "<div><input id='isShowEmergencyMessage' type='checkbox' class='btnCheckbox'><label for='isShowEmergencyMessage'>" + strDontShowThisMessage + "</label></div>" + "</div>").dialog({

                            autoResize: true,
                            resizable: false,
                            modal: true,
                            width: 'auto',
                            height: 'auto',
                            open: function (event, ui) {
                                $('.ui-widget-overlay').bind('click', function () {
                                    $(event.target).dialog('close');
                                });

                                var btnCancel = "Close";
                                if (localize.language == "he-IL")
                                    btnCancel = "סגור";
                                $($(event.target).prev().find(".ui-dialog-titlebar-close")[0]).attr("title", btnCancel);
                            },
                            close: function (event, ui) {
                                //$(this).close();
                                $(".headerAnchor")[0].focus();
                            }
                        })
                    .bind('dialogclose', function (event) {

                    });
                        $("#isShowEmergencyMessage").change(function (e) {

                            if (!$rootScope.isStorageActive) return;

                            if (this.checked == true)
                                localStorage.setItem("EmergencyMessageId", EmergencyMessageId + "-0");
                            else {
                                var emId = localStorage.getItem("EmergencyMessageId");
                                emId = emId.split('-')[0];
                                localStorage.setItem("EmergencyMessageId", emId);
                            }
                        });
                    }
                    else {
                        if ($("#isShowMessage")[0] != null) {
                            $("#isShowMessage").dialog('open');
                            return;
                        }
                        $("<div title='" + strSiteMessages + "' id='isShowMessage'>" + msg + "</div>").dialog({
                            autoResize: true,
                            resizable: false,
                            modal: true,
                            width: 'auto',
                            height: 'auto',
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

                                var btnCancel = "Close";
                                if (localize.language == "he-IL")
                                    btnCancel = "סגור";
                                $($(event.target).prev().find(".ui-dialog-titlebar-close")[0]).attr("title", btnCancel);

                                //$('.ui-widget-overlay').bind('keyup', function (event, ui) {
                                //    $(event.target).dialog('close');
                                //    $(".headerAnchor")[0].focus();
                                //});
                            }
                        , close: function (event, ui) {
                            setTimeout(function () {
                                //$(this).close();
                                //$(".headerAnchor")[0].focus();
                            }, 500);
                        }

                        });
                    }
                });

        }

        $scope.linesBetweenCitiesMenuItemClicked = function () {

            var strSiteMessages = localize.getLocalizedString("_SiteMessages_");
            var contentString = localize.getLocalizedString("_MenuItemHelpLinesBetweenSettlements_");

            var directlinesDialog = $("<div class='directlinesDialog' title='" + strSiteMessages + "'><span>" + contentString + "</span></div>");

            var clickToNav = "";
            if (localize.language == "he-IL")
                clickToNav = "לחץ כאן";
            else
                clickToNav = "Press here";

            $("<a href='#/origindestination/1/0/true/'>" + clickToNav + "</a>").
                appendTo(directlinesDialog);

            $(directlinesDialog).dialog({
                width: '80%',
                resizable: false,
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

                    var btnCancel = "Close";
                    if (localize.language == "he-IL")
                        btnCancel = "סגור";
                    $($(event.target).prev().find(".ui-dialog-titlebar-close")[0]).attr("title", btnCancel);

                }
            , close: function (event, ui) {
            }

            });

        }

        $scope.isMainMenuStripVisible = false;

        $scope.toggleMainMenuStrip = function (e) {
            if ($(".mainMenuStrip").css("display") == "none") {
                $scope.isMainMenuStripVisible = true;
                $(".mainMenuStrip").show();
            }
            else {
                $scope.isMainMenuStripVisible = false;
                $(".mainMenuStrip").hide();
            }
        }

        $rootScope.toggleMap = function (isMapView) {
            $rootScope.isMapSearch = false;
            if (isMapView)
                $rootScope.isMapViewed = true;
            else
                $rootScope.isMapViewed = false;
        }

        var stoppedTyping;
        $rootScope.BalClear = function () {

            if (stoppedTyping) clearTimeout(stoppedTyping);
            //setTimeout(function () {
            $location.path("/origindestination/1/1");
            setTimeout(function () {
                $window.location.reload();
            }, 1000);
            //}, 0);

            //if ($location.$$path.indexOf("origindestination") > -1)
            //    $location.path("/origindestination/1/1");
            //if ($location.$$path.indexOf("linenumber") > -1)
            //    $location.path("/linenumber/1/1");
            //if ($location.$$path.indexOf("realtime") > -1)
            //    $location.path("/realtime/1/1");
            //if ($location.$$path.indexOf("freetext") > -1)
            //    $location.path("/freetext/1/1");
        }

        $rootScope.initIsraelBounds = function () {

            //if ($rootScope.isGoogleReachable == false) return;

            var retVal = new google.maps.LatLngBounds();

            retVal.extend(new google.maps.LatLng(33.481723, 35.901578));
            retVal.extend(new google.maps.LatLng(32.973409, 35.954667));
            retVal.extend(new google.maps.LatLng(32.613885, 35.610435));
            retVal.extend(new google.maps.LatLng(31.757829, 35.581768));
            retVal.extend(new google.maps.LatLng(30.880008, 35.417917));
            retVal.extend(new google.maps.LatLng(29.542605, 34.996660));
            retVal.extend(new google.maps.LatLng(29.479151, 34.863279));
            retVal.extend(new google.maps.LatLng(31.323552, 34.160687));
            retVal.extend(new google.maps.LatLng(33.116266, 35.087264));

            return retVal;
        }

        function loadParametersFromLocalStorage() {

            var fromCityId;
            var fromQuarterId;
            var toCityId;
            var toQuarterId;
            var lineNumberId;
            if ($location.$$path.indexOf("origindestination") > -1) {
                if ($rootScope.search.language == "he") {
                    fromCityId = localStorage.getItem('hebydestFromCityId');
                    fromQuarterId = localStorage.getItem('hebydestFromQuarterId');
                    toCityId = localStorage.getItem('hebydestToCityId');
                    toQuarterId = localStorage.getItem('hebydestToQuarterId');
                }
                else {
                    fromCityId = localStorage.getItem('enbydestFromCityId');
                    fromQuarterId = localStorage.getItem('enbydestFromQuarterId');
                    toCityId = localStorage.getItem('enbydestToCityId');
                    toQuarterId = localStorage.getItem('enbydestToQuarterId');
                }
                if (fromCityId && fromQuarterId && toCityId && toQuarterId)
                    location.href = "#/origindestination/1/0/false/" +
                        fromCityId + "/" +
                        fromQuarterId + "/" +
                        toCityId + "/" +
                        toQuarterId;

            }

            if ($location.$$path.indexOf("linenumber") > -1) {

                if ($rootScope.search.language == "he") {
                    fromCityId = localStorage.getItem('hebylineFromCityId');
                    lineNumberId = localStorage.getItem('hebylineLineNumberId');
                    fromQuarterId = localStorage.getItem('hebylineFromQuarterId');
                    toCityId = localStorage.getItem('hebylineToCityId');
                    toQuarterId = localStorage.getItem('hebylineToQuarterId');
                }
                else {
                    fromCityId = localStorage.getItem('enbylineFromCityId');
                    lineNumberId = localStorage.getItem('enbylineLineNumberId');
                    fromQuarterId = localStorage.getItem('enbylineFromQuarterId');
                    toCityId = localStorage.getItem('enbylineToCityId');
                    toQuarterId = localStorage.getItem('enbylineToQuarterId');
                }
                if (fromCityId && fromQuarterId && toCityId && toQuarterId && lineNumberId)
                    location.href = "#/linenumber/1/0/" +
                        fromCityId + "/" +
                        fromQuarterId + "/" +
                        toCityId + "/" +
                        toQuarterId + "/" +
                        lineNumberId;

            }

            if ($location.$$path.indexOf("freetext") > -1) {
                var freelang = localStorage.getItem('freelang');
                if (freelang)
                    location.href = "#/freetext/1/0/" + freelang;
            }

            if ($location.$$path.indexOf("realtime") > -1) {
                var typeIndex = localStorage.getItem('realtimeTypeIndex');
                var dataString = localStorage.getItem('realtimeDataString');

                if (typeIndex && dataString)
                    location.href = "#/realtime/1/0/" + typeIndex + "/" + dataString;
            }

        }

        setTimeout(function () {
            if ($rootScope.isBezeqOnline != true && $rootScope.isStorageActive == true)
                loadParametersFromLocalStorage();
        }, 500);

        $rootScope.SkipToMainMenu = function () {
            $("#navItemToSearchPage").focus();
            //$($(".searchSubView")[0]).focus();
        }

        $rootScope.SkipToSearchArea = function () {
            if ($rootScope.accessibilitySite != true) $($(".FromToTabIcon")[0]).closest("a").focus();
           else $("#realtimeAddressText").focus();
       
            //$($(".searchSubView")[0]).focus();
        }

        $rootScope.SkipToResultArea = function () {
            $($(".resultSubView")[0]).focus();
        }

        $rootScope.SkipToFooter = function () {
            $("#footerFeedbackLink").focus();
            //$($(".searchSubView")[0]).focus();
        }

        var regex = new RegExp("[\\?&]" + 'state' + "=([^&#]*)");
        var results = regex.exec(location.search);
        if (results === null) return;
        var queriedState = decodeURIComponent(results[1].replace(/\+/g, " "));
        if (queriedState != "") {
            switch (queriedState) {
                case '1':
                    location.href = "#/origindestination";
                    break;
                case '2':
                    location.href = "#/linenumber";
                    break;
                case '3':
                    var regex = new RegExp("[\\?&]" + 'freelang' + "=([^&#]*)");
                    var results = regex.exec(location.search);
                    if (results === null) {
                        location.href = "#/freetext/1/0/";
                        return;
                    }
                    var queriedFreelang = decodeURIComponent(results[1].replace(/\+/g, " "));
                    queriedFreelang = queriedFreelang === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
                    location.href = "#/freetext/1/0/" + queriedFreelang;
                    break;
                case '4':
                    location.href = "#/realtime";
                    break;
                default:
                    location.href = "#/origindestination";
                    break;
            }
        }


    });
