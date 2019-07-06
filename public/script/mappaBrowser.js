// initialize the map to show the Europe
var map = L.map('mappa').setView([41,12], 5);
var circle;
var marker;
var popup;

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

function onLocationFound(e) {
    console.log(e.latlng)
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
        draggable: true
    }
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
    marker.on('dragend', function(e) { 
        var position = marker.getLatLng();
        circle.setLatLng(position);
        marker.setLatLng(position).openPopup();
    });  
    // center the map on the right coordinates and zoom
    map.setView(e.latlng, 18); 
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

$("a[href='/']").addClass("active");

// Search box
var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false
})
  .on('markgeocode', function(e) {
        circle.setLatLng(e.geocode.center);
        marker.setLatLng(e.geocode.center).openPopup();
        map.setView(e.geocode.center, 18); 
  })
  .addTo(map);