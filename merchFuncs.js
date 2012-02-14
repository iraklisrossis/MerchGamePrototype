var avgIslandDist = 0.000500;
var renderDist = 0.002000;
var comRenderDist = 0.007000;
var mapQuantum = avgIslandDist;
var latSeed = 4829;
var lngSeed = 8513;

var map;
var center;
var islands = [];
var comodities = [];

function initialize() {
	center = new google.maps.LatLng(59.323718,18.071131);
	//center = new google.maps.LatLng(0.045000,18.270000);
	var myOptions = {
					center: center,
					zoom: 15,
					mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	//createIslands(center);
	createComodities(center);
}

function createComodities(latLng)
{
	var cx = latLng.lng() + latLng.lng() % realDistance(mapQuantum,latLng.lat());
	var cy = latLng.lat() + latLng.lat() % mapQuantum;
	var maxComoditiesPerAxis = comRenderDist / avgIslandDist;
	for(var i = -maxComoditiesPerAxis; i < maxComoditiesPerAxis; i++)
	{
		for(var j = -maxComoditiesPerAxis; j < maxComoditiesPerAxis; j++)
		{
			var coordsSW = new google.maps.LatLng(cy + avgIslandDist * j, cx + realDistance(avgIslandDist,latLng.lat()) * i);
			var coordsNE = new google.maps.LatLng(coordsSW.lat() + avgIslandDist, coordsSW.lng() + realDistance(avgIslandDist,latLng.lat()));
			var value = getComodityIcon(coordsSW);
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

function getComodityIcon(latLng)
{
	x = (latLng.lng()/avgIslandDist) * Math.cos(Math.PI * latLng.lat() / 180);
	y = latLng.lat()/avgIslandDist;

	var value = Math.sin(y*0.3)*Math.sin(x*0.3);
	value = value + Math.sin(y*0.7)*Math.sin(x*0.7)*0.5;
	
	return (value + 1.5)/3;
}

function createIslands(latLng)
{
	var cx = latLng.lng() + latLng.lng() % realDistance(mapQuantum,latLng.lat());
	var cy = latLng.lat() + latLng.lat() % mapQuantum;
	var maxIslandsPerAxis = renderDist / avgIslandDist;
	for(var i = -maxIslandsPerAxis; i < maxIslandsPerAxis; i++)
	{
		for(var j = -maxIslandsPerAxis; j < maxIslandsPerAxis; j++)
		{
			var coords = randomizeIslandPosition(cy + avgIslandDist * j, cx + realDistance(avgIslandDist,latLng.lat()) * i);
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

function randomizeIslandPosition(lat, lng)
{
	var latByQuant = lat / mapQuantum;
	var lngByQuant = lng / mapQuantum;
	
	var iter = latByQuant - Math.floor(latByQuant/10) * 10 + lngByQuant - Math.floor(lngByQuant/10) * 10

	var latRand = myRand(latSeed, iter);
	var lngRand = myRand(lngSeed, iter);
	
	var newLat = lat + avgIslandDist * 0.6 * lngRand;
	var newLng = lng + realDistance(avgIslandDist, lat) * 0.6 * latRand;

	return new google.maps.LatLng(newLat, newLng);
}

function myRand(seed, iter)
{
	console.log(iter);
	
	if(iter == undefined)
	{
		iter = 1;
	}
	for(var i = 0; i < iter; i++)
	{
		seed = Math.floor((((Math.floor((seed * seed)/100))/10000) % 1) *10000);
		console.log("seed" + seed);
	}
	
	return seed / 10000;
}

function realDistance(dist,lat)
{
	var newDist = dist / Math.cos(Math.PI * lat / 180);
	//console.log("latitude:" + latLng.lat() + " dist:" + dist + " newDist:" + newDist);
	return newDist
}