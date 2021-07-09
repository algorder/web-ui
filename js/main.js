var algorderContract = undefined;
var algorderWriteContract = undefined;
var createAccountContract = undefined;

var avaxSymbol = {symbol: "AVAX", address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", decimals: 18}; //WAVAX address for path
var algorSymbol = {symbol: "ALGOR", address: "0xA0ebcB85157F59684Cf243dC8057184f2BBA5b9b", decimals: 18};
var usdt = {symbol : "USDT", address: "0xde3A24028580884448a5397872046a019649b084", decimals: 6};
var pngToken = {symbol: "PNG", address: "0x60781C2586D68229fde47564546784ab3fACA982", decimals: 18};

var conditionSymbol1 = avaxSymbol;
var conditionSymbol2 = usdt;
var swapSymbol1 = avaxSymbol;
var swapSymbol2 = pngToken;


var dexList = [
	{name: "PANGOLIN", logo:"https://app.pangolin.exchange/static/media/icon.adcff230.svg", router:"0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106", factory:"0xefa94DE7a4656D787667C749f7E1223D71E9FD88"},
	{name: "YetiSwap", logo:"https://assets.coingecko.com/coins/images/14382/small/YTSCoin.png", router:"0x262DcFB36766C88E6A7a2953c16F8defc40c378A", factory:"0x58C8CD291Fa36130119E6dEb9E520fbb6AcA1c3a"},
	{name: "Elk", logo:"https://raw.githubusercontent.com/elkfinance/avax-bridge-tokens/main/avalanche-tokens/0xE1C8f3d529BEa8E3fA1FAC5B416335a2f998EE1C/logo.png", router:"0x9E4AAbd2B3E60Ee1322E94307d0776F2c8e6CFbb", factory:"0x091d35d7F63487909C863001ddCA481c6De47091"},
	{name: "Baguette", logo:"https://raw.githubusercontent.com/baguette-exchange/contracts/master/tokenlist/logos/baguette.png", router:"0xF7b1e993d1b4F7348D64Aa55A294E4B74512F7f2", factory:"0x3587B8c0136c2C3605a9E5B03ab54Da3e4044b50"},
	{name: "Lydia Finance", logo:"https://www.lydia.finance/images/lyd_logo.png", router:"0xA52aBE4676dbfd04Df42eF7755F01A3c41f28D27", factory:"0xe0C1bb6DF4851feEEdc3E14Bd509FEAF428f7655"},
	{name: "Canary", logo:"https://app.canary.exchange/static/media/icon.9a2a67ee.svg", router:"0x06f8ED60393AC6A4B16900273C9313222dfe9940", factory:"0xCFBA329d49C24b70F3a8b9CC0853493d4645436b"}

];
$( document ).ready(function() {
    

    initializeWalletState(function(){
		initialize();
	});


	$( "#saveOrderButton" ).click(function() {
  		saveOrderTapped();
	});

    $( "#swapFromToken" ).click(function() {
  		selectToken(2);
	});

	$( "#swapToToken" ).click(function() {
  		selectToken(3);
	});

	$( "#conditionToken1" ).click(function() {
  		selectToken(0);
	});

	$( "#conditionToken2" ).click(function() {
  		selectToken(1);
	});

	$( "#exchangeButton" ).click(function() {
  		selectExchange();
	});

	$( "#accountButton" ).click(function() {

		accountTapped();
	});

	$( "#operatorObj" ).click(function() {
		$('#operatorModal').modal();
	});

	

	$( "#creditsButton" ).click(function() {
  		buyCredits();
	});

	$( "#connectMetamaskButton" ).click(function() {
  		connectToMetamask();
	});



	$( "#box1" ).click(function() {
		$("#box1").removeClass("boxSelected");
		$("#box2").removeClass("boxSelected");
		$("#box3").removeClass("boxSelected");
		$("#box1").addClass("boxSelected");
	});
	$( "#box2" ).click(function() {
		$("#box1").removeClass("boxSelected");
		$("#box2").removeClass("boxSelected");
		$("#box3").removeClass("boxSelected");
		$("#box2").addClass("boxSelected");
	});
	$( "#box3" ).click(function() {
		$("#box1").removeClass("boxSelected");
		$("#box2").removeClass("boxSelected");
		$("#box3").removeClass("boxSelected");
		$("#box3").addClass("boxSelected");
	});

	$( "#becomeMemberButton" ).click(function() {
  		createAccountTapped();
	});

	


	var dexHtml = "";
	for(var i=0; i < dexList.length; i++){
		var dex = dexList[i];
		dexHtml +='<li onclick="exchangeSelected('+i+');">'; 

        dexHtml +='<img class="tokenLogo" src="'+dex.logo+'" onerror="this.onerror=null; this.src=\'assets/placeholderToken.png\'"/>';
        dexHtml +='<span class="selectText">'+dex.name+'</span>';
        dexHtml +='</li>';

	}
		

    document.getElementById("dexList").innerHTML = dexHtml;

    displaySearchList();
    displaySymbols();
    displayOperator();
    retrieveConditionPrice();
});

async function retrieveConditionPrice() {
	let minABI = [
	{"type":"function","stateMutability":"view","outputs":[{"type":"uint256[]","name":"amounts","internalType":"uint256[]"}],"name":"getAmountsOut","inputs":[{"type":"uint256","name":"amountIn","internalType":"uint256"},{"type":"address[]","name":"path","internalType":"address[]"}]}
	];
	try {
		var conditionPath = await getPath(currentExchange.factory, conditionSymbol1, conditionSymbol2);
		let contract = new readerWeb3.eth.Contract(minABI,currentExchange.router);
		var amounts = await contract.methods.getAmountsOut(
			"" + (1 * (10 ** conditionSymbol1.decimals)),
			conditionPath
			).call();
		var price = amounts[amounts.length -1];

		document.getElementById("conditionAmountInput").value = Number((price / (10 ** conditionSymbol2.decimals)).toFixed(4));

	}catch (error) {
		console.log(error);
	}
}

async function saveOrderTapped(){
	if(selectedAccount === undefined){
		connectToMetamask();
		return;
	}
	if(document.getElementById("swapAmountInput").value <= 0){
		alert('Invalid swap amount.');
		return;
	}
	var account = await algorderContract.methods.getAccountContractAddress(selectedAccount.toLowerCase()).call();
	if(account == 0 ){
		createAccountModal();
	}else{

	showLoader();

		var algorderAccountWriteContract = new writerWeb3.eth.Contract(
	       AlgorderAccountContractABI,
	       account
	    );

	    var algorderAccountReaderContract = new readerWeb3.eth.Contract(
	       AlgorderAccountContractABI,
	       account
	    );
		

		var routerFunction = 0;
		if(swapSymbol1.symbol == "AVAX" && swapSymbol1.address == avaxSymbol.address){
			routerFunction = 0; //swapExactAVAXForTokens
		}else if(swapSymbol2.symbol == "AVAX" && swapSymbol2.address == avaxSymbol.address){
			routerFunction = 1; //swapExactTokensForAVAX
		}else {
			routerFunction = 2; //swapExactTokensForTokens
		}

		var conditionPath = await getPath(currentExchange.factory, conditionSymbol1, conditionSymbol2);
		var swapPath = await getPath(currentExchange.factory, swapSymbol1, swapSymbol2);

		try {
	    	var result = await addNetworkToMetamask();
	    	if(!result){  wrongNetworkError(); return; }

	    	const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

	    	var conditionValueString = (parseInt("" + (document.getElementById("conditionAmountInput").value * (10 ** conditionSymbol2.decimals)  ))) + "";
	    	if (conditionSymbol1.decimals < 18) {
	    		conditionValueString += ((10 ** (18 - conditionSymbol1.decimals)) + "").replace("1","");
	    	}


	    	var gasEstimate = await algorderAccountWriteContract.methods.createOrder(
				currentExchange.router,
				routerFunction,
				currentExchange.factory,
				conditionPath,
				conditionValueString,
				operatorIndex,
				swapPath,
				(parseInt("" + (document.getElementById("swapAmountInput").value * (10 ** swapSymbol1.decimals))) + ""),
				90,
				60*5
			).estimateGas({ 
    			from: accounts[0].toUpperCase()  , 
	            value: Web3.utils.toWei('0', 'ether')
    		});

    		const gasPrice = await readerWeb3.eth.getGasPrice();

	    	await algorderAccountWriteContract.methods.createOrder(
				currentExchange.router,
				routerFunction,
				currentExchange.factory,
				conditionPath,
				conditionValueString,
				operatorIndex,
				swapPath,
				(parseInt("" + (document.getElementById("swapAmountInput").value * (10 ** swapSymbol1.decimals))) + ""),
				90,
				60*5
				).send({ 

					from: accounts[0]  , 
					value: Web3.utils.toWei('0', 'ether'),
	            	gas: gasEstimate,
	            	gasPrice: gasPrice
				});

			alert("Order saved.");
			location.href = "orders.html";
			dismissLoader();
	  	}catch(error){
	    	console.log("An error occured: " + error);
	    	dismissLoader();
	  	}
		

	}

}

async function getPath(factoryAddress, token1, token2){
	var routerFunction = 0;
	if(token1.symbol == "AVAX" && token1.address == avaxSymbol.address){
		routerFunction = 0; //swapExactAVAXForTokens
	}else if(token2.symbol == "AVAX" && token2.address == avaxSymbol.address){
		routerFunction = 1; //swapExactTokensForAVAX
	}else {
		routerFunction = 2; //swapExactTokensForTokens
	}

	if(routerFunction != 2) {
		return [token1.address, token2.address];
	}

	let minABI = [
	{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint112","name":"_reserve0","internalType":"uint112"},{"type":"uint112","name":"_reserve1","internalType":"uint112"},{"type":"uint32","name":"_blockTimestampLast","internalType":"uint32"}],"name":"getReserves","inputs":[],"constant":true}
	];

	let minABI2 = [
		{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"address","name":"","internalType":"address"}],"name":"getPair","inputs":[{"type":"address","name":"","internalType":"address"},{"type":"address","name":"","internalType":"address"}],"constant":true}
	] 
	try {
		let factoryContract = new readerWeb3.eth.Contract(minABI2,factoryAddress);
		var pair = await factoryContract.methods.getPair(token1.address, token2.address).call();
		let pairContract = new readerWeb3.eth.Contract(minABI,pair);
		var reserves = await pairContract.methods.getReserves().call();


		var amount1 = (document.getElementById("swapAmountInput").value * (10 ** swapSymbol1.decimals));

		if((amount1 * 10 < reserves["_reserve0"] ) ||  (token1.address == avaxSymbol.address) || (token2.address == avaxSymbol.address)) {
			return [token1.address, token2.address];
		}else{

			return [token1.address, avaxSymbol.address, token2.address];
		}


	}catch (error) {
		if((token1.address == avaxSymbol.address) || (token2.address == avaxSymbol.address)) {
			return [token1.address, token2.address];
		}else{

			return [token1.address, avaxSymbol.address, token2.address];
		}
		console.log(error);
	}

}


function swapAmountChange() {
	displayDisclaimer();
}
function displayDisclaimer() {
	var amount = document.getElementById("swapAmountInput").value;
	document.getElementById("disclaimer").innerHTML = amount + " "+swapSymbol1.symbol+" (swap amount you entered) and 0.1 AVAX for fee should exists in your account balance for this order to be executed. If you don't have it on your account balance, you could deposit it on your account page after you save your order. Algorder is still in beta. Please use at your own risk.";


}
function displaySymbols(){
	displayDisclaimer();

	var html = "";
	if(conditionSymbol1.symbol == "AVAX"){
		html += '<img class="tokenLogo" src="assets/tokens/avax.png" />';
	}else if(conditionSymbol1.symbol == "ALGOR" && conditionSymbol1.address == algorSymbol.address){
		html += '<img class="tokenLogo" src="assets/tokens/algor.png" />';
	}else{
		html += '<img class="tokenLogo" src="https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/'+conditionSymbol1.address+'/logo.png" onerror="this.onerror=null; this.src=\'assets/placeholderToken.png\'"/>';
	}
    html += '<span class="selectText">'+conditionSymbol1.symbol+'</span>';
    html += '<img class="arrow" src="assets/selectArrow.png" />';
	document.getElementById("conditionToken1").innerHTML = html;

	html = "";
	if(conditionSymbol2.symbol == "AVAX"){
		html += '<img class="tokenLogo" src="assets/tokens/avax.png" />';
	}else if(conditionSymbol2.symbol == "ALGOR" && conditionSymbol2.address == algorSymbol.address){
		html += '<img class="tokenLogo" src="assets/tokens/algor.png" />';
	}else{
		html += '<img class="tokenLogo" src="https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/'+conditionSymbol2.address+'/logo.png" onerror="this.onerror=null; this.src=\'assets/placeholderToken.png\'"/>';
	}
    html += '<span class="selectText">'+conditionSymbol2.symbol+'</span>';
    html += '<img class="arrow" src="assets/selectArrow.png" />';
	document.getElementById("conditionToken2").innerHTML = html;

	html = "";
	if(swapSymbol1.symbol == "AVAX"){
		html += '<img class="tokenLogo" src="assets/tokens/avax.png" />';
	}else if(swapSymbol1.symbol == "ALGOR" && swapSymbol1.address == algorSymbol.address){
		html += '<img class="tokenLogo" src="assets/tokens/algor.png" />';
	}else{
		html += '<img class="tokenLogo" src="https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/'+swapSymbol1.address+'/logo.png" onerror="this.onerror=null; this.src=\'assets/placeholderToken.png\'"/>';
	}
    html += '<span class="selectText">'+swapSymbol1.symbol+'</span>';
    html += '<img class="arrow" src="assets/selectArrow.png" />';
	document.getElementById("swapFromToken").innerHTML = html;

	html = "";
	if(swapSymbol2.symbol == "AVAX"){
		html += '<img class="tokenLogo" src="assets/tokens/avax.png" />';
	}else if(swapSymbol2.symbol == "ALGOR" && swapSymbol2.address == algorSymbol.address){
		html += '<img class="tokenLogo" src="assets/tokens/algor.png" />';
	}else{
		html += '<img class="tokenLogo" src="https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/'+swapSymbol2.address+'/logo.png" onerror="this.onerror=null; this.src=\'assets/placeholderToken.png\'"/>';
	}
    html += '<span class="selectText">'+swapSymbol2.symbol+'</span>';
    html += '<img class="arrow" src="assets/selectArrow.png" />';
	document.getElementById("swapToToken").innerHTML = html;
	
	document.getElementById("fromSymbolLabel").innerHTML = swapSymbol1.symbol;

	
}


function displaySearchList() {
	var tokenSelectListHtml = "";
	if(searchedTokenData !== undefined){
		tokenSelectListHtml += '<li onclick="tokenSelected(-1);"> ';
        tokenSelectListHtml += '<img class="tokenLogo" src="'+ ('https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/'+searchedTokenData.address+'/logo.png') +'" onerror="this.onerror=null; this.src=\'assets/placeholderToken.png\'"/>';
        tokenSelectListHtml += '<span class="selectText">'+searchedTokenData.symbol+'</span>';
        tokenSelectListHtml += '</li>';
	}

	tokenSelectListHtml += '<li onclick="tokenSelected(-2);"> ';
    tokenSelectListHtml += '<img class="tokenLogo" src="assets/tokens/avax.png" />';
    tokenSelectListHtml += '<span class="selectText">AVAX</span>';
    tokenSelectListHtml += '</li>';


	for(var i=0; i < predefinedTokenList.length; i++){
		var item = predefinedTokenList[i];
		if(oldSearchText !== undefined && oldSearchText.trim().length > 0){
			if(item.symbol.toUpperCase().indexOf(oldSearchText.trim().toUpperCase()) == -1){
				continue;
			}
		}
		tokenSelectListHtml += '<li onclick="tokenSelected('+i+');"> ';
        tokenSelectListHtml += '<img class="tokenLogo" src="'+ ('https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/'+item.address+'/logo.png') +'" onerror="this.onerror=null; this.src=\'assets/placeholderToken.png\'"/>';
        tokenSelectListHtml += '<span class="selectText">'+item.symbol+'</span>';
        tokenSelectListHtml += '</li>';
	}

	document.getElementById("tokenSelectList").innerHTML = tokenSelectListHtml;
}

var oldSearchText = undefined;
function tokenSearchChanged() {
	var text = document.getElementById("tokenSearchInput").value;
	if(text != oldSearchText){
		oldSearchText = text;
		retrieveTokenData(oldSearchText);
		displaySearchList();
	}

}

var searchedTokenData = undefined;
async function retrieveTokenData(address){
	let minABI = [
	{
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint8","name":"","internalType":"uint8"}],"name":"decimals","inputs":[],"constant":true}
	];
	try {
		let contract = new readerWeb3.eth.Contract(minABI,address);
		var symbol = await contract.methods.symbol().call();
		var decimals = await contract.methods.decimals().call();
		if(symbol.length > 0){
			searchedTokenData = {
				symbol: symbol,
				address: address,
				decimals: decimals
			};
			displaySearchList();
		}

	}catch (error) {
		searchedTokenData = undefined;
		displaySearchList();
	}
}
function tokenSelected(i) {

	$('#tokenModal').modal('hide');
	var selectedTokenObj;
	if(i == -1){
		selectedTokenObj = searchedTokenData;
	}else if(i == -2){
		selectedTokenObj = avaxSymbol;
	}else{
		selectedTokenObj = predefinedTokenList[i];
	}
	switch(tokenModalType){
		case 0: //condition symbol1
			conditionSymbol1 = selectedTokenObj;
			retrieveConditionPrice();
			break;
		case 1: //condition symbol2
			conditionSymbol2 = selectedTokenObj;
			retrieveConditionPrice();
			break;
		case 2: //swap symbol 1
			swapSymbol1 = selectedTokenObj;
			break;
		case 3: //swap symbol 2
			swapSymbol2 = selectedTokenObj;
			break;
		default:
			break;
	}

	
	displaySymbols();
}

var operatorIndex = 3;

function operatorSelected(i) {
	operatorIndex = i;
	
    displayOperator();
    $('#operatorModal').modal('hide');

}

function displayOperator() {
	var html = "";

	switch(operatorIndex){
		case 0: // ge
    		html += '<span class="selectOperatorText" style="top:-8px;">Greater than or equal to</span>';
    		    html += '<img class="arrow" style="top:-20px;" src="assets/selectArrow.png" />';
			break;
		case 1: //g
    		html += '<span class="selectOperatorText">Greater than</span>';
    		html += '<img class="arrow"  src="assets/selectArrow.png" />';
			break;
		case 2: //e
    		html += '<span class="selectOperatorText">Equal to</span>';
    		html += '<img class="arrow"  src="assets/selectArrow.png" />';
			break;
		case 3: //l
    		html += '<span class="selectOperatorText">Less than</span>';
    		html += '<img class="arrow"  src="assets/selectArrow.png" />';
			break;
		case 4: //le
    		html += '<span class="selectOperatorText" style="top:-8px;">Less than or equal to</span>';
    		    html += '<img class="arrow" style="top:-20px;" src="assets/selectArrow.png" />';
			break;
		default:
			break;
	}

    document.getElementById("operatorObj").innerHTML = html;
}

async function initialize() {
	algorderContract = new readerWeb3.eth.Contract(
       AlgorderContractABI,
       algorderContractAddress
    );
    algorderWriteContract = new writerWeb3.eth.Contract(
       AlgorderContractABI,
       algorderContractAddress
    );
    loadPage();
	if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('chainChanged', function(chainId){
        loadPage();
      });
    }
}

async function loadPage(){
  try {
    readerWeb3.eth.clearSubscriptions();

  }catch(error){
    console.log(error);
  }


}


function accountChanged(){
	loadPage();
}

async function accountTapped() {
	var account = await algorderContract.methods.getAccountContractAddress(selectedAccount.toLowerCase()).call();
	if(account == 0 ){
		createAccountModal();
	}else{
		location.href = "account.html";
	}
}

async function createAccountTapped() {
	
	var createAccountWriteContract = new writerWeb3.eth.Contract(
       CreateAccountContractABI,
       CreateAccountContractAddress
    );

    var createAccountReaderContract = new readerWeb3.eth.Contract(
       CreateAccountContractABI,
       CreateAccountContractAddress
    );
	var fee = await createAccountReaderContract.methods.fee().call();


	try {
    	var result = await addNetworkToMetamask();
    	if(!result){  wrongNetworkError(); return; }
    	showLoader();
    	const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    	var gasEstimate;
    	try{
    		gasEstimate = await createAccountWriteContract.methods.createAccount().estimateGas({ 
    			from: accounts[0].toUpperCase()  , 
	            value: fee
    		});
    	}catch(error){
    		gasEstimate = 3500000;
    	}
    	const gasPrice = await readerWeb3.eth.getGasPrice();

	        await createAccountWriteContract.methods.createAccount().send({ 
	            from: accounts[0].toUpperCase()  , 
	            value: fee,
	            gas: gasEstimate,
	            gasPrice: gasPrice
	        });

		dismissLoader();
		$('#createAccountModal').modal('hide');
		location.reload();

  	}catch(error){
  		dismissLoader();
    	console.log("An error occured: " + error);
  	}

}


var tokenModalType = 0;

function selectToken(type) {
	tokenModalType = type;
	$('#tokenModal').modal();
}

var currentExchange = dexList[0];
function selectExchange() {
	$('#exchangeModal').modal();
}

function exchangeSelected(index) {
	currentExchange = dexList[index];

    retrieveConditionPrice();
	document.getElementById("exchangeName").innerHTML = currentExchange.name;
	document.getElementById("exchangeLogo").src = currentExchange.logo;
	$('#exchangeModal').modal('hide');
}

async function createAccountModal() {
	var createAccountReaderContract = new readerWeb3.eth.Contract(
       CreateAccountContractABI,
       CreateAccountContractAddress
    );
	var fee = await createAccountReaderContract.methods.fee().call();
	fee = Web3.utils.fromWei(fee, 'ether')

	document.getElementById("accountFee").innerHTML = fee + " AVAX";

	$('#createAccountModal').modal();
}

function buyCredits() {
	$('#creditModal').modal();
}

