var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"


d3.json(queryUrl).then(function(data){
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

// Define a function that we want to run once for each feature in the features array.
// Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p> Time: ${new Date(feature.properties.time)}</p> <br><h2> Magnitude: ${feature.properties.mag}</h2>`); 
        }     
        
   

    function geojsonMarkerOptions (feature, latlng) {
        let options = {
            radius: feature.properties.mag*5,
            fillColor: markerColor(feature.geometry.coordinates[2]),
            color: markerColor(feature.geometry.coordinates[2]),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5
      }
        return L.geojsonMarkerOptions(latlng, options);
    }

// Create a GeoJSON layer that contains the features array on the earthquakeData object.
// Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: geojsonMarkerOptions
        
    });

// Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}


var depth = feature.geometry.coordinates[2]
// define color gradients based on depth
function markerColor(depth){
    for(var i=0; i< data.features.length; i++){
        var color = "";
    if (depth > 20) {
        color = "red";
    }
    else if (depth > 10) {
        color = "orange";
    }
    else if (depth > 5) {
        color = "yellow";
    }
    else {
        color = "green";
    }

    }
}


function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 20,
        id: "outdoors-v10",
        accessToken: API_KEY
      });
  
    var topo = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 20,
        id: "light-v10",
        accessToken: API_KEY
      });
  
    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
      legend.addTo(myMap);
}
