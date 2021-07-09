var algorderContract = undefined;
var algorderWriteContract = undefined;
var createAccountContract = undefined;

$( document ).ready(function() {
  	$('[data-toggle="tooltip"]').tooltip()

  	initializeWalletState(function(){
		initialize();
	});

  	$( "#accountButton" ).click(function() {

		accountTapped();
	});


  	$( "#connectMetamaskButton" ).click(function() {
  		connectToMetamask();
	});

	$( "#connectMetamaskButton2" ).click(function() {
  		connectToMetamask();
	});

	

	$( "#becomeMemberButton" ).click(function() {
  		createAccountTapped();
	});

	$( "#activateAccountButton" ).click(function() {
		accountTapped();
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

	
	

	displaySearchList();
	
});

function displaySearchList() {
	var tokenSelectListHtml = "";
	if(searchedTokenData !== undefined){
		tokenSelectListHtml += '<li onclick="tokenSelected(-1);"> ';
        tokenSelectListHtml += '<img class="tokenLogo" src="'+ ('https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/'+searchedTokenData.address+'/logo.png') +'" onerror="this.onerror=null; this.src=\'assets/placeholderToken.png\'"/>';
        tokenSelectListHtml += '<span class="selectText">'+searchedTokenData.symbol+'</span>';
        tokenSelectListHtml += '</li>';
	}

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
				decimals: Number(decimals)
			};
			displaySearchList();
		}

	}catch (error) {
		searchedTokenData = undefined;
		displaySearchList();
	}
}
function tokenSelected(i) {

	$('#tokenModal').modal('hide')
	if(i == -1){
		addToken(searchedTokenData.symbol, searchedTokenData.address, searchedTokenData.decimals);
	}else{
		var item = predefinedTokenList[i];
		addToken(item.symbol, item.address, item.decimals);
	}

	
	loadPage();
}


var selectedWithdrawToken = undefined;

async function withdrawModal(token) {
	selectedWithdrawToken = token;

	document.getElementById("withdrawLabel").innerHTML = "Withdraw " + token.symbol;
	if(token.symbol == "AVAX") {
		document.getElementById("withdrawTokenLogo").src = "assets/tokens/avax.png";
		document.getElementById("withdrawBalanceLabel").innerHTML = "Your "+token.symbol+" Balance: "+ tokenBalanceMap["AVAX"] +" "+ token.symbol;
	}else{
		document.getElementById("withdrawBalanceLabel").innerHTML = "Your "+token.symbol+" Balance: "+ tokenBalanceMap[token.address] +" "+ token.symbol;
		document.getElementById("withdrawTokenLogo").onerror = "this.onerror=null; this.src=\'assets/placeholderToken.png\'";
		document.getElementById("withdrawTokenLogo").src = 'https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/'+token.address+'/logo.png';
	}
		

	$('#withdrawModal').modal();
}

async function withdrawButtonTapped() {
	if(selectedWithdrawToken == undefined){
		return;
	}

	var amount = document.getElementById("withdrawAmountInput").value;
	if(selectedWithdrawToken.symbol == "AVAX"){
		if(Number(amount) > tokenBalanceMap["AVAX"]) {
			alert("Amount is larger than your balance.");
			return;
		}
	}else{
		if(Number(amount) > tokenBalanceMap[selectedWithdrawToken.address]) {
			alert("Amount is larger than your balance.");
			return;
		}
	}

	var account = await algorderContract.methods.getAccountContractAddress(selectedAccount.toLowerCase()).call();

	var algorderAccountWriteContract = new writerWeb3.eth.Contract(
       AlgorderAccountContractABI,
       account
    );
	
	try {
    	var result = await addNetworkToMetamask();
    	if(!result){  wrongNetworkError(); return; }

    	const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
		if(selectedWithdrawToken.symbol == "AVAX"){
    		var gasEstimate = await algorderAccountWriteContract.methods.withdraw(Web3.utils.toWei(amount + "", 'ether')).estimateGas({ 
    			from: accounts[0].toUpperCase()  
    		});
    		const gasPrice = await readerWeb3.eth.getGasPrice();
			await algorderAccountWriteContract.methods.withdraw(Web3.utils.toWei(amount + "", 'ether')).send({
				from: accounts[0]  , 
				value: Web3.utils.toWei('0', 'ether'),
	            gas: gasEstimate,
	            gasPrice: gasPrice
			});
		}else{
			var dec = selectedWithdrawToken.decimals;
			if(dec === undefined || dec === "undefined"){
				dec = 18;
			}
			var amountToken = amount * (10 ** dec);

			
			var gasEstimate = await algorderAccountWriteContract.methods.withdrawToken(selectedWithdrawToken.address, amountToken + "").estimateGas({ 
    			from: accounts[0].toUpperCase() 
    		});
    		const gasPrice = await readerWeb3.eth.getGasPrice();
			

	    	await algorderAccountWriteContract.methods.withdrawToken(selectedWithdrawToken.address, amountToken + "").send({
	    	 from: accounts[0]  , 
	    	 value: Web3.utils.toWei('0', 'ether'),
	            gas: gasEstimate,
	            gasPrice: gasPrice
	    	});
			
		}
		 $('#modal').modal('toggle');
		 location.reload();
  	}catch(error){
    	console.log("An error occured: " + error);
  	}
}

function maxTapped(){
	if(selectedWithdrawToken == undefined){
		return;
	}


	var amount = document.getElementById("withdrawAmountInput").value;
	if(selectedWithdrawToken.symbol == "AVAX"){
		document.getElementById("withdrawAmountInput").value =  tokenBalanceMap["AVAX"];
		
	}else{
		document.getElementById("withdrawAmountInput").value =  tokenBalanceMap[selectedWithdrawToken.address];
	}
}

var tokenBalanceMap = {};
var tokenList = [];

async function getTokenBalances(walletAddress, callback) {
	if(tokenList.length == 0){
		callback();
		return;
	}
	tokenBalanceMap = {};
	var count = tokenList.length;
	for(var i=0; i < tokenList.length; i++){
		var token = tokenList[i];
		getBalanceOf(token.address, walletAddress, token, function(balance, tAddress, tokenX){
			count = count - 1;
			var decimals = tokenX.decimals;
			if(decimals === undefined){
				decimals = 18;
			}
			tokenBalanceMap[tAddress] = balance / (10 ** decimals);
			if(count <= 0){
				callback();
			}
		});
	}


}

async function getBalanceOf(tokenAddress, walletAddress, token, callback){

	// The minimum ABI to get ERC20 Token balance
	let minABI = [
	  // balanceOf
	  {
	    "constant":true,
	    "inputs":[{"name":"_owner","type":"address"}],
	    "name":"balanceOf",
	    "outputs":[{"name":"balance","type":"uint256"}],
	    "type":"function"
	  },
	  // decimals
	  {
	    "constant":true,
	    "inputs":[],
	    "name":"decimals",
	    "outputs":[{"name":"","type":"uint8"}],
	    "type":"function"
	  }
	];
	try {
		let contract = new readerWeb3.eth.Contract(minABI,tokenAddress);
		balance = await contract.methods.balanceOf(walletAddress).call();
		callback(balance, tokenAddress, token);
	}catch (error) {
		console.log(error);
		callback("0", tokenAddress, token);
	}
	
}

function depositModal() {
	$('#depositModal').modal();
}


function importToken() {
	$('#tokenModal').modal();
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

  	tokenList = loadUserAddedTokens();

  	if (selectedAccount !== undefined) {
  	  	$("#connectWalletView2").css("display","none");

  		var accountAddress = await algorderContract.methods.getAccountContractAddress(selectedAccount.toLowerCase()).call();
		if(accountAddress == 0){
			$("#noAccountView").css("display","block");
			$("#accountExistsView").css("display","none");
		}else{
			
			loadAccountDetail();
			
		}
  	}else{
  		
  		$("#connectWalletView2").css("display","block");
		$("#noAccountView").css("display","none");
		$("#accountExistsView").css("display","none");

  	}
  	
}

async function loadAccountDetail() {
	showLoader();
	var account = await algorderContract.methods.getAccountContractAddress(selectedAccount.toLowerCase()).call();

	

	document.getElementById("contractAddress").innerHTML = account;
	document.getElementById("copyInput").value = account;

	var avaxBalance = await readerWeb3.eth.getBalance(account);
	avaxBalance = Web3.utils.fromWei(avaxBalance, 'ether');
	tokenBalanceMap["AVAX"] = avaxBalance;



	var html = '';
	html += '<tr>';
    html += '<td><img class="tokenLogo" src="assets/tokens/avax.png" /><span class="ml10">AVAX</span></td>';
    html += '<td>'+avaxBalance+'</td>';
    html += '<td><button type="button" class="btn btn-primary accountButton" onclick="withdrawModal({\'symbol\':\'AVAX\'});">Withdraw</button></td>';
    html += '<td><button type="button" class="btn btn-primary accountButton" onclick="depositModal();">Deposit</button></td>';
    html += '</tr>';
    document.getElementById("accountTable").innerHTML = html;


    getTokenBalances(account, function(){
    	tokenBalanceMap["AVAX"] = avaxBalance;

    	var html = '';
		html += '<tr>';
	    html += '<td><img class="tokenLogo" src="assets/tokens/avax.png" /><span class="ml10">AVAX</span></td>';
	    html += '<td>'+avaxBalance+'</td>';
	    html += '<td><button type="button" class="btn btn-primary accountButton" onclick="withdrawModal({\'symbol\':\'AVAX\'});">Withdraw</button></td>';
	    html += '<td><button type="button" class="btn btn-primary accountButton" onclick="depositModal();">Deposit</button></td>';
	    html += '</tr>';


		tokenList.sort((a, b) => (a.symbol.toUpperCase() < b.symbol.toUpperCase()) ? 1 : -1)
		tokenList.sort((a, b) => (tokenBalanceMap[a.address] < tokenBalanceMap[b.address]) ? 1 : -1)

	    for(var i=0; i < tokenList.length; i++){
			var token = tokenList[i];
			if(tokenBalanceMap[token.address] == 0 && isTokenUserAdded(token.address) == false){
				continue;
			}
			html += '<tr>';
		    html += '<td><img class="tokenLogo" src="https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/'+token.address+'/logo.png" onerror="this.onerror=null; this.src=\'assets/placeholderToken.png\'"/><span class="ml10">'+token.symbol+'</span></td>';
		    html += '<td>'+tokenBalanceMap[token.address]+'</td>';
		    html += '<td><button type="button" class="btn btn-primary accountButton" onclick="withdrawModal(tokenList['+i+']);">Withdraw</button></td>';
		    html += '<td><button type="button" class="btn btn-primary accountButton" onclick="depositModal();">Deposit</button></td>';
		    html += '</tr>';

		}

		document.getElementById("accountTable").innerHTML = html;
setTimeout(function(){ 
			dismissLoader();
		}, 500);

setTimeout(function(){ 
			dismissLoader();
		}, 2000);

    });

    document.getElementById("explorerLink").innerHTML = "You could explore your account's smart contract on <a target=\"_blank\" href=\"https://cchain.explorer.avax.network/address/"+account+"/transactions\" >Avalanche Explorer</a>";
    document.getElementById("explorerLink2").href="https://cchain.explorer.avax.network/address/"+account+"/transactions"; 

    $("#noAccountView").css("display","none");
			$("#accountExistsView").css("display","block");

}

function copyAddress () {
	/* Get the text field */
  var copyText = document.getElementById("copyInput");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");
}

function accountChanged(){
	loadPage();
}

async function accountTapped() {
	var account = await algorderContract.methods.getAccountContractAddress(selectedAccount.toLowerCase()).call();
	if(account == 0 ){
		createAccountModal();
	}else{
		location.reload();
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
