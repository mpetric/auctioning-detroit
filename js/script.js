// Set up map and turn off default zoom control

var map = L.map('map', {
    zoomControl: false
})
    .setView([42.381427, -83.045754], 12);

// Add zoom control to top right of screen

map.addControl(L.control.zoom({
    position: 'topright'
}))

// Create two variable for basemap options

var standardColor = 'http://{s}.tiles.mapbox.com/v3/examples.map-i875mjb7/{z}/{x}/{y}.png';
var darkGreyColor = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';

// Add basemap to map

L.tileLayer(darkGreyColor, {
    maxZoom: 18
}).addTo(map);

// Add address search using geosearch plugin

new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.Google()
}).addTo(map);

// Tell leaflet location of image folder for Markers (since locally hosted)

L.Icon.Default.imagePath = 'images/';


// Return color and radius based on value

function getColor(x) {
    return x > 50000 ? "#005a32" : x > 25000 ? "#238b45" : x > 10000 ? "#41ab5d" : x > 5000 ? "#74c476" : x > 1000 ? "#a1d99b" :
        "#c7e9c0";
}

function getRadius(r) {
    return r > 50000 ? "12.5" : r > 25000 ? "11" : r > 10000 ? "10" : r > 5000 ? "9" : r > 1000 ? "8.5" :
        "8";
}

// Setup style function which passes elements through getColor and getRadius functions

function style(feature) {
    return {
        "fillColor": getColor(feature.properties.price),
            "opacity": 1,
            "radius": getRadius(feature.properties.price),
            "color": "#000",
            "weight": 1,
            "fillOpacity": 0.8
    };
}


// Load external geoJson and style markers according to style function

$.getJSON('./js/auction_points.geojson', function (data) {
    var geojsonLayer = L.geoJson(data.features, {
        onEachFeature: makeMarkers,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, style(feature) //style(feature) loads style from function above
            );
        }
    }).addTo(map);
});


//Create legend based off of getColor function

var legend = L.control({
    position: 'bottomleft'
});
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1000, 5000, 10000, 25000, 50000],
        labels = ['<strong> Sale Price </strong>'],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1] - 0;

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> $' + from + (to ? '&ndash;$' + to : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};
legend.addTo(map);


//Create function to format number with thousands seperator

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}


//Setup on click and mouseover actions

function makeMarkers(feature, layer) {
    var thisFeature = feature.properties;
    console.log(thisFeature);
    layer.on("click", function (e) {
        var priceFormat = accounting.formatMoney(thisFeature.price, "$", 0, ",", "."); //accesses accounting.js to format into currency
        var squareFeetFormat = numberWithCommas(thisFeature.squareFeet); //format square feet with thousands seperator
        //begin formatting for date
        var year = thisFeature.saleDate.substring(0, 4);
        var month = thisFeature.saleDate.substring(5, 7);
        var day = thisFeature.saleDate.substring(8, 10);
        var name = month
        if (name == "01") {
            var monthName = "January";
        }
        if (name == "02") {
            var monthName = "February";
        }
        if (name == "03") {
            var monthName = "March";
        }
        if (name == "04") {
            var monthName = "April";
        }
        if (name == "05") {
            var monthName = "May";
        }
        if (name == "06") {
            var monthName = "June";
        }
        if (name == "07") {
            var monthName = "July";
        }
        if (name == "08") {
            var monthName = "August";
        }
        if (name == "09") {
            var monthName = "September";
        }
        if (name == "10") {
            var monthName = "October";
        }
        if (name == "11") {
            var monthName = "November";
        }
        if (name == "12") {
            var monthName = "December";
        }
        var formattedDate = monthName + " " + day + ", " + year;
        //console.log(formattedDate);
        //end formatting for date
        map.panTo(new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]));
        $('#address').text(thisFeature.address)
        $('#bedrooms').text(thisFeature.bedrooms)
        $('#squareFeet').text(squareFeetFormat)
        $('#price').text(priceFormat)
        $('#bathrooms').text(thisFeature.bathrooms)
        $('#saleDate').text(formattedDate)
        $('#yearBuilt').text(thisFeature.YEARBUILT)
        $('#neighborhood').text(thisFeature.MPSUBSEC01)
        $('#full_url').attr("href", thisFeature.full_url)
        $('#full_url_2').attr("href", thisFeature.full_url)
        $('#housePhoto').attr("src", "./" + thisFeature.image)
    });
    layer.on({
        mouseover: function over(e) {
            layer.bindPopup(L.popup().setContent(thisFeature.address))
            layer.openPopup()
        },
        mouseout: function out(e) {
            layer.closePopup()
        }
    });
}


//Script for Footer
$(document).ready(function () {
    $('.open').click(function () {
        $('#footer').animate({
            bottom: 0
        });
        $(this).hide();
        $('.close').show();
    });

    $('.close').click(function () {
        $('#footer').animate({
            bottom: "-233px"
        });
        $(this).hide();
        $('.open').show();
    });
});