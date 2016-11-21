
mslApp.service('infoBoxlist', function (localize) {

    var that = this;
    this.itemList = [];

    this.add = function (markerObject) {

        if (that.mapObject == null) {
            that.mapObject = new google.maps.OverlayView();
            that.mapObject.setMap(markerObject.map);
        }

        //that.mapObject.draw = function () {
        //    for (var i = 0; i < that.itemList.length; i++) {
        //        if (that.itemList[i] == null) continue;
        //        var pixPosition = that.mapObject.getProjection().fromLatLngToDivPixel(that.itemList[i].latlng);
        //        if (!pixPosition) return;
        //        if (that.itemList[i].element != null)
        //            that.itemList[i].element.
        //                show().
        //                css("left", (pixPosition.x + 10) + "px").
        //                css("top", (pixPosition.y - 10) + "px");
        //    }
        //};

        that.mapObject.draw = function () {
            var panes = that.mapObject.getPanes();

            //that.hideAll();

            for (var i = 0; i < that.itemList.length; i++) {
                var pixPosition = that.mapObject.getProjection().fromLatLngToDivPixel(that.itemList[i].latlng);
                if (!pixPosition) return;

                if (that.itemList[i].element == null) {
                    var wrapperDiv = $("<div>").
                        bind('click', { index: i }, function (e) {
                            that.itemList[e.data.index].clickEvent(that.itemList[e.data.index].marker);
                        }).
                        css("cursor", "pointer").
                        css("height", "20px").
                        css("width", "100px").
                        css("position", "absolute").
                        css("top", (pixPosition.y - 10) + "px").
                        css("display", "table");
                    //.click(function (e)
                    //{
                    //    markerObject.map.setCenter(markerObject.latlng);
                    //    markerObject.map.setZoom(16);
                    //});

                    if (localize.language == "en-US") {
                        wrapperDiv.css("direction", "rtl").
                        css("left", (pixPosition.x + 10) + "px");
                    }
                    else {
                        wrapperDiv.css("direction", "rtl").
                        css("left", (pixPosition.x + 10) + "px");
                    }

                    var textDiv = $("<div>").
                        css("display", "table-cell").
                        css("background-color", "white").
                        html(that.itemList[i].content).
                        css("border", "1px grey solid").
                        appendTo(wrapperDiv);
                    var arrowDiv = $("<div>").
                        addClass("arrow-left").
                        css("display", "table-cell").
                        appendTo(wrapperDiv);

                    that.itemList[i].element = wrapperDiv;
                    panes.floatPane.appendChild(wrapperDiv[0]);

                }
                else {

                    that.itemList[i].element.
                        css("top", (pixPosition.y - 10) + "px");

                    if (localize.language == "en-US") {
                        that.itemList[i].element.
                        css("left", (pixPosition.x + 10) + "px");
                    }
                    else {
                        that.itemList[i].element.
                        css("left", (pixPosition.x + 10) + "px");
                    }


                    $(that.itemList[i].element.children()[0]).html(that.itemList[i].content);

                    if (that.itemList[i].isVisible == true)
                        that.itemList[i].element.show();
                    else
                        that.itemList[i].element.hide();

                }

                var samePositionItem = that.getItemWithSamePosition(that.itemList[i]);
                if (samePositionItem != null) {

                    var top = that.itemList[i].element.css("top");
                    top = parseInt(top);
                    that.itemList[i].element.
                       css("top", (top + 10) + "px");
                    top = samePositionItem.element.css("top");
                    top = parseInt(top);
                    samePositionItem.element.
                       css("top", (top - 10) + "px");
                }

            }
        };

        //for (var i = 0; i < that.itemList.length; i++) {
        //    if (that.itemList[i].id == markerObject.id && that.itemList[i].content == markerObject.content) {
        //        return;
        //    }
        //}

        for (var i = 0; i < that.itemList.length; i++) {
            if (that.itemList[i].isVisible == false) {
                that.itemList[i].id = markerObject.id;
                that.itemList[i].isVisible = true;
                that.itemList[i].latlng = markerObject.latlng;
                that.itemList[i].map = markerObject.map;
                that.itemList[i].clickEvent = markerObject.clickEvent;
                that.itemList[i].content = markerObject.content;
                return;
            }
        }

        var newInfoBox = {
            id: markerObject.id,
            isVisible: true,
            latlng: markerObject.latlng,
            map: markerObject.map,
            marker: markerObject.marker,
            clickEvent: markerObject.clickEvent,
            content: markerObject.content
        };

        this.itemList.push(newInfoBox);
    }

    this.getItemWithSamePosition = function (selectedItem) {

        for (var i = 0; i < that.itemList.length; i++) {
            if (that.itemList[i].id == selectedItem.id) {
                return that.itemList[i];
            }
        }
    }

    this.hideAll = function (id) {
        for (var i = 0; i < that.itemList.length; i++) {
            //if (that.itemList[i].element.id == id) {
            if (that.itemList[i] == null) continue;
            that.itemList[i].isVisible = false;
            if (that.itemList[i].element != null)
                that.itemList[i].element.hide();
            //break;
            //}
        }
    }

    this.hideItem = function (id) {
        for (var i = 0; i < that.itemList.length; i++) {
            if (that.itemList[i].id == id) {
                if (that.itemList[i] == null) continue;
                that.itemList[i].isVisible = false;
                if (that.itemList[i].element != null)
                    that.itemList[i].element.hide();
                break;
            }
        }
    }

});
