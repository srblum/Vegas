//The main function of Vegas.js
//Called when "start" button is clicked
//Calls all other functions
function runSim(form) {
    var startCash = Number(form.startCash.value);
    var betCash = Number(form.betCash.value);
    var numNights = 1000;
    var cashArrs=[];
    for(var i=0;i<numNights;i++){
		cashArrs[cashArrs.length]=simRoulette(startCash,betCash);
    }

	//Specify the width and height of the svg element
	var w = 300,
	    h = 100;

	//maps the domain of the data (0,length-1)
	//onto the range of x screen coordinates (which correspond
	//to the width of the svg element.)
	var x = d3.scale.linear()
	    .domain([0, 100])
	    .range([0, w]);

	//Same as above, but mapping y-data
	//to y screen coordinates
	var y = d3.scale.linear()
	    .domain([0, 200])
	    .range([h,0]);

	//d3.svg.line is a path generator
	//It is both an object and a function
	//Creates a line object with anonymous functions
	//that tell the object which numbers in the data array 
	//correspond to x- and y-values.
	//
	//Also uses the x and y d3 scale objects created above
	var line = d3.svg.line()
	    .x(function(d) { return x(d[0]); })
	    .y(function(d) { return y(d[1]); });

	//appends an svg element to the body
	//with apropriate width and height
	d3.select('body').selectAll('svg').remove();
	var svg = d3.select('body').append('svg')
	    .attr('w', w)
	    .attr('h', h);

	for(var i=0;i<cashArrs.length;i++){
		drawPlot(cashArrs[i],svg,line);
	}
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


//Takes a nested array of 1000 arrays 
//of 101 cash values and plots them
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
        //Seemingly unnecessary line below
        // .attr('d', line(data[0]))

        //Documentation about transitions here:
        //https://github.com/mbostock/d3/wiki/Transitions
        .transition()
        .duration(3500)
        .attrTween('d', pathTween);
    
    function pathTween() {
        var interpolate = d3.scale.quantile()
                .domain([0,1])
                .range(d3.range(1, data.length-1));
        return function(t) {
            return line(data.slice(0, interpolate(t)));
        };
    }
}