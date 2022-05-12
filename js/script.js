let map;
let markers = [];
let year = 2019;
let month = 1;

function toMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', {
    month: 'long',
  });
}


for(i=2015; i<2020; i++){
  for(j=1; j<13; j++){
    $('#monthSelect').append(`<option value="${i}-${j<10 ? "0"+j : j}">${toMonthName(j)} ${i}</option>`)
  }

}



function filterMonth(dateTime, year, month) {
  return dateTime.slice(0, 4) == year && dateTime.slice(5, 7) == month
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 51.5072,
      lng: -0.1276
    },
    zoom: 11,
  });

  $.get(`https://api.tfl.gov.uk/AccidentStats/${year}`, function(data) {
    console.log(data)

    const date = data.filter(dataPoint => filterMonth(dataPoint.date, year, month))
    console.log("date", date)
    $('#total').empty().append(date.length)

    $("#statsSelect").change(function() {
      switch (this.value) {
        case "Boroughs":
          $('.stats').empty().append(`<tr><th colspan="2">Boroughs</th</tr>`);;
          //boroughs
          const boroughs = [...new Set(data.map(item => item.borough))].sort()
          console.log("borough", boroughs)


          boroughs.forEach(b => {
            let count = 0;
            date.forEach(d => {
              if (d.borough == b) {
                count += 1
              }
            })
            console.log(b, count)
            $('.stats').append(`<tr>
            <td>${b}</td>
            <td>${count}</td>
          </tr>`)
          })
          break;


        case "Casualties":
          $('.stats').empty().append(`<tr><th colspan="2">Casualties</th</tr>`);
          const ages = data.map(item => item.casualties.map(cas => cas.age))
          console.log("ages", ages.flat())
          const uniqueAges = [...new Set(ages.flat())].sort();
          console.log(uniqueAges)

          $('.stats').append(`<tr><th colspan="2">Age Band</th</tr>`)
          for (i = 10; i <= 100; i += 10) {
            let count = 0
            date.forEach(d => {
              d.casualties.forEach(el => {
                if (el.age <= i) {
                  count += 1
                }
              })
            })
            console.log(i)
            $('.stats').append(`<tr>
            <td>${i-10} - ${i}</td>
            <td>${count}</td>
          </tr>`)
          }

          $('.stats').append(`<tr><th colspan="2">Casualty Type</th</tr>`)
          const casClass = [...new Set(data.map(item => item.casualties[0].class))]
          console.log("casClass", casClass)
          casClass.forEach(c => {
            let count = 0;
            date.forEach(d => {
              d.casualties.forEach(el => {
                if (el.class == c) {
                  count += 1
                }
              })
            })

            $('.stats').append(`<tr>
            <td>${c}</td>
            <td>${count}</td>
          </tr>`)
          })

          $('.stats').append(`<tr><th colspan="2">Mode of Transport</th</tr>`)
          const mode = [...new Set(data.map(item => item.casualties[0].mode))]
          console.log(mode)
          mode.forEach(m => {
            let count = 0;
            date.forEach(d => {
              d.casualties.forEach(el => {
                if (el.mode == m) {
                  count += 1
                }
              })
            })

            $('.stats').append(`<tr>
            <td>${m}</td>
            <td>${count}</td>
          </tr>`)
          })
          break;

        case "Severity":
          $('.stats').empty().append(`<tr><th colspan="2">Severity</th</tr>`);;
          //severity
          const severity = data.filter(dataPoint => dataPoint.severity == "Slight")
          console.log(severity)
          const severities = [...new Set(data.map(item => item.severity))].sort();
          console.log(severities)
          severities.forEach(s => {
            $('#severitySelect').append(`<option>${s}</option>`)
          })

          severities.forEach(s => {
            let count = 0;
            date.forEach(d => {
              if (d.severity == s) {
                count += 1
              }
            })

            $('.stats').append(`<tr>
            <td>${s}</td>
            <td>${count}</td>
          </tr>`)
          })
          break;

        case "Vehicles":
          $('.stats').empty().append(`<tr><th colspan="2">Vehicles</th</tr>`);;
          //vehicles
          const vehicles = [...new Set(data.map(item => item.vehicles[0].type))].sort();
          console.log("vehicles", vehicles)
          vehicles.forEach(v => {
            $('#vehicleSelect').append(`<option>${v.replace(/([A-Z])/g, ' $1').trim().replace(/_/g, ' ')}</option>`)
          })

          vehicles.forEach(v => {
            let count = 0;
            date.forEach(d => {
              d.vehicles.forEach(el => {
                if (el.type == v) {
                  count += 1
                }
              })
            })

            $('.stats').append(`<tr>
              <td>${v.replace(/([A-Z])/g, ' $1').trim().replace(/_/g, ' ')}</td>
              <td>${count}</td>
            </tr>`)
          })
      }
    })

    reloadMarkers(date)
  })
}

$('#monthSelect').change(function() {
  console.log(this.value)
  $('.stats').empty();
  month = this.value.slice(-2);
  year = this.value.slice(0, 4);
  console.log(this.value)
  console.log(month, year)
  $("#chosenDate").empty().append(`${toMonthName(month)} ${year}`)
  $.get(`https://api.tfl.gov.uk/AccidentStats/${year}`, function(data) {
    console.log(data)
    const date = data.filter(dataPoint => filterMonth(dataPoint.date, year, month))
    initMap()
  })
})

function reloadMarkers(data) {

  markers = []
  data.forEach(dataPoint => {
    let myLatlng = new google.maps.LatLng(dataPoint.lat, dataPoint.lon);
    let marker = new google.maps.Marker({
      position: myLatlng,
      title: "Hello World!"
    });

    // marker.setMap(map);
    let contentString = `
    <div>${dataPoint.borough} (${dataPoint.date.slice(0,10)})</div></br>
    <div>${dataPoint.location}</div></br>
    <div>${dataPoint.severity} Severity</div></br>
    <div>${dataPoint.casualties.length} Casualties</div>
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
}



window.initMap = initMap;

console.log("data")
