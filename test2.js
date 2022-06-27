const Web3 = require('web3');
const Tx = require("ethereumjs-tx");
const Binance = require('binance-api-node').default;
var cron = require('node-cron');

const web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'));
require('dotenv').config();
//details
const abiJson = require('./Abi/abi.json');
const routerContract = '0x0e85cA106FD68EC23755023B1415D496159477B2';
const user = '0xC39192Cc62eDc7668bD5c2280277caEbdc7c48E4'; 

const WebSocket = require('ws');
let ws = new WebSocket('wss://stream.binance.com:9443/ws/bnbusdt@trade');  //bnbbtc //ethusdt //btcusdt //dotusdt

// cron.schedule("*/1 * * * *", function() {
//     compare();
// });

let compare = async() =>{
    //binance price from market
        const client = Binance()
        const tokenRes = await client.prices();
        const BNBRes = tokenRes.BNBUSDT;
         const BNBAuto = parseFloat(BNBRes).toFixed(0);
         console.log(BNBAuto,"marketprice");
         //call thew contract
         const uni_contract = await new web3.eth.Contract(abiJson, routerContract,{from: user, },);
         //binance price from  the pool
    let etherCal = await web3.utils.toBN(10000000000000000,'wei');
    const getAmountOut = await uni_contract.methods.getAmountsOut(etherCal,["0x262afAaDa39435a617A3049Db2BF3e999190eE6E","0x81FA727E73778f0d8106C10be8d0311E612A99cE"]).call(); //WETH,token
    const poolPrice = parseFloat(getAmountOut[1]);
    const poolPriceFixed = (poolPrice/10000000000000000).toFixed(0);
    console.log(poolPriceFixed,'poolPriceFixed');
     
    //Array of Path
    const Array = ["0x262afAaDa39435a617A3049Db2BF3e999190eE6E","0x81FA727E73778f0d8106C10be8d0311E612A99cE"];
    const Array1 = ["0x81FA727E73778f0d8106C10be8d0311E612A99cE","0x262afAaDa39435a617A3049Db2BF3e999190eE6E"];

    const count = await web3.eth.getTransactionCount(user);
    //private key
    let privateKey = Buffer.from(
        process.env.privateKey,
        "hex",
    );


             let tokenCalculation = await web3.utils.toBN(2000000000000000000,'wei');// 2token       //web3.utils.toWei(web3.utils.toBN(1000,'wei'));
            let BNBCal = await web3.utils.toBN(50000000000000000,'wei'); //0.01        //web3.utils.toWei(web3.utils.toBN(100000000000000000,'wei'));

        let rawTransaction = {
                from: user,
                gasPrice: web3.utils.toHex(20 * 1e9),
                gasLimit: web3.utils.toHex(250000),
                to: routerContract,
                value: BNBCal,
                data: uni_contract.methods.swapExactETHForTokens(tokenCalculation,Array,user,1664018496).encodeABI(),
        
                nonce: web3.utils.toHex(count),
            };
            let transaction = await new Tx(rawTransaction);
            console.log(transaction, "rawTransaction happen on the line .....");
            await transaction.sign(privateKey);
            console.log("jfskflkf");
            const trans = await web3.eth.sendSignedTransaction(
                "0x" + transaction.serialize().toString("hex"),
            );
            console.log(trans);

            let etherCall = await web3.utils.toBN(10000000000000000,'wei');//0.01 
            const getAmountOut1 = await uni_contract.methods.getAmountsOut(etherCall,["0x262afAaDa39435a617A3049Db2BF3e999190eE6E","0x81FA727E73778f0d8106C10be8d0311E612A99cE"]).call();
            console.log(getAmountOut1,"getamountout1");
            }

compare ();