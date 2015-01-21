//The main function of Vegas.js
//Called when "start" button is clicked
//Calls all other functions
function runSim(form) {
    var startCash = Number(form.startCash.value);
    var betCash = Number(form.betCash.value);
    var numNights = 100;
    var cashArrs=[];
    for(var i=0;i<numNights;i++){
		cashArrs[cashArrs.length]=simRoulette(startCash,betCash);
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
	//Specify the width and height of the svg element
	var w = 300,
	    h = 100;
	    padding = 30;

	//maps the domain of the data (0,length-1)
	//onto the range of x screen coordinates (which correspond
	//to the width of the svg element.)
	var xScale = d3.scale.linear()
	    .domain([0, 100])
	    .range([padding, w - padding * 2]);

	//Same as above, but mapping y-data
	//to y screen coordinates
	var yScale = d3.scale.linear()
	    .domain([0, 200])
	    .range([h - padding, padding]);

	//d3.svg.line is a path generator
	//It is both an object and a function
	//Creates a line object with anonymous functions
	//that tell the object which numbers in the data array 
	//correspond to x- and y-values.
	//
	//Also uses the x and y d3 scale objects created above
	var line = d3.svg.line()
	    .x(function(d) { return xScale(d[0]); })
	    .y(function(d) { return yScale(d[1]); });

	//appends an svg element to the body
	//with apropriate width and height
	d3.select('body').selectAll('svg').remove();
	var svg = d3.select('body').append('svg')
	    .attr('w', w)
	    .attr('h', h);

	//Define X axis
	var xAxis = d3.svg.axis()
					  .scale(xScale)
					  .orient("bottom")

	//Define Y axis
	var yAxis = d3.svg.axis()
					  .scale(yScale)
					  .orient("left")
					  .ticks(5);

	//Create X axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxis);
	
	//Create Y axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);

	//Draw all 1000 simulations
	for(var i=0;i<cashArrs.length;i++){
		drawPlot(cashArrs[i],svg,line);
	}

	//Draw average
	drawAve(aveArr,svg,line);
}

//Simulates a single night of roulette (100 spins)
//Returns an array of 101 cash values
function simRoulette(startCash,betCash){
	var cashArr=[startCash];
	var curCash=startCash;
	var winFrac=18/37;
	for(var i=0;i<100;i++){
		if(curCash>0){
			if(Math.random()<winFrac){
				curCash+=betCash;
			}else{curCash-=betCash;}
		}else{}
		cashArr[cashArr.length]=curCash;
	}
	return cashArr
}

//Takes an array of cash values and plots them
//This code was taken from here:
//http://big-elephants.com/2014-06/unrolling-line-charts-d3js/
function drawPlot(cashArr,svg,line){
	//Turn the raw data into a nested array of
	//[index,data] pairs
	//This works because index is an automatic
	//2nd argument to the map function
	var data = cashArr.map(function(d,i) {
        return [i, d];
    });
    
	//Appends a path element to the svg element created above
    // add element and transition in
    var path = svg.append('path')
        .attr('class', 'line')
        //Seemingly unnecessary line omitted below
        // .attr('d', line(data[0]))

        //Documentation about transitions here:
        //https://github.com/mbostock/d3/wiki/Transitions
        .transition()
        .duration(1000)
        .attrTween('d', pathTween);
    //Called by attrTween during the path transition animation
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
        .duration(1000)
        .attrTween('d', pathTween);
    //Called by attrTween during the path transition animation
	function pathTween() {
	    var interpolate = d3.scale.quantile()
	            .domain([0,1])
	            .range(d3.range(1, data.length+1));
	    return function(t) {
	        return line(data.slice(0, interpolate(t)));
	    };
	}
}

