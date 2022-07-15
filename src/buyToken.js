const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3'); // web3js
const { ethers } = require("ethers");
const { response } = require("express");

let privateKeys = new Set();

let mapWallets = new Map();

let mapPKActive = new Map();

let mapWalletsPK = new Map();

let wallets = new Set();

let contractOwner;

let tokenName = '';
let tokenSymbol = '';
let tokenDecimals = 0;
let maxSell = 0;
let maxTXAmount = 0;
let bnbIN = 1000000000000000000;
let maxTxBNB = null;

let minABI = [
    // balanceOf
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function"
    },
    // decimals
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "type": "function"
    },
    //approve
    {
        "constant": false,
        "inputs": [
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
        ],
        "name": "approve",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
    }
];

const NODE_WSS = "wss://apis-sj.ankr.com/wss/98518f632f8e42e38889b4769226a6e9/af92e5136be11c3e6e1da6fc031295a9/binance/full/main";

let node = "wss://apis-sj.ankr.com/wss/98518f632f8e42e38889b4769226a6e9/af92e5136be11c3e6e1da6fc031295a9/binance/full/main";
let wsProvider = new Web3.providers.WebsocketProvider(node);
HDWalletProvider.prototype.on = wsProvider.on.bind(wsProvider);

const providerETHERS = new ethers.providers.WebSocketProvider(NODE_WSS);

let provider;
let web3;
let router;
if (privateKeys.size != 0) {
    provider = new HDWalletProvider({
        privateKeys: privateKeys,
        providerOrUrl: node,
        pollingInterval: 20000000,
    })
    web3 = new Web3(provider)
    router = new web3.eth.Contract(
        [
            { "inputs": [{ "internalType": "address", "name": "_factory", "type": "address" }, { "internalType": "address", "name": "_WETH", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "WETH", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "amountADesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountBDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amountTokenDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "factory", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountIn", "outputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountOut", "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsIn", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsOut", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveB", "type": "uint256" }], "name": "quote", "outputs": [{ "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETHSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapETHForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETHSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }
        ],
        '0x10ED43C718714eb63d5aA57B78B54704E256024E' // pass connected account to pcs router
    );
}

console.log("loaded");

async function getSlippage(ca, slippage) {
    amountIn = web3.utils.toWei('0.01', 'ether');
    console.log(amountIn);

    amount_out = await router.methods.getAmountsOut(amountIn, ['0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', ca]).call();
    console.log(amount_out[1]);

    amountOutMin = amount_out[1] * (1 - (slippage / 100))
    console.log(amountOutMin)
}

async function honeypotIs(address) {
    let encodedAddress = web3.eth.abi.encodeParameter('address', address);
    let contractFuncData = '0xd66383cb';
    let callData = contractFuncData+encodedAddress.substring(2);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://aywt3wreda.execute-api.eu-west-1.amazonaws.com/default/IsHoneypot?chain=bsc2&token='+address, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            if(xhr.response.IsHoneypot == false) {
                showStats(xhr.response);
            }else {
                if(xhr.response.Error == "Error: Returned error: execution reverted") {
                    showUnable(xhr.response.Error);
                    return;
                }
                if(xhr.response.Error.includes('INSUFFICIENT_LIQUIDITY')) {
                    showUnable(xhr.response.Error);
                    return;
                }
                showHoneypot(xhr.response);
            }
        } else {
            showUnable('Internal Error');
        }
    };
    xhr.send();

    updateTokenInformation(address);
}

async function updateTokenInformation(tokenAddress) {
    web3.eth.call({
        to: tokenAddress,
        value: 0,
        gas: 150000,
        data: encodeBasicFunction(web3, 'name'),
    })
    .then(value => {
        tokenName = web3.eth.abi.decodeParameter('string', value);
        let x = document.getElementById('token-info');
        if(x != null) {
            x.innerText = tokenName + ' ('+tokenSymbol+')';
        }
    });

    web3.eth.call({
        to: tokenAddress,
        value: 0,
        gas: 150000,
        data: encodeBasicFunction(web3, 'symbol'),
    })
    .then(value => {
        tokenSymbol = web3.eth.abi.decodeParameter('string', value);
        let x = document.getElementById('token-info');
        if(x != null) {
            x.innerText = tokenName + ' ('+tokenSymbol+')';
        }
    });
}

async function showStats(resp) {
    let warnings = [];
    
    if(resp.BuyTax + resp.SellTax >= 80) {
        warnings.push("Insanely high tax. Effectively a honeypot.");
    }else if(resp.BuyTax + resp.SellTax >= 30) {
        warnings.push("Be aware of high tax.");
    }
    if(resp.SellGas >= 3500000) {
        warnings.push("Selling the token has high gas cost. Be aware.");
    }

    let warningmsg = '';
    let warningMsgExtra = '';
    let uiType = 'success';
    let warningsEncountered = false;
    if(warnings.length > 0) {
        warningsEncountered = true;
        uiType = 'warning';
        warningmsg = '<p><ul>WARNINGS';
        for(let i = 0; i < warnings.length; i++) {
            warningmsg += '<li>'+warnings[i]+'</li>';
        }
        warningmsg += '</ul></p>';
    }

    let maxdiv = '';
    if(maxTXAmount != 0 || maxSell != 0) {
        console.log('maxes', maxTXAmount.toString(), maxSell);
        let n = 'Max TX';
        let x = maxTXAmount;
        if(maxSell != 0) {
            n = 'Max Sell';
            x = maxSell;
        }
        let bnbWorth = '?'
        if(maxTxBNB != null) {
            bnbWorth = Math.round(maxTxBNB / 10**15) / 10**3;
        }
        let tokens = Math.round(x / 10**tokenDecimals);
        maxdiv = '<p>'+n+': ' + tokens + ' ' + tokenSymbol + ' (~'+bnbWorth+' BNB)</p>';
    }
    let noLiqDiv = '';
    if(resp.NoLiquidity == true) {
        noLiqDiv = '<p>INFO! There is no liquidity with BNB. Honeypot added liquidity for test. Results with non-BNB pair may differ. If the token is not live yet, results may be different once the token is live. It is common for tokens to have 0% taxes before launching on DEX!</p>';
    }

    let gasdiv = '<p>Gas used for Buying: ' + numberWithCommas(resp.BuyGas) + '<br>Gas used for Selling: ' + numberWithCommas(resp.SellGas) + '</p>';
    document.getElementById('shitcoin').innerHTML = '<div style="max-width: 100%;" class="ui compact '+
    uiType+
    ' message"><div class="header">Does not seem like a honeypot.</div><p>This can always change! Do your own due diligence.</p>'+noLiqDiv+
    warningmsg+
    '<p>Address: ' + 
    addressToOutput +
    '</p><p id="token-info">'+
        tokenName +
        ' ('+tokenSymbol+')'+'</p>'+maxdiv+gasdiv+'<p>Buy Tax: ' + resp.BuyTax + '%<br>Sell Tax: ' + resp.SellTax + '%</p></div>';
}

async function buy(ca, amountIn, slippage, gasPrice, gasLimit) 
{
    let amountOutMin = 0;

    if (slippage) 
    {
        let amount_out = await router.methods.getAmountsOut(amountIn.toString(), ['0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', ca]).call();
        amountOutMin = amount_out[1] * (1 - (slippage / 10000))
    }

    for (const [addressWallet, isActive] of mapWallets.entries()) {
        if (isActive) {
            console.log("buying for " + addressWallet);
            router.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(
                amountOutMin,
                ['0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', ca],
                addressWallet,
                (Date.now() + 1000 * 60 * 10)).send({
                    from: addressWallet,
                    'value': web3.utils.toWei(amountIn, 'ether'),
                    'gas': gasLimit,
                    'gasPrice': web3.utils.toWei(gasPrice, 'gwei'),
                }).on("sent", function () {
                    document.getElementById("logSniper").value += "Buy sent on wallet " + addressWallet + "\n";
                }).on("receipt", function (receipt) {
                    document.getElementById("logSniper").value += "Buy sent on wallet " + addressWallet + " was successful\n" +
                    "Hash: " + receipt.transactionHash + "\n";
                }).on('error', function (error) {
                    document.getElementById("logSniper").value += "Buy sent on wallet " + addressWallet + " failed\n";
                });
        }
    }

    //approveMax(ca);
}

async function trackResults(ca, totalWallets, amountIn)
{
    let totalBNBResult = 0;
    amountIn = amountIn * totalWallets;
    let contractSell = new web3.eth.Contract(minABI, ca);

    for (const [addressWallet, isActive] of mapWallets.entries()) {
        if (isActive) 
        {
            let balance = await contractSell.methods.balanceOf(addressWallet).call();
            let amount_out = await router.methods.getAmountsOut(balance.toString(), [ca, '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c']).call();
            totalBNBResult += web3.utils.fromWei(amount_out[1].toString(), 'ether')
        }
    }
    let result = (totalBNBResult * 100) / amountIn;
    document.getElementById("logSniper").value += "Current value:" + result + "% | BNB: " + totalBNBResult;

    console.log();
}

async function sell(ca, sellAmount, slippage, gasPrice, gasLimit) {
    let contractSell = new web3.eth.Contract(minABI, ca);

    for (let i = 0; i < 1; i++) {
        let balance = await contractSell.methods.balanceOf(wallets[i]).call();
        balance = (balance * (sellAmount / 100)).toString();

        if (slippage) 
        {
            amount_out = await router.methods.getAmountsOut(balance, ['0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', ca]).call();
            amountOutMin = amount_out[1] * (1 - (slippage / 10000))
        }
        else
        amountOutMin = 0;

        router.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
            web3.utils.toWei(balance, 'ether'),
            amountOutMin,
            [ca, '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'],
            wallets[i],
            (Date.now() + 1000 * 60 * 10)).send({
                from: wallets[i],
                'gas': gasLimit,
                'gasPrice': web3.utils.toWei(gasPrice, 'gwei'),
            }).on('error', function (error, receipt) {
                console.log(error);
                console.log(receipt);
            });
    }
}

async function addWallet(privateKey) {

    if (privateKey.length > 42)
    {    let tempPKs = new Set();
        tempPKs.add(privateKey);

        let pvkeysarray = Array.from(tempPKs);
        provider = new HDWalletProvider({
            privateKeys: pvkeysarray,
            providerOrUrl: node,
            pollingInterval: 20000000,
        })

        let wsProvider = new Web3.providers.WebsocketProvider(node);
        HDWalletProvider.prototype.on = wsProvider.on.bind(wsProvider);
        web3 = new Web3(provider);

        tempPKs.forEach(element => {
            privateKeys.add(element);
        });

        let promiseWallet = await web3.eth.accounts.privateKeyToAccount(privateKey);
        mapWallets.set(promiseWallet.address, true);
        
        mapPKActive.set(privateKey, true);

        wallets.add(promiseWallet.address);

        mapWalletsPK.set(promiseWallet.address, privateKey);

        router = new web3.eth.Contract(
            [
                { "inputs": [{ "internalType": "address", "name": "_factory", "type": "address" }, { "internalType": "address", "name": "_WETH", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "WETH", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "amountADesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountBDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amountTokenDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "factory", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountIn", "outputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountOut", "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsIn", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsOut", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveB", "type": "uint256" }], "name": "quote", "outputs": [{ "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETHSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapETHForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETHSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }
            ],
            '0x10ED43C718714eb63d5aA57B78B54704E256024E' // pass connected account to pcs router
        );
    }
    else
    {
    mapPKActive.set(mapWallets.get(privateKey), true);  //privateKey = actually a wallet, too lazy to change variable name
    mapWallets.set(privateKey, true);  //privateKey = actually a wallet, too lazy to change variable name
    }
    getWallets();
}

async function removeWallet(wallet) {
    let pvkey;
    if (mapWalletsPK.has(wallet))
        pvkey = mapWalletsPK.get(wallet);

    mapWallets.set(wallet, false);
    mapPKActive.set(mapWalletsPK.get(wallet), false);

    arrayPK = [];
    for (const [pk, isActive] of mapPKActive.entries()) {
        if (isActive)
            arrayPK.push(pk)
    }

    provider = new HDWalletProvider({
        privateKeys: arrayPK,
        providerOrUrl: node,
        pollingInterval: 20000000,
    });
    getWallets();
}

async function getWallets() {
    let arrayDisabled = [];
    document.getElementById("log").value = "";
    for (const [addressWallet, isActive] of mapWallets.entries()) {
        if (isActive)
            document.getElementById("log").value += addressWallet + "\n";
        else
            arrayDisabled.push(addressWallet);
    }
    if (arrayDisabled.length != 0)
    {
        document.getElementById("log").value += "The folowing wallets are disabled:\n";
        for (let index = 0; index < arrayDisabled.length; index++) {
            document.getElementById("log").value += arrayDisabled[index] + "\n";
        }
    }
}

async function getPrivateKeys(array) {
    let text;
    for (let index = 0; index < array.length; index++) {
        text += array[index];
        text += "\n"
        document.getElementById("log").value += text;
    }
}

async function reloadRPC(newURL) {
    node = newURL;
    if (!node) {
        document.getElementById("log").value = "Please input your node link.";
        return;
    }

    try {
        let pvkeysarray = Array.from(privateKeys);
        provider = new HDWalletProvider({
            privateKeys: pvkeysarray,
            providerOrUrl: node,
            pollingInterval: 20000000,
        })
    } catch (error) {
        document.getElementById("log").value = "Please add at least one wallet before trying to connect.";
        return;
    }

    let wsProvider = new Web3.providers.WebsocketProvider(node);
    HDWalletProvider.prototype.on = wsProvider.on.bind(wsProvider);
    web3 = new Web3(provider);

    router = new web3.eth.Contract(
        [
            { "inputs": [{ "internalType": "address", "name": "_factory", "type": "address" }, { "internalType": "address", "name": "_WETH", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "WETH", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "amountADesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountBDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amountTokenDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "addLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "factory", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountIn", "outputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveIn", "type": "uint256" }, { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }], "name": "getAmountOut", "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsIn", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }], "name": "getAmountsOut", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveA", "type": "uint256" }, { "internalType": "uint256", "name": "reserveB", "type": "uint256" }], "name": "quote", "outputs": [{ "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidity", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETH", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "removeLiquidityETHSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountToken", "type": "uint256" }, { "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens", "outputs": [{ "internalType": "uint256", "name": "amountETH", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "tokenA", "type": "address" }, { "internalType": "address", "name": "tokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "bool", "name": "approveMax", "type": "bool" }, { "internalType": "uint8", "name": "v", "type": "uint8" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "removeLiquidityWithPermit", "outputs": [{ "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapETHForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactETHForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForETHSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactETH", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "internalType": "uint256", "name": "amountInMax", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }], "name": "swapTokensForExactTokens", "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }
        ],
        '0x10ED43C718714eb63d5aA57B78B54704E256024E' // pass connected account to pcs router
    );

    document.getElementById("log").value = "Connected";
    document.getElementById("newRPC").style.backgroundColor = "green";
}

async function scanMempool(caToScan, amountIn, slippage, buyGwei, gasLimit) {

    let option = document.getElementById("mempoolOption").value;
    // if (option == "buyLiqAdd")
    //  {   
        let waitingBlockDelay = document.getElementById("edtBlockDelay").value;
        let isDelay = false;
        let foundLiq = false

        let dataContract = caToScan.split("x");
        dataContract = dataContract[1]

        providerETHERS.on("block", async function (blockNumber) 
        {
            document.getElementById("logMempool").value = "Scanning block " + blockNumber + "\n"
            let receipt = await providerETHERS.getBlockWithTransactions();
            if (waitingBlockDelay && foundLiq) 
            {
                waitingBlockDelay--;
                if (!waitingBlockDelay)
                    buy(caToScan, amountIn, slippage, buyGwei, gasLimit);
            }
                
            if (!foundLiq)
            {          
                for (let index = 0; index < receipt.transactions.length; index++) 
                {
                    if (receipt.transactions[index].data.includes(dataContract) && 
                    (receipt.transactions[index].data.includes("0xf305d719") || receipt.transactions[index].data.includes("0xe8e33700")))
                    {
                        if (!waitingBlockDelay)
                            buy(caToScan, amountIn, slippage, buyGwei, gasLimit);
                        else
                            foundLiq = true;

                        document.getElementById("logMempool").value = "Found liquidity at block " + blockNumber + "\n"
                    }
                }
            }
        })
    // }

    //else if (option == "sellLiqRem")

    //  if (waitingBlockDelay)
    //      isDelay = true
    //  let web3 = new Web3(new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws/v3/ffaf1d798e124abc8a0e23de2a0e02e6"))
    //  let subscription = web3.eth.subscribe('newBlockHeaders', function (error, result) 
    //  {
    //      if (error)
    //      document.getElementById("logMempool").value = "Error while trying to scan for new blocks.\n" + error
    //  })
    //      .on("connected", function (subscriptionId) {
    //          document.getElementById("logMempool").value = "Connected"
    //      })
    //      .on("data", async function (blockHeader) 
    //      {
    //          document.getElementById("logMempool").value = "Scanning block " + blockHeader.number
    //          if (waitingBlockDelay && foundLiq) 
    //          {
    //              waitingBlockDelay--;
    //              if (!waitingBlockDelay)
    //                  buy(caToScan, amountIn, slippage, buyGwei, gasLimit);
    //          }
    //          let subscriptionLogs = web3.eth.subscribe('logs', {
    //              fromBlock: blockHeader.number,
    //          }, function (error, result) {
    //              if (error)
    //                  console.log(error);
    //          })
    //          // citar limite
    //              .on("data", async function (log) {
    //                      let address = log.address.toLowerCase();
    //                      if (address == caToScan && !foundLiq)
    //                      {
    //                          let result = await web3.eth.getTransaction(log.transactionHash);
    //                          if (result.input.includes("0xf305d719"))
    //                          {
    //                              document.getElementById("logMempool").value = "Liquidity being added in " + result.block.Array
    //                              if (isDelay)
    //                              {
    //                                  document.getElementById("logMempool").value += "Delaying buy until block " + result.block.Array + waitingBlockDelay
    //                                  foundLiq = true;
    //                              }
    //                              else 
    //                              {
    //                              buy(caToScan, amountIn, slippage, buyGwei, gasLimit);
    //                              contractOwner = tx.from;
    //                              }
    //                          }
    //                      }
    //                      else
    //                         document.getElementById("logMempool").value = "Found tx with Contract Address but it is not about liquidity"

    //                  //let result = web3.eth.abi.encodeEventSignature('swapExactTokensForETH(uint256,uint256,address[],address,uint256)')
    //                  //console.log(result)
    //              })
    //      })
    // if (receipt.input.includes("0xf305d719"))
    // {
    //     document.getElementById("logMempool").value = "Detected transaction to add liquidity"
    //     buy(caToScan, 
    //     document.getElementById('amountIn').value,
    //     document.getElementById('slippage').value,
    //     document.getElementById('buyGwei').value,
    //     document.getElementById('gasLimit').value);
    //     document.getElementById("logMempool").value = "Sent buy transaction"
    //     contractOwner = tx.from;
    // }
    // if (!error)
    //     document.getElementById("logMempool").value += result;
    // else
    // {
    //     document.getElementById("logMempool").value += "Something went wrong when trying to subscribe to the blockchain. If the error    persists contact @xerrien on Telegram.";
    // };

}

async function stopScan()
{
        providerETHERS.off("block")
        document.getElementById("logMempool").value += "Stopped scanning."
}


async function scanMempoolToSellRemoveLiq(caToScan, contractOwner) {

    var web3 = new Web3(new Web3.providers.WebsocketProvider(NODE_WSS, stayon));
    const subscription = web3.eth.subscribe("pendingTransactions", function (error, result) {
        let tx = web3.eth.getTransaction(result)
        if (tx.input.includes("0x02751cec")
            || tx.input.includes("0x2195995c")
            || tx.input.includes("0xded9382a")
            || tx.input.includes("0x5b0d5984"))

        //0x02751cec removeLiquidityETH
        //0x2195995c removeLiquidityWithPermit
        //0xded9382a removeLiquidityETHWithPermit
        //0x5b0d5984 removeLiquidityETHWithPermitSupportingFeeOnTransferTokens

        {
            document.getElementById("logMempool").value = "Detected transaction to remove liquidity"
            sell(caToScan,
                document.getElementById('sellNormal').value,
                document.getElementById('slippage').value,
                document.getElementById('sellGwei').value,
                document.getElementById('gasLimit').value);
            document.getElementById("logMempool").value = "Sent sell transaction"
        }
        if (!error)
            document.getElementById("logMempool").value += result;
        else {
            document.getElementById("logMempool").value += "Something went wrong when trying to subscribe to the blockchain. If the error persists contact @xerrien on Telegram.";
        }
    });
}

function dataStorage() {
    let temppks = Array.from(privateKeys);
    let tempwallets = Array.from(wallets);
    localStorage.mapWalletsPK = JSON.stringify(Array.from(mapWalletsPK.entries()));
    localStorage.mapWallets = JSON.stringify(Array.from(mapWallets.entries()));
    localStorage.mapPKActive = JSON.stringify(Array.from(mapPKActive.entries()));
    window.localStorage.setItem('privateKeys', JSON.stringify(temppks));
    window.localStorage.setItem('wallets', JSON.stringify(tempwallets));
    window.localStorage.setItem('node', node);
    window.localStorage.setItem('slippage', document.getElementById('slippage').value);
    window.localStorage.setItem('buyGwei', document.getElementById('buyGwei').value);
    window.localStorage.setItem('sellGwei', document.getElementById('sellGwei').value);
    window.localStorage.setItem('gasLimit', document.getElementById('gasLimit').value);
    window.localStorage.setItem('newRPC', document.getElementById('newRPC').value);
}

async function loadConfig() {
    let loadPKs = JSON.parse(window.localStorage.getItem('privateKeys'));
    let loadWallets = JSON.parse(window.localStorage.getItem('wallets'));

    mapWalletsPK = new Map(JSON.parse(localStorage.mapWalletsPK));
    mapPKActive = new Map(JSON.parse(localStorage.mapPKActive));
    mapWallets = new Map(JSON.parse(localStorage.mapWallets));

    document.getElementById('gasLimit').value = window.localStorage.getItem('gasLimit');
    document.getElementById('slippage').value = window.localStorage.getItem('slippage');
    document.getElementById('buyGwei').value = window.localStorage.getItem('buyGwei');
    document.getElementById('sellGwei').value = window.localStorage.getItem('sellGwei');
    document.getElementById('newRPC').value = window.localStorage.getItem('newRPC');
    document.getElementById('botKey').value = window.localStorage.getItem('licenseKey');


    if (loadPKs) {
        privateKeys = loadPKs;
        if (!checkPKIntegrity(privateKeys))
            return;
    }
    if (loadWallets) {
        wallets = loadWallets;
        if (!checkWalletsIntegrity(wallets))
            return;
    }

    node = window.localStorage.getItem('node');
    document.getElementById("newRPC").value = node;

    arrayWallets = Array.from(wallets);

    reloadRPC(node);
    getWallets();
}

async function approveMax(ca) {
    let tokenApprove = new web3.eth.Contract(minABI, ca);

    for (const [addressWallet, isActive] of mapWallets.entries()) {
        balance = await tokenApprove.methods.balanceOf(addressWallet).call();
        if (balance == 0);
            balance = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
        tokenApprove.methods.approve("0x10ED43C718714eb63d5aA57B78B54704E256024E", balance).send({
            from: addressWallet,
            'gas': "500000",
            'gasPrice': web3.utils.toWei("5", 'gwei')
        }).on("sent", function () {
        document.getElementById("logSniper").value += "Approve sent on wallet " + addressWallet + "\n";
    }).on("receipt", function (receipt) {
        document.getElementById("logSniper").value += "Approve sent on wallet " + addressWallet + " was successful\n";
    }).on('error', function (error) {
        document.getElementById("logSniper").value += "Approve sent on wallet " + addressWallet + " failed\n";
    });
    }
}

async function checkPKIntegrity(arrayPKs) {
    for (let index = 0; index < arrayPKs.length; index++) {
        if (arrayPKs[index].length != 64) {
            document.getElementById("log").value = "Private keys are not correct. The config might be corrupted.";
            return false;
        }
        return true;
    }
}

async function checkWalletsIntegrity(arrayWallets) {
    for (let index = 0; index < arrayWallets.length; index++) {
        if (arrayWallets[index].length != 42) {
            document.getElementById("log").value = "Wallets are not correct. The config might be corrupted.";
            return false;
        }
        return true;
    }
}

async function clearConfig() {
    window.localStorage.removeItem('privateKeys');
    window.localStorage.removeItem('wallets');
    window.localStorage.removeItem('node');
    window.localStorage.removeItem('slippage');
    window.localStorage.removeItem('buyGwei');
    window.localStorage.removeItem('sellGwei');
    window.localStorage.removeItem('gasLimit');
    window.localStorage.removeItem('newRPC');

    //window.localStorage.clear();
}

//0x02751cec removeLiquidityETH
//0x2195995c removeLiquidityWithPermit
//0xded9382a removeLiquidityETHWithPermit
//0x5b0d5984 removeLiquidityETHWithPermitSupportingFeeOnTransferTokens

//0xf305d719 addLiquidityETH

async function setNode(nodeURL) {
    node = nodeURL;
    document.getElementById("log").value = "node set\n"
}

function encodeBasicFunction(web3, funcName) {
    return web3.eth.abi.encodeFunctionCall({
        name: funcName,
        type: 'function',
        inputs: []
    }, []);
}

async function updateTokenInformation(web3, address) {
    web3.eth.call({
        to: address,
        value: 0,
        gas: 150000,
        data: encodeBasicFunction(web3, 'name'),
    })
        .then(value => {
            tokenName = web3.eth.abi.decodeParameter('string', value);
            let x = document.getElementById('token-info');
            if (x != null) {
                x.innerText = tokenName + ' (' + tokenSymbol + ')';
            }
        });

    web3.eth.call({
        to: address,
        value: 0,
        gas: 150000,
        data: encodeBasicFunction(web3, 'symbol'),
    })
        .then(value => {
            tokenSymbol = web3.eth.abi.decodeParameter('string', value);
            let x = document.getElementById('token-info');
            if (x != null) {
                x.innerText = tokenName + ' (' + tokenSymbol + ')';
            }
        });
}

async function telegram(phoneNumber, code, apiID, apiHash, channel) {

    const { exec } = require('node:child_process');
    var executablePath = "main.exe";
    
    exec(executablePath, function(err, data) {
        if(err){
           console.error(err);
           return;
        }
     
        console.log(data.toString());
    });

    // var spawn = require("child_process").spawn;

    // let process = spawn('python3', ['src/telegram.py', phoneNumber, code]);
    // process.stdout.on('error', function (error) {
    //     var textChunk = error.toString('utf8');// buffer to string

    //     console.log(textChunk);
    // })
    // process.stdout.on('data', function (data) {
    //     var textChunk = data.toString('utf8');// buffer to string

    //     console.log(textChunk);
    // })
}