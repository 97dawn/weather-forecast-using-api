function search(searchValue, callBack){
    $.ajax({
        url: "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+searchValue+"')&format=json&callback=?",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "callBack",
        success: function(data) {
            var results=data.query.results;
            var weeklyWeather = results.channel.item.forecast;
            var htmlFormat = "<div class=\"weather-box\"> <p>Weather</p><p>City: "+ results.channel.location.city+"</p>"+"<p>Date/Time: "+results.channel.item.condition.date+"</p>";

            htmlFormat += "<div class=\"weather-content\"> <strong> Current Conditions:</strong><br>"+"<p>"+results.channel.item.condition.text+"</p>"+"<strong> Forecast: </strong>";

            for(var i=0; i<5 ; i++){
                var w = weeklyWeather[i];
                var tag = "<p>"+w.day+" - "+w.text+". High: "+w.high+" Low: "+w.low+"</p>";
                htmlFormat += tag;
            }
            var url = results.channel.link.split("*")
            htmlFormat += "<a href=\""+url[1]+"\"> Full Forecast at Yahoo! Weather</a><p>(provided by <a href=\"https://weather.com/\"> The Weather Channel</a>)</p></div></div>";
            callBack(htmlFormat);
        },
        error: function(request,status,error){
            var msg = "<p>";
            if (request.status === 0) {
                msg += "Not connect.\n Verify Network.";
            } else if (request.status == 404) {
                msg += "Requested page not found. [404]";
            } else if (request.status == 500) {
                msg += "Internal Server Error [500].";
            } else if (error === "parsererror") {
                msg += "Requested JSON parse failed.";
            } else if (error === "timeout") {
                msg += "Time out error.";
            } else if (error === "abort") {
                msg += "Ajax request aborted.";
            } else {
                msg += "Uncaught Error.\n" + request.responseText;
            }
            msg +="</p>";
            callBack(msg);
        }

    });
}