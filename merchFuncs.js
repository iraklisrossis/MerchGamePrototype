var avgIslandDist = 0.000500;
var renderDist = 0.009000;
var latSeed = 4829;
var lngSeed = 8513;

var shouldDrawIslands = true;
var shouldDrawComodity = false;

//var comFreqs = [0.006];
var comFreqs = [0.006, 0.017, 0.027];
var comColor = "00FF00";
var comAtten = 0.5;

var map;
var cLat = 59.323718;
var cLng = 18.071131;
var center;
var islands = [];
var comodities = [];

function initialize() {
	center = new google.maps.LatLng(cLat,cLng);
	//center = new google.maps.LatLng(0.000000,18.270000);
	var myOptions = {
					center: center,
					zoom: 15,
					mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	google.maps.event.addListener(map, 'click', function(event) {
    	cLat = e("renderCenterLat").value = event.latLng.lat();
		cLng = e("renderCenterLng").value = event.latLng.lng();
		updateRenderingValues();
  	});
  	updateInterface();
	redraw();
}

function updateInterface()
{
	e("renderCenterLat").value = cLat;
	e("renderCenterLng").value = cLng;
	e("renderDistance").value = renderDist;

	e("renderIslandsCheckbox").checked = shouldDrawIslands;
	e("avgIslandDistBox").value = avgIslandDist;
	e("latSeedBox").value = latSeed;
	e("lngSeedBox").value = lngSeed;

	e("renderComodityCheckbox").checked = shouldDrawComodity;
	e("comColorBox").value = comColor;
	e("comFreq1Box").value = comFreqs[0];
	e("comFreq2Box").value = comFreqs[1];
	e("comFreq3Box").value = comFreqs[2];
	e("comAttenBox").value = comAtten;
}

function redraw()
{
	createIslands(center);
	createComodities(center);
}

function updateRenderingValues()
{
	center = new google.maps.LatLng(cLat,cLng);
	redraw();
}

var filterLines = [];

function createComodities(latLng)
{
	
	for (i in comodities) {
      comodities[i].setMap(null);
    }
	comodities.length = 0;
	
	if(!shouldDrawComodity)
	{
		return;
	}
	
	var maxComoditiesPerAxis = renderDist / avgIslandDist;
	for(var j = -maxComoditiesPerAxis; j < maxComoditiesPerAxis; j++)
	{
		var adjY = latLng.lat() + avgIslandDist * j;
		var cy = adjY - adjY % avgIslandDist;
		var realXIslandDist = realDistance(avgIslandDist, cy);
		var realXQuantum = realDistance(avgIslandDist, cy);
		for(var i = -maxComoditiesPerAxis; i < maxComoditiesPerAxis; i++)
		{
			var adjX = latLng.lng() + realXIslandDist * i;
			var cx = adjX - adjX % realXQuantum;
			var coordsSW = new google.maps.LatLng(cy, cx);
			var coordsNE = new google.maps.LatLng(coordsSW.lat() + avgIslandDist, coordsSW.lng() + realXIslandDist);
			var value = getComodityValue(coordsSW);
			//var green = Math.floor(255*value);
			//var red = 255 - green;
			comodities.push(new google.maps.Rectangle({
											bounds: new google.maps.LatLngBounds(coordsSW, coordsNE),
											strokeWeight: 0,
											fillColor: "#" + comColor,
											fillOpacity: value,
											//fillColor: "#" + red.toString(16) + green.toString(16) + "00",
											//fillOpacity: 0.5,
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
	var valueSum = 0;
	var weightSum = 0;
	var weight = 1;
	for(var i = 0; i < comFreqs.length; i++) {
    	valueSum += getWaveValue(comFreqs[i], latLng) * weight;
    	weightSum += weight;
    	weight *= comAtten;
    }
    return valueSum/weightSum;
}

function getWaveValue(freq, latLng)
{
	y = latLng.lat()/avgIslandDist;

	cLat = (y - y % (1/freq)) * avgIslandDist;
	
	x = latLng.lng()/realDistance(avgIslandDist, cLat);

	/*var polyPoints = [
						new google.maps.LatLng(cLat, latLng.lng()),
						new google.maps.LatLng(cLat, latLng.lng() + realDistance(avgIslandDist, cLat))
					];
	filterLines.push(new google.maps.Polyline({
										path: polyPoints,
										strokeColor: "#FF0000",
										strokeOpacity: 1.0,
										strokeWeight: 2,
										map: map
								})
					);*/
	var value = (Math.cos(y*freq*2*Math.PI + Math.PI) + Math.cos(x*freq*2*Math.PI + Math.PI))/2;
	//value = value + Math.sin(y*0.7)*Math.sin(x*0.7)*0.5;
	//value = (value + 1)/2;
	value = (value>0)?value:0;
	return value;
}

function createIslands(latLng)
{
	for (i in islands) {
      islands[i].marker.setMap(null);
    }
	islands.length = 0;
	
	if(!shouldDrawIslands)
	{
		return;
	}
	//console.log("cx: " + cx + " cy: " + cy);
	var maxIslandsPerAxis = renderDist / avgIslandDist;
	for(var j = -maxIslandsPerAxis; j < maxIslandsPerAxis; j++)
	{
		var adjY = latLng.lat() + avgIslandDist * j;
		var cy = adjY - adjY % avgIslandDist;
		var realXIslandDist = realDistance(avgIslandDist, cy);
		var realXQuantum = realDistance(avgIslandDist, cy);
		for(var i = -maxIslandsPerAxis; i < maxIslandsPerAxis; i++)
		{
			var adjX = latLng.lng() + realXIslandDist * i;
			var cx = adjX - adjX % realXQuantum;
			var coords = randomizeIslandPosition(cy, cx, avgIslandDist, realXQuantum, avgIslandDist, realXIslandDist);
			//var coords = new google.maps.LatLng(cy, cx);
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