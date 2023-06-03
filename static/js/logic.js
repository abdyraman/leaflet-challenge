// Creating the map object
let myMap = L.map('map', {
    center: [36.778259, -119.417931],
    zoom: 5
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Use this link to get the GeoJSON data.
  let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Helper function to determine marker color based on depth
  function getColor(depth) {
    if (depth < -10) return "olive";
    else if (depth == -10) return "apple";
    else if (depth < 30) return "lime";
    else if (depth < 50) return "Peach";
    else if (depth < 70) return "Light Coral";
    else if (depth <= 90) return "Crimson";
    else if (depth >= 90) return "Burgundy";
}

     
  // Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.
  fetch(url)
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data.features, {
        pointToLayer: function (feature, latlng) {
          const magnitude = feature.properties.mag;
          const depth = feature.geometry.coordinates[2];
  
          // Calculate marker size based on magnitude
          const markerSize = magnitude * 3;
  
          // Calculate marker color based on depth
          const markerColor = getColor(depth);
  
          return L.circleMarker(latlng, {
            radius: markerSize,
            fillColor: markerColor,
            color: 'black',
            fillOpacity: 0.7,
            weight: 1 
          });
        },
        onEachFeature: onEachFeature
      }).addTo(myMap);
      // Create a legend after the GeoJSON data is loaded
      createLegend();
    });
    
  // Helper function to create popups for each feature
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>${feature.geometry.coordinates[2]}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }
  
  // // Create a legend that provides context for the map data
  // function createLegend() {
  //   let legend = L.control({ position: "bottomright" });
  //   legend.onAdd = function(map) {
  //     let div = L.DomUtil.create("div", "legend");
  //     let depthValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
  //     let labels = [];
  
  //     // Add title to the legend
  //     div.innerHTML = "<h3>Depth Legend</h3>";
  
  //     // Loop through depth values and create labels with corresponding colors
  //     for (let i = 0; i < depthValues.length; i++) {
  //       div.innerHTML +=
  //         '<i style="background:' + getColor(depthValues[i]) + '"></i> ' +
  //         depthValues[i] + (depthValues[i + 1] ? '&ndash;' + depthValues[i + 1] + '<br>' : '+');
  //     }
  
  //     // Append the legend to
  //     // Append the legend to the map
  //     legend.addTo(map);

  //     return div;
  //   };
  
  //   // Add the legend to the map
  //   legend.addTo(myMap);
  // }
  