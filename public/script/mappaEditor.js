// initialize the map to show the Europe
var map = L.map('mappa').setView([41,12], 5);

// Creo un box per mostrare messaggi all'utente
var info = L.control();
// Should return the container DOM element for the control and add listeners on relevant map events. Called on control.addTo(map).
info.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

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

// Add a marker on location found
function onLocationFound(e) {
    map.eachLayer(function(layer) {
        // Remove all layers except the background (tilelayer). Evita che a ogni aggiornamento di posizione rimangano i vecchi marker e circle
        if (!(layer instanceof L.TileLayer)) {
            map.removeLayer(layer);
        }
    }); 
    var popupContent = `<div class='text-center'>
                                <h3>Tu sei qui <i id='microfono' class='fas fa-microphone'></i></h3>
                                <p id='popupText' class='lead'>Clicca per creare una clip</p>
                                <button id='registratore' class='btn btn-primary'>Crea</button>
                                <button id='registratore-no-autorizzazione' class='btn btn-primary' hidden>Crea</button>
                                <button id='stop' class='btn btn-primary' hidden>Stop</button>
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
    var marker = new L.Marker(e.latlng, markerOptions);
    popup = new L.popup()
        .setLatLng(e.latlng)
        .setContent(popupContent);
    marker.addTo(map).bindPopup(popup, popupOptions).openPopup();
    // Disegna un cerchio intorno al marker con un raggio di 100 metri
    var circle = L.circle(e.latlng, 100).addTo(map);
    // Il marker è draggable con posizione aggiornata
    // Il popup e il circle aggiornano la loro posizione
    marker.on('dragend', function(e) { 
        var position = marker.getLatLng();
        circle.setLatLng(position);
        marker.setLatLng(position).openPopup();
    });   
    // center the map on the right coordinates and zoom
    map.setView(e.latlng, 18);
    
    coordinate = marker.getLatLng();
}

map.on('locationfound', onLocationFound);

// Show a message if there is an error
function onLocationError(e) {
    info.update = function () {
        this._div.innerHTML = '<p>Errore: Impossibile geolocalizzare</p>';
    };  
    info.addTo(map);
}

map.on('locationerror', onLocationError);

function manipolaPopupRegistrazione(){
  $('#registratore, #registratore-no-autorizzazione').click(function()
  {
      document.getElementById("registratore").hidden = true;
      document.getElementById("registratore-no-autorizzazione").hidden = true;
      document.getElementById("stop").hidden = false;
      $("#microfono").css("color", "red");
   
      $("#popupText").text("Clicca per stoppare");
  });
  $('#stop').click(function() 
  {
    document.getElementById("stop").hidden = true;
    document.getElementById("registratore-no-autorizzazione").hidden = false;
    $("#microfono").css("color", "black");
    $("#popupText").text("Clicca per creare una clip");
    $('#new-clip-form-modal').modal();
  });    
}

// Comportamento dell'interfaccia per registrare
map.on('popupopen', manipolaPopupRegistrazione);

$("a[href='/editor-mappa']").addClass("active");
