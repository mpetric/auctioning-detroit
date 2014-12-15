//Hide footer on small screens

if ($(window).width() < 1200) {
    $('#footer').css("display", "none");
}


// Set location of points geoJson

var geoJsonFile = './js/auction_points.geojson';


// Set up map and turn off default zoom control

var map = L.map('map', {
    zoomControl: false
})

    .setView([42.371427, -83.045754], 12);

// Add zoom control to top right of screen

map.addControl(L.control.zoom({
    position: 'topright'
}))


// Create variable for basemap

var darkGreyColor = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';

// Add basemap to map

L.tileLayer(darkGreyColor, {
    maxZoom: 18
}).addTo(map);
map.attributionControl.setPrefix('');

// Add address search using geosearch plugin

new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.Google()
}).addTo(map);

// Tell leaflet location of image folder for Markers (since locally hosted)

L.Icon.Default.imagePath = 'images/';

// Load external geoJson and style markers for points according to style function

$.getJSON(geoJsonFile, function (data) {
    var geojsonLayer = L.geoJson(data.features, {
        onEachFeature: makeMarkers,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, style(feature) //style(feature) loads style from function above
            );
        }
    }).addTo(map);
});

// Create Info Control for Neighborhood Layer
var info = L.control({
    position: 'bottomright'
});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h5>Neighborhood:</h5>' +  (props ?
        '<b><div id="offset">' + props.NHOOD + '</b></div>' + '<h5>Auctions:</h5><b><div id="offset">' +  props.Count_ + ' homes</b></div>'
        : '<div id="offset"><b>Hover over a neighborhood</b></div>');
};

info.addTo(map);

// Load external geojson file for neighborhood polygons, style, and turn on mouseover and zoom effects

var myStyle = {
    "color": "rgb(125,125,125)",
    "weight": 2,
    "opacity": .25,
    "fillColor": "rgb(25,25,25)",
    "fillOpacity": 0
};

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'rgb(150,150,150)',
        opacity: .85,
        fillColor: 'rgb(25,25,25)',
        fillOpacity: 0
    });
    layer.bringToBack();
    info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(neighborhoods, {
            style: myStyle,
            onEachFeature: onEachFeature
        }).addTo(map);

// Return color and radius of point marker based on auction close price

function getColor(x) {
    return x > 50000 ? "#005a32" : x > 25000 ? "#238b45" : x > 10000 ? "#41ab5d" : x > 5000 ? "#74c476" : x > 1000 ? "#a1d99b" :
        "#c7e9c0";
}

function getFontColor(z) {
    return z > 10000.1 ? "white" :
        "#191919";
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


//Create legend based off of getColor function

var legend = L.control({
    position: 'bottomleft'
});
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'legend'),
        grades = [0, 1000, 5000, 10000, 25000, 50000],
        labels = ['<strong><span id="legendTitle"> Sale Price </span></strong>'],
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


//Create function to format number with thousands seperator for square feet

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}


//Setup on click and mouseover actions

function makeMarkers(feature, layer) {
    var thisFeature = feature.properties;
    //console.log(feature);

    layer.on("click", function (e) {
        var priceFormat = accounting.formatMoney(thisFeature.price, "$", 0, ",", "."); //accesses accounting.js to format into currency
        var priceFormatNGBH = accounting.formatMoney(thisFeature.sale_summaries_NGBR_AVG, "$", 0, ",", ".");
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
        //end formatting for date
        // map.panTo(new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]));
        $('#address').text(thisFeature.address)
        var thisPropertyWidth = Math.log10(thisFeature.price)*Math.log10(thisFeature.price)*Math.log10(thisFeature.price)*4.6;
        $('#thisProperty').text(thisFeature.address).css({"width" : thisPropertyWidth, "background-color" : getColor(thisFeature.price), "color" : getFontColor(thisFeature.price)})
        $('#bedrooms').text(thisFeature.bedrooms)
        $('#squareFeet').text(squareFeetFormat)
        $('#price').text(priceFormat)
        $('#priceChart').text(priceFormat)
        $('#priceChartNGBH').text(priceFormatNGBH)
        $('#bathrooms').text(thisFeature.bathrooms)
        $('#saleDate').text(formattedDate)
        $('#yearBuilt').text(thisFeature.YEARBUILT)
        $('#full_url').attr("href", thisFeature.full_url)
        $('#full_url_2').attr("href", thisFeature.full_url)
        $('#housePhoto').attr("src", "./" + thisFeature.image)
        $('#neighborhoodAvg').text(thisFeature.sale_summaries_NGBR_AVG)
        $('#neighborhood').text(thisFeature.MPSUBSEC01)
        var neighborhoodWidth = Math.log10(thisFeature.sale_summaries_NGBR_AVG)*Math.log10(thisFeature.sale_summaries_NGBR_AVG)*Math.log10(thisFeature.sale_summaries_NGBR_AVG)*4.6;
        $('#neighborhoodName').text(thisFeature.MPSUBSEC01).css({"width" : neighborhoodWidth, "background-color" : getColor(thisFeature.sale_summaries_NGBR_AVG), "color" : getFontColor(thisFeature.sale_summaries_NGBR_AVG)})
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
        $('.closeFooter').show();
    });

    $('.closeFooter').click(function () {
        $('#footer').animate({
            bottom: "-270px"
        });
        $(this).hide();
        $('.open').show();
    });
});


// Script for About Page
$('#about').on('click',function(){
    $('#mask').fadeIn(250);
    $('.popup').fadeIn(250);
    $('.popupBackground').fadeIn(250);
});

$('#close').on('click',function(){
    $('.popup').fadeOut(250);
    $('.popupBackground').fadeOut(250);
    $('#mask').fadeOut(250);
});

//Turn off info window if small display; run function at end of script to override div info creation
if ($(window).width() < 1000) {
    $('.info').css("display", "none");
}