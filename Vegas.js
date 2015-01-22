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
	for(var i=0;i<101;i++){
		var ave=0;
		for(var j=0;j<cashArrs.length;j++){
			ave+=cashArrs[j][i];
		}
		ave/=cashArrs.length;
		aveArr[aveArr.length]=ave;
	}

	//Specify the width, height, and margin of the svg element
	var w = 600,
	    h = 200;
	    padding = 50;

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
	d3.select('body').selectAll('svg').remove();
	var svg = d3.select('body').append('svg')
	    .attr('width', w)
	    .attr('height', h);

	//Define X and Y axis
	var xAxis = d3.svg.axis()
					  .scale(xScale)
					  .orient("bottom")
					  .ticks(1);
	var yAxis = d3.svg.axis()
					  .scale(yScale)
					  .orient("left")
					  .ticks(3);

	//Create X and Y axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxis);
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);

	//Draw all 1000 simulations and average
	for(var i=0;i<cashArrs.length;i++){
		drawPlot(cashArrs[i],svg,line);
	}
	drawAve(aveArr,svg,line);
}


//Simulates a single night of roulette (100 spins)
//Returns an array of 101 cash values
function simRoulette(startCash,betCash,numPlays){
	var cashArr=[startCash];
	var curCash=startCash;
	var winFrac=18/37;
	for(var i=0;i<numPlays;i++){
		if(curCash>0){
			if(Math.random()<winFrac){
				curCash+=betCash;
			}else{curCash-=betCash;}
		}else{}
		cashArr[cashArr.length]=curCash;
	}
	return cashArr
}

//Takes an array of cash values and plots them. Taken from here:
//http://big-elephants.com/2014-06/unrolling-line-charts-d3js/
//Documentation about transitions here: https://github.com/mbostock/d3/wiki/Transitions
function drawPlot(cashArr,svg,line){
	var data = cashArr.map(function(d,i) {
        return [i, d];
    });
    //Seemingly unnecessary line omitted below: .attr('d', line(data[0]))
    var path = svg.append('path')
        .attr('class', 'line')
        .transition()
        .duration((Math.random()+2)*1000)
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

//Identical to drawPlot except for adding an 'ave'
//class to the path
function drawAve(aveArr,svg,line){
	var data = aveArr.map(function(d,i) {
        return [i, d];
    });
    var path = svg.append('path')
        .attr('class', 'ave')
        .transition()
        .duration(2900)
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

