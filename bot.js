const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const Web3 = require('web3');
const Tx = require("ethereumjs-tx");
const Binance = require('binance-api-node').default;
var cron = require('node-cron');

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(cors());

require('dotenv').config();

const web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'));
//details
const abiJson = require('./Abi/abi.json');
const routerContract = '0x0e85cA106FD68EC23755023B1415D496159477B2';
const user = '0xC39192Cc62eDc7668bD5c2280277caEbdc7c48E4';
var userReqAmt = null;

var cron_task;

app.post('/enable', async function (req, res) {

    cron_task = cron.schedule("*/2 * * * *", function () {
        compare();
    });

    console.log("dere post ", req.body);
    const data = req.body;
    userReqAmt = data;
    res.send("data set successfully.")
})

app.get('/disable', async function (req, res) {
    cron_task.stop();
});


let compare = async () => {
    // userReqAmt +>
    console.log({ userReqAmt });
    //binance price from market
    const client = Binance();
    // console.log({client});
    const tokenRes = await client.prices();
    const BNBRes = tokenRes.BNBUSDT;
    const BNBAuto = parseFloat(BNBRes).toFixed(0);
    console.log(BNBAuto, "market Price");
    //binance price from  the pool
    const uni_contract = await new web3.eth.Contract(abiJson, routerContract, { from: user, },);
    let etherCal = await web3.utils.toBN(10000000000000000, 'wei');
    const getAmountOut = await uni_contract.methods.getAmountsOut(etherCal, ["0x262afAaDa39435a617A3049Db2BF3e999190eE6E", "0x81FA727E73778f0d8106C10be8d0311E612A99cE"]).call(); //WETH,token

    const poolPrice = parseFloat(getAmountOut[1]);
    const poolPriceFixed = (poolPrice / 10000000000000000).toFixed(0);
    console.log(poolPriceFixed, 'poolPriceFixed');

    //3% from the pool price
    const HoldPercent = (BNBAuto * (userReqAmt?.percent) / 100).toFixed(0);
    console.log(HoldPercent);
    //differnce real price % - pool price

    const comapreMarketPriceLow = Number(BNBAuto) - Number(HoldPercent);
    console.log(comapreMarketPriceLow, "market price less from your percent");
    const comapreMarketPriceHigh = Number(BNBAuto) + Number(HoldPercent);
    console.log(comapreMarketPriceHigh, "market price high from your percent");

    //Array of Path
    const Array = ["0x262afAaDa39435a617A3049Db2BF3e999190eE6E", "0x81FA727E73778f0d8106C10be8d0311E612A99cE"];
    const Array1 = ["0x81FA727E73778f0d8106C10be8d0311E612A99cE", "0x262afAaDa39435a617A3049Db2BF3e999190eE6E"];

    const count = await (web3.eth.getTransactionCount(user));
    // const count = count1;
    console.log(count,"count");
    //private key
    let privateKey = Buffer.from(
        process.env.privateKey1,
        "hex",
    );

    if (poolPriceFixed <= comapreMarketPriceLow) {
        const PriceDifferance = BNBAuto - poolPriceFixed;
        console.log(PriceDifferance, "tokenCalForPriceDiff1");

        const decimalOfTokenCal = PriceDifferance * 10 ** 18;
        console.log(decimalOfTokenCal,"decimalOfTokenCal");
        // const pricefor5Addr = decimalOfTokenCal/5;

            let tokenCall = await web3.utils.toBN(decimalOfTokenCal, 'wei');       //web3.utils.toWei(web3.utils.toBN(1000,'wei'));
            // console.log(pricefor5Addr,"pricefor5Addr");
            let minBNB = await web3.utils.toBN(10000000000000,'wei');
            console.log("this1");
            let rawTransaction = {
                from: user,
                gasPrice: web3.utils.toHex(20 * 1e9),
                gasLimit: web3.utils.toHex(250000),
                to: routerContract,
                value: 0x0,
                data: uni_contract.methods.swapExactTokensForETH(tokenCall, minBNB, Array1, user, 1664018496).encodeABI(),
                nonce: web3.utils.toHex(count),
            };
            console.log("this2");
            let transaction = await new Tx(rawTransaction);
            console.log("this3");

            await transaction.sign(privateKey);
            console.log("this4");

            const trans = await web3.eth.sendSignedTransaction(
                "0x" + transaction.serialize().toString("hex"),
                );
                console.log(trans);
            
            
                let etherCall = await web3.utils.toBN(10000000000000000, 'wei');// 2.5 
                const getAmountOut = await uni_contract.methods.getAmountsOut(etherCall, ["0x262afAaDa39435a617A3049Db2BF3e999190eE6E", "0x81FA727E73778f0d8106C10be8d0311E612A99cE"]).call();
            console.log(getAmountOut, "getamountout");

    } else if (poolPriceFixed >= comapreMarketPriceHigh) {      //swapExactETHForTokens
        const PriceDifferance = poolPriceFixed - BNBAuto;
        console.log(PriceDifferance, "tokenCalForPriceDiff2");
        const decimalOfTokenCal = PriceDifferance * 10 ** 18;

        const perUsdtBNB = (1 / BNBAuto).toFixed(4);
        console.log(perUsdtBNB, "perUsdtBNB");
        const BNBcalForDifferance = (perUsdtBNB * PriceDifferance).toFixed(4);
        console.log(BNBcalForDifferance, "BNBcalForDifferance");
        const BNBCalDiffWithDecimal = BNBcalForDifferance * 10 ** 18;
        console.log(BNBCalDiffWithDecimal, "BNBCalDiffWithDecimal");

        let tokenCalculation = await web3.utils.toBN(decimalOfTokenCal, 'wei');// 2.5       //web3.utils.toWei(web3.utils.toBN(1000,'wei'));
        console.log(tokenCalculation, "tokenCalculation 2");
        let BNBCal = await web3.utils.toBN(BNBCalDiffWithDecimal, 'wei'); //0.01        //web3.utils.toWei(web3.utils.toBN(100000000000000000,'wei'));

        let rawTransaction = {
            from: user,
            gasPrice: web3.utils.toHex(20 * 1e9),
            gasLimit: web3.utils.toHex(250000),
            to: routerContract,
            value: BNBCal,
            data: uni_contract.methods.swapExactETHForTokens(tokenCalculation, Array, user, 1664018496).encodeABI(),
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

    }
}

app.listen(4000, () => console.log("bot server is running on 4000"));
