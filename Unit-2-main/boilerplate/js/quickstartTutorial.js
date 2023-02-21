//s3etting coordinates and zoom level for map view to be at when it it is loaded 
var map = L.map('map').setView([51.505, -0.09], 13);

//add tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);  var marker = L.marker([51.5, -0.09]).addTo(map);

//adding circle feature to highlight specific coordinate on the map
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

//adding polygon feature to highlighy specifc coordinates on the map
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

//adding pop-up with text to circle, pinpoint, and polygon 
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

//is this a better syntax for pop-ups because it handles automatic closing of a previously opened popup when opening a new one? --> it looks like both syntax close other pop-ups automatically
var popup = L.popup();

//I think this is like an event listener when the map is clicked on a pop up will come up that states the coordinates you clicked on. 
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);

   