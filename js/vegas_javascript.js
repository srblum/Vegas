var gameName = "Roulette";
var winFrac = 1/2;
var loaded = false;
window.onload = function() {
    var fakeForm = {
        startCash:{value:100},
        betCash:{value:10}
    };
    runSim(fakeForm);
};

/* When Games, Rules, or Strategy gets clicked on, text appears or disappears */
$(document).ready(function() {
    $('#bacStratList').hide();
	$('#blackStratList').hide();
    $('#crapsStratList').hide();


	$(".clickText").hide();
	
	$(".clickAppear").click(function() {
		$(this).next().slideToggle(300);
	});
	
    $(".game1").click(function() {
        gameName = "Baccarat";
        winFrac = 45/100;
        $('#bacStratList').show();
        $('#blackStratList').hide();
        $('#crapsStratList').hide();
        $('#rouletteStratList').hide();
	});
    
    $(".game2").click(function() {
        gameName = "Roulette";
        winFrac = 48/100;
        $('#bacStratList').hide();
        $('#blackStratList').hide();
        $('#crapsStratList').hide();
        $('#rouletteStratList').show();
	});
    
    $(".game3").click(function() {
        gameName = "BlackJack";
        winFrac = 43/100;
        $('#bacStratList').hide();
        $('#blackStratList').show();
        $('#crapsStratList').hide();
        $('#rouletteStratList').hide();
	});
    
    $(".game4").click(function() {
        gameName = "Craps";
        winFrac = 49/100;
        $('#bacStratList').hide();
        $('#blackStratList').hide();
        $('#crapsStratList').show();
        $('#rouletteStratList').hide();
	});
});

//The main function of Vegas.js
//Called when "start" button is clicked
function runSim(form) {
    var startCash = Number(form.startCash.value);
    var betCash = Number(form.betCash.value);
    if(loaded == false) {
        document.getElementById("startText").style.color = "black";
        loaded=true;
    }else{
    document.getElementById("startText").style.color = "black";
    document.getElementById("startText").innerHTML = "You started with $" + startCash + ". Each game you decided to bet $" + betCash + ". On the graph to the right, the black lines represents a thousand simulation of possible outcomes over 100 game plays. The red line is your average cash over time.";
    }
    var numPlays = 100;
    var numNights = 300;
    var cashArrs=[];
    for(var i=0;i<numNights;i++){
        if(gameName == "Roulette"){
            cashArrs[cashArrs.length]=simRoulette(startCash,betCash,numPlays);
        }else if(gameName == "Craps"){
            cashArrs[cashArrs.length]=simCraps(startCash,betCash,numPlays);
        }else if(gameName == "BlackJack"){
            cashArrs[cashArrs.length]=simBlackJack(startCash,betCash,numPlays);
        }else if(gameName == "Baccarat"){
            cashArrs[cashArrs.length]=simBaccarat(startCash,betCash,numPlays);
        }else{
            cashArrs[cashArrs.length]=simRoulette(startCash,betCash,numPlays);
        }

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
    var w = 900,
        h = 700;
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
    d3.select('.graph').selectAll('svg').remove();
    var svg = d3.select('.graph').append('svg')
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
                      .tickFormat(function(d){return "$"+d;})
                      .ticks(7);
    // Creates functions for the X and Y Grid to be created
    function gridYaxis() {
        return d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(10)
    }

    // Draw yAxis grid
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(160,0)")
        .call(gridYaxis()
            .tickSize(-430, 0, 0)
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
        .text("Cash");
    
    // Creates xAxis label
    svg.append("text")
        .attr("transform", "translate(" + (w/2 - 100) + " ," + (h-100) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Number of Plays");
    
//    //Creates the legend
//    svg.append("rect")
//        .attr("x", 160)
//        .attr("y", 105)
//        .attr("width", w-475)
//        .attr("height", 30)
//        .attr("fill", "#ddd")
//        .style("stroke-size", "1px");   
//    svg.append("circle")
//        .attr("r", 6)
//        .attr("cx", 180)
//        .attr("cy", 120)
//        .style("fill", "Black");
//    svg.append("circle")
//        .attr("r", 6)
//        .attr("cx", 330)
//        .attr("cy", 120)
//        .style("fill", "Grey");
//    svg.append("text")
//        .attr("class", "label1")
//        .attr("x", 300)
//        .attr("y", 125)
//        .style("text-anchor", "end")
//        .text("Average Cash");
//    svg.append("text")
//        .attr("class", "label2")
//        .attr("x", 450)
//        .attr("y", 125)
//        .style("text-anchor", "end")
//        .text("Random Plays");
 
    //Creates Title
    svg.append("text")
        .attr("class", "title1")
        .attr("x", w/2.5)
        .attr("y", 130)
        .style("text-anchor", "middle")
        .style("font-size", "30px")
        .text(gameName);    

    //Draw all 1000 simulations and average
    for(var i=0;i<cashArrs.length;i++){
        if (cashArrs[i][100]==0){
            drawPath(cashArrs[i],svg,line,'brokeLine')
        }
        else{
            drawPath(cashArrs[i],svg,line,'line');
        }
    }
    drawHist(cashArrs,svg,w,h,padding);
    drawPath(aveArr,svg,line,'ave');
}


//Simulates a single night of roulette (100 spins)
//Returns an array of 101 cash values
function simRoulette(startCash,betCash,numPlays){
	var cashArr=[startCash];
	var curCash=startCash;
    var cashArr=[startCash];
    var curCash=startCash;
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

function simCraps(startCash,betCash,numPlays){
    var cashArr=[startCash];
    var curCash=startCash;
    var cashArr=[startCash];
    var curCash=startCash;
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



//
//THE CODE BELOW HAS NOT YET BEEN FULLY INTEGRATED... 
//

// Simulates craps bets, over numPlays number of individual rolls
// function simCraps(startCash, betCash, numPlays){
//     var cashArr = [startCash];
//     var curCash = startCash;
//     var wagerCash;
//     var comeOut = true; // A come out roll is the first roll of a shooter's round. Sim assumes first bet is always on a come out
//     var pointSet = 0; // Value is set by a successful come out roll, this roll becomes target to match before hitting 7
//     // On a come out roll, pointSet assigned 0, representing no point has been set
//     function rollDice() { return (Math.floor((Math.random() * 6) + 1) + Math.floor((Math.random() * 6) + 1)); }
//     // Returns sum of two results between 1 and 6, i.e. sum of two die rolls
//     for(var i = 0; i < numPlays; i++){
//         var rollResult = rollDice(); // Shooter's roll result
//         if(comeOut == true){ // If it was the come out...
//             if(rollResult == 7 || rollResult == 11)
//                 comeOut = true;
//                 // Pass line victory, don't pass loss, next roll still comeOut
//             else if(rollResult == 2 || rollResult == 3 || rollResult == 12)
//                 comeOut = true;
//                 // Don't pass victory, pass line loss, next roll still comeOut
//             else{
//                 comeOut = false;
//                 pointSet = rollResult;
//             }
//         }
//         else{ // If it wasn't the come out...
//             if(rollResult == pointSet){
//             // Pass line victory, don't pass loss
//                comeOut = true;
//             }
//             else if(rollResult == 7){
//             // Don't pass victory, pass line loss
//                comeOut = true;
//             }
//             else{} // Reroll
//                comeOut = false;
//         }
//     }
// }

//
//
//

function simBlackJack(startCash,betCash,numPlays){
    var cashArr=[startCash];
    var curCash=startCash;
    var cashArr=[startCash];
    var curCash=startCash;
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

function simBaccarat(startCash,betCash,numPlays){
    var cashArr=[startCash];
    var curCash=startCash;
    var cashArr=[startCash];
    var curCash=startCash;
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
        .on("mouseover",function(){this.parentNode.appendChild(this);})
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


// Takes array of cash values and draws vertical histogram
// Modified from Mike Bostock's histogram code: http://bl.ocks.org/mbostock/3048450
function drawHist(cashArrs, svg, w, h, padding){
// Takes array of arrays as input, but this function only cares about ending bankroll
    
    var histMargin = 20; // Number of horizontal pixels to buffer graph from histogram
    var displayHeight = h - (padding * 2); // Number of pixels of height of histogram
    var displayXStart = w - padding + histMargin; // X position where histogram starts
    
    var binCount = 15; // Sets bin count for hist
    var binHeight = displayHeight/binCount; // This will form histogram bar height
    
    endCash = []; // Array to store only final bankrolls
    for(var i = 0; i < cashArrs.length; i++){ // For each array stored in cashArrs...
        endCash[i] = cashArrs[i][(cashArrs[i].length) - 1]; // Store last element of i-th array in endCash
    }
  //  console.log(endCash);
    
    var yScaleHist = d3.scale.linear()
        .domain([0, d3.max(endCash)]) // From lowest to highest bankrolls at end of night
        .range([h - (padding), padding]); // Display height
    
    var histData = d3.layout.histogram() // Generates a histogram with 20 equal bins
        .bins(binCount) // Adjusts span of bins by yScaleHist to end up with 20
        (endCash);
    
  //  console.log(histData);
    
    var xScaleHist = d3.scale.linear()
        .domain([0,
                 d3.max(histData, function(d) { return d.y; } )]) // d.y = bin COUNT, not x-y position
// Domain is variation in COUNT of stuff in bins, from lowest to the highest of bin counts!
 //       .range([displayXStart, displayXStart + padding]); // Width display of pixels go from right of graph display to edge of canvas
        .range([0, padding]);
    
    // svg element already declared, shouldn't need to declare it again
    
    svg.append("g")
        .attr("transform", "translate(" + (w - (padding * 2) + histMargin) + "," + padding + ")"); // element appended in position
    
    var histbar = svg.selectAll(".histbar")
        .data(histData)
        .enter()
        .append("g")
        .attr("class", "histbar")
    
    histbar.append("rect")
//         .transition().duration(1000) Currently doens't seem to work
        .attr("x", w - (padding * 2) + histMargin)
// x position of rectangle should be end of graph display
        .attr("y", function(d) { return yScaleHist(d.x) - binHeight; } ) // d.x is hist bin's relative start, NOT x position
// y position of rectangle should be based on the bounds of the bin.
        .attr("width", function(d) {return xScaleHist(d.y); }) // d.y is count within hist bin, NOT y position
// Width of rectangle should be pegged to xScaled data value, i.e. count of items in histogram
        .attr("height", binHeight)
// Height of rectangle should be based on yScaled "width" of the bin

}