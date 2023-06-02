// Creating the map object
let myMap = L.map('map', {
    center: [39.0997, -124.0179],
    zoom: 4.5
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Use this link to get the GeoJSON data.
  let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  let values = [];
  let colors = [];
  
  // Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.
  fetch(url)
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data.features, {
        pointToLayer: function (feature, latlng) {
          const magnitude = feature.properties.mag;
          const depth = feature.geometry.coordinates[2];
  
          // Calculate marker size based on magnitude
          const markerSize = magnitude * 5;
  
          // Calculate marker color based on depth
          values.push(depth);
          const markerColor = getColor(depth);
  
          return L.circleMarker(latlng, {
            radius: markerSize,
            fillColor: markerColor,
            color: 'black',
            fillOpacity: 0.5
          });
        },
        onEachFeature: onEachFeature
      }).addTo(myMap);
  
      // Create a legend after the GeoJSON data is loaded
      createLegend();
    });
  
  // Helper function to determine marker color based on depth
  function getColor(depth) {
    // Define color range based on depth values
    const colors = [
      "green",
      "lightgreen",
      "yellow",
      "orange",
      "red",
      "darkred"
    ];
  
    // Find the appropriate color based on the depth value
    if (depth <= 10) {
      return colors[0];
    } else if (depth <= 30) {
      return colors[1];
    } else if (depth <= 50) {
      return colors[2];
    } else if (depth <= 70) {
      return colors[3];
    } else if (depth <= 90) {
      return colors[4];
    } else {
      return colors[5];
    }
  }
  
  // Helper function to create popups for each feature
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>${feature.geometry.coordinates[2]}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }
  
  // Create a legend that provides context for the map data
  function createLegend() {
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
  
      // Define the legend values and colors
      let limits = calculateLegendLimits(values);
      let colors = calculateLegendColors(limits.length);
  
      // Your visualization should look something like the preceding map.
      // Add the minimum and maximum.
      let legendInfo = "<h1>Depth of the earthquake</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo;
      limits.forEach(function(limit, index) {
        div.innerHTML += "<li style=\"background-color: " + colors[index] + "\"></li>";
      });
  
      return div;
    };
  
    // Adding the legend to the map
    legend.addTo(myMap);
  }
  