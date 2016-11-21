
function mapMarker(params) {

    var that = this;
    this.id_ = params.id;
    this.makat_ = params.makat;
    this.position_ = params.position;
    this.map_ = params.map;
    this.imagePath_ = params.imagePath;
    this.imageName_ = params.imageName;
    this.title_ = params.title;
    this.clickEvent = params.clickEvent;
    //this.selectedBusstop = params.selectedBusstop;

    this.markerObject = new google.maps.Marker({
        position: that.position_,
        zIndex: 10,
        map: that.map_,
        title: that.title_,
        icon: {
            url: "/Content/images/Popup/" + that.imageName_,
            anchor: new google.maps.Point(8, 8),
            scaledSize: new google.maps.Size(16, 16)
        }
    });

    //Object.observe(this.selectedBusstop, function (changes) {
    //    changes.forEach(function (change) {
    //        debugger;
    //        console.log(change.type, change.name, change.oldValue);
    //    });
    //});

    google.maps.event.addListener(this.markerObject, 'click', function () {
        //that.selectedBusstop = that;
        that.map_.setCenter(that.position_);
        that.map_.setZoom(17);
        //that.setSelectedBusstop(that);
        that.clickEvent(that);
    });

    //mapMarker.markerList.push(this);
}

mslApp.factory('mapMarker', function ($injector) {
    return function () {
        return $injector.instantiate(mapMarker, {});
    };
});
