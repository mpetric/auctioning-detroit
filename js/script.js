// Set up map and turn off default zoom control

var map = L.map('map', {
    zoomControl: false
})
    .setView([42.381427, -83.045754], 12);

// Add zoom control to top right of screen

map.addControl(L.control.zoom({
    position: 'topright'
}))

// Create two variables for basemap options

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
        //console.log(formattedDate);
        //end formatting for date
        map.panTo(new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]));
        $('#address').text(thisFeature.address)
        var thisPropertyWidth = Math.log10(thisFeature.price)*Math.log10(thisFeature.price)*Math.log10(thisFeature.price)*4.8;
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
        var neighborhoodWidth = Math.log10(thisFeature.sale_summaries_NGBR_AVG)*Math.log10(thisFeature.sale_summaries_NGBR_AVG)*Math.log10(thisFeature.sale_summaries_NGBR_AVG)*4.8;
        $('#neighborhoodName').text(thisFeature.MPSUBSEC01).css({"width" : neighborhoodWidth, "background-color" : getColor(thisFeature.sale_summaries_NGBR_AVG), "color" : getFontColor(thisFeature.sale_summaries_NGBR_AVG)})
        
        //attempt to nest d3 as nested function
        function bar()
          {
            "test"
          }
        //console.log(bar);

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
            bottom: "-273px"
        });
        $(this).hide();
        $('.open').show();
    });
});


//Script for D3 Horizontal Bar Charts
        var w = 500,
            h = 100;

        var svg = d3.select("#chart")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
    
        d3.json("js/bars.json", function(json) {
    
            var data = json.items;
    
            var max_n = 0;
            for (var d in data) {
                max_n = Math.max(data[d].n, max_n);
            }
        
            var dx = w / max_n;
            var dy = h / data.length;
    
            // bars
            var bars = svg.selectAll(".bar")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", function(d, i) {return "bar " + d.label;})
                .attr("x", function(d, i) {return 0;})
                .attr("y", function(d, i) {return dy*i;})
                .attr("width", function(d, i) {return dx*d.n})
                .attr("height", dy);
    
            // labels
            var text = svg.selectAll("text")
                .data(data)
                .enter()
                .append("text")
                .attr("class", function(d, i) {return "label " + d.label;})
                .attr("x", 5)
                .attr("y", function(d, i) {return dy*i + 15;})
                .text( function(d) {return d.label + " (" + d.n  + ")";})
                .attr("font-size", "15px")
                .style("font-weight", "bold");
        });