$.get('https://www.worldcubeassociation.org/api/v0/persons/' + their_wca_id, function(data, status){
pbki = data.personal_records;
$.get('https://www.worldcubeassociation.org/api/v0/persons/' + their_wca_id + '/results', function(data, status){
wyniki = data;
resultsAverage = {}
resultsSingle = {}
allPBComps = []
for(record in pbki){
	if(pbki[record].hasOwnProperty('average')){
		for(wynik in wyniki){
			//console.log(pbki[record]['average']['best'])
			//console.log(wyniki[wynik]['average'])
			if(wyniki[wynik]['event_id'] == record && wyniki[wynik]['average'] == pbki[record]['average']['best']){
				if(resultsAverage.hasOwnProperty(record)){
					resultsAverage[record].push(wyniki[wynik]['competition_id'])
				}else{
					resultsAverage[record] = [wyniki[wynik]['competition_id']]
				}
				if(!allPBComps.includes(wyniki[wynik]['competition_id'])){
					allPBComps.push(wyniki[wynik]['competition_id'])
				}
			}
		}
	}
	for(wynik in wyniki){
		if(wyniki[wynik]['event_id'] == record && wyniki[wynik]['best'] == pbki[record]['single']['best']){
			if(resultsSingle.hasOwnProperty(record)){
				resultsSingle[record].push(wyniki[wynik]['competition_id'])
			}else{
				resultsSingle[record] = [wyniki[wynik]['competition_id']]
			}
			if(!allPBComps.includes(wyniki[wynik]['competition_id'])){
				allPBComps.push(wyniki[wynik]['competition_id'])
			}
		}
	}
}
comp_dates = {}
for(comp in allPBComps){
	$.get('https://www.worldcubeassociation.org/api/v0/competitions/' + allPBComps[comp], function(data, status){
		comp_dates[data['id']] = new Date(data['end_date'])
	});
}
$(".personal-records td.single").hover(function(){
	event = $(this).parent().children().eq(0).attr('data-event')
	text = "<div style = \"z-index:1; position:absolute; background-color: #f4f4f4; display: inline; padding-left: 10px border-width: 10px; border-radius: 15px; border-style: solid; border-color:#f4f4f4;\">"
	for(i in resultsSingle[event]){
		diff = Math.floor((new Date() - comp_dates[resultsSingle[event][i]])/(1000 * 60 * 60 * 24))
		text += "<div>" + diff + " days ago " + resultsSingle[event][i] + "</div>"
	}
	text += "</div>"
	$(this).append(text);
},
function(){
	//($(this)html())
	$(this).html($(this).html().split('<div')[0])
	
}
);
$(".personal-records td.average").hover(function(){
	event = $(this).parent().children().eq(0).attr('data-event')
	text = "<div style = \"z-index:1; position:absolute; background-color: white; display: inline; padding-left: 10px border-width: 10px; border-radius: 15px; border-style: solid; border-color:#f4f4f4;\">"
	for(i in resultsAverage[event]){
		diff = Math.floor((new Date() - comp_dates[resultsAverage[event][i]])/(1000 * 60 * 60 * 24))
		text += "<div>" + diff + " days ago " + resultsAverage[event][i] + "</div>"
	}
	text += "</div>"
	$(this).append(text);
},
function(){
	//console.log($(this)html())
	$(this).html($(this).html().split('<div')[0])
	
}
);
});
});