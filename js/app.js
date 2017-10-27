var locations = [
    { title: 'City Centre I', location: { lat: 22.5882126, lng: 88.4084421 }, venID: "4bee95bfe24d20a1960e7314", category: 'Mall', show: ko.observable(true) },
    { title: 'The Stadel', location: { lat: 22.56907917, lng: 88.41034591 }, venID: "4ce160d9df986ea8c649ec16", category: 'Hotel', show: ko.observable(true) },
    { title: 'Mani Square', location: { lat: 22.57761891, lng: 88.40111643 }, venID: "4c333482a0ced13af334166e", category: 'Mall', show: ko.observable(true) },
    { title: 'ITC', location: { lat: 22.54440805, lng: 88.39785218 }, venID: "4bb4f2d60fb7b7132cb9bf8a", category: 'Hotel', show: ko.observable(true) },
    { title: 'Silver Screen Asia', location: { lat: 22.56735531, lng: 88.41136247 }, venID: "4d81bd59ebb4236a6f764558", category: 'Restaurant', show: ko.observable(true) },
    { title: 'Apollo Pharmacy', location: { lat: 22.57474597, lng: 88.4020257 }, venID: "4e3b9ba9b61cb577be5e5de1", category: 'Pharmacy', show: ko.observable(true) },
    { title: 'RDB Cinemas', location: { lat: 22.5685979, lng: 88.4330547 }, venID: "4cb76352352ebfb764508bf2", category: 'Movie Theatre', show: ko.observable(true) },
    { title: 'Columbia Asia', location: { lat: 22.57237327, lng: 88.41282696 }, venID: "4e91da865c5c4562f0862334", category: 'Hospital', show: ko.observable(true) },
    { title: 'C3', location: { lat: 22.58777773, lng: 88.40861991 }, venID: "4bf3eec43f86c9b629a0b21c", category: 'Supermarket', show: ko.observable(true) },
    { title: 'Nicco Park', location: { lat: 22.572508, lng: 88.422191 }, venID: "4c234b3113c00f47a0be88de", category: 'Amusement Park', show: ko.observable(true) },
    { title: 'Chowman', location: { lat: 22.59532578, lng: 88.41951102 }, venID: "535192a7498e84539e83d7a9", category: 'Restaurant', show: ko.observable(true) },
    { title: 'Salt Lake Stadium', location: { lat: 22.56773178, lng: 88.40882778 }, venID: "4d5f52e3ef378cfa06736ea6", category: 'Stadium', show: ko.observable(true) }
];

// Creates the map
function initMap() {
    var markers = [];
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 22.58656426, lng: 88.41608584 },
        zoom: 18
    });
    // Creates the infoWindow
    var largeInfoWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    function dispInfo () {
        bouncingMarker(this);
        populateInfoWindow(this, largeInfoWindow);
    }

    function markerInfo () {
        bouncingMarker(this.marker);
        populateInfoWindow(this.marker, this.largeInfoWindow);
    }

    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        var venID = locations[i].venID;
        // Creates the markers
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            show: true,
            animation: google.maps.Animation.DROP,
            venID: venID
        });
        // Attaches marker to locations []
        locations[i].marker = marker;
        locations[i].largeInfoWindow = largeInfoWindow;
        markers.push(marker);
        bounds.extend(marker.position);
        // On clicking the marker, it will bounce and the infoWindow will appear
        marker.addListener('click', dispInfo);

        locations[i].showInfo = markerInfo;


    }

    function populateInfoWindow(marker, infowindow) {

        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            var clientID = "B4U0ZWGZR4DLA1DCBD2QEBY3RURLLB22D4G11SOU4OIYQI4L";
            var clientSecret = "1AFM1K0BZTY3VGD1ZQFVTZV0WSCOZ3JFG4DL4P4MWA05BCIE";
            var version = "20170101";
            var apiURL = 'https://api.foursquare.com/v2/venues/' + marker.venID + '?client_id=' + clientID + '&client_secret=' + clientSecret + '&v=' + version;
            $.ajax({
                url: apiURL
            }).done(function (data) {
                infowindow.setContent('<div>' + marker.title + '<br>' + data.response.venue.location.formattedAddress + '<br>' + '</div>');
                infowindow.open(map, marker);
            }).fail(function (x, status, error) {
                alert("ERROR");
                console.log("Error:" + error);
                console.log("Status:" + status);
                console.dir(x);
            });
        }
    }

    map.fitBounds(bounds);

    function bouncingMarker(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 1400);
    }
    ko.applyBindings(new ViewModel());
}
// ViewModel function
function ViewModel() {
    var map;
    var marker;
    var self = this;
    self.categories = ko.observableArray(["All", "Restaurant", "Pharmacy", "Mall", "Supermarket", "Hotel", "Amusement Park", "Stadium", "Hospital", "Movie Theatre"]);
    self.selectedCategory = ko.observable('');
    self.selectLocation = ko.observableArray(locations);
    self.locations = ko.observableArray([]);
    // Filter function
    self.filteredItems = ko.computed(function () {
        for (var i = 0; i < self.selectLocation().length; i++) {
            if (self.selectedCategory() === "All" || !self.selectedCategory()) {
                self.selectLocation()[i].show(true);
                self.selectLocation()[i].marker.setVisible(true);
            } else if (self.selectedCategory() === self.selectLocation()[i].category) {
                self.selectLocation()[i].show(true);
                self.selectLocation()[i].marker.setVisible(true);
            } else {
                self.selectLocation()[i].show(false);
                self.selectLocation()[i].marker.setVisible(false);
            }
        }
    });
}
// If an error occured, this message will appear
function mapError() {
    alert("ERROR: Map didn't load");
}
