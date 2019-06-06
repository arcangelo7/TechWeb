// initialize the map to show the entire world
var map = L.map('mappa').fitWorld();

// add a Mapbox Streets tile layer
    // set the URL template for the tile images
    // set the attribution text and the maximum zoom level of the layer
    // in order to use tiles from Mapbox, I've also requested an access token
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiYXJjYW5nZWxvNyIsImEiOiJjandnbTA1cGQxOTdkNGFvM2E0MXNtenhyIn0.3KYZtLTolcDAj7zagvi2sQ'
}).addTo(map);

// Geolocation
map.locate();

// Add a marker on location found
function onLocationFound(e) {

    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("<div class='text-center'><h3>Tu sei qui <a type='button' id='bottone-registratore'><i class='fas fa-microphone'></i></a></h3><p class='lead'>Clicca sul microfono per creare una clip</p></div>").openPopup();

    L.circle(e.latlng, radius).addTo(map);

    // center the map on the right coordinates and zoom
    map.setView(e.latlng, 18);
    
}

map.on('locationfound', onLocationFound);

// Show an alert if there is an error
function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);