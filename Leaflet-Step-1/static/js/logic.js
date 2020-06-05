// Defining the URL json to take the data from 
var URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'

// Using d3 to pull the JSON data from the URL 
d3.json(URL, function(data) {
  // Displaying the data 
    console.log(data);

  // Calling the function created earlier which includes creating the map. 
    createFeatures(data.features);

});

// Building a function for binding popup and calling another function. 
function createFeatures(earthquakeData) {

// Defining the earthquake variable in geoJSON format 
  var earthquakes = L.geoJSON(earthquakeData, {

    // Bind popup on each feature explaining the magnitude, location, and time of the quake. 
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>The magnitude of this quake was " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
        "</h3><hr><p> Time: " + new Date(feature.properties.time) + "</p>");
    },
    
    // making a circle on each feature with a color and size based on magnitude. 
    pointToLayer: function (feature, position) {
      return new L.circle(position,
        {radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: .8,
        color: "#000",
        stroke: true,
        weight: .3
    })
  }

  });

  // Sending our earthquakes layer to the createMap function
  createmap(earthquakes);

  // Create a legend to display information about our map
  var info = L.control({
    position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend"
  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  // Add the info legend to the map
  info.addTo(map);



}


function createmap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18, 
    id: 'mapbox/outdoors-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWJkdWxsYWgxMDEyOTgiLCJhIjoiY2thd29qZTNhMWQzZjJyb2N5Y24yZWNoNSJ9.5t-lSJRAfJ9XUjLc70GYzw'
  }) 


  var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18, 
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWJkdWxsYWgxMDEyOTgiLCJhIjoiY2thd29qZTNhMWQzZjJyb2N5Y24yZWNoNSJ9.5t-lSJRAfJ9XUjLc70GYzw'
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


}

  // Create the range for the colors based on the magnitude of the earthquake
  function getColor(circle){
    return circle > 5 ? "#CB4335":
    circle  > 4 ? "#F39C12":
    circle > 3 ? "#F8C471":
    circle > 2 ? "#F7DC6F":
    circle > 1 ? "#FEF9E7":
             "#A9DFBF";
  }

  //Change the maginutde of the earthquake by a factor of 25,000 for the radius of the circle. 
  function getRadius(radius){
    return radius*20000
  }
