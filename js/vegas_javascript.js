var gameName = "Roulette";
var winFrac = 1/2;
var loaded = false;
window.onload = function() {
    var fakeForm = {
        startCash:{value:100},
        betCash:{value:10},
        rouletteStratList:{value:"colorBet"}
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
    // var strat = form.
    if(loaded == false) {
        document.getElementById("startText").style.color = "black";
        loaded=true;
    }else{
    document.getElementById("startText").style.color = "black";
    document.getElementById("startText").innerHTML = "You started with $" + startCash + ". Each game you decided to bet $" + betCash + ". On the graph to the right, the black lines represents a thousand simulation of possible outcomes over 100 game plays. The red line is your average cash over time.";
    }
    var numPlays = 100;
    var numNights = 1000;
    var cashArrs=[];
    for(var i=0;i<numNights;i++){
        if(gameName == "Roulette"){
            cashArrs[cashArrs.length]=simRoulette(startCash,betCash,numPlays,form.rouletteStratList.value);
        }else if(gameName == "Craps"){
            cashArrs[cashArrs.length]=simCraps(startCash,betCash,numPlays);
        }else if(gameName == "BlackJack"){
            cashArrs[cashArrs.length]=simBlackJack(startCash,betCash,numPlays);
        }else if(gameName == "Baccarat"){
            cashArrs[cashArrs.length]=simBaccarat(startCash,betCash,numPlays,form.bacStratList.value);
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
        .domain([d3.min(cashArrs,function(x){return d3.min(x)}), d3.max(cashArrs,function(x){return d3.max(x)})])
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
            .tickSize(-420, 0, 0)
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
    for(var i=0;i<300;i++){
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
function simRoulette(startCash,betCash,numPlays,strat){
	var cashArr=[startCash];
	var curCash=startCash;
    var wagerCash;
    if(strat=='colorBet'){
        winFrac=18/37;
        payout=1;
    }else if(strat=='numberBet'){
        winFrac=1/37;
        payout=35;
    }
    for(var i=0;i<numPlays;i++){
        if(curCash>0){
            wagerCash = betCash; // wagerCash is a check to make sure we're betting max available cash, resets itself every loop
            if(curCash < betCash)
                wagerCash = curCash;
            if(Math.random()<winFrac){
                curCash+=wagerCash*payout;
            }else{curCash-=wagerCash;}
        }
        cashArr[cashArr.length]=curCash;
    }
    return cashArr
}

// function simCraps(startCash,betCash,numPlays){
//     var cashArr=[startCash];
//     var curCash=startCash;
//     var wagerCash;
//     for(var i=0;i<numPlays;i++){
//         if(curCash>0){
//             wagerCash = betCash; // wagerCash is a check to make sure we're betting max available cash, resets itself every loop
//             if(curCash < betCash)
//                 wagerCash = curCash;
//             if(Math.random()<winFrac){
//                 curCash+=wagerCash;
//             }else{curCash-=wagerCash;}
//         }else{}
//         cashArr[cashArr.length]=curCash;
//     }
//     return cashArr
// }



// Simulates craps bets, over numPlays number of individual rolls
 function simCraps(startCash, betCash, numPlays){
     var stratIndex = document.getElementById("crapsStratList").selectedIndex; // Which craps strategy was selected
     // Index 0 = optimal, index 1 = Pass line, index 2 = don't pass
     var cashArr = [startCash];
     var curCash = startCash;
     var wagerCash; // The amount we'll bet in a given round
     var comeOut = true; // A come out roll is the first roll of a shooter's round. Sim assumes first bet is always on a come out
     var roundComplete = false; // Each round of play can consist of multiple rolls
     var pointSet = 0; // Value is set by a successful come out roll, this roll becomes target to match before hitting 7
     // On a come out roll, pointSet assigned 0, representing no point has been set
     function rollDice() { return (Math.floor((Math.random() * 6) + 1) + Math.floor((Math.random() * 6) + 1)); }
     // Returns sum of two results between 1 and 6, i.e. sum of two die rolls

     if(stratIndex == 0){ // Optimal play selected, simplified betting
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
     }
     else{ for(var i = 0; i < numPlays; i++){ // For all other betting strategies
         if(curCash > 0){ // We only bet if we have any money left
            if(curCash < betCash) // If we don't have as much money as we want to wager..
                wagerCash = curCash; // We bet as much as what we have
            else
                wagerCash = betCash; // Else we bet the intended amount
            while(roundComplete == false) // While the round is not done...
            {
                var rollResult = rollDice(); // Roll the dice and look at result
                if(comeOut == true){ // If it was the come out...
                    if(rollResult == 7 || rollResult == 11){
                        if(stratIndex == 1) { curCash = curCash + wagerCash; }// Pass line victory
                        if(stratIndex == 2) { curCash = curCash - wagerCash; }// Don't pass loss
                        comeOut = true;
                        roundComplete = true; // End of round
                    }
                    else if(rollResult == 2 || rollResult == 3){
                        if(stratIndex == 1) { curCash = curCash - wagerCash; } // Pass line loss
                        if(stratIndex == 2) { curCash = curCash + wagerCash; }// Don't pass victory
                        comeOut = true;
                        roundComplete = true; // End of round
                    }
                    else{
                        comeOut = false;
                        pointSet = rollResult; // New rolls against point that's been set
                    }
                }
                else{ // If it wasn't the come out...
                    if(rollResult == pointSet){ // Dice rolled match pointSet
                        if(stratIndex == 1) { curCash = curCash + wagerCash; } // Pass line victory
                        if(stratIndex == 2) { curCash = curCash - wagerCash; } // Don't pass loss
                        comeOut = true;
                        roundComplete = true; // End of round
                    }
                    else if(rollResult == 7){ // Dice roll a 7, before getting pointSet
                        if(stratIndex == 1) { curCash = curCash - wagerCash; } // Pass line loss
                        if(stratIndex == 2) { curCash = curCash + wagerCash; }// Don't pass victory
                        comeOut = true;
                        roundComplete = true;
                    }
                    else{ comeOut = false; }
                    // ...if neither of those is true, we just roll again
                }
            } // End of round
            roundComplete = false; // Set this so new round can begin
            pointSet = 0; // No point yet set in the new round
         } // End of "if curCash > 0" clause, we can skip entire game if we're broke!
         cashArr[cashArr.length]=curCash; // Bankroll after round's bet added to bankroll array
       } // End of for loop
     } // End of "else" for strategy selection
     return cashArr;
}


function simBlackJack(startCash,betCash,numPlays){
    var cashArr=[startCash];
    var curCash=startCash;
    var winFrac=.5018646;
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

function simBaccarat(startCash,betCash,numPlays,strat){
    var winFrac = 0.458597;
    var lossFrac = 0.446247;
    var cashArr=[startCash];
    var curCash=startCash;
    var wagerCash;
    var payout;
    var loss;
    var tie;
    if(strat=='bankerBet'){
        payout=0.95;
        loss=-1;
        tie=0;
    }else if(strat=='playerBet'){
        payout=-1;
        loss=1;
        tie=0;
    }else if(strat=='tieBet'){
        payout=-1;
        loss=-1;
        tie=8;
    }else if(strat=='pairBet'){
        winFrac=0.074699;
        lossFrac=0;
        payout=11;
        loss=-1;
        tie=-1;
    }
    for(var i=0;i<numPlays;i++){
        var rand=Math.random();
        if(curCash>0){
            wagerCash = betCash; // wagerCash is a check to make sure we're betting max available cash, resets itself every loop
            if(curCash < betCash){wagerCash = curCash;}
            if(rand<winFrac){
                curCash+=wagerCash*payout;
            }else if(rand<(winFrac+lossFrac)){
                curCash+=wagerCash*loss;
            }else{
                curCash+=wagerCash*tie;
            }
        }
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
//
//Old version
//

// // Takes array of cash values and draws vertical histogram
// // Modified from Mike Bostock's histogram code: http://bl.ocks.org/mbostock/3048450
// function drawHist(cashArrs, svg, w, h, padding){
// // Takes array of arrays as input, but this function only cares about ending bankroll
    
//     var histMargin = 20; // Number of horizontal pixels to buffer graph from histogram
//     var displayHeight = h - (padding * 2); // Number of pixels of height of histogram
//     var displayXStart = w - padding + histMargin; // X position where histogram starts
    
//     var binCount = 15; // Sets bin count for hist
//     var binHeight = displayHeight/binCount; // This will form histogram bar height
    
//     endCash = []; // Array to store only final bankrolls
//     for(var i = 0; i < cashArrs.length; i++){ // For each array stored in cashArrs...
//         endCash[i] = cashArrs[i][(cashArrs[i].length) - 1]; // Store last element of i-th array in endCash
//     }
//   //  console.log(endCash);
    
//     var yScaleHist = d3.scale.linear()
//         .domain([0, d3.max(endCash)]) // From lowest to highest bankrolls at end of night
//         .range([h - (padding), padding]); // Display height
    
//     var histData = d3.layout.histogram() // Generates a histogram with 20 equal bins
//         .bins(binCount) // Adjusts span of bins by yScaleHist to end up with 20
//         (endCash);
    
//   //  console.log(histData);
    
//     var xScaleHist = d3.scale.linear()
//         .domain([0,
//                  d3.max(histData, function(d) { return d.y; } )]) // d.y = bin COUNT, not x-y position
// // Domain is variation in COUNT of stuff in bins, from lowest to the highest of bin counts!
//  //       .range([displayXStart, displayXStart + padding]); // Width display of pixels go from right of graph display to edge of canvas
//         .range([0, padding]);
    
//     // svg element already declared, shouldn't need to declare it again
    
//     svg.append("g")
//         .attr("transform", "translate(" + (w - (padding * 2) + histMargin) + "," + padding + ")"); // element appended in position
    
//     var histbar = svg.selectAll(".histbar")
//         .data(histData)
//         .enter()
//         .append("g")
//         .attr("class", "histbar")
    
//     histbar.append("rect")
// //         .transition().duration(1000) Currently doens't seem to work
//         .attr("x", w - (padding * 2) + histMargin)
// // x position of rectangle should be end of graph display
//         .attr("y", function(d) { return yScaleHist(d.x) - binHeight; } ) // d.x is hist bin's relative start, NOT x position
// // y position of rectangle should be based on the bounds of the bin.
//         .attr("width", function(d) {return xScaleHist(d.y); }) // d.y is count within hist bin, NOT y position
// // Width of rectangle should be pegged to xScaled data value, i.e. count of items in histogram
//         .attr("height", binHeight)
// // Height of rectangle should be based on yScaled "width" of the bin

// }

//
//
//

// Takes array of cash values and draws vertical histogram
// Modified from Mike Bostock's histogram code: http://bl.ocks.org/mbostock/3048450
function drawHist(cashArrs, svg, w, h, padding){
// Takes array of arrays as input, but this function only cares about ending bankroll
    
    var histMargin = 0; // Number of horizontal pixels to buffer graph from histogram, currently flush
    var textMargin = 5; // Number of pixels to separate hover-over text from histogram bars
    var displayHeight = h - (padding * 2); // Number of pixels of height of histogram
    var displayXStart = w - padding + histMargin; // X position where histogram starts
    
    var binCount = 20; // Sets bin count for hist
    var binHeight = displayHeight/binCount; // This will form histogram bar height
    
    var startCash = cashArrs[0][0]; // Value of original bankroll
    var numGamblers = cashArrs.length;
    endCash = []; // Array to store only final bankrolls
    for(var i = 0; i < cashArrs.length; i++){ // For each array stored in cashArrs...
        endCash[i] = cashArrs[i][(cashArrs[i].length) - 1]; // Store last element of i-th array in endCash
    }
    var percentBroke = 0; // Calculates percent of gamblers who went broke
    for(var i = 0; i < endCash.length; i++){
        if(endCash[i] == 0)
            percentBroke++;
    }
    percentBroke = (percentBroke/numGamblers * 100).toFixed(2);
                   
    var highestXPos; var highestYPos = 99999; // Coordinates to be altered for writing highest gambler result
    var lowestXPos; var lowestYPos = 0; // Coordinates to be altered for writing lowest gambler results
    
    var yScaleHist = d3.scale.linear()
        .domain([d3.min(endCash), d3.max(endCash)]) // From lowest to highest bankrolls at end of night
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
        .each(function(d){
            //Goes through each bar to track highest and lowest bars
            // Finding lowest
            if((yScaleHist(d.x) - binHeight) > lowestYPos){ // If pixel position # is larger, it's lower on the drawing
                lowestYPos = (yScaleHist(d.x) - binHeight);
                lowestXPos = w - (padding * 2) + histMargin + xScaleHist(d.y) + textMargin;
            } // Finding highest
            if((yScaleHist(d.x) - binHeight) < highestYPos){ // If pixel position # is lower, it's higher on the drawing
                highestYPos = (yScaleHist(d.x) - binHeight);
                highestXPos = w - (padding * 2) + histMargin + xScaleHist(d.y) + textMargin;
            }
        })
        .each(function(d){ // Goes through each bar to add appropriate color
            if((d.x + d.dx) > startCash) // Splits based on whether they were above starting bankroll
                d3.select(this).style("fill","#79b"); // Fills with appropriate color for profit
            else
                d3.select(this).style("fill","#FF3333"); // Fills with color for loss
        })
        .on('mouseover', function(d){
            svg.select("#mintext").transition().style("opacity", 0);
            svg.select("#maxtext").transition().style("opacity", 0);
            var xPosText = w - (padding * 2) + histMargin + xScaleHist(d.y) + textMargin;
            var yPosText = yScaleHist(d.x) - (binHeight * 3.5/10);
        
            svg.append("text")
			.attr("id", "histtext")
            .attr("x", xPosText)
            .attr("y", yPosText)
            .attr("text-anchor", "left")
            .attr("font-size", "11px")
            .text((d.y * 100 / numGamblers).toFixed(2) + "% of gamblers"); // Percentage of gamblers
        })
        .on('mouseout', function() {
            svg.select("#histtext").remove();
            svg.select("#mintext").transition().style("opacity", 1);
            svg.select("#maxtext").transition().style("opacity", 1);
        });
   function drawMinMaxText(){  // Display text for luckiest and unluckiest gamblers
        svg.append("text")
            .attr("id", "maxtext")
            .attr("x", highestXPos)
            .attr("y", highestYPos + (binHeight *.7))
            .attr("text-anchor", "left")
            .attr("font-size", "11px")
            .text("Luckiest gambler walked away with $" + d3.max(endCash));
    
        svg.append("text")
            .attr("id", "mintext")
            .attr("x", lowestXPos)
            .attr("y", lowestYPos + (binHeight *.7))
            .attr("text-anchor", "left")
            .attr("font-size", "11px")
            .text(percentBroke + "% went broke");
    }
    drawMinMaxText();

}