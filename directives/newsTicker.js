mslApp.directive('newsTicker', function ($rootScope, searchService, localize) {
    return {
        scope:{
        "search": "="
        },
        templateUrl: '/app/views/directive/newsTicker.htm',
        link: function (scope, element, attrs) {
            if (scope.isMarqueeCreated != null && scope.isMarqueeCreated == true)
                return;
            try {

                scope.isTickerPaused = false;
                scope.isDialogBox1Open = false;
                scope.isDialogBox2Open = false;
                scope.scrollNumber = 0;

                scope.togglePause = function () {
                        scope.isTickerPaused = !scope.isTickerPaused;
                        if (scope.isTickerPaused == true) {
                            $(".marquee ul").css("animation-play-state", "paused");
                            $(".marquee ul").css("-moz-animation-play-state", "paused");
                            $(".marquee ul").css("-o-animation-play-state", "paused");
                            $(".marquee ul").css("-webkit-animation-play-state", "paused");
                        }
                        else {
                            $(".marquee ul").css("animation-play-state", "");
                            $(".marquee ul").css("-moz-animation-play-state", "");
                            $(".marquee ul").css("-o-animation-play-state", "");
                            $(".marquee ul").css("-webkit-animation-play-state", "");
                        }
                }

                scope.marqueeContent = "";
                var d = new Date();
                scope.dtToday = [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('.');
                var dataSrc;

                if (scope.newsList == null) {

                    searchService.getDataFromServer("getEggedNews", [$rootScope.search.language, $rootScope.search.isEggedDb], function (tempNewsList) {
                        scope.newsList = dataSrc = tempNewsList;
                        init();
                    });
                }

                function showNewsItemInDialog(dialogIndex) {

                    for (var i = 0 ; i < dataSrc.length ; i++) {

                        if (i == parseInt(dialogIndex)) {
                            var newItemIndex = parseInt(i);
                            var itemDialogElement = $("<div><div>" + dataSrc[i].Content + "</div></div>").
                                attr("id", "newsItemDialog-" + i.toString()).
                                css("display", "inline-block").
                                attr("tabindex", "0").
                                keydown(function (e) {
                                    var maxHeight = e.currentTarget.scrollHeight - 221;
                                    if (e.keyCode == 38) {
                                        if (scope.scrollNumber == 0) return;
                                    else if (scope.scrollNumber > 0) scope.scrollNumber -= 30;
                                                else if (scope.scrollNumber <= 0) scope.scrollNumber = 0;
                                        $("#newsItemDialog-" + newItemIndex + "").animate({scrollTop:scope.scrollNumber},1);
                                    }
                                    if (e.keyCode == 40) {
                                        if (maxHeight == scope.scrollNumber) return;
                                        else if (maxHeight > scope.scrollNumber) scope.scrollNumber += 30; 
                                        else if (scope.scrollNumber >= maxHeight) scope.scrollNumber = maxHeight;
                                            $("#newsItemDialog-" + newItemIndex + "").animate({ scrollTop: scope.scrollNumber }, 1);
                                        }
                                   

                                }).
                                appendTo(element);

                            $(itemDialogElement)[0].title = $(dataSrc[i].Summary)[0].textContent;
                            //$(element)[0].title = "";
                            $(itemDialogElement).dialog({
                                resizable: false,
                                width: 'auto',
                                height: 300,
                                modal: true,

                                show: {
                                    effect: "blind",
                                    duration: 100
                                },
                                hide: {
                                    effect: "blind",
                                    duration: 100
                                },
                                open: function (event, ui) {

                                    var currentHeaderText = $($(event.target).prev().find(".ui-dialog-title")[0]).html();
                                    var h3Element = $("<h3 tabindex='0' style='font-size: 18px;'>").html(currentHeaderText);
                                    setTimeout(function () {
                                        $(h3Element).focus();
                                    }, 500);
                                    $($(event.target).prev().find(".ui-dialog-title")[0]).html("");
                                    h3Element.appendTo($($(event.target).prev().find(".ui-dialog-title")[0]));

                                    scope.isDialogBox2Open = true;
                                    $("#newsItemDialog-" + newItemIndex + "").focus();

                                    var btnCancel = "Close";
                                    if (localize.language == "he-IL")
                                        btnCancel = "סגור";
                                    $($(event.target).prev().find(".ui-dialog-titlebar-close")[0]).attr("title", btnCancel);

                                },
                    close: function (event, ui) {           
                        scope.isDialogBox2Open = false;
                        $(event.target).dialog('close');
                    }
                            });
                        }
                    }
                }

                function init() {

                    scope.marqueeContent = $(".marqueeContent");

                    //$(element).html("");

                    var dialogElement = $("<div id='newsDialog' ></div>").appendTo(element);
                    $(dialogElement)[0].title = "כל ההודעות";
                    $(dialogElement).dialog({
                        resizable: false,
                        width: 840,
                        height: 300,
                        modal: true,
                        dialogClass: 'DialogWindow',
                        autoOpen: false,        
                        show: {
                            effect: "blind",
                            duration: 100
                        },
                        hide: {
                            effect: "blind",
                            duration: 100
                        },
                        open: function (event, ui) {
                            var currentHeaderText = $($(event.target).prev().find(".ui-dialog-title")[0]).html();
                            var h3Element = $("<h3 tabindex='0' style='font-size: 18px;'>").html(currentHeaderText);
                            setTimeout(function () {
                                $(h3Element).focus();
                            }, 500);
                            $($(event.target).prev().find(".ui-dialog-title")[0]).html("");
                            h3Element.appendTo($($(event.target).prev().find(".ui-dialog-title")[0]));
                            scope.isDialogBox1Open = true;
                            $('#newsDialog [tabindex="0"]').focus();
                        }
                    , close: function (event, ui) {
                        if (scope.isDialogBox1Open == false) return;
                        $(event.target).dialog('close');
                        $(".NewsShowAll").focus();
                        scope.isDialogBox1Open = false;
                    }

                    });


                    //$("<div class='newsTickerHeader' style='display: table-cell; vertical-align: 50%;' ><div style='margin-top: 3px;' >עדכונים:</div><div style='width:10px; margin-top: 3px;'></div><div class='newsTickerDate' style='margin-top: 3px;' >" + dtToday + "</div></div>").appendTo(element);
                    //var marqueeElement = $("<marquee scrollamount='1' behavior='scroll' direction='right' style='height: 22px; width: 770px;' ></marquee>").
                    //mouseover(function () {
                    //    this.setAttribute('scrollamount', 0, 0);
                    //}).
                    //mouseout(function () {
                    //    this.setAttribute('scrollamount', 1, 0);
                    //});

                    //var elemMarqueeTd = $("<div>").appendTo(element).css("vertical-align", "middle").css("display", "table-cell").css("width", "80%");
                    //$(marqueeElement).appendTo(elemMarqueeTd);

                    for (var i = 0 ; i < dataSrc.length ; i++) {


                        var spanElem1 = $("<li style='white-space:nowrap; width:20px; height: 22px; line-height: 22px; vertical-align: top;'></li>");
                        $(spanElem1).attr("id", "newsItemSentence-" + i.toString());
                        var spanElem2 = $("<div style='white-space:nowrap; width:100%; height: 22px; line-height: 22px; vertical-align: top;display:block; '></div>");
                        $(spanElem2).attr("id", "newsItemSentence-" + i.toString());
                        $(spanElem2).attr("tabindex", "" + i.toString() + "");
                        $(spanElem1).
                            addClass("NewsItem").
                            click(function (e) {
                                var dialogIndex = e.currentTarget.id.split('-')[1];
                                showNewsItemInDialog(dialogIndex);
                                //$("#newsItemDialog-" + dialogIndex.toString()).dialog("open");
                            }).
                            keyup(function (e) {
                                if (e.keyCode == 13) {
                                    if (scope.isDialogBox1Open == false) {
                                        scope.isDialogBox1Open = true;
                                        var dialogIndex = e.currentTarget.id.split('-')[1];
                                        showNewsItemInDialog(dialogIndex);
                                    }
                                }
                            });

                        $(spanElem2).
                            addClass("NewsItem").
                            click(function (e) {
                                var dialogIndex = e.currentTarget.id.split('-')[1];
                                showNewsItemInDialog(dialogIndex);
                                //$("#newsItemDialog-" + dialogIndex.toString()).dialog("open");
                            }).
                            keydown(function (e) {

                                 if (e.keyCode == 13) {
                                if (scope.isDialogBox2Open == false) {
                                        scope.isDialogBox2Open = true;
                                        var dialogIndex = e.currentTarget.id.split('-')[1];
                                        showNewsItemInDialog(dialogIndex);
                                    }
                                }
                                    if (scope.isDialogBox2Open == false) {
                                    //document.onkeydown = function (evt) {
                                    //    evt = evt || window.event;
                                    //    var keyCode = evt.keyCode;
                                    //    if (keyCode >= 37 && keyCode <= 40) {
                                    //        return false;
                                    //    }
                                    //    };
                                            switch (e.keyCode) {
                                                case 9:
                                                    if (e.shiftKey == true) {
                                                        if ($(e.target)[0].tabIndex > 0) {
                                                            $(e.target).prev().focus();
                                                            return false;
                                                        }
                                                    }
                                                    else if ($(e.target)[0].tabIndex < dataSrc.length - 1) {
                                                        $(e.target).next().focus();
                                                        return false;
                                                    }
                                            break;
                                        case 38:
                                            var endOfTab = parseInt(dataSrc.length - 1);
                                            if ($(e.target)[0].tabIndex == 0) $('[tabindex=' + endOfTab + ']').focus();
                                              else  $(e.target).prev().focus();
                                            break;
                                        case 40:
                                            if ($(e.target)[0].tabIndex == dataSrc.length-1) $('[tabindex=' + 0 + ']').focus();
                                            else $(e.target).next().focus();
                                            break;
                                            

                                    }
                                }
                              
                            });

                        $("<a href='javascript:void(0);' style='text-decoration: blink; margin-left: 20px; margin-right: 20px; border: 0px; background-color: transparent; color: black; '>" + $(dataSrc[i].Summary).text() + "</a>").appendTo(spanElem1);
                        $("<a href='javascript:void(0);' style='text-decoration: blink; margin-left: 20px; margin-right: 20px;'>" + $(dataSrc[i].Summary).text() + "</a>").appendTo(spanElem2);
                        $(spanElem1)[0].title = $(dataSrc[i].Summary)[0].textContent;
                        //$(spanElem1).prop("title", dataSrc[i].textContent);
                        $(spanElem1).appendTo(scope.marqueeContent);

                        $(spanElem2)[0].title = $(dataSrc[i].Summary)[0].textContent;
                        //$(spanElem2).prop("title", dataSrc[i].textContent);
                        $(spanElem2).appendTo(dialogElement);



                    }

                    //var elemShowAllTd = $("<div>").css("display", "table-cell").css("vertical-align", "middle").appendTo(element);
                    //$("<div tabindex='0'>הצג הכל ◄</div>").
                    //addClass("NewsShowAll").
                    //click(
                    scope.btnShowAllClick = function () {
                            if (scope.isDialogBox1Open == true) return;
                            $(dialogElement).dialog("open");
                            setTimeout(function () {
                                $('#newsDialog [tabindex="0"]').focus();
                            }, 50);
                    }
                    //).
                    //bind("keydown keypress", function (event) {
                    //    if (event.which == 13)
                    //        $(dialogElement).dialog("open");
                    //}).
                    //appendTo(elemShowAllTd);

                    $(dialogElement).hide();
                    scope.isMarqueeCreated = true;
                }

            }
            catch (e) {
                debugger;
            }

        }
    }
});


