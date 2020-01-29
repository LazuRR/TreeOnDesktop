function staggerFade() {
  setTimeout(function() {
    $('.fadein-stagger > *').each(function() {
      $(this).addClass('js-animated');
    })
  }, 30);
}

function skycons() {
  var i,icons = new Skycons({"monochrome": false}),
  list  = [
  "clear-day",
  "clear-night",
  "partly-cloudy-day",
  "partly-cloudy-night",
  "cloudy",
  "rain",
  "showers-day",
  "showers-night",
  "sleet",
  "rain-snow",
  "rain-snow-showers-day",
  "rain-snow-showers-night",
  "snow",
  "snow-showers-day",
  "snow-showers-night",
  "wind",
  "fog",
  "thunder",
  "thunder-rain",
  "thunder-showers-day",
  "thunder-showers-night",
  "hail"
  ],
  i;
  
  for(i = list.length; i--;) {
    var weatherType = list[i],
        elements    = document.getElementsByClassName( weatherType );
    for (e = elements.length; e--;) {
      icons.set(elements[e], weatherType);
    }
  }

  // animate the icons
  icons.play();
}

function fToC(fahrenheit) {
  var fTemp  = fahrenheit,
  fToCel = (fTemp - 32) * 5 / 9;

  return fToCel;
}

function weatherReport(latitude, longitude) {
  var apiKey       = 'c73c6b895c7af9721646af7979c9b298',
  url          = 'https://api.darksky.net/forecast/',
  lati         = latitude,
  longi        = longitude,
  api_call     = url + apiKey + "/" + lati + "," + longi + "?extend=hourly&callback=?";

  // Hold our days of the week for reference later.
  var days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
  ];

  var sunday    = [],
  monday    = [],
  tuesday   = [],
  wednesday = [],
  thursday  = [],
  friday    = [],
  saturday  = [];

  var isCelsiusChecked = $('#celsius:checked').length > 0;

  function hourlyReport(day, selector) {
    for(var i = 0, l = day.length; i < l; i++) {
      $("." + selector + " " + "ul").append('<li>' + Math.round(day[i]) + '</li>');
    }
  }

  $.getJSON(api_call, function(forecast) {

    for(var j = 0, k = forecast.hourly.data.length; j < k; j++) {
      var hourly_date    = new Date(forecast.hourly.data[j].time * 1000),
      hourly_day     = days[hourly_date.getDay()],
      hourly_temp    = forecast.hourly.data[j].temperature;

      if(isCelsiusChecked) {
        hourly_temp = fToC(hourly_temp);
        hourly_temp = Math.round((hourly_temp));
      }

      switch(hourly_day) {
        case 'Sunday':
        sunday.push(hourly_temp);
        break;
        case 'Monday':
        monday.push(hourly_temp);
        break;
        case 'Tuesday':
        tuesday.push(hourly_temp);
        break;
        case 'Wednesday':
        wednesday.push(hourly_temp);
        break;
        case 'Thursday':
        thursday.push(hourly_temp);
        break;
        case 'Friday':
        friday.push(hourly_temp);
        break;
        case 'Saturday':
        saturday.push(hourly_temp);
        break;
        default: console.log(hourly_date.toLocaleTimeString());
        break;
      }
    }

    for(var i = 0, l = forecast.daily.data.length; i < l - 1; i++) {

      var date     = new Date(forecast.daily.data[i].time * 1000),
      day      = days[date.getDay()],
      skicons  = forecast.daily.data[i].icon,
      time     = forecast.daily.data[i].time,
      humidity = forecast.daily.data[i].humidity,
      summary  = forecast.daily.data[i].summary,
      temp    = Math.round(forecast.hourly.data[i].temperature),
      tempMax = Math.round(forecast.daily.data[i].temperatureMax);

      if(isCelsiusChecked) {
        temp    = fToC(temp);
        tempMax = fToC(tempMax);
        temp = Math.round(temp);
        tempMax = Math.round(tempMax);
      }

      $("#forecast").append(
        '<li class="shade-'+ skicons +'"><div class="card-container "><div><div class="front card blue"><div>' +
        "<div class='graphic'><canvas class=" + skicons + "></canvas></div>" +
        "<div><b>Day</b>: " + date.toLocaleDateString() + "</div>" +
        "<div><b>Temperature</b>: " + temp + "</div>" +
        "<div><b>Max Temp.</b>: " + tempMax + "</div>" +
        "<div><b>Humidity</b>: " + humidity + "</div>" +
        '<p class="summary">' + summary + '</p>' +
        '</div></div><div class="back card">' +
        '<div class="hourly' + ' ' + day + '"></div></div></div></div></li>'
        );

      switch(day) {
        case 'Sunday':
        hourlyReport(sunday, days[0]);
        break;
        case 'Monday':
        hourlyReport(monday, days[1]);
        break;
        case 'Tuesday':
        hourlyReport(tuesday, days[2]);
        break;
        case 'Wednesday':
        hourlyReport(wednesday, days[3]);
        break;
        case 'Thursday':
        hourlyReport(thursday, days[4]);
        break;
        case 'Friday':
        hourlyReport(friday, days[5]);
        break;
        case 'Saturday':
        hourlyReport(saturday, days[6]);
        break;
      }
    }

    skycons(); 
    staggerFade(); 

  });
}

$('button').on('click', function(e) {
  var lat       = $('#latitude').val(),
  long      = $('#longitude').val(),
  city_name = $('#city-search').val()

  if(lat && long !== '') {
    e.preventDefault();

    $('#logo').fadeOut(100);

    $('.form').fadeOut(100, function() {
      weatherReport(lat, long);
      $('.screen').append('<button id="back" class="btn btn-primary">New Forecast</button><h3 class="city ">' + city_name + '</h3><div class="list-reset fadein-stagger" id="forecast"></div>');
    });
  }
});



$('body').on('click', '#back', function() {
  window.location.reload(true);
})


function insertGoogleScript() {
  var google_api = document.createElement('script'),
  api_key    = 'enter_your_key_here';

  google_api.src = 'https://maps.googleapis.com/maps/api/js?key='+ api_key +'&callback=initGoogleAPI&libraries=places,geometry';
  document.body.appendChild(google_api);
}


function initGoogleAPI() {
  var autocomplete = new google.maps.places.SearchBox(document.querySelector("#city-search"));

  autocomplete.addListener('places_changed', function() {
    var place = autocomplete.getPlaces()[0];
    document.querySelector("#latitude").value = place.geometry.location.lat();
    document.querySelector("#longitude").value = place.geometry.location.lng();
  });
}

insertGoogleScript();

