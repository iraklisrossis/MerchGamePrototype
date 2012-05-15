var avgIslandDist = 0.000500;
var renderDist = 0.009000;
var latSeed = 4829;
var lngSeed = 8513;

var time = 0;

var sellValue = 0.75;
var priceChangePerUnit = 0.02;
var priceChangeRange = avgIslandDist * 5;

var shouldDrawIslands = true;

var currentPosition;

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
	tradeHist: {
		
	}
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
  	var commoditiesDivHTML = "";
  	var playerHoldDivHTML = "";
  	for(commodityName in commodities)
  	{
  		var commodity = commodities[commodityName];
  		
  		commoditiesDivHTML += "<div id='" + commodityName + "Controls' style='float:left; width:150px; height:90%; padding: 5px; border: 5px white groove;'>" +
								commodityName + "<br>" +
								"<br>" + 
								"Render <input id='render" + commodityName + "Checkbox' type='checkbox' onclick='commodities." + commodityName + ".draw=this.checked;createCommodities(center, commodities." + commodityName + ");'/><br>" +
								"Color:<input type='text' id='" + commodityName + "ColorBox' style='width:100px;' onchange='commodities." + commodityName + ".color = this.value'/><br>" +
								"Floor :<input type='text' id='" + commodityName + "FloorPBox' style='width:100px;' onchange='commodities." + commodityName + ".floorPrice = this.value'/><br>" +
								"Ceilin:<input type='text' id='" + commodityName + "CeilPBox' style='width:100px;' onchange='commodities." + commodityName + ".ceilingPrice = this.value'/><br>" +
								"Freq1:<input type='text' id='" + commodityName + "Freq1Box' style='width:100px;' onchange='commodities." + commodityName + ".freqs[0] = this.value'/><br>" +
								"Freq2:<input type='text' id='" + commodityName + "Freq2Box' style='width:100px;' onchange='commodities." + commodityName + ".freqs[1] = this.value'/><br>" +
								"Freq3:<input type='text' id='" + commodityName + "Freq3Box' style='width:100px;' onchange='commodities." + commodityName + ".freqs[2] = this.value'/><br>" +
								"Attenuation:<input type='text' id='" + commodityName + "AttenBox' style='width:100px;' onchange='commodities." + commodityName + ".atten = this.value'/><br>" +
							"</div>";
							
		playerHoldDivHTML += commodityName + ": <label type='text' id='player" + commodityName + "Label' style='width:100px;'/></label><br>"
		player.tradeHist[commodityName] = [];
		player[commodityName] = 0;
  	}
  	e('ControlsRow2').innerHTML = commoditiesDivHTML;
  	e('playerHold').innerHTML = playerHoldDivHTML;
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
	for(commodityName in commodities)
  	{
		e("render" + commodityName + "Checkbox").checked = commodities[commodityName].draw;
		e(commodityName + "ColorBox").value = commodities[commodityName].color;
		e(commodityName + "FloorPBox").value = commodities[commodityName].floorPrice;
		e(commodityName + "CeilPBox").value = commodities[commodityName].ceilingPrice;
		e(commodityName + "Freq1Box").value = commodities[commodityName].freqs[0];
		e(commodityName + "Freq2Box").value = commodities[commodityName].freqs[1];
		e(commodityName + "Freq3Box").value = commodities[commodityName].freqs[2];
		e(commodityName + "AttenBox").value = commodities[commodityName].atten;
	}
}

function updatePlayerPanel()
{
	e("playerFundsLabel").innerHTML = player.funds;
	for(commodityName in commodities)
  	{
		e("player" + commodityName + "Label").innerHTML = player[commodityName];
	}
}

function redraw()
{
	createIslands(center);
	for(commodityName in commodities)
  	{
		createCommodities(center, commodities[commodityName]);
	}
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
    var percentValue = valueSum/weightSum;
    var normalValue = commodity.floorPrice + (commodity.ceilingPrice - commodity.floorPrice) * percentValue;
    var inflation = 1;
    var tradeHist = player.tradeHist[commodity.name];
	
	for(var i = 0; i < tradeHist.length; i++)
	{
		console.log("TradeHist coord:" + tradeHist[i].coord + " value:" + tradeHist[i].value);
		var dy = tradeHist[i].coord.lat() - latLng.lat();
		//var dx = realDistance(tradeHist[i].coord.lng() - latLng.lng(), (tradeHist[i].coord.lat() + latLng.lat())/2);
		var dx = tradeHist[i].coord.lng() - latLng.lng()
		var dist = Math.sqrt(dx*dx + dy*dy);
		var infDist = priceChangeRange - dist;
		infDist = (infDist > 0)?infDist:0;
		console.log("" + dy + " " + dx + " " + infDist);
		inflation += (infDist/priceChangeRange) * tradeHist[i].value * priceChangePerUnit;
	}
    return normalValue * inflation;
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
	currentPosition = island.marker.getPosition();
	updateInfoWindow();
  	islandWindow.open(map, island.marker);
}

function updateInfoWindow()
{
	var windowContent = "";
	for(commodityName in commodities)
	{
		var commodity = commodities[commodityName];
		var buyPrice = Math.floor(getCommodityValue(currentPosition, commodity));
		var sellPrice = Math.floor(buyPrice * sellValue);
		windowContent += commodityName + ": " + buyPrice + "$ <input type='button' value='Buy' onclick='buyCommodity(commodities." + commodityName + ")'/> - " + sellPrice + "$<input type='button' value='Sell' onclick='sellCommodity(commodities." + commodityName + ")'/><br>"
	}

	islandWindow.setContent(windowContent);
}

function buyCommodity(commodity)
{
	var price = Math.floor(getCommodityValue(currentPosition, commodity));
	if(player.funds < price)
	{
		return;
	}
	
	player.funds -= price;
	player[commodity.name] += 1;
	
	var tradeHist = player.tradeHist[commodity.name];
	
	var existed = false;
	for(var i = 0; i < tradeHist.length; i++)
	{
		if(tradeHist[i].coord.equals(currentPosition))
		{
			existed = true;
			tradeHist[i].value += 1;
			if(tradeHist[i].value == 0)
			{
				tradeHist.splice(i,1);
			}
			break;
		}
	}
	
	if(!existed)
	{
		tradeHist.push({
						coord: currentPosition,
						value: 1
						});
	}
	updateInfoWindow();
	updatePlayerPanel();
}

function sellCommodity(commodity)
{
	var price = Math.floor(getCommodityValue(currentPosition, commodity) * sellValue);
	if(player[commodity.name] < 1)
	{
		return;
	}
	
	player.funds += price;
	player[commodity.name] -= 1;
	
	var tradeHist = player.tradeHist[commodity.name];
	var existed = false;
	for(var i = 0; i < tradeHist.length; i++)
	{
		if(tradeHist[i].coord.equals(currentPosition))
		{
			existed = true;
			tradeHist[i].value -= 1;
			if(tradeHist[i].value == 0)
			{
				tradeHist.splice(i,1);
			}
			break;
		}
	}
	if(!existed)
	{
		tradeHist.push({
						coord: currentPosition,
						value: -1
						});
	}
	updateInfoWindow();
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

function AdvanceTime()
{
	time += 1;
	
	for(commodityName in player.tradeHist)
	{
		var commodity = player.tradeHist[commodityName];
		for(var i = 0; i < commodity.length; i++)
		{
			if(commodity[i].value < 0)
			{
				commodity[i].value += 1;
				if(commodity[i].value > 0)
				{
					commodity[i].value = 0;
				}
			}
			else
			{
				commodity[i].value -= 1;
				if(commodity[i].value < 0)
				{
					commodity[i].value = 0;
				}
			}
			
			if(commodity[i].value == 0)
			{
				commodity.splice(i,1);
			}
		}
	}
	updateInfoWindow();
}