
const Web3 = require('web3');
const Tx = require("ethereumjs-tx");
const Binance = require('binance-api-node').default;


const web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'));
require('dotenv').config();
//details
const abiJson = require('./Abi/abi.json');
const routerContract = '0x0e85cA106FD68EC23755023B1415D496159477B2';
const user = '0xC39192Cc62eDc7668bD5c2280277caEbdc7c48E4'; 

const WebSocket = require('ws');
let ws = new WebSocket('wss://stream.binance.com:9443/ws/bnbusdt@trade');  //bnbbtc //ethusdt //btcusdt //dotusdt

let compare = async() =>{
    //binance price from market
        const client = Binance()
        const tokenRes = await client.prices();
        const BNBRes = tokenRes.BNBUSDT;
         const BNBAuto = parseFloat(BNBRes).toFixed(0);
         console.log(BNBAuto);
    //binance price from  the pool
    const uni_contract = new web3.eth.Contract(abiJson, routerContract,{from: user, },);
    let etherCal = await web3.utils.toBN(10000000000000000,'wei');
    const getAmountOut = await uni_contract.methods.getAmountsOut(etherCal,["0x262afAaDa39435a617A3049Db2BF3e999190eE6E","0x81FA727E73778f0d8106C10be8d0311E612A99cE"]).call(); //WETH,token

    const poolPrice = parseFloat(getAmountOut[1]);
    const poolPriceFixed = (poolPrice/10000000000000000).toFixed(0);
    console.log(poolPriceFixed,'poolPriceFixed');
     
   //3% from the pool price
    const HoldPercent = (BNBAuto *3/100).toFixed(0);
    console.log(HoldPercent);
    //differnce real price 3% - pool price
    const comapreMarketPrice = BNBAuto - HoldPercent;
    console.log(comapreMarketPrice,"market price 3% less");

    // const utcTimestamp = new Date().getTime();
    // console.log(utcTimestamp);
    //Array of Path
    const Array = ["0x262afAaDa39435a617A3049Db2BF3e999190eE6E","0x81FA727E73778f0d8106C10be8d0311E612A99cE"];
    const Array1 = ["0x81FA727E73778f0d8106C10be8d0311E612A99cE","0x262afAaDa39435a617A3049Db2BF3e999190eE6E"];

    const count = await web3.eth.getTransactionCount(user);
    //private key
    let privateKey = Buffer.from(
        process.env.privateKey,
        "hex",
    );

    if (poolPriceFixed<=comapreMarketPrice){
        const PriceDifferance = BNBAuto - poolPriceFixed;
        console.log(PriceDifferance,"tokenCalForPriceDiff");
    
        const decimalOfTokenCal = PriceDifferance*10**18;
        let tokenCall = await web3.utils.toBN(decimalOfTokenCal, 'wei');       //web3.utils.toWei(web3.utils.toBN(1000,'wei'));

        let minBNB = await web3.utils.toBN(10000000000000, 'wei');
        let rawTransaction = {
            from: user,
            gasPrice: web3.utils.toHex(20 * 1e9),
            gasLimit: web3.utils.toHex(250000),
            to: routerContract,
            value: 0x0,
            // data: uni_contract.methods.swapExactTokensForETH(tokenCall,minBNB,Array1,user,1664018496).encodeABI(),
            nonce: web3.utils.toHex(count),
        };
        let transaction = new Tx(rawTransaction);
        transaction.sign(privateKey);
        const trans = await web3.eth.sendSignedTransaction(
            "0x" + transaction.serialize().toString("hex"),
        );
        // console.log(trans);

        let etherCall = await web3.utils.toBN(10000000000000000,'wei');// 2.5 
        const getAmountOut = await uni_contract.methods.getAmountsOut(etherCall,["0x262afAaDa39435a617A3049Db2BF3e999190eE6E","0x81FA727E73778f0d8106C10be8d0311E612A99cE"]).call();
        console.log(getAmountOut,"getamountout");

    }else if (poolPriceFixed >= comapreMarketPrice){      //swapExactETHForTokens
        const PriceDifferance =  poolPriceFixed -BNBAuto ;
        console.log(PriceDifferance,"tokenCalForPriceDiff");
        // const decimalOfTokenCal = PriceDifferance*10**18;

        const perUsdtBNB = (1 /  BNBAuto).toFixed(4) ;
        console.log(perUsdtBNB,"perUsdtBNB");
        const BNBcalForDifferance = (perUsdtBNB * PriceDifferance).toFixed(4);
        console.log(BNBcalForDifferance,"BNBcalForDifferance");
        const BNBCalDiffWithDecimal =BNBcalForDifferance *10**18;
        console.log(BNBCalDiffWithDecimal,"BNBCalDiffWithDecimal");

             let tokenCalculation = await web3.utils.toBN(2000000000000000000,'wei');// 2.5       //web3.utils.toWei(web3.utils.toBN(1000,'wei'));
            let BNBCal = await web3.utils.toBN(BNBCalDiffWithDecimal,'wei'); //0.01        //web3.utils.toWei(web3.utils.toBN(100000000000000000,'wei'));

        let rawTransaction = {
                from: user,
                gasPrice: web3.utils.toHex(20 * 1e9),
                gasLimit: web3.utils.toHex(250000),
                to: routerContract,
                value: BNBCal,
                data: uni_contract.methods.swapExactETHForTokens(tokenCalculation,Array,user,1664018496).encodeABI(),
        
                nonce: web3.utils.toHex(count),
            };
            let transaction = new Tx(rawTransaction);
            // console.log(transaction, "rawTransaction happen on the line .....");
            transaction.sign(privateKey);
            // console.log("jfskflkf");
            const trans = await web3.eth.sendSignedTransaction(
                "0x" + transaction.serialize().toString("hex"),
            );
            // console.log(trans);

            let etherCall = await web3.utils.toBN(10000000000000000,'wei');// 2.5 
            const getAmountOut = await uni_contract.methods.getAmountsOut(etherCall,["0x262afAaDa39435a617A3049Db2BF3e999190eE6E","0x81FA727E73778f0d8106C10be8d0311E612A99cE"]).call();
            console.log(getAmountOut,"getamountout");
            }
    }

compare();


// async function a() {
    //    //calling contract
    //    const uni_contract = new web3.eth.Contract(abiJson, routerContract,{from: user, },);
    //    //calculation wei
    //    let etherCal = await web3.utils.toBN(10000000000000000,'wei');
    //    // console.log(etherCal);
    //    // getAmountOUt
    //    const getAmountOut = await uni_contract.methods.getAmountsOut(etherCal,["0x262afAaDa39435a617A3049Db2BF3e999190eE6E","0x81FA727E73778f0d8106C10be8d0311E612A99cE"]).call();
    //    console.log(getAmountOut);
    
    // let etherCall = await web3.utils.toBN(2000000000000000000,'wei');// 2.5       //web3.utils.toWei(web3.utils.toBN(1000,'wei'));
    // let BNBCal = await web3.utils.toBN(10000000000000000,'wei'); //0.01        //web3.utils.toWei(web3.utils.toBN(100000000000000000,'wei'));
    // async function b() {
    //     // addLiquidityETH("0xAffc6d8DCee57d6069806404c5456eC352E41644",20000000000,19000000000,BNBCal,user,1664018496).encodeABI(),    
    //     let rawTransaction = {
    //     from: user,
    //     gasPrice: web3.utils.toHex(20 * 1e9),
    //     gasLimit: web3.utils.toHex(250000),
    //     to: routerContract,
    //     value: BNBCal,
    //     data: uni_contract.methods.swapExactETHForTokens(etherCall,Array,user,1664018496).encodeABI(),

    //     nonce: web3.utils.toHex(count),
    // };
    // let transaction = new Tx(rawTransaction);
    // // console.log(transaction, "rawTransaction happen on the line .....");
    // transaction.sign(privateKey);
    // console.log("jfskflkf");
    // const trans = await web3.eth.sendSignedTransaction(
    //     "0x" + transaction.serialize().toString("hex"),
    // );
    // console.log(trans);
    // }

//     ////////////
    
//         const Array1 = ["0x81FA727E73778f0d8106C10be8d0311E612A99cE","0x262afAaDa39435a617A3049Db2BF3e999190eE6E"];

//     let etherCall = await web3.utils.toBN(2500000000000000000,'wei');// 2.5       //web3.utils.toWei(web3.utils.toBN(1000,'wei'));
//     let BNBCal = await web3.utils.toBN(10000000000000000,'wei'); //0.01        //web3.utils.toWei(web3.utils.toBN(100000000000000000,'wei'));
//     let minBNB = await web3.utils.toBN(1000000000000000,'wei');
//         // addLiquidityETH("0xAffc6d8DCee57d6069806404c5456eC352E41644",20000000000,19000000000,BNBCal,user,1664018496).encodeABI(),    
//         let rawTransaction = {
//         from: user,
//         gasPrice: web3.utils.toHex(20 * 1e9),
//         gasLimit: web3.utils.toHex(250000),
//         to: routerContract,
//         value: 0x0,
//         // data: uni_contract.methods.swapExactTokensForETH(etherCall,minBNB,Array1,user,1664018496).encodeABI(),

//         nonce: web3.utils.toHex(count),
//     };
//     let transaction = new Tx(rawTransaction);
//     // console.log(transaction, "rawTransaction happen on the line .....");
//     transaction.sign(privateKey);
//     console.log("jfskflkf");
//     const trans = await web3.eth.sendSignedTransaction(
//         "0x" + transaction.serialize().toString("hex"),
//     );
//     console.log(trans);
  
   
// }

   

// a();
// // const WebSocket = require('ws');
// // let ws = new WebSocket('wss://stream.binance.com:9443/ws/bnbusdt@trade');  //bnbbtc //ethusdt //btcusdt //dotusdt
// // // let socketPrice5 = document.getElementById('cryptoPrice5');

// // ws.onmessage = (event)=>{
// //     const socketObject = JSON.parse(event.data);
// //     console.log(socketObject.p);
  
// // }