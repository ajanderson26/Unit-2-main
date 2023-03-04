//* Map of GeoJSON data from MegaCities.geojson */
//declare map var in global scope
var map;
var minValue;
var attribute = 'est_budget';
//finish years
//subsitute attributeS for years variable 
var years = [1996, 1998, 2001, 2004, 2007, 2009, 2012, 2014, 2018, 2021, 2023];
var selectedYear = years[0];
//function to create the Leaflet map
function createMap() {
    //create the map
    map = L.map('map', {
        center: [0, 0],
        zoom: 2
    });

    //Step 1: add the openstreet map tilelayer
    L.tileLayer('https://api.mapbox.com/styles/v1/ajanderson26/cl9yx108p002o15r70hbmu73w/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWphbmRlcnNvbjI2IiwiYSI6ImNsOXl3dnIzdzAwNmszcW1yMmhrZjlsNHUifQ.XCys49mvEy12hmZV60I_9A', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData();
};
function calculateMinValue(data) {
    //create empty array to store all data values
    var allValues = [];
    //loop through each city
    for (var city of data.features) {
        //get population for current year
        var value = city.properties["est_budget"];
        //add value to array
        if (value > 0)
            allValues.push(value);
    }
    //get minimum value of our array
    var minValue = Math.min(...allValues)

    return minValue;
}
//should the estimated budget exclude the dollar sign?
//calculate the radius of each proportional symbol --> I dont think this worked the size of the prop symbols is not included in the console log
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 8;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue / minValue, 0.5715) * minRadius

    return radius;
};

//is the pop up code suppose to be here? where should it go because it is not poping up.
function onEachFeature(feature, layer) {

};

function setFillOpacity(feature) {
    if (feature.properties.Date == selectedYear)
        return 0.8;
    else
        return 0;
}

function pointToLayer(feature, latlng, years) {
    var attribute = "est_budget";
    //check
    console.log(attribute);
    //Determine hich attribute to visual proportional symbols
    var attribute = "est_budget";
    //create marker option
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#f5df8f",
        color: "#000",
        weight: 1,
        opacity: setFillOpacity(feature),
        fillOpacity: setFillOpacity(feature)
    };
    //right spot?
    //L.circleMarker(latlng, geojsonMarkerOptions)

    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    geojsonMarkerOptions.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, geojsonMarkerOptions);
    //build popup content string
    //build popup content string starting with city...Example 2.1 line 24
    var popupContent = "<p><b>Movie</b> " + feature.properties.Movie + "</p>";

    var popupValue = popupContent.layer;
    if (feature.properties[attribute] > 0)
        popupValue = feature.properties[attribute]
    else
        popupValue = "No data"

    //add formatted attribute to popup content string
    var year = attribute.split("_")[1];
    popupContent += "<p><b>Budget in " + year + ":</b> " + popupValue + " million</p>";
    popupContent += "<p><b>Filming Location :</b> " + feature.properties.Filming_location + "</p>";
    


    //bind the popup to the circle marker
    layer.bindPopup(popupContent);
    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//return L.circleMarker(latlng, geojsonMarkerOptions);
//Step 5: For each feature, determine its value for the selected attribute

//Step 3: Add circle markers for point features to the map
function createPropSymbols(data, years) {

    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return pointToLayer(feature, latlng, years);
        }
    }).addTo(map);
};

function processData(data) {
    //empty array to hold years
    var years = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into years array
    for (var attribute in properties) {
        //only take years with population values
        if (attribute.est_budget) {
            years.push(attribute);
        };
    };

    //check result
    console.log(years);

    return years;
};


function createSequenceControls(years) {
    //create range input element (slider)
    var slider = "<input class='range-slider' type='range'></input>";
    document.querySelector("#panel").insertAdjacentHTML('beforeend', slider);
    document.querySelector('.range-slider').max = 6;
    document.querySelector('.range-slider').min = 0;
    document.querySelector('.range-slider').value = 0;
    document.querySelector('.range-slider').step = 1;

    document.querySelector('#panel').insertAdjacentHTML('beforeend', '<button class="step" id="reverse">Reverse</button>');
    document.querySelector('#panel').insertAdjacentHTML('beforeend', '<button class="step" id="forward">Forward</button>');
    document.querySelector('#reverse').insertAdjacentHTML('beforeend', "<img id= 'reverse-img' src='img/reverse.png'>")
    document.querySelector('#forward').insertAdjacentHTML('beforeend', "<img id='forward-img' src='img/forward_.png'>")

    //Step 5: click listener for buttons
    document.querySelectorAll('.step').forEach(function (step) {
        step.addEventListener("click", function () {
            var index = document.querySelector('.range-slider').value;

            //Step 6: increment or decrement depending on button clicked
            if (step.id == 'forward') {
                index++;
                //Step 7: if past the last attribute, wrap around to first attribute
                index = index > 6 ? 0 : index;
            } else if (step.id == 'reverse') {
                index--;
                //Step 7: if past the first attribute, wrap around to last attribute
                index = index < 0 ? 6 : index;
            };

            //Step 8: update slider
            document.querySelector('.range-slider').value = index;

            selectedYear = years[index]
            console.log(selectedYear)
            updatePropSymbols();


        })
    })
    //Step 5: input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function () {
        var index = this.value;
        updatePropSymbols(years[index]);
    });
};


function updatePropSymbols(attribute) {
    map.eachLayer(function (layer) {
        if (layer.feature) {
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            layer.setStyle({
                opacity: setFillOpacity(layer.feature),
                fillOpacity: setFillOpacity(layer.feature)
            })
            var popupValue = selectedYear.props
            if (feature.properties[attribute] > 0)
                popupValue = feature.properties[attribute]
            else
                popupValue = "No data"

            //add city to popup content string
         var popupContent = "<p><b>City:</b> " + props.City + "</p>";
            popupContent += "<p><b>Budget in " + years + ":</b> " + popupValue + " million</p>";
            popupContent += "<p><b>Filming Location :</b> " + props.Filming_location + "</p>";

            //add formatted attribute to panel content string
            //popupContent += "<p><b>Movie in " + selectedYear + ":</b> " + props[attribute] + "</p>";
            //add formatted attribute to panel content string
            //popupContent += "<p><b>Estimated Budget in " + selectedYear + ":</b> " + props[attribute] + "</p>";

            //update popup content            
            popup = layer.getPopup();
            popup.setContent(popupContent).update();

        };
    });
};
//Step 2: Import GeoJSON data
function getData() {
    //load the data--> geojson file can be switched out for mapand.geojson
    fetch("data/nosignmap.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            //var years = processData(json);
            minValue = calculateMinValue(json);
            //call function to create proportional symbols
            createPropSymbols(json, years);
            createSequenceControls(years);
        })
};
//something wrong with input? look at line 167
document.addEventListener('DOMContentLoaded', createMap)