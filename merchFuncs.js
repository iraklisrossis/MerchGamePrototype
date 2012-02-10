var avgIslandDist = 0.000500;
var renderDist = 0.002000;
var mapQuantum = avgIslandDist;

var map;
var center;
var islands = [];
function initialize() {
	center = new google.maps.LatLng(59.323718,18.071131);
	//center = new google.maps.LatLng(0.045000,18.270000);
	var myOptions = {
					center: center,
					zoom: 15,
					mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	createIslands(center);
}

function createIslands(latLng)
{
	var cx = latLng.lng() + latLng.lng() % realDistance(mapQuantum,latLng);
	var cy = latLng.lat() + latLng.lat() % mapQuantum;
	var maxIslandsPerAxis = renderDist / avgIslandDist;
	for(var i = -maxIslandsPerAxis; i < maxIslandsPerAxis; i++)
	{
		for(var j = -maxIslandsPerAxis; j < maxIslandsPerAxis; j++)
		{
			var coords = new google.maps.LatLng(cy + avgIslandDist * j, cx + realDistance(avgIslandDist,latLng) * i);
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

function realDistance(dist,latLng)
{
	var newDist = dist / Math.cos(Math.PI * latLng.lat() / 180);
	console.log("latitude:" + latLng.lat() + " dist:" + dist + " newDist:" + newDist);
	return newDist
}