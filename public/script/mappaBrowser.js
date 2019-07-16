// initialize the map to show the Europe
var map = L.map('mappa', {scrollWheelZoom:false}).setView([41,12], 5);
var circle = new L.circle;
var marker = new L.Marker;
var popup = new L.popup;

// add a Mapbox Streets tile layer
    // set the URL template for the tile images
    // set the attribution text and the maximum zoom level of the layer
    // in order to use tiles from Mapbox, I've also requested an access token
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiYXJjYW5nZWxvNyIsImEiOiJjandnbTA1cGQxOTdkNGFvM2E0MXNtenhyIn0.3KYZtLTolcDAj7zagvi2sQ'
}).addTo(map);

// Geolocation
map.locate({enableHighAccuracy: true});

var popupContent = `<div class='text-center'>
                            <h3>Tu sei qui</h3>
                            <p class='lead'>Scrolla verso il basso per cercare locazioni</p>
                    </div>`
// Il popup non si chiude mai
var popupOptions = {
    closeButton: false,
    closeOnEscapeKey: false,
    closeOnClick: false
}
// Testo alternativo per l'accessibilità e possibilità di aggiustare la posizione del marker
var markerOptions = {
    alt: "Marker posizionato sulla tua posizione",
    draggable: false
}

function newPosition() {
    coordinate = marker.getLatLng();
    document.getElementById('coordinate').value = coordinate.lat + "," + coordinate.lng;    
    $("#results").html("");
}

function onLocationFound(e) {
    // Aggiungo un marker con un popup
    marker = new L.Marker(e.latlng, markerOptions);
    popup = new L.popup()
        .setLatLng(e.latlng)
        .setContent(popupContent);
    marker.addTo(map).bindPopup(popup, popupOptions).openPopup();
    // Disegna un cerchio intorno al marker con un raggio di 100 metri
    circle = L.circle(e.latlng, 100).addTo(map);
    // Il marker è draggable con posizione aggiornata
    // Il popup e il circle aggiornano la loro posizione
    // center the map on the right coordinates and zoom
    map.setView(e.latlng, 18); 
    newPosition();
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

// Add sctive class on proper navbar link
$("a[href='/browser-mappa']").addClass("active");

// Search box
var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false,
    collapsed: false,
    placeholder: "Cerca...",
    errorMessage: "Non ho trovato nulla... Riprova"
})
  .on('markgeocode', function(e) {
    if (marker !== null || circle !== null) {
        map.removeLayer(marker);
        map.removeLayer(circle);
    }
    marker = new L.Marker(e.geocode.center, markerOptions);
    popup = new L.popup()
        .setLatLng(e.geocode.center)
        .setContent(popupContent);
    marker.addTo(map).bindPopup(popup, popupOptions).openPopup();
    circle = L.circle(e.geocode.center, 100).addTo(map);
    map.setView(e.geocode.center, 18); 
    newPosition();
    init();
  })
  .addTo(map);

L.mapbox.accessToken = 'pk.eyJ1IjoiYXJjYW5nZWxvNyIsImEiOiJjandnbTA1cGQxOTdkNGFvM2E0MXNtenhyIn0.3KYZtLTolcDAj7zagvi2sQ';

// move the attribution control out of the way
map.attributionControl.setPosition('bottomleft');

// create the initial directions object, from which the layer
// and inputs will pull data.
var directions = L.mapbox.directions();

var directionsLayer = L.mapbox.directions.layer(directions)
    .addTo(map);

var directionsInputControl = L.mapbox.directions.inputControl('inputs', directions)
    .addTo(map);

var directionsErrorsControl = L.mapbox.directions.errorsControl('errors', directions)
    .addTo(map);

var directionsRoutesControl = L.mapbox.directions.routesControl('routes', directions)
    .addTo(map);

var directionsInstructionsControl = L.mapbox.directions.instructionsControl('instructions', directions)
    .addTo(map);

// Creo un box per mostrare cose sulla mappa
var info = L.control({position: "topleft"});
// Should return the container DOM element for the control and add listeners on relevant map events. Called on control.addTo(map).
info.onAdd = function () {
    this._div = L.DomUtil.create('div', 'indicazioni'); // create a div with a class "indicazioni"
    L.DomEvent.disableClickPropagation(this._div);
    this.update();
    return this._div;
};
info.update = function () {
    this._div.innerHTML = '<button class="btn btn-success"><i class="fas fa-directions"></i></button>';
    };  
info.addTo(map);

function toggleDirectionsButton() {
    if($(".indicazioni").html() == '<button class="btn btn-success"><i class="fas fa-directions" aria-hidden="true"></i></button>') {
        $(".indicazioni").html('<button class="btn btn-danger"><i class="fas fa-directions"></i></button>');
    } else {
        $(".indicazioni").html('<button class="btn btn-success"><i class="fas fa-directions" aria-hidden="true"></i></button>');
    }
}

$(".indicazioni").click(function(){
    $("#inputs, #errors, #directions").toggle("slow");
    toggleDirectionsButton();
});

map.on("click", function(){
    $("#inputs, #errors, #directions").show(500);
    $(".indicazioni").html('<button class="btn btn-danger"><i class="fas fa-directions"></i></button>')
});


