var nazwy_eventow = {
	"event-222":"2x2x2 Cube",
	"event-333":"3x3x3 Cube",
	"event-444":"4x4x4 Cube",
	"event-555":"5x5x5 Cube",
	"event-666":"6x6x6 Cube",
	"event-777":"7x7x7 Cube",
	"event-333oh":"3x3x3 One-Handed",
	"event-333fm":"3x3x3 Fewest Moves",
	"event-333ft":"3x3x3 With Feet",
	"event-333bf":"3x3x3 Blindfolded",
	"event-333mbf":"3x3x3 Multi-Blind",
	"event-444bf":"4x4x4 Blindfolded",
	"event-555bf":"5x5x5 Blindfolded",
	"event-minx":"Megaminx",
	"event-pyram":"Pyraminx",
	"event-clock":"Clock",
	"event-sq1":"Square-1",
	"event-skewb":"Skewb",
	"event-333mbo":"3x3x3 Multi-Blind Old Style",
	"event-magic":"Magic",
	"event-mmagic":"Master Magic",
};
var wszystko = {}
/*
$( ".results-by-event tbody" ).each(function( index ) {
  //eventy
  var event = ""
  var helper = $(this).attr("class").split(' ');
  
  event = helper[0];
  wszystko[event] = []
  $(this).find('.result').each(function( index ) {
	//rundy
	current = []
	$(this).find('.solve').each(function( index ) {
		//console.log( index + ": " + $( this ).text() + " " + event);
		var tekst = $(this).text();
		if(tekst != ""){
			//wszystko[event].push(tekst);
			current.push(tekst);
		}
	});
	current = current.reverse();
	wszystko[event] = wszystko[event].concat(current);
  });
});
*/
$.get('https://www.worldcubeassociation.org/api/v0/persons/' + their_wca_id + '/results', function(data, status){
wyniki = data;
console.log(wyniki);
for(i in wyniki){
	event_id = 'event-' + wyniki[i]['event_id']
	if(!wszystko.hasOwnProperty(event_id)){
		wszystko[event_id] = []
	}
	for(j in wyniki[i]['attempts']){
		if(wyniki[i]['attempts'][j] != 0 && wyniki[i]['attempts'][j] != -1 && wyniki[i]['attempts'][j] != -2){
			wszystko[event_id].push(wyniki[i]['attempts'][j])
		}
		if(wyniki[i]['attempts'][j] == -1){
			wszystko[event_id].push(9999999)
		}
	}
}
//multi kurwa :(
for(i in wszystko['event-333mbf']){
	time = wszystko['event-333mbf'][i]
	nieudane = time%100;
	czas = (time%10000000 - time%100)/100;
	roznica = (time%1000000000 - time%10000000)/10000000;
	punkty = 99 - roznica;
	ulozone = punkty + nieudane;
	probowane = ulozone + nieudane;
	sekundy = czas % 60;
	minuty = (czas - sekundy) / 60
	if(sekundy < 10){
		sekundy = "0" + sekundy
	}
	if(minuty == 60){
		minuty = "1:00";
	}
	text_form = ulozone + "/" + probowane + " " + minuty + ":" + sekundy;
	if(punkty == 99){
		text_form = "DNF"
	}
	wszystko['event-333mbf'][i] = [punkty, text_form]
}
console.log(wszystko)
printAverages()
});
function average(array){
	array.sort(function(a,b) { return a - b;});
	var do_usuniecia = Math.ceil(array.length*0.05);
	counting = array.slice(do_usuniecia, array.length-do_usuniecia);
	if(counting[counting.length-1] == 9999999){
		return 9999999;
	}
	var sum = 0;
	for(var i in counting){
		sum = sum + counting[i];
	}
	//console.log(Math.round(sum/counting.length*100)/100);
	return Math.round(sum/counting.length*100)/100;	
}
function multiAverage(array){
	array.sort(function(a,b) { return a - b;});
	var do_usuniecia = Math.ceil(array.length*0.05);
	counting = array.slice(do_usuniecia, array.length-do_usuniecia);
	if(counting[0] == -1){
		return 9999999
	}
	var sum = 0;
	for(var i in counting){
		sum = sum + counting[i];
	}
	//console.log(Math.round(sum/counting.length*100)/100);
	return Math.round(sum/counting.length*100)/100;	
}
function convert(time){
	if(time=="DNF" || time=="DNS"){
		return 9999999;
	}
	if(time.length < 6){
		return parseFloat(time);
	}
	var minutes = 0;
	helper = time.split(':');
	minutes = parseInt(helper[0]);
	return parseFloat(helper[1]) + 60*minutes;
}
function bestAverage(array, howmuch){
	if(howmuch > array.length){
		return -1;
	}
	var max = 9999999;
	how = [];
	for(var i = 0; i < array.length-howmuch+1; i++){
		current_avg = average(array.slice(i, i+howmuch))
		if(current_avg <= max){
			max = current_avg;
			how = array.slice(i, i+howmuch);
		}
	}
	if(max == 9999999){
		return -1;
	}
	return [max, how];
}
function bestMultiAverage(array, howmuch){
	if(howmuch > array.length){
		return -1;
	}
	just_points = []
	for(i in array){
		if(array[i][0] == 99){
			just_points.push(-1)
		}else{
			just_points.push(array[i][0])
		}
	}
	var max = 0;
	how = []
	for(var i = 0; i < array.length - howmuch + 1; i++){
		current_avg = multiAverage(just_points.slice(i, i+howmuch))
		//console.log(current_avg)
		if(current_avg > max && current_avg != 9999999){
			//console.log(max)
			max = current_avg
			how = []
			for(j=i;j<i+howmuch;j++){
				how.push(array[j][1])
			}
		}
	}
	if(max == 0){
		return -1
	}
	return [max, how]
	
}
function convertBack(time){
	if(time == 9999999){
		return "DNF"
	}
	time = time / 100
	if(time < 60){
		return time.toFixed(2);
	}
	if(time%60>10){
		return (time-time%60)/60 + ":" + (Math.round((time%60)*100)/100).toFixed(2);
	}
	return (time-time%60)/60 + ":0" + (Math.round((time%60)*100)/100).toFixed(2);
	
}
function convert_array(array, event){
	current = ""
	for(var i in array){
		if(event != "event-333fm" && event != "event-333mbf"){
			current+=convertBack(array[i]);
		}
		if(event == "event-333fm"){
			if(array[i] == 9999999){
				current+="DNF"
			}else{
				current+=array[i];
			}
		}
		if(event == "event-333mbf"){
			current += array[i]
		}
		if(i != array.length - 1){
			current+=", ";
			if((parseInt(i)+1)%10 == 0){
				current+="<br>";
			}
		}
	}
	return current;
}
function printAverages(){
	averages = [5, 12, 25, 50, 100];
	all_strings = "";
	for (var i in averages){
		table = '<table class = "table table-striped" id = "table' + i + '"><thead><tr><th>Event</th><th>Average of ' + averages[i] + '</th><th>Times</th></tr></thead>';
		for(event in wszystko){
			if(event != "event-333mbf" && event != "event-333mbo"){
				helper = bestAverage(wszystko[event], averages[i]);
				if(helper != -1){
					var czas = helper[0];
					czasy = helper[1];
					if(event != "event-333fm" && event != "event-333mbf"){
						var current_text = '<tr><b>' + '<td class="event" data-event="333"> <span class=" cubing-icon '+event+'" style="padding:2px"></span> ' + nazwy_eventow[event] + "</b></td><td>" + convertBack(czas) + "</td><td>" + convert_array(czasy, event) + "</td></tr>";
					}
					if(event == "event-333fm"){
						var current_text = '<tr><b>' + '<td class="event" data-event="333"> <span class=" cubing-icon '+event+'" style="padding:2px"></span> ' + nazwy_eventow[event] + "</b></td><td>" + czas + "</td><td>" + convert_array(czasy, event) + "</td></tr>";
					}
					table = table + current_text;
				}
			}
			if(event == "event-333mbf"){
				helper = bestMultiAverage(wszystko[event], averages[i]);
				console.log(i)
				console.log(helper)
				if(helper != -1){
					czas = helper[0]
					czasy = helper[1]
					var current_text = '<tr><b>' + '<td class="event" data-event="333"> <span class=" cubing-icon '+event+'" style="padding:2px"></span> ' + nazwy_eventow[event] + "</b></td><td>" + czas + "</td><td>" + convert_array(czasy, "event-333mbf") + "</td></tr>";

					table = table + current_text;
				}
			}
		}
		table = table + '</table>';
		all_strings = all_strings + table;
	}
	$(".nav-justified").append('<li class=""><a href="#rolling-avgs" data-toggle="tab" aria-expanded="false">Rolling Averages</a></li>');
	$(".tab-content").append('<div class="tab-pane" id="rolling-avgs">'+all_strings+'</div>');
}
/*$(".nav-justified li").each(function ( index ){
	console.log(index);
});*/