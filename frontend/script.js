mapboxgl.accessToken =
  "pk.eyJ1IjoiY2xhZXNqb25hc2dpbGwiLCJhIjoiY2s3cDhqbGNmMDBrMjNtbHJnZjcwenV5cyJ9.1u0TbeFhs8tHULPEWVWsrQ";
var map = new mapboxgl.Map({
  container: "map",
  center: [12.90903540439615, 54.242037065804084],  //[10.74609, 59.91273],
  zoom: 2.25,
  style: "mapbox://styles/mapbox/streets-v11"
});
let attrib;
map.on("load", async function() {
  
  let data = await getExternalData()
  let stats = data[1]

  if(stats != undefined){
    let stat = document.getElementById("stats")
    stat.innerHTML = `
      <h2>World</h2>
      <strong>
      😷: ${stats.confirmed} <br>
      👍: ${stats.recovered} <br>
      🌹: ${stats.deaths}    <br>
      🌎: ${stats.countries} <br>
      🗄️: <strong style="color: green;">${stats.updated}</strong><br>
      </strong>
    `
  } else {
    let stat = document.getElementById("stats")
    stat.innerHTML = `
      <h2>World</h2>
      <strong>
      😷: ${156102} <br>
      👍: ${72624}  <br>
      🌹: ${5819}   <br>
      🌎: ${143}    <br>
      🗄️: <strong style="color: red;">2020-03-13</strong>
      </strong>     <br>
    `
  }

  map.addSource("cities", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: await data[0]
    },
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "cities",
    filter: ["has", "point_count"],
    paint: {
      "circle-stroke-color": "#000000",
      "circle-stroke-width": 1,
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        5,
        "#f1f075",
        20,
        "#f28cb1"
      ],
      "circle-radius": [
        "step",
        ["get", "point_count"],
        20, 
        5,
        30, 
        20,
        40 
      ]
    }
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "cities",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12
    }
  });

  map.loadImage("images/warning.png", function(error, image) {
    if (error) throw error;
    map.addImage("custom-marker", image);
    map.addLayer({
        id: "unclustered-point",
        type: "symbol",
        source: "cities",
        filter: ["!", ["has", "point_count"]],
        layout: {
          "icon-image": "custom-marker",
          "icon-size": 0.05
        }
      });
  });


  map.on("click", "clusters", function(e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"]
    });
    var clusterId = features[0].properties.cluster_id;
    map
      .getSource("cities")
      .getClusterExpansionZoom(clusterId, function(err, zoom) {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom
        });
      });
  });

  map.on("click", "unclustered-point", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description
    const city = e.features[0].properties.city
    const count = e.features[0].properties.count
    const deaths = e.features[0].properties.deaths
    const recoveries = e.features[0].properties.recovered || 0

    const message = `<div style='margin: 10px;'><strong>${city}</strong><p>😷: ${count} <br>👍: ${recoveries} <br>🌹: ${deaths}</p></div>`

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(message)
      .addTo(map);
  });

  map.on("mouseenter", "clusters", function() {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", function() {
    map.getCanvas().style.cursor = "";
  });
  map.on("mouseenter", "unclustered-point", function() {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "unclustered-point", function() {
    map.getCanvas().style.cursor = "";
  });

  attrib = document.getElementsByClassName("mapboxgl-ctrl-attrib-inner")[0]
  let newAttrib = document.createElement("a")
  newAttrib.href = "http://claesgill.com"
  newAttrib.innerText = "© Claes Gill "
  let newAttrib2 = document.createElement("a")
  newAttrib2.href = "https://github.com/ExpDev07/coronavirus-tracker-api"
  newAttrib2.innerText = "Dataset "
  
  attrib.insertBefore(newAttrib,  attrib.firstChild)
  attrib.insertBefore(newAttrib2, attrib.firstChild)

});

