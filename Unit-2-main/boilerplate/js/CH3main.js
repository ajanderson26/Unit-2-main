//function jsAjax(){
//define a variable to hold the data--> why is it not defined? what should it equal?
//var myData;

//I do not understand the point of having the variable above if we include the URL here --> what is myData suppose to do? 
//explain example 3.6
// fetch('data/MegaCities.geojson')
//.then(function(response){
// return response.json();
// }) 
//.then(function(response){
//  myData = response;

//check the data
// console.log(myData)
// }) 

//check the data
//console.log(myData)
//};

//the function executes when the event is loaded --> i moved this to the top of the script because I think it makes more sense but it does the same thing as window.onload
document.addEventListener('DOMContentLoaded', initialize)
//initialize function called when the script loads
function initialize() {
   debugAjax();
    cities();
};
//it is so silly that you have to write cities before it is defined in the function but I think its like naming the recipe before the instructions tell you what is in the recipe. 
function cities() {
    var cityPop = [
        {
            city: 'Madison',
            population: 233209
        },
        {
            city: 'Milwaukee',
            population: 594833
        },
        {
            city: 'Green Bay',
            population: 104057
        },
        {
            city: 'Superior',
            population: 27244
        }
        //creates array that contains city and population data --> this is like naming the ingredients of the recipe and how much of each ingredient to add in.
    ];
    //create a table element
    var table = document.createElement("table");

    //makes the header of the table which is the element that was created above
    var headerRow = document.createElement("tr");
    table.appendChild(headerRow);

    //create the "City" and "Population" column headers --> <th> with the city in the tag means that the City header goes in the <th> section of the wireframe and same for Population
    headerRow.insertAdjacentHTML("beforeend", "<th>City</th><th>Population</th>")

    //forEach is a loop element i think? It calls the loop function? This section confuses me a bit no matter how long I look through the example I could not get the loop to work in the chapter practice and I need to be walked through step by step
    cityPop.forEach(function (cityObject) {
        //assign longer html strings to a variable --> not sure what this comment means but it was in the answer key. I also need this explained.
        var rowHtml = "<tr><td>" + cityObject.city + "</td><td>" + cityObject.population + "</td></tr>";
        table.insertAdjacentHTML('beforeend', rowHtml); //inserts html snippet into the table --> 
    })

    //append the table element to the div--> I also need this explained to me--> longer way to do the operation .intersetAdjacentHTML--> appends a child element?--> example rows are a "child" to the 'table' element
    document.querySelector("#myDiv").appendChild(table);

    addColumns(cityPop);
    addEvents();

};

//This function adds a column called cityPop to the table 
function addColumns(cityPop) {


    //This calls all the rows that are in the wire frame section called tr
    var rows = document.querySelectorAll("tr")

    //This loops the new column cityPop into the table --> methods have dots functions do not
    document.querySelectorAll("tr").forEach(function (row, i) {

        if (i == 0) {
            //this conditional statement tells the computer when to create a new row

            row.insertAdjacentHTML('beforeend', '<th>City Size</th>'); //this function says what row or column the variable goes and what should go there, city sizes go in this column

        } else {

            var citySize;

            if (cityPop[i - 1].population < 100000) {
                citySize = 'Small';

            } else if (cityPop[i - 1].population < 500000) {
                citySize = 'Medium';

            } else {
                citySize = 'Large';
            };

            row.insertAdjacentHTML('beforeend', '<td>' + citySize + '</td>')
            //this gives direction on where citySize needs to go in the table and the part of the wireframe it belongs
        };
    });
};

function addEvents() {
    //this function makes the text change to a random color when the mouse hoovers over --> function is called whenever a specialized event occurs

    //adds this function to the table 
    table = document.querySelector("table");

    //the event occurs when the user puts their mouse over the event
    document.querySelector("table").addEventListener("mouseover", function () {

        var color = "rgb(";
        //generate random color
        for (var i = 0; i < 3; i++) {

            var random = Math.round(Math.random() * 255);

            //rounds number to the closets whole number and then multiples 255 which is max amount of color for rgb color scheme

            color += random;
            // This allows for a random color to picked when the event is called 

            if (i < 2) {
                color += ",";

            } else {
                color += ")";
            };
        }

        table.style.color = color;


    });
    //this allows for when the text of the table is clicked on the pop up comes up --> the event is clicking?
    function clickme() {
        //this is the message that pops up when the event is called --> the function must be called and then the EventListener is added 
        alert('Hey, you clicked me!');
    };

    //event listener for the click of the mouse
    table.addEventListener("click", clickme)
};

//window.onload = initialize();

//Defining the callback response? 
function debugCallback(myData) {
    document.querySelector("#myDiv").insertAdjacentHTML('beforeend', 'GeoJSON data: ' + JSON.stringify(myData))
    //debugCallback(response.json());
};
function debugAjax() {
    //delcaring the variable myData
    var myData;

    //changed the "" to '' and is a basic fetch function
    fetch('data/MegaCities.geojson')
        .then(function (response) {
            //conversion method is added
            return response.json();
        })
        .then(function (response) {
            myData = response;
            debugCallback(myData)
            //check the data
            console.log(myData)
        })

    //check the data
    console.log(myData)
};

//myDiv needed to be capitalized
//document.querySelector("#myDiv").insertAdjacentHTML('beforeend', '<br> GeoJSON data: </br>' + JSON.stringify(myData))

//myDiv needed to be capitalized
document.querySelector("#myDiv").insertAdjacentHTML('beforeend', 'GeoJSON data: ' + JSON.stringify(myData));

//is 'DOMContentLoaded' Necessary? is it in the right place?
//document.addEventListener('DOMContentLoaded', debugAjax)

