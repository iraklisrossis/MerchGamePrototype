var avgIslandDist = 0.000500;
var renderDist = 0.009000;
var mapQuantum = avgIslandDist;
var latSeed = 4829;
var lngSeed = 8513;

var comFreq = 0.05;

var map;
var center;
var islands = [];
var comodities = [];

function initialize() {
	//center = new google.maps.LatLng(59.323718,18.071131);
	center = new google.maps.LatLng(0.045000,18.270000);
	var myOptions = {
					center: center,
					zoom: 15,
					mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	google.maps.event.addListener(map, 'click', function(event) {
    	e("renderCenterLat").value = event.latLng.lat();
		e("renderCenterLng").value = event.latLng.lng();
		updateRenderingValues();
  	});
	redraw();
	updateInterface();
}

function updateInterface()
{
	e("renderCenterLat").value = center.lat();
	e("renderCenterLng").value = center.lng();
	e("renderDistance").value = renderDist;
}

function redraw()
{
	for (i in islands) {
      islands[i].marker.setMap(null);
    }
	islands.length = 0;

	for (i in comodities) {
      comodities[i].setMap(null);
    }
	comodities.length = 0;
	//createIslands(center);
	createComodities(center);
}

function updateRenderingValues()
{
	center = new google.maps.LatLng(e("renderCenterLat").value,e("renderCenterLng").value);
	renderDist = e("renderDistance").value;
	redraw();
}

function createComodities(latLng)
{
	var maxComoditiesPerAxis = renderDist / avgIslandDist;
	for(var j = -maxComoditiesPerAxis; j < maxComoditiesPerAxis; j++)
	{
		var adjY = latLng.lat() + avgIslandDist * j;
		var cy = adjY - adjY % mapQuantum;
		var realXIslandDist = realDistance(avgIslandDist, cy);
		var realXQuantum = realDistance(mapQuantum, cy);
		for(var i = -maxComoditiesPerAxis; i < maxComoditiesPerAxis; i++)
		{
			var adjX = latLng.lng() + realXIslandDist * i;
			var cx = adjX - adjX % realXQuantum;
			var coordsSW = new google.maps.LatLng(cy, cx);
			var coordsNE = new google.maps.LatLng(coordsSW.lat() + avgIslandDist, coordsSW.lng() + realXIslandDist);
			var value = getComodityValue(coordsSW);
			comodities.push(new google.maps.Rectangle({
											bounds: new google.maps.LatLngBounds(coordsSW, coordsNE),
											strokeWeight: 0,
											fillColor: "#00FF00",
											fillOpacity: value,
											map: map
										})
						);
		}
	}
}

function e(elementName)
{
	return document.getElementById(elementName);
}

function getComodityValue(latLng)
{
	y = latLng.lat()/avgIslandDist;

	cLat = (y - y % (2*Math.PI)) * avgIslandDist;
	
	x = latLng.lng()/realDistance(avgIslandDist, cLat);

	var value = (Math.sin(y*comFreq*2*Math.PI) + Math.sin(x*comFreq*2*Math.PI))/2;
	//value = value + Math.sin(y*0.7)*Math.sin(x*0.7)*0.5;
	
	return (value + 1)/2;
	//return (value + 1.5)/3;
}

function createIslands(latLng)
{
	//console.log("cx: " + cx + " cy: " + cy);
	var maxIslandsPerAxis = renderDist / avgIslandDist;
	for(var j = -maxIslandsPerAxis; j < maxIslandsPerAxis; j++)
	{
		var adjY = latLng.lat() + avgIslandDist * j;
		var cy = adjY - adjY % mapQuantum;
		var realXIslandDist = realDistance(avgIslandDist, cy);
		var realXQuantum = realDistance(mapQuantum, cy);
		for(var i = -maxIslandsPerAxis; i < maxIslandsPerAxis; i++)
		{
			var adjX = latLng.lng() + realXIslandDist * i;
			var cx = adjX - adjX % realXQuantum;
			//var coords = randomizeIslandPosition(cy, cx, mapQuantum, realXQuantum, avgIslandDist, realXIslandDist);
			var coords = new google.maps.LatLng(cy, cx);
			islands.push({marker:new google.maps.Marker({
											position: coords,
											title:"Hello World!",
											icon: "images/island.png",
											map: map
										})
						});
		}
	}
}

function randomizeIslandPosition(lat, lng, yQuantum, xQuantum, yAvgDist, xAvgDist)
{
	var latByQuant = lat / yQuantum;
	var lngByQuant = lng / xQuantum;
	
	var iter = ((((latByQuant - Math.floor(latByQuant/100) * 100) + 1)  * ((lngByQuant - Math.floor(lngByQuant/10) * 10) + 1)) % 15) + 1

	var latRand = myRand(latSeed, iter);
	var lngRand = myRand(lngSeed, iter);
	
	var newLat = lat + yAvgDist * 0.6 * lngRand;
	var newLng = lng + xAvgDist * 0.6 * latRand;

	return new google.maps.LatLng(newLat, newLng);
}

function myRand(seed, iter)
{
	//console.log(iter);
	
	if(iter == undefined)
	{
		iter = 1;
	}
	for(var i = 0; i < iter; i++)
	{
		seed = Math.floor((((Math.floor((seed * seed)/100))/10000) % 1) *10000);
		//console.log("seed" + seed);
	}
	
	return seed / 10000;
}

function realDistance(dist,lat)
{
	var newDist = dist / Math.cos(Math.PI * lat / 180);
	//console.log("latitude:" + latLng.lat() + " dist:" + dist + " newDist:" + newDist);
	return newDist
}