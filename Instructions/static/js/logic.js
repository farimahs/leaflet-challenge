//USGS earthquake data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"


d3.json(queryUrl).then(function(data){
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

// Defining a function that runs once for each feature in the features array.
// Giving each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p> Time: ${new Date(feature.properties.time)}</p> <br><h2> Magnitude: ${feature.properties.mag}</h2>`); 
        }     
        
   

    function createMarker (feature, latlng) {
        let options={
            radius: feature.properties.mag*5,
            fillColor: markerColor(feature.geometry.coordinates[2]),
            color: markerColor(feature.geometry.coordinates[2]),
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
        }
        return L.circleMarker(latlng, options)
    }

        
    

// Creating a GeoJSON layer that contains the features array on the earthquakeData object.
// Running the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
        
    });
// Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}

function markerColor(depth){
    
    
    if (depth > 20) {
        return "red";
    }
    else if (depth > 10) {
        return "orange";
    }
    else if (depth > 2) {
        return "yellow";
    }
    else {
        return "green";
    }

}

//Adding a legend to the map
let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 2, 10, 20],
    labels = [];

// loop through density intervals and generate a label with a colored square for each interval
    for (i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};



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
