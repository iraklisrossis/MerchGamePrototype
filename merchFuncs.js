var avgIslandDist = 0.000500;
var renderDist = 0.009000;
var latSeed = 4829;
var lngSeed = 8513;

var shouldDrawIslands = true;

var commodities = {};

commodities.wheat = {
	name: "wheat",
	freqs: [0.006, 0.017, 0.027],
	color: "00FF00",
	atten: 0.5,
	draw: false,
	floorPrice: 10,
	ceilingPrice: 100,
	icons: []
}

commodities.apples = {
	name: "apples",
	freqs: [0.005, 0.016, 0.029],
	color: "FF0000",
	atten: 0.4,
	draw: false,
	floorPrice: 30,
	ceilingPrice: 150,
	icons: []
}

commodities.gold = {
	name: "gold",
	freqs: [0.002, 0.011, 0.019],
	color: "FFFF00",
	atten: 0.2,
	draw: false,
	floorPrice: 100,
	ceilingPrice: 600,
	icons: []
}

var player = {
	funds: 5000,
	wheat: 0,
	apples: 0,
	gold: 0
}

var map;
var cLat = 59.323718;
var cLng = 18.071131;
var center;
var islands = [];
var islandWindow;

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
  	
  	islandWindow = new google.maps.InfoWindow({
  												
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
	
	updatePlayerPanel();

	e("renderWheatCheckbox").checked = commodities.wheat.draw;
	e("wheatColorBox").value = commodities.wheat.color;
	e("wheatFloorPBox").value = commodities.wheat.floorPrice;
	e("wheatCeilPBox").value = commodities.wheat.ceilingPrice;
	e("wheatFreq1Box").value = commodities.wheat.freqs[0];
	e("wheatFreq2Box").value = commodities.wheat.freqs[1];
	e("wheatFreq3Box").value = commodities.wheat.freqs[2];
	e("wheatAttenBox").value = commodities.wheat.atten;
	
	e("renderApplesCheckbox").checked = commodities.apples.draw;
	e("applesColorBox").value = commodities.apples.color;
	e("applesFloorPBox").value = commodities.apples.floorPrice;
	e("applesCeilPBox").value = commodities.apples.ceilingPrice;
	e("applesFreq1Box").value = commodities.apples.freqs[0];
	e("applesFreq2Box").value = commodities.apples.freqs[1];
	e("applesFreq3Box").value = commodities.apples.freqs[2];
	e("applesAttenBox").value = commodities.apples.atten;
	
	e("renderGoldCheckbox").checked = commodities.gold.draw;
	e("goldColorBox").value = commodities.gold.color;
	e("goldFloorPBox").value = commodities.gold.floorPrice;
	e("goldCeilPBox").value = commodities.gold.ceilingPrice;
	e("goldFreq1Box").value = commodities.gold.freqs[0];
	e("goldFreq2Box").value = commodities.gold.freqs[1];
	e("goldFreq3Box").value = commodities.gold.freqs[2];
	e("goldAttenBox").value = commodities.gold.atten;
}

function updatePlayerPanel()
{
	e("playerFundsLabel").innerHTML = player.funds;
	e("playerWheatLabel").innerHTML = player.wheat;
	e("playerApplesLabel").innerHTML = player.apples;
	e("playerGoldLabel").innerHTML = player.gold;
}

function redraw()
{
	createIslands(center);
	createCommodities(center, commodities.wheat);
	createCommodities(center, commodities.apples);
	createCommodities(center, commodities.gold);
}

function updateRenderingValues()
{
	center = new google.maps.LatLng(cLat,cLng);
	redraw();
}

var filterLines = [];

function createCommodities(latLng, commodity)
{
	
	for (i in commodity.icons) {
      commodity.icons[i].setMap(null);
    }
	commodity.icons.length = 0;
	
	if(!commodity.draw)
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
			var value = getCommodityValue(coordsSW, commodity);
			//var green = Math.floor(255*value);
			//var red = 255 - green;
			commodity.icons.push(new google.maps.Rectangle({
											bounds: new google.maps.LatLngBounds(coordsSW, coordsNE),
											strokeWeight: 0,
											fillColor: "#" + commodity.color,
											fillOpacity: (value - commodity.floorPrice)/(commodity.ceilingPrice - commodity.floorPrice),
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

function getCommodityValue(latLng, commodity)
{
	var valueSum = 0;
	var weightSum = 0;
	var weight = 1;
	for(var i = 0; i < commodity.freqs.length; i++) {
    	valueSum += getWaveValue(commodity.freqs[i], latLng) * weight;
    	weightSum += weight;
    	weight *= commodity.atten;
    }
    var percent = valueSum/weightSum;
    return commodity.floorPrice + (commodity.ceilingPrice - commodity.floorPrice) * percent;
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
			var island={marker:new google.maps.Marker({
											position: coords,
											title:"Hello World!",
											icon: "images/island.png",
											map: map,
											clickable:true
										})
						};
			setInfoWindowToIsland(island);
  			islands.push(island);
		}
	}
}

function setInfoWindowToIsland(island)
{
	google.maps.event.addListener(island.marker, 'click', function(event) {
															showInfoWindow(island);
  														});
}

function showInfoWindow(island)
{
	var windowContent = "";
	for(commodityName in commodities)
	{
		var commodity = commodities[commodityName];
		var price = Math.floor(getCommodityValue(island.marker.getPosition(), commodity));
		windowContent += commodityName + ": " + price + "$ <input type='button' value='Buy' onclick='buyCommodity(" + price + ",commodities." + commodityName + ")'/><input type='button' value='Sell' onclick='sellCommodity(" + price + ",commodities." + commodityName + ")'/><br>"
	}

	islandWindow.setContent(windowContent);
  	islandWindow.open(map, island.marker);
}

function buyCommodity(price, commodity)
{
	if(player.funds < price)
	{
		return;
	}
	
	player.funds -= price;
	player[commodity.name] += 1;
	
	updatePlayerPanel()
}

function sellCommodity(price, commodity)
{
	if(player[commodity.name] < 1)
	{
		return;
	}
	
	player.funds += price;
	player[commodity.name] -= 1;
	
	updatePlayerPanel();
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