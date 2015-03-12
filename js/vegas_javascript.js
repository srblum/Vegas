window.onload = function() {
    var startCash = 100;
    var betCash = 10;
    var numPlays = 100;
    var numNights = 300;
    var cashArrs=[];
    for(var i=0;i<numNights;i++){
        cashArrs[cashArrs.length]=simRoulette(startCash,betCash,numPlays);
    }

    //Store an average of all arrays of cashArr in aveArr
    var aveArr=[];
    for(var i=0;i<numPlays+1;i++){
        var ave=0;
        for(var j=0;j<cashArrs.length;j++){
            ave+=cashArrs[j][i];
        }
        ave/=cashArrs.length;
        aveArr[aveArr.length]=ave;
    }

    //Specify the width, height, and margin of the svg element
    var w = 1200,
        h = 800;
        padding = 160;

    //maps the domain of the data (0,length-1)
    //onto the range of x screen coordinates (which correspond
    //to the width of the svg element.)
    var xScale = d3.scale.linear()
        .domain([0, numPlays])
        .range([padding, w - padding * 2]);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(cashArrs,function(x){return d3.max(x)})])
        .range([h - padding, padding]);

    //d3.svg.line is a path generator (both object and function), containing scale information
    var line = d3.svg.line()
        .x(function(d) { return xScale(d[0]); })
        .y(function(d) { return yScale(d[1]); });

    //Recreate svg element
    d3.select('.graphcontainer').selectAll('svg').remove();
    var svg = d3.select('.graphcontainer').append('svg')
        .attr('width', w)
        .attr('height', h);

    //Define X and Y axis
    var xAxis = d3.svg.axis()
                      .scale(xScale)
                      .orient("bottom")
                      .ticks(5);
    var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left")
                      .ticks(7);
    // Creates functions for the X and Y Grid to be created
    function gridXaxis() {
        return d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(10)
    }
    function gridYaxis() {
        return d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(10)
    }

    // Draw xAxis grid
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0,640)")
        .call(gridXaxis()
            .tickSize(-500, 0, 0)
            .tickFormat("")
        )

    // Draw yAxis grid
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(160,0)")
        .call(gridYaxis()
            .tickSize(-740, 0, 0)
            .tickFormat("")
        )

    //Create X and Y axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -400)
        .attr("dy", "-3em")
        .style("font-size", "20px")
        .style("text-anchor", "middle") 
        .text("Value in Dollars ($)");

    // Creates xAxis label
    svg.append("text")
        .attr("transform", "translate(" + (w/2 - 100) + " ," + (h-100) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Number of Plays");
    
    //Creates the legend
    svg.append("rect")
        .attr("x", 160)
        .attr("y", 105)
        .attr("width", w-475)
        .attr("height", 30)
        .attr("fill", "#ddd")
        .style("stroke-size", "1px");   
    svg.append("circle")
        .attr("r", 6)
        .attr("cx", 180)
        .attr("cy", 120)
        .style("fill", "Red");
    svg.append("circle")
        .attr("r", 6)
        .attr("cx", 330)
        .attr("cy", 120)
        .style("fill", "Black");
    svg.append("text")
        .attr("class", "label1")
        .attr("x", 300)
        .attr("y", 125)
        .style("text-anchor", "end")
        .text("Average Cash");
    svg.append("text")
        .attr("class", "label2")
        .attr("x", 450)
        .attr("y", 125)
        .style("text-anchor", "end")
        .text("Random Plays");
    
    //Creates Title
    svg.append("text")
        .attr("class", "title1")
        .attr("x", w/2 + 70)
        .attr("y", 60)
        .style("text-anchor", "end")
        .style("font-size", "30px")
        .text("Fixed Graph for 100 Plays");

    //Draw all 1000 simulations and average
    for(var i=0;i<cashArrs.length;i++){
        drawPath(cashArrs[i],svg,line,'line');
    }
    drawPath(aveArr,svg,line,'ave');
};

/* When Games, Rules, or Strategy gets clicked on, text appears or disappears */
$(document).ready(function() {
	
	$(".clickText").hide();
	
	$(".clickAppear").click(function() {
		$(this).next().slideToggle(300);
	});
	
    $(".game").click(function() {
        
	});
});

//The main function of Vegas.js
//Called when "start" button is clicked
function runSim(form) {
    var startCash = Number(form.startCash.value);
    var betCash = Number(form.betCash.value);
    var numPlays = 100;
    var numNights = 300;
    var cashArrs=[];
    for(var i=0;i<numNights;i++){
		cashArrs[cashArrs.length]=simRoulette(startCash,betCash,numPlays);
    }

    //Store an average of all arrays of cashArr in aveArr
	var aveArr=[];
	for(var i=0;i<numPlays+1;i++){
		var ave=0;
		for(var j=0;j<cashArrs.length;j++){
			ave+=cashArrs[j][i];
		}
		ave/=cashArrs.length;
		aveArr[aveArr.length]=ave;
	}

	//Specify the width, height, and margin of the svg element
	var w = 1200,
	    h = 800;
	    padding = 160;

	//maps the domain of the data (0,length-1)
	//onto the range of x screen coordinates (which correspond
	//to the width of the svg element.)
	var xScale = d3.scale.linear()
	    .domain([0, numPlays])
	    .range([padding, w - padding * 2]);

	var yScale = d3.scale.linear()
	    .domain([0, d3.max(cashArrs,function(x){return d3.max(x)})])
	    .range([h - padding, padding]);

	//d3.svg.line is a path generator (both object and function), containing scale information
	var line = d3.svg.line()
	    .x(function(d) { return xScale(d[0]); })
	    .y(function(d) { return yScale(d[1]); });

	//Recreate svg element
	d3.select('.graphcontainer').selectAll('svg').remove();
	var svg = d3.select('.graphcontainer').append('svg')
	    .attr('width', w)
	    .attr('height', h);

	//Define X and Y axis
	var xAxis = d3.svg.axis()
					  .scale(xScale)
					  .orient("bottom")
					  .ticks(5);
	var yAxis = d3.svg.axis()
					  .scale(yScale)
					  .orient("left")
					  .ticks(7);
    // Creates functions for the X and Y Grid to be created
    function gridXaxis() {
        return d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .ticks(10)
    }
    function gridYaxis() {
        return d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(10)
    }
    
    // Draw xAxis grid
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0,640)")
        .call(gridXaxis()
            .tickSize(-500, 0, 0)
            .tickFormat("")
        )

    // Draw yAxis grid
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(160,0)")
        .call(gridYaxis()
            .tickSize(-740, 0, 0)
            .tickFormat("")
        )

	//Create X and Y axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxis);
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -400)
        .attr("dy", "-3em")
        .style("font-size", "20px")
        .style("text-anchor", "middle") 
        .text("Value in Dollars ($)");
    
    // Creates xAxis label
    svg.append("text")
        .attr("transform", "translate(" + (w/2 - 100) + " ," + (h-100) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Number of Plays");
    
    //Creates the legend
    svg.append("rect")
        .attr("x", 160)
        .attr("y", 105)
        .attr("width", w-475)
        .attr("height", 30)
        .attr("fill", "#ddd")
        .style("stroke-size", "1px");   
    svg.append("circle")
        .attr("r", 6)
        .attr("cx", 180)
        .attr("cy", 120)
        .style("fill", "Red");
    svg.append("circle")
        .attr("r", 6)
        .attr("cx", 330)
        .attr("cy", 120)
        .style("fill", "Black");
    svg.append("text")
        .attr("class", "label1")
        .attr("x", 300)
        .attr("y", 125)
        .style("text-anchor", "end")
        .text("Average Cash");
    svg.append("text")
        .attr("class", "label2")
        .attr("x", 450)
        .attr("y", 125)
        .style("text-anchor", "end")
        .text("Random Plays");
 
    //Creates Title
    svg.append("text")
        .attr("class", "title1")
        .attr("x", w/2 + 70)
        .attr("y", 60)
        .style("text-anchor", "end")
        .style("font-size", "30px")
        .text("Game Graph for 100 Plays");    

	//Draw all 1000 simulations and average
	for(var i=0;i<cashArrs.length;i++){
		drawPath(cashArrs[i],svg,line,'line');
	}
	drawPath(aveArr,svg,line,'ave');
}


//Simulates a single night of roulette (100 spins)
//Returns an array of 101 cash values
function simRoulette(startCash,betCash,numPlays){
	var cashArr=[startCash];
	var curCash=startCash;
	var winFrac=18/37;
    var wagerCash;
	for(var i=0;i<numPlays;i++){
		if(curCash>0){
            wagerCash = betCash; // wagerCash is a check to make sure we're betting max available cash, resets itself every loop
            if(curCash < betCash)
                wagerCash = curCash;
			if(Math.random()<winFrac){
				curCash+=wagerCash;
			}else{curCash-=wagerCash;}
		}else{}
		cashArr[cashArr.length]=curCash;
	}
	return cashArr
}

//Takes an array of cash values and plots them. Taken from here:
//http://big-elephants.com/2014-06/unrolling-line-charts-d3js/
//Documentation about transitions here: https://github.com/mbostock/d3/wiki/Transitions
function drawPath(cashArr,svg,line,pathClass){
	var data = cashArr.map(function(d,i) {
        return [i, d];
    });
    var path = svg.append('path')
        .attr('class', pathClass)
        .transition()
        .duration(pathClass=='ave'?3000:(Math.random()*1000)+2000)
        .attrTween('d', pathTween);
	function pathTween() {
	    var interpolate = d3.scale.quantile()
	            .domain([0,1])
	            .range(d3.range(1, data.length+1));
	    return function(t) {
	        return line(data.slice(0, interpolate(t)));
	    };
	}
}