let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 51.5072,
      lng: -0.1276
    },
    zoom: 11,
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
    console.log(data)
    const borough = data.filter(dataPoint => dataPoint.borough == "Barnet")
    console.log(borough)

    const severity = data.filter(dataPoint => dataPoint.severity == "Slight")
    console.log(severity)

    function filterMonth(dateTime, year, month){
      return dateTime.slice(0,4) == year && dateTime.slice(5,7) == month
    }

    const date = data.filter(dataPoint => filterMonth(dataPoint.date, "2019", "01"))
    console.log(date)

    // const timeStamp = "2019-02-14T17:54:00Z"
    // const date = new Date("2019-02-14T17:54:00Z")
    // console.log(timeStamp.slice(0,4))
    // console.log(timeStamp.slice(5,7))

    // const markers = locations.map((position, i) => {
    //   const label = labels[i % labels.length];
    //   const marker = new google.maps.Marker({
    //     position,
    //     label,
    //   });
    //   // markers can only be keyboard focusable when they have click listeners
    //   // open info window when marker is clicked
    //   marker.addListener("click", () => {
    //     infoWindow.setContent(label);
    //     infoWindow.open(map, marker);
    //   });
    //   return marker;
    // });


    const markers = [];

    date.forEach(dataPoint => {
      let myLatlng = new google.maps.LatLng(dataPoint.lat, dataPoint.lon);
      let marker = new google.maps.Marker({
        position: myLatlng,
        title: "Hello World!"
      });

      // marker.setMap(map);
      let contentString = `
      <div>${dataPoint.location}</div>
      <div>${dataPoint.severity}</div>
      <div></div>
      `

      // ${dataPoint.vehicles.forEach(vehicle => vehicle.split("_").join(""))}

      let infoWindow = new google.maps.InfoWindow({
        content: contentString,
        disableAutoPan: true,
      });

      marker.addListener("click", () => {
        // infoWindow.setContent();
        infoWindow.open(map, marker);
      });
      return markers.push(marker);
    });
    new markerClusterer.MarkerClusterer({
      map,
      markers
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
