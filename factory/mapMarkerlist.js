
function mapMarkerlist(params) {

    this.map_ = params.map;
    this.bounds_ = null;
    this.imagePath_ = params.imagePath;
    this.imageName_ = params.imageName;
    this.clickEvent = params.clickEvent;
    this.markerList = [];
    this.selectedBusstop = null;

    //var selectedBusstop = null;
    //if (Object.getOwnPropertyDescriptor(this, 'selectedBusstop') == null) {
    //    Object.defineProperty(this, 'selectedBusstop',
    //    {
    //        get: function () {
    //            return selectedBusstop;
    //        },
    //        set: function (value) {
    //            selectedBusstop = value;
    //        }
    //    });
    //}

}

mapMarkerlist.prototype.setImageName = function (newImageName) {
    this.imageName_ = newImageName;

};

mapMarkerlist.prototype.setMarkerList = function (stopList) {

    var that = this;
    for (var i = 0; i < stopList.length; i++) {
        var vacantMarkerIndex = null;
        for (var j = 0; j < this.markerList.length; j++) {
            if (this.markerList[j].map_ == null) {
                vacantMarkerIndex = i;
                break;
            }
        }
        if (vacantMarkerIndex != null) {
            this.markerList[vacantMarkerIndex].makat_ = stopList[i].Makat;
            this.markerList[vacantMarkerIndex].map_ = this.map_;
            this.markerList[vacantMarkerIndex].markerObject.setMap(this.map_);
            this.markerList[vacantMarkerIndex].position_ = new google.maps.LatLng(stopList[i].Latitude, stopList[i].Longitude);
            this.markerList[vacantMarkerIndex].markerObject.setPosition(new google.maps.LatLng(stopList[i].Latitude, stopList[i].Longitude));
            this.markerList[vacantMarkerIndex].title_ = "תחנה " + stopList[i].Name;
            this.markerList[vacantMarkerIndex].markerObject.setTitle("תחנה " + stopList[i].Name);
        }
        else {
            var newMarker = new mapMarker({
                id: 0,
                makat: stopList[i].Makat,
                position: new google.maps.LatLng(stopList[i].Latitude, stopList[i].Longitude),
                map: this.map_,
                imagePath: this.imagePath_,
                imageName: this.imageName_,
                title: "תחנה " + stopList[i].Name,
                clickEvent: function (args) {
                    that.setSelectedBusstop(this);
                    that.clickEvent(args);
                }
            });
            this.markerList.push(newMarker);
        }

    }

    this.setZoomToIncludeAllMarkers();

};

mapMarkerlist.prototype.setZoomToIncludeAllMarkers = function () {
    if (this.markerList.length == 0) return;
    this.bounds_ = new google.maps.LatLngBounds();
    for (i = 0; i < this.markerList.length; i++)
        if (this.markerList[i].map_ != null)
            this.bounds_.extend(new google.maps.LatLng(this.markerList[i].position_.lat(), this.markerList[i].position_.lng()));
    this.map_.fitBounds(this.bounds_);
};

mapMarkerlist.prototype.setSelectedBusstop = function (newSelectedBusstop) {
    this.selectedBusstop = newSelectedBusstop;
    this.updateIconSize();
};

mapMarkerlist.prototype.updateIconSize = function () {

    var point = 16;
    var size = 32;

    for (var i = 0; i < this.markerList.length; i++) {
        if (this.selectedBusstop && this.selectedBusstop.makat_ == this.markerList[i].makat_) {
            point = 16;
            size = 32;
        }
        else {
            point = 8;
            size = 16;
        }
        var pinIcon =
            {
                url: this.markerList[i].imagePath_ + this.markerList[i].imageName_,
                size: null, /* size is determined at runtime */
                origin: null, /* origin is 0,0 */
                anchor: new google.maps.Point(point, point),
                scaledSize: new google.maps.Size(size, size)
            };
        this.markerList[i].markerObject.setIcon(pinIcon);
    }

}

mapMarkerlist.prototype.clear = function () {

    this.bounds_ = new google.maps.LatLngBounds(null);
    //this.map_.fitBounds(this.bounds_);

    this.selectedBusstop = null;
    for (var i = 0; i < this.markerList.length; i++) {
        this.markerList[i].map_ = null;
        this.markerList[i].markerObject.setMap(null);
    }
    this.updateIconSize();
}

mslApp.factory('mapMarkerlist', function ($injector) {
    return function () {
        return $injector.instantiate(mapMarkerlist, {});
    };
});

