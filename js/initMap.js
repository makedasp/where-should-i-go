
var map, center, marker, city;
var previousPicks = [];
var failedSearches = 0;

function callback(results, status) {
    console.log("hi");
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        randomPick = results[Math.floor(Math.random() * results.length)];
        if(!(previousPicks.includes(randomPick.name)) || failedSearches > 15) {
            failedSearches = 0;
            previousPicks.push(randomPick.name);
            createMarker(randomPick);
            displayMainLocation(randomPick);
        } else {
            console.log('already picked that');
            failedSearches += 1;
            searchPlaces();
        }
    } else {
        console.log('fuck');
        searchPlaces();
    }
}

function generateLink(place) {
    name = encodeURIComponent(place.name);
    return "https://www.google.com/maps/search/?api=1&query=" + name + "&query_place_id=" + place.id;
}

function displayMainLocation(place) {    
    console.log(place.name);
    console.log(place.vicinity);
    console.log(generateLink(place));
    $("#resultsContainer").append("<div id='results'></div>")
    $("#results").append("<div id='info'></div>")
    $("#info").append("<h2 id='resultName'>" + place.name + "</h2>");
    $("#info").append("<p id='address'>" + place.vicinity + "</p>");
    $("#address").wrap('<a target="_blank" href="' + generateLink(place) + '" />');
    try{
        $("#results").append("<img class='resultPicture' src='" + place.photos[0].getUrl({'maxWidth': 400, 'maxHeight': 300}) + "'>");
    } catch(err){
        $("#info").append("This place has no photos yet!");
    }
    $("#results").append("<div id='tryAgain'>Pick Another?</div>");
    $("#tryAgain").click(function() {
        $("#results").remove();
        marker.setMap(null);
        searchPlaces();
    });
    map.setCenter(place.geometry.location);
}
  
function createMarker(place) {
    marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        window.open(generateLink(place), '_blank')
    });
}

function getCityFromCordinates(latlng) {
    new google.maps.Geocoder().geocode({'latLng' : latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                var country = null, countryCode = null, city = null, cityAlt = null;
                var c, lc, component;
                for (var r = 0, rl = results.length; r < rl; r += 1) {
                    var result = results[r];
    
                    if (!city && result.types[0] === 'locality') {
                        for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                            component = result.address_components[c];
    
                            if (component.types[0] === 'locality') {
                                city = component.long_name;
                                break;
                            }
                        }
                    }
                    if (city) {
                        break;
                    }
                }
                $("#city").val(city);
                console.log(city);
                return city;
            }
        }
    });
}

function searchPlaces() {
    var places = ['amusement_park', 'aquarium', 'art_gallery', 'bar', 'bicycle_store', 'book_store', 'bowling_alley', 'campground', 'casino', 'clothing_store', 'department_store', 'library', 'movie_theater', 'museum', 'night_club', 'park', 'shopping_mall', 'spa', 'zoo'];
    randomPlace = places[Math.floor(Math.random() * places.length)];
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: center,
        radius: 5000,
        type: [randomPlace]
    }, callback);
    console.log(randomPlace);
}

function searchNewCity() {
    city = $("#city").val();
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': city
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            center = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            };
            console.log(center);
            map.setCenter(center);
        } else {
            alert("City not Found");
        }
    });
}

function geolocationFailed() {
    city = 'Charlotte';
    $("#city").val(city);
    console.log(city);
    
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': city
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            center = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            };
            console.log(center);
            drawMap();
        } else {
            alert("City not Found");
        }
    });
}

function drawMap() {
    var styledMapType = new google.maps.StyledMapType(
        [
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#888888"
              },
              {
                "weight": 3
              }
            ]
          },
          {
            "featureType": "landscape.man_made",
            "stylers": [
              {
                "color": "#c5c5c5"
              }
            ]
          },
          {
            "featureType": "landscape.natural",
            "stylers": [
              {
                "color": "#dddddd"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#dadada"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#fcfcfc"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#888888"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#bacbba"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#b9b8d3"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#b9b8d3"
              }
            ]
          },
          {
            "featureType": "water",
            "stylers": [
              {
                "color": "#2703f1"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#c6fbfb"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#888888"
              }
            ]
          }
        ],
        {name: 'Go Map'}
    );    

    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 15,
        mapTypeControlOptions:{
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
        }
    });
    
    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
}

function initMap() {

    //Try HTML% geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            center = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            getCityFromCordinates(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            console.log(center);
            drawMap();
        }, function() {
            geolocationFailed();
        });
    } else {
        geolocationFailed();
    }
}
  


