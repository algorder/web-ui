const predefinedTokenList = [
        {
            "address": "0x60781C2586D68229fde47564546784ab3fACA982",
            "chainId": 43114,
            "name": "Pangolin",
            "symbol": "PNG",
            "decimals": 18,
            "logoURI": "https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x60781C2586D68229fde47564546784ab3fACA982/logo.png"
        },
        {
            "address": "0x78ea17559B3D2CF85a7F9C2C704eda119Db5E6dE",
            "chainId": 43114,
            "name": "Avaware",
            "symbol": "AVE",
            "decimals": 18,
            "logoURI": "https://raw.githubusercontent.com/avaware/bridge-tokens/a35b91bcd9874683965ccea8d7c20f90f479af4d/avalanche-tokens/0x78ea17559B3D2CF85a7F9C2C704eda119Db5E6dE/logo.png"
        },
        {
            "chainId": 43114,
            "address": "0x3711c397B6c8F7173391361e27e67d72F252cAad",
            "decimals": 18,
            "name": "COMPLUS",
            "symbol": "COM",
            "logoURI": "https://raw.githubusercontent.com/complusnetwork/default-token-list/master/src/ava/0x3711c397B6c8F7173391361e27e67d72F252cAad/logo.png"
        },
        {
            "chainId": 43114,
            "address": "0x488F73cddDA1DE3664775fFd91623637383D6404",
            "decimals": 18,
            "name": "YetiSwap",
            "symbol": "YTS",
            "logoURI": "https://raw.githubusercontent.com/YetiSwap/yetiswap.app/master/src/assets/image/YTSCoin.png"
        },
        {
            "chainId": 43114,
            "address": "0x008E26068B3EB40B443d3Ea88c1fF99B789c10F7",
            "decimals": 18,
            "name": "Zero.Exchange Token",
            "symbol": "ZERO"
        },
        {
            "chainId": 43114,
            "address": "0xC38f41A296A4493Ff429F1238e030924A1542e50",
            "decimals": 18,
            "name": "Snowball",
            "symbol": "SNOB",
            "logoURI": "https://raw.githubusercontent.com/Snowball-Finance/Assets/main/Uphill%20snowball.png"
        },
        {
            "chainId": 43114,
            "address": "0x1F1FE1eF06ab30a791d6357FdF0a7361B39b1537",
            "decimals": 9,
            "name": "sled.finance",
            "symbol": "SFI",
            "logoURI": "https://raw.githubusercontent.com/sled-finance/media/main/sled_token_fl.png"
        },
        {
            "chainId": 43114,
            "address": "0x6e7f5C0b9f4432716bDd0a77a3601291b9D9e985",
            "decimals": 9,
            "name": "Spore",
            "symbol": "SPORE",
            "logoURI": "https://raw.githubusercontent.com/sporeproject/Spore-frontend/master/src/utils/SPORE.png"
        },
        {
            "chainId": 43114,
            "address": "0xe896CDeaAC9615145c0cA09C8Cd5C25bced6384c",
            "decimals": 18,
            "name": "Penguin Finance",
            "symbol": "PEFI",
            "logoURI": "https://raw.githubusercontent.com/Penguin-Finance/png-files/main/PEFILOGOPNG.png"
        },
        {
            "address": "0xC931f61B1534EB21D8c11B24f3f5Ab2471d4aB50",
            "chainId": 43114,
            "name": "Blocknet",
            "symbol": "aaBLOCK",
            "decimals": 8,
            "logoURI": "https://github.com/blocknetdx/documentation/blob/master/docs/img/icons/Blocknet_symbol_dark_RGB.png"
        },
        {
            "chainId": 43114,
            "address": "0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084",
            "decimals": 18,
            "name": "Lydia Finance",
            "symbol": "LYD",
            "logoURI": "https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x4C9B4E1AC6F24CdE3660D5E4Ef1eBF77C710C084/logo.png"
        },
        {
            "chainId": 43114,
            "address": "0x846D50248BAf8b7ceAA9d9B53BFd12d7D7FBB25a",
            "decimals": 18,
            "name": "Verso",
            "symbol": "VSO",
            "logoURI": "https://raw.githubusercontent.com/VersoOfficial/pr/master/icon_blue.png"
        },
        {
            "chainId": 43114,
            "address": "0x1ECd47FF4d9598f89721A2866BFEb99505a413Ed",
            "decimals": 18,
            "name": "AV Me",
            "symbol": "AVME",
            "logoURI": "https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x1ECd47FF4d9598f89721A2866BFEb99505a413Ed/logo.png"
        },
        {
            "chainId": 43114,
            "address": "0xE9D00cBC5f02614d7281D742E6E815A47ce31107",
            "decimals": 9,
            "name": "Crack.Fi",
            "symbol": "CRACK",
            "logoURI": "https://raw.githubusercontent.com/crackfi/logo/master/crackfi_png.png"
        },
        {
            "chainId": 43114,
            "address": "0x65378b697853568dA9ff8EaB60C13E1Ee9f4a654",
            "decimals": 18,
            "name": "Husky Avalanche",
            "symbol": "HUSKY",
            "logoURI": "https://raw.githubusercontent.com/safepoint-be/project-husky/main/img/logo.png"
        },
        {
            "chainId": 43114,
            "address": "0xD606199557c8Ab6F4Cc70bD03FaCc96ca576f142",
            "decimals": 18,
            "name": "Gondola",
            "symbol": "GDL",
            "logoURI": "https://raw.githubusercontent.com/gondola-finance/frontend/master/src/assets/icons/brand_logo_darkmode.png"
        },
        {
            "chainId": 43114,
            "address": "0x81440C939f2C1E34fc7048E518a637205A632a74",
            "decimals": 18,
            "name": "Cycle Protocol",
            "symbol": "CYCLE",
            "logoURI": "https://raw.githubusercontent.com/CycleProtocol/assets/master/cycle-logo-round-small.png"
        },
        {
            "chainId": 43114,
            "address": "0x4480B4DdFb15fE6518817ef024D8B493afF2Db54",
            "decimals": 18,
            "name": "Birdy Finance",
            "symbol": "BIRD",
            "logoURI": "https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x4480B4DdFb15fE6518817ef024D8B493afF2Db54/logo.png"
        },
        {
            "chainId": 43114,
            "address": "0xd1c3f94DE7e5B45fa4eDBBA472491a9f4B166FC4",
            "decimals": 18,
            "name": "Avalaunch",
            "symbol": "XAVA",
            "logoURI": "https://raw.githubusercontent.com/avalaunch-app/xava-protocol/master/logo.png"
        },
        {
            "chainId": 43114,
            "address": "0x8349088C575cA45f5A63947FEAeaEcC41136fA01",
            "decimals": 9,
            "name": "TeslaBitcoin",
            "symbol": "TESLABTC",
            "logoURI": "https://raw.githubusercontent.com/crackfi/tesla_btc_logo/master/Tesla_Bitcoin_logo.png"            
        },
        {
            "chainId": 43114,
            "address": "0x4aBBc3275f8419685657C2DD69b8ca2e26F23F8E",
            "decimals": 9,
            "name": "diamondtoken.world",
            "symbol": "Diamond",
            "logoURI": "https://raw.githubusercontent.com/virtualdiamondtoken/site/main/logo.png"  
         },
         {

             "chainId": 43114,
             "address": "0x76076880e1EBBcE597e6E15c47386cd34de4930F",
             "decimals": 18,
             "name": "Canopus",
             "symbol": "OPUS",
             "logoURI": "https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0x76076880e1EBBcE597e6E15c47386cd34de4930F/logo.png"
             
        },
        {
            "chainId": 43114,
            "address": "0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15",
            "decimals": 18,
            "name": "Ether",
            "symbol": "ETH",
            "logoURI": "https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15/logo.png"
        },
        {
            "chainId": 43114,
            "address": "0xde3A24028580884448a5397872046a019649b084",
            "decimals": 6,
            "name": "Tether USD",
            "symbol": "USDT",
            "logoURI": "https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xde3A24028580884448a5397872046a019649b084/logo.png"
        },
        {
            "chainId": 43114,
            "address": "0xB3fe5374F67D7a22886A0eE082b2E2f9d2651651",
            "decimals": 18,
            "name": "ChainLink Token",
            "symbol": "LINK",
            "logoURI": "https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/0xB3fe5374F67D7a22886A0eE082b2E2f9d2651651/logo.png"
        }
    ];

function loadUserAddedTokens() {
    var userDefinedTokens = getCookie("userDefinedTokens");
    if(userDefinedTokens === null || userDefinedTokens === undefined){
        return [];
    }
    var list = userDefinedTokens.split("|||");
    var result = [];
    for(var i=0; i < list.length; i++){
        var item = list[i];
        var s = item.split("&&&");
        var rItem = {
            symbol: s[0],
            address: s[1]
        };
        if(s.length > 2 && s[2] !== undefined && s[2] !== "undefined" ){
            rItem["decimals"] = Number(s[2]);
        }else{
            for(var y=0; y < predefinedTokenList.length; y++){
                var pre = predefinedTokenList[y];
                if(pre.address == s[1]){
                    rItem["decimals"] = pre.decimals;
                    break;
                }
            }
        }
        
        result.push(rItem);
    }
    return result;
}

function addToken(symbol, address, decimals) {
    if(isTokenUserAdded(address) == true){
        return;
    }
    var list = loadUserAddedTokens();
    var item = {
        symbol: symbol,
        address: address
    };

    if(decimals !== undefined){
        item["decimals"] = decimals;
    }

    list.push(item);
    saveTokens(list);
}

function isTokenUserAdded(address) {
    var list = loadUserAddedTokens();
    for(var i=0; i < list.length; i++){
        var item = list[i];
        if(item.address == address){
            return true;
        }
    }
    return false;
}

function saveTokens(list){
    var result = [];
    for(var i=0; i < list.length; i++){
        var item = list[i];
        result.push(item.symbol + "&&&" + item.address + "&&&" + item.decimals);
    }
    var mainResult = "";
    for(var i=0; i < result.length; i++){
        var item = result[i];

        mainResult += item;
        if(i < result.length -1){
            mainResult += "|||";
        }
    }
    setCookie("userDefinedTokens", mainResult, 360);
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}