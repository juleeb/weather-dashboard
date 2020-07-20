//global variables for API key and cities array list
var apiKey = "dfb281a5342bc115d550aeb0a30860b6";
var cities = localStorage.getItem("searchHistory") ? JSON.parse(localStorage.getItem("searchHistory")) : []

//display weather on HTML and retrive data using AJAX
function display(city = $("#searchtext").val().trim()) {
// var city = $(this).attr("data-name");
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {

        var iconcode = response.weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

        $(".name").text(response.name);
        $(".date").text(new Date(response.dt*1000).toLocaleDateString());
        $(".temperature").text("Temperature (F): " + ((response.main.temp- 273.13) * 1.80 +32).toFixed(2));
        $(".humidity").text("Humidity: " + response.main.humidity + " %");
        $(".wind").text("Wind Speed: " + response.wind.speed + " MPH");
        $(".icon").attr('src', iconurl);

        uvindex(response.coord.lon,response.coord.lat);
        fivedays(city);
      });
};

//retreive data using AJAX for UV index using latitude and longitude
function uvindex(lon, lat) {
  
  var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid="+ apiKey + "&lat=" + lat + "&lon=" + lon;
  $.ajax({
    url:uvURL,
    method:"GET"
    }).then(function(response){
        $(".uv").html(`UV Index: <span>${response.value}</span>`);
    });

}

//retrieve data using AJAX on five days forecast
function fivedays(city) {
    var queryURLfive = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

        $.ajax({
            url: queryURLfive,
            method: "GET"
          }).then(function(response) {
      
            for (var i = 0; i < 5; i ++) {

          var iconcode = response.list[((i+1)*8)-1].weather[0].icon;
          var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

            $(".date" + i).text(new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString());
            $(".humidity" + i).text("Humidity: " + response.list[((i+1)*8)-1].main.humidity + " %");
            $(".temperature" + i).text("Temp (F): " + ((response.list[((i+1)*8)-1].main.temp - 273.13) * 1.80 +32).toFixed(2));
            $(".image" + i).attr("src", iconurl);
            }
          });
}

//function to create list on searched cities
function renderButtons() {
    $("#city-input").empty();

    for (var i = 0; i < cities.length; i++) {
    var add = $("<button>");
    add.addClass("city");
    add.attr("data-name", cities[i]);
    add.text(cities[i]);
    $("#city-input").append(add);
    }
};

//eventlistener for searching input city name and store to local storage
$("#search-city").on("click", function(event) {
    event.preventDefault();
    var city = $("#searchtext").val().trim();
    cities.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(cities))
    renderButtons();
    display();
});

//eventlistener to display on page
$(document).on("click", ".city", (e)=>display(e.target.textContent));

renderButtons();
