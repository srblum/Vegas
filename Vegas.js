//Simulates a single night of roulette
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
function drawPlot(cashArrs){
	console.log('drawPlot was called')
}