//* Map of GeoJSON data from MegaCities.geojson */
//declare map var in global scope
var map;
//function to create the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [20, 0],
        zoom: 2
    });
    //add the openstreet map tilelayer
    L.tileLayer('https://api.mapbox.com/styles/v1/ajanderson26/cl9yx108p002o15r70hbmu73w/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWphbmRlcnNvbjI2IiwiYSI6ImNsOXl3dnIzdzAwNmszcW1yMmhrZjlsNHUifQ.XCys49mvEy12hmZV60I_9A', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData();
};
function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent)
        .addTo(map);
    }
};

//function to get the data and put it on the map
function getData(map){
    //load the data
    fetch("data/MegaCities.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json, {
                onEachFeature: onEachFeature
            }).addTo(map);
        })  
};
//function to retrieve the data and place it on the map
//function getData(){
    //load the data
    //fetch("data/map.geojson")
       // .then(function(response){
         //   return response.json();
       // })
       // .then(function(json){
            //create a Leaflet GeoJSON layer and add it to the map
          //  L.geoJson(json).addTo(map);
      //  })
//};

document.addEventListener('DOMContentLoaded',createMap)