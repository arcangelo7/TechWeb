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

    let popupContent = `<div class='text-center'>
                            <h3>Tu sei qui <a type='button'></a><i id='microfono' class='fas fa-microphone'></i></h3>
                            <p class='lead'>Clicca per creare una clip</p>
                            <button id='registratore' class='btn btn-primary'>Crea</button>
                            <button id='registratore-no-autorizzazione' class='btn btn-primary'>Crea</button>
                            <button id='stop' class='btn btn-primary'>Stop</button>
                            <audio class='mt-4' controls id='audio' hidden></audio>
                        </div>`

    L.marker(e.latlng).addTo(map)
        .bindPopup(popupContent).openPopup();

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

// Comportamento del bottone per registrare
map.on('popupopen', function() { 
  $("#stop").css("display", "none"); 
  $("#registratore-no-autorizzazione").css("display", "none");
  $('#registratore, #registratore-no-autorizzazione').click(function(){
      $("#registratore").css("display", "none");
      $("#registratore-no-autorizzazione").css("display", "none");
      $("#stop").css("display", "inline-block");
      $("#microfono").css("color", "red");
      intervalId = setInterval(function(){
        $("#microfono").fadeOut(250).fadeIn(250);
      }, 1000);   
  });

  $('#stop').click(function() {
    $("#registratore-no-autorizzazione").css("display", "inline-block");
    $("#stop").css("display", "none");
    $("#microfono").css("color", "black");
    clearInterval(intervalId);  
    $('#new-clip-form-modal').modal();
  });
});