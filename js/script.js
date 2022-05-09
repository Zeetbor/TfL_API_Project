let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 51.5072,
      lng: -0.1276
    },
    zoom: 11,
  });

  const infoWindow = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true,
  });

  // var marker = new google.maps.Marker({
  //   position: {
  //     lat: 51.5072,
  //     lng: -0.1276
  //   },
  //   title: "Hello World!"
  // });
  //
  // // To add the marker to the map, call setMap();
  // marker.setMap(map);

  let year = 2019;
  $.get(`https://api.tfl.gov.uk/AccidentStats/${year}`, function(data) {
    console.log(data[0])

    const markers = locations.map((position, i) => {
      const label = labels[i % labels.length];
      const marker = new google.maps.Marker({
        position,
        label,
      });
      // markers can only be keyboard focusable when they have click listeners
      // open info window when marker is clicked
      marker.addListener("click", () => {
        infoWindow.setContent(label);
        infoWindow.open(map, marker);
      });
      return marker;
    });

    const markers = data.forEach(dataPoint => {
      let myLatlng = new google.maps.LatLng(dataPoint.lat, dataPoint.lon);
      let marker = new google.maps.Marker({
        position: myLatlng,
        title: "Hello World!"
      });

      marker.addListener("click", () => {
        infoWindow.setContent();
        infoWindow.open(map, marker);
      });
      return marker;
    });
    marker.setMap(map);
  })
  new markerClusterer.MarkerClusterer({
    markers,
    map
  });
})
}

// var myLatlng = new google.maps.LatLng(51.5072, -0.1276);
// var mapOptions = {
//   zoom: 4,
//   center: myLatlng
// }
// var map = new google.maps.Map(document.getElementById("map"), mapOptions);
//
// var marker = new google.maps.Marker({
//   position: myLatlng,
//   title: "Hello World!"
// });
//
// // To add the marker to the map, call setMap();
// marker.setMap(map);

window.initMap = initMap;

// $.ajax({
//   url: "",
//   type: "GET",
// })

console.log("data")







// new google.maps.Marker({
//   position: {
//     lat: 51.5072,
//     lng: -0.1276
//   },
//   map,
//   title: "Hello World!",
// });
