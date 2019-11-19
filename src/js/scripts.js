$(document).ready(function () {

    // Get Location 
    navigator.geolocation.getCurrentPosition(success, error);

    function success(pos) {
      var lat = pos.coords.latitude;
      var long = pos.coords.longitude;
      weather(lat, long);
    }

    function error() {
      console.log('There was an error');
    }

    // Call Weather
    function weather(lat, long) {
      var URL = 'http://maps.openweathermap.org/maps/2.0/weather/TA2/{z}/{x}/{y}?date=1527811200&opacity=0.9&fill_bound=true&appid=68bebcc7bc23207ab063d92d18e2323f'
      $.getJSON(URL, function(data) {
        updateDOM(data);
      });
    }

    // Update Dom
    function updateDOM(data) {
      var city = data.name;
      var temp = Math.round(data.main.temp_max);
      var desc = data.weather[0].description;
      var icon = data.weather[0].icon;

      $('#city').html(city);
      $('#temp').html(temp);
      $('#desc').html(desc);
      $('#icon').attr('src', icon);
    }
  });