var algorderContract = undefined;
var algorderWriteContract = undefined;
$( document ).ready(function() {
  	$('[data-toggle="tooltip"]').tooltip()

  	initializeWalletState(function(){
		initialize();
	});
	
});


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

function accountChanged(){
	loadPage();
}

async function loadPage(){
  	try {
    	readerWeb3.eth.clearSubscriptions();

  	}catch(error){
    	console.log(error);
  	}


  	if (selectedAccount !== undefined) {
  	  	$("#connectWalletView2").css("display","none");

  		var accountAddress = await algorderContract.methods.getAccountContractAddress(selectedAccount.toLowerCase()).call();
		if(accountAddress == 0){
			$("#noAccountView").css("display","block");
			$("#accountExistsView").css("display","none");
		}else{
			
			loadData();
			
		}
  	}else{
  		
  		$("#connectWalletView2").css("display","block");
		$("#noAccountView").css("display","none");
		$("#accountExistsView").css("display","none");

  	}
  	
}

var mainOrders = [];
async function loadData() {

	var account = await algorderContract.methods.getAccountContractAddress(selectedAccount.toLowerCase()).call();
	if(account == 0 ){
		alert("You don't have an Algorder Account");
		return;
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
	    loadHistory(algorderAccountReaderContract);

		var ordersLength = await algorderAccountReaderContract.methods.getOrdersLength().call();
		var orders = [];
		for(var i = 0; i < ordersLength ; i++){
			var order = await algorderAccountReaderContract.methods.getOrder(i).call();
			orders.push(order);
		}
		mainOrders = orders;

		var html = "";
		for(var i=0; i < orders.length; i++){
			var order = orders[i];
			var conditionSymbol1 = await getSymbol(order.conditionPath[0]);
			var conditionSymbol2 = await getSymbol(order.conditionPath[order.conditionPath.length -1]);
			if(conditionSymbol1 == "WAVAX"){ conditionSymbol1 = "AVAX"; }
			if(conditionSymbol2 == "WAVAX"){ conditionSymbol2 = "AVAX"; }
			var swapSymbol1 = (order.routerFunction == 0) ? "AVAX" : await getSymbol(order.swapPath[0]);
			var swapSymbol2 = (order.routerFunction == 1) ? "AVAX" : await getSymbol(order.swapPath[order.swapPath.length -1]);

			var conditionValue = order.conditionValue / (10 ** await getDecimalSymbol(order.conditionPath[order.conditionPath.length -1]));
			conditionValue = conditionValue / (10 ** (18 -  await getDecimalSymbol(order.conditionPath[0])));


			var swapValue = order.value / (10 ** await getDecimalSymbol(order.swapPath[0]));


			var d = new Date(0); 
			d.setUTCSeconds(order.createdDate);

			var operatorString = "";
			switch(order.conditionOperator){
				case "0": operatorString = ">="; break;
				case "1": operatorString = ">"; break;
				case "2": operatorString = "=="; break;
				case "3": operatorString = "<"; break;
				case "4": operatorString = "<="; break;
			}
			html +='<tr>';
	        html +='<td class="yy" >'+order.id+'</td>';
	        html +='<td>'+conditionSymbol1+'/'+conditionSymbol2+' '+operatorString+' '+Number(conditionValue).toFixed(4)+'</td>';
	        html +='<td>SWAP '+swapValue+' '+swapSymbol1+' with '+swapSymbol2+'</td>';
	        html +='<td>'+d.toShortFormat()+'</td>';
	        html +='<td><img class="delete" src="assets/delete.png" onclick="deleteOrder('+i+')"/></td>';
	        html +='</tr>';
		}

		document.getElementById("activeOrdersTable").innerHTML = html;
		setTimeout(function(){ 
			dismissLoader();
		}, 500);

	}	
}

async function loadHistory(contract) {
	const orderDeleteEvents = await contract.getPastEvents("OrderDelete", {  fromBlock: 0, toBlock: 'latest' ,filter: {}});
	const orderCreateEvents = await contract.getPastEvents("OrderCreate", {  fromBlock: 0, toBlock: 'latest' ,filter: {}});
	const orderSendEvents = await contract.getPastEvents("OrderSend", {  fromBlock: 0, toBlock: 'latest' ,filter: {}});
	
	var historyItems = [];

	for(var i=0; i < orderDeleteEvents.length; i++){
		var item = orderDeleteEvents[i].returnValues;
		historyItems.push({
			orderId: item.id,
			date: item.time,
			status: "Order is deleted.",
			statusClass: "rc",
			tx: orderDeleteEvents[i].transactionHash
		});
	}
	for(var i=0; i < orderCreateEvents.length; i++){
		var item = orderCreateEvents[i].returnValues;
		historyItems.push({
			orderId: item.id,
			date: item.time,
			status: "Order is created.",
			statusClass: "gc",
			tx: orderCreateEvents[i].transactionHash
		});
	}
	for(var i=0; i < orderSendEvents.length; i++){
		var item = orderSendEvents[i].returnValues;
		historyItems.push({
			orderId: item.id,
			date: item.time,
			status: "Transaction sent successfuly.",
			statusClass: "gc",
			tx: orderSendEvents[i].transactionHash
		});
	}
	historyItems.sort((a, b) => (a.date < b.date) ? 1 : -1)



	  var html = "";
		for(var i=0; i < historyItems.length; i++){
			var item = historyItems[i];
			

			var d = new Date(0); 
			d.setUTCSeconds(item.date);

			html +='<tr>';
            html +='<td class="yy" >'+item.orderId+'</td>';
	        html +='<td>'+d.toShortFormat()+'</td>';
            html +='<td class="'+item.statusClass+'">'+item.status+'</td>';
            var txAddress = item.tx.substring(0,4) + "..." + item.tx.substring(item.tx.length - 4,item.tx.length) ;
            html +='<td><a href="https://cchain.explorer.avax.network/tx/'+item.tx+'/internal-transactions" class="ac">'+txAddress+'</a></td>';
            html +='</tr>';
            if(i > 150){
            	break;
            }

		}

	  

		document.getElementById("historyTable").innerHTML = html;

}

Date.prototype.toShortFormat = function() {

    let monthNames =["Jan","Feb","Mar","Apr",
                      "May","Jun","Jul","Aug",
                      "Sep", "Oct","Nov","Dec"];
    
    let day = this.getDate();
    
    let monthIndex = this.getMonth();
    let monthName = monthNames[monthIndex];
    
    let year = this.getFullYear();
    
    return `${monthName} ${day}, ${year}`;  
}


async function deleteOrder(index){
	var account = await algorderContract.methods.getAccountContractAddress(selectedAccount.toLowerCase()).call();
	if(account != 0 ){
		var algorderAccountWriteContract = new writerWeb3.eth.Contract(
	       AlgorderAccountContractABI,
	       account
	    );
		var order = mainOrders[index];
		try {
	    	var result = await addNetworkToMetamask();
	    	if(!result){  wrongNetworkError(); return; }

	    	const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
			await algorderAccountWriteContract.methods.deleteOrder(order.id).send({ from: accounts[0]  , value: Web3.utils.toWei('0', 'ether')});
			location.reload();
	  	}catch(error){
	    	console.log("An error occured: " + error);
	  	}
		
	}

}


async function getSymbol(address){
	for(var i=0; i < predefinedTokenList.length; i++){
		var token = predefinedTokenList[i];
		if(token.address == address){
			return token.symbol;
		}
	}
	var data =  await retrieveTokenData(address);
	return data.symbol;
}

async function getDecimalSymbol(address){
	for(var i=0; i < predefinedTokenList.length; i++){
		var token = predefinedTokenList[i];
		if(token.address == address){
			return token.decimals;
		}
	}
	var data =  await retrieveTokenData(address);
	return data.decimals;
}

async function retrieveTokenData(address){
	if(cachedMap[symbol] !== undefined){
		return cachedMap[symbol];
	}

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
			var searchedTokenData = {
				symbol: symbol,
				address: address,
				decimals: decimals
			};
			cachedMap[symbol] = searchedTokenData;
			return searchedTokenData;
		}

	}catch (error) {
		return undefined;
	}
}

var cachedMap = {};




