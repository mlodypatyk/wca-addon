var nazwy_eventow2 = {
	"222":"2x2x2 Cube",
	"333":"3x3x3 Cube",
	"444":"4x4x4 Cube",
	"555":"5x5x5 Cube",
	"666":"6x6x6 Cube",
	"777":"7x7x7 Cube",
	"333oh":"3x3x3 One-Handed",
	"333fm":"3x3x3 Fewest Moves",
	"333ft":"3x3x3 With Feet",
	"333bf":"3x3x3 Blindfolded",
	"333mbf":"3x3x3 Multi-Blind",
	"444bf":"4x4x4 Blindfolded",
	"555bf":"5x5x5 Blindfolded",
	"minx":"Megaminx",
	"pyram":"Pyraminx",
	"clock":"Clock",
	"sq1":"Square-1",
	"skewb":"Skewb",
	"333mbo":"3x3x3 Multi-Blind Old Style",
	"magic":"Magic",
	"mmagic":"Master Magic"
};
downloading = false;
//console.log("skrr");
wca_id = ""
$('.navbar-collapse .navbar-nav a').each(function (index){
	link = $(this).attr('href');
	if(link.startsWith('/persons/')){
		//console.log(link.split('/')[2]);
		wca_id = link.split('/')[2];
	}	
});
their_wca_id = window.location.href.split('/')[4];
their_wca_id = their_wca_id.split('?')[0];
if (wca_id != their_wca_id && wca_id != ""){
	/*$('.personal-records .table-responsive').each( function (index){
		console.log(this);
	});*/
	$('.personal-records .table-responsive').append('<a class="text-center" style="display:grid" id="compare_button">Compare vs you!</a>');
	var guzik = document.getElementById("compare_button");
	guzik.addEventListener('click', function(){
		if(!downloading){
			downloading = true;
			compare();
		}
	});
}
pbs = null;
their_pbs = null;
function compare(){
	uri = 'https://www.worldcubeassociation.org/api/v0/persons/'
	fetch(uri + wca_id)
		.then(response => response.json())
		.then(function (data){
			pbs = data["personal_records"];
			fetch(uri + their_wca_id)
				.then(response => response.json())
				.then(function (data2){
					their_pbs = data2["personal_records"];
					draw_table();
				}
				);
		}
		);
}
function format(time, event){
	if(event == "333fm"){
		if(time < 100){
			return time;
		}
		else{
			return time/100;
		}
	}
	else if(event == "333mbf"){
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
		return ulozone + "/" + probowane + " " + minuty + ":" + sekundy;
	}else{
		minutes = (time-time%6000)/6000;
		seconds = (time%6000)/100;
		if(time % 100 == 0){
			seconds += ".0";
		}
		if(time % 10 == 0){
			seconds += "0";
		}
		if(minutes == 0){
			return seconds;
		}
		else{
			if(seconds < 10){
				return minutes + ":0" + seconds;
			}
			else{
				return minutes + ":" + seconds;
			}
		}
	
	}
}
function draw_table(){
	eventlist = ["222", "333", "333bf", "333fm", "333mbf", "333oh", "444", "444bf", "555", "555bf", "666", "777", "clock", "minx", "pyram", "skewb", "sq1"];
	compare_table = {};
	for(i in eventlist){
		compare_table[eventlist[i]+" single"] = {};
		compare_table[eventlist[i]+" average"] = {};
	}
	for(i in pbs){
		if(eventlist.includes(i)){
			for(x in pbs[i]){
				compare_table[i+" "+x]["pb"] = pbs[i][x];
			}
		}
	}
	for(i in their_pbs){
		if(eventlist.includes(i)){
			for(x in their_pbs[i]){
				compare_table[i+" "+x]["their_pb"] = their_pbs[i][x];
			}
		}
	}
	table = "<div style=\"text-align:center\"><table class=\"table table-striped\" style=\"display:unset\">";
	win_table = ""
	tie_table = ""
	lose_table = ""
	console.log(compare_table);
	for(event in compare_table){
		if (Object.keys(compare_table[event]).length > 0){
			helper = event.split(" ")
			row = "<tr><td>" + nazwy_eventow2[helper[0]] + " " + helper[1] + "</td>";
			
			you_win = 1;
			if(Object.keys(compare_table[event]).length == 1){
				if('their_pb' in compare_table[event]){
					you_win = 2;
				}
				if(you_win == 2){
					row += "<td style=\"background-color:red;\">-</td><td style=\"background-color:lime;\">" + format(compare_table[event]['their_pb']['best'], helper[0]) + "</td>";
				}
				if(you_win == 1){
					row += "<td style=\"background-color:lime;\">" + format(compare_table[event]['pb']['best'], helper[0]) + "</td><td style=\"background-color:red;\">-</td>";
				}
			}else{
				if(compare_table[event]['pb']['world_rank'] == compare_table[event]['their_pb']['world_rank']){
					you_win = 0;
				}
				if(compare_table[event]['pb']['world_rank'] > compare_table[event]['their_pb']['world_rank']){
					you_win = 2;
				}
				row += "<td ";
				if(you_win == 1){
					row += "style=\"background-color:lime;\""
				}
				if(you_win == 2){
					row += "style=\"background-color:red;\""
				}
				row += " >" + format(compare_table[event]['pb']['best'], helper[0]) + "</td>";
				row += "<td ";
				if(you_win == 2){
					row += "style=\"background-color:lime;\""
				}
				if(you_win == 1){
					row += "style=\"background-color:red;\""
				}
				row += " >" + format(compare_table[event]['their_pb']['best'], helper[0]) + "</td>";
			}
			row += "<tr>";
			if(you_win == 1){
				win_table += row
			}
			if(you_win == 2){
				lose_table += row
			}
			if(you_win == 0){
				tie_table += row
			}

		}
	}
	table += win_table + tie_table + lose_table
	table += "</table></div>";
	$('.personal-records .table-responsive').append(table);
	$('#compare_button').remove();
	
}