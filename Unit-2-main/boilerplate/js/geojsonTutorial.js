//declaring map variable and setting the view of the map when it is opened to Denver
var map = L.map('map').setView([39.75621, -104.99404], 13);



//making sure I can log in the console
console.log('hello');

//add the map tile layer with max zoom available and its attribution
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);  

//adding geojson features/elements to the map 
function onEachFeature(feature, layer) {
    console.log(feature)
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
};

var geojsonFeature = {
   "type": "Feature",
    "properties": {
       "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
        
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621],
    }
};

//adding features to the map 
var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];

//ho do I get layer to not be greyed out
L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
    
}).addTo(map);
//adding coordinate point to the map tile
var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];
var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

//adding style to map 
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

//adding geoJson features and objects to the map
L.geoJSON(geojsonFeature, {
    onEachFeature : onEachFeature
}).addTo(map);

//pushing geojson features to map
L.geoJSON(myLines, {
    style: myStyle
}).addTo(map);
