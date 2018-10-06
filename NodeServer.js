/*
ETC Node Server
Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|
var errorSet = require('./errors.js');
var express = require('express');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var rp = require ('request-promise-native');
var Web3 = require ('web3');
var base64 = require ('base-64);
var async = require ('async');
var http = require ('http);                      
//-o_o===init======================================================|
const NODE_PORT = process.env.N_PORT;
const S_PORT = process.env.S_PORT;
                    
const app = express();
const web3 = new Web3.providers.HttpProvider(`http://localhost:${NODE_PORT}`);

app.use(helmet());
app.use(helmet.noCache());


//used to make the response from request(Not needed if using request promises) a Javascript objects

//===TxDetail-=====================================================|
app.post('/tx_detail',async (req,res)=>{
  try
  {
    var txhash = req.body.txid; //Gets the TXID sent in the request
    var re = new RegExp('^0x([A-Fa-f0-9]{64})$'); //RegEx for validating txid
    if((txid.length==64)&&(re.test(txid))){
     //rp returns a promise
      web3.eth.getTransaction(txhash).then((result)=>{
        return {"txid":result.hash,
                "confirmations":web3.eth.blockNumber - result.blockNumber,
                "from":result.from,
                "to":result.to,
                "value": result.value,
                "gas":result.gas,
                "gasPrice":result.gasPrice,
        }
      }).then((json)=>{
        res.send(json)
      }).catch((error)=>{
        res.send(error)
      })
   }
  }
  catch(e){
   console.log(e)
    res.send(e)
  }
})
//===AccountGen-====================================================|
app.post('/new_account',async (req,res)=>{
  try{
  	let account = web3.eth.accounts.create();
    web3.eth.wallet.add(account);
    res.send({
      "address":account.address,
      "privateKey": account.privateKey
    });
  }
  catch(e){
  	res.send(e);
  }
})
//===ReceiveNotify-=================================================|
var receive_notify = async ()=>{
  try{
   var filter = web3.eth.filter('latest');
   var filter = web3.eth.filter(options);
   web3.eth.filter(options, function(error, result){
    if (!error)
    console.log(result);
   });
  }
  catch(e){
  	res.status(500).send(e);
  }
}
//===CONNECT=====-==================================================|
app.listen(S_PORT,()=>{
 console.log(`Listening on port ${S_PORT}");
})
//===FIN=====-==================================================|
