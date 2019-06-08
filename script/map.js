// initialize the map to show the entire world and a marker
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
    var popupContent = `<div class='text-center'>
                                <h3>Tu sei qui <a type='button'></a><i id='microfono' class='fas fa-microphone'></i></h3>
                                <p id='popupText' class='lead'>Clicca per creare una clip</p>
                                <button id='registratore' class='btn btn-primary'>Crea</button>
                                <button id='registratore-no-autorizzazione' class='btn btn-primary'>Crea</button>
                                <button id='stop' class='btn btn-primary'>Stop</button>
                                <audio class='mt-4' controls id='audio' hidden></audio>
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
    marker.addTo(map).bindPopup(popup).openPopup();
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
}

map.on('locationfound', onLocationFound);

// Show an alert if there is an error
function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

// Comportamento del bottone per registrare
map.on('popupopen', function() { 
  $("#stop").css("display", "none");
  $("#registratore-no-autorizzazione").css("display", "none");
  $('#registratore, #registratore-no-autorizzazione').click(function()
  {
      $("#registratore").css("display", "none");
      $("#registratore-no-autorizzazione").css("display", "none");
      $("#stop").css("display", "inline-block");
      $("#microfono").css("color", "red");
      intervalId = setInterval(function(){
        $("#microfono").fadeOut(250).fadeIn(250);
      }, 1000);   
      $("#popupText").text("Clicca per stoppare");
  });
  $('#stop').click(function() 
  {
    $("#stop").css("display", "none");
    $("#registratore-no-autorizzazione").css("display", "inline-block");
    clearInterval(intervalId);  
    $("#popupText").text("Clicca per creare una clip");
    $('#new-clip-form-modal').modal();
  });
});