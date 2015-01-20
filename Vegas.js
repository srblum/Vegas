function simRoulette(startCash,betCash,numPlays){
	var cashArr=[startCash];
	var winFrac=18/37;
	for(var i=0;i<numPlays;i++){
		if(Math.random()<winFrac){
			newCash+=betCash;
		}else{
			newCash-=betCash;
		}
		cashArr[cashArr.length]=newCash;
	}
	return cashArr
}