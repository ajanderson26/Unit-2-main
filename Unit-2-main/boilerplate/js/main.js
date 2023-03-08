//* Map of GeoJSON data from MegaCities.geojson */
//declare map var in global scope
var map;
var minValue;
var attribute = 'est_budget';
var allValues = [];

/*function PopupContent(properties, attribute) {
    this.properties = properties;
    this.attribute = attribute;
    this.year = attribute.split("_")[1];
    this.est_budget = this.properties[attribute];
    this.formatted = "<p><b>Filming Location:</b> " + this.popupValue + "</p><p><b>Budget in " + this.selectedYear + ":</b> " + this.Filming_location + "</p>";
};*/
//this.popupValue was properties.attribute
var years = [1996, 1998, 2001, 2004, 2007, 2009, 2012, 2014, 2018, 2021, 2023];
var selectedYear = years[0];
//function to create the Leaflet map
function createMap() {
    //create the map
    map = L.map('map', {
        center: [0, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 15,
    scrollWheelZoom: false,
    doubleClickZoom: true

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
    if (attValue)
    var radius = 1.0083 * Math.pow(attValue / minValue, 0.5715) * minRadius
    else
    var radius = 5;

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
function setInteraction(feature) {
    if (feature.properties.Date == selectedYear)
        return true;
    else
        return false;
}
//years-selectedYear
function pointToLayer(feature, latlng) {
    var attribute = "est_budget";
    //check
    console.log(attribute);
    //Determine hich attribute to visual proportional symbols
    //var attribute = "est_budget";
    //create marker option
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#f5df8f",
        color: "#000",
        weight: 1,
        opacity: setFillOpacity(feature),
        fillOpacity: setFillOpacity(feature),
        interative:setInteraction(feature)
    };
    console.log(setInteraction(feature))
    //right spot?
    //L.circleMarker(latlng, geojsonMarkerOptions)

    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    geojsonMarkerOptions.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, geojsonMarkerOptions);

    //var popups = new popupContent(feature.properties, attribute);
    //console.log(popups);


    var popupContent = "<p><b>Movie</b> " + feature.properties.Movie + "</p>";

    var popupValue;
    if (feature.properties[attribute] > 0)
        popupValue = feature.properties[attribute]
    else
        popupValue = "No data"

    //add formatted attribute to popup content string

    popupContent += "<p><b>Budget in " + feature.properties.Date + ":</b> " + popupValue + "</p>";
    popupContent += "<p><b>Filming Location :</b> " + feature.properties.Filming_location + "</p>";


    console.log(selectedYear)
    //bind the popup to the circle marker
    layer.bindPopup(popupContent);
    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//return L.circleMarker(latlng, geojsonMarkerOptions);
//Step 5: For each feature, determine its value for the selected attribute

//Step 3: Add circle markers for point features to the map years-SelectedYear
function createPropSymbols(data, years) {

    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return pointToLayer(feature, latlng);
        }
    }).addTo(map);
};

function processData(data) {
    //empty array to hold 
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
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function () {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');
            //create range input element (slider)
            container.insertAdjacentHTML('beforeend', '<input class="range-slider" type="range">')
            //add skip buttons
            container.insertAdjacentHTML('beforeend', '<button class="step" id="reverse" title="Reverse"><img src="img/reverse.png"></button>');
            container.insertAdjacentHTML('beforeend', '<button class="step" id="forward" title="Forward"><img src="img/forward_.png"></button>');

            //disable any mouse event listeners for the container
            L.DomEvent.disableClickPropagation(container);


            // ... initialize other DOM elements

            return container;
        }
    });

    map.addControl(new SequenceControl());    // add listeners after adding control}
    //create range input element (slider)
    var slider = "<input class='range-slider' type='range'></input>";
    //  document.querySelector("#panel").insertAdjacentHTML('beforeend', slider);
    document.querySelector('.range-slider').max = 10;
    document.querySelector('.range-slider').min = 0;
    document.querySelector('.range-slider').value = 0;
    document.querySelector('.range-slider').step = 1;

    // document.querySelector('#panel').insertAdjacentHTML('beforeend', '<button class="step" id="reverse"></button>');
    //document.querySelector('#panel').insertAdjacentHTML('beforeend', '<button class="step" id="forward"></button>');
    //document.querySelector('#reverse').insertAdjacentHTML('beforeend', "<img id= 'reverse-img' src='img/reverse.png'>")
    //document.querySelector('#forward').insertAdjacentHTML('beforeend', "<img id='forward-img' src='img/forward_.png'>")

    //Step 5: click listener for buttons
    document.querySelectorAll('.step').forEach(function (step) {
        step.addEventListener("click", function () {
            var index = document.querySelector('.range-slider').value;

            //Step 6: increment or decrement depending on button clicked
            if (step.id == 'forward') {
                index++;
                //Step 7: if past the last attribute, wrap around to first attribute
                index = index > 10 ? 0 : index;
            } else if (step.id == 'reverse') {
                index--;
                //Step 7: if past the first attribute, wrap around to last attribute
                index = index < 0 ? 10 : index;
            };

            //Step 8: update slider
            document.querySelector('.range-slider').value = index;

            selectedYear = years[index]
            console.log(selectedYear)
            updatePropSymbols(attribute);


        })
    })
    //Step 5: input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function () {
        var index = this.value;
        updatePropSymbols(attribute);
    });
};

function createLegend(attribute) {
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright',
        },

        onAdd: function () {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'control-legend');

            container.insertAdjacentHTML('beforeend','<p class="legend-text">Movie Budget</span></p>');

            //start attribute legend svg string
            var svg = '<svg id="legend-layer" width="150px" height="150px">';

            //array of circle names to base loop on
           // var circles = ["budgetOne", "budgetTwo", "budgetThree", "budgetFour", "budgetFive", "budgetSix", "budgetSeven", "budgetEight"];

            //manually set the stats from calcStats 
            var circles = [7000000,25000000,50000000]
        
            //container.insertAdjacentHTML('beforeend','<p class="legend-text"></span></p>');

            //loop to add each circle and text to svg string
            for (var i = 0; i < circles.length; i++) {
                //assign the r and cy attributes  
                var radius = calcPropRadius(circles[i]);
                var cy = 65- radius
                var cx = 50
                //circle string
                svg +=
                    '<circle class="st1" id="legend-layer' +
                    circles[i] +
                    '" r="' +
                    radius +
                    '"cy="' +
                    cy +
                    '" fill="#f5df8f" fill-opacity="0.4" stroke="#000000" cx="30"/>';
                //evenly space out labels            
                var textY = i * 20 + 20;
                //text string            
                svg += '<text class="legend-text-nums" id="' + circles[i] + '-text" x="70px" y="' + textY + '">' + Math.round(circles[i] * 100) / 100 + '</text>';
            };

            //close svg string
            svg += "</svg>";
            console.log(svg)

            //add attribute legend svg to container
            container.insertAdjacentHTML('beforeend', svg);

            return container;
        }
    });
    map.addControl(new LegendControl());
};



function updatePropSymbols(attribute) {
   
    map.eachLayer(function (layer) {
        if (layer.feature) {
            var props = layer.feature.properties;
            //var feature = props;

            //update each feature's radius based on new attribute values
            layer.setStyle({
                opacity: setFillOpacity(layer.feature),
                fillOpacity: setFillOpacity(layer.feature),
                interative:setInteraction(layer.feature)
            })
            var popupValue;
            if (props[attribute] > 0)
                popupValue = props[attribute]
            else
                popupValue = "No data"
            console.log(props);

            if (props.Date == selectedYear){
                layer.bringToFront()
            }

            //var popups = new popupContent(props, attribute);
            //console.log(popups);
            //add city to popup content string
            var popupContent = "<p><b>Movie:</b> " + props.Movie + "</p>";
            popupContent += "<p><b>Budget in " + selectedYear + ":</b> " + popupValue + "</p>";
            popupContent += "<p><b>Filming Location :</b> " + props.Filming_location + "</p>";

            //add formatted attribute to panel content string
            // popupContent += "<p><b>Movie in " + selectedYear + ":</b> " + props[attribute] + "</p>";
            //add formatted attribute to panel content string
            //popupContent += "<p><b>Estimated Budget in " + selectedYear + ":</b> " + props[attribute] + "</p>";

            //update popup content            
            popup = layer.getPopup();
            //popup.setContent(popupContent).update();

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
            createLegend(attribute)
        })
};

document.addEventListener('DOMContentLoaded', createMap)