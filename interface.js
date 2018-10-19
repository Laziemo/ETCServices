/*
ETC Node Server
Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
//var rp = require ('request-promise-native');
const Web3 = require ('web3');
const Web3ETH =  require('web3-eth');
const Accounts = require('web3-eth-accounts');
const base64 = require ('base-64');
const http = require ('http');

const logs = require('./logs.js');
//-o_o===init======================================================|
const NODE_PORT = process.env.N_PORT;
const S_PORT = process.env.S_PORT;
const node_addr = `http://localhost:${NODE_PORT}`;
const app = express();
var web3 = new Web3.providers.HttpProvider(node_addr);
var accounts = new Accounts(node_addr);
var web3eth = new Web3ETH(node_addr);
app.use(helmet());
app.use(helmet.noCache());
//===AccountGen-====================================================|
app.post('/new_account',async (req,res)=>{
  try{
    console.log("got request at /new_account");
  	let account = accounts.create();
    //web3.eth.wallet.add(account);
    res.send(account);
  }
  catch(e){
  	res.send(e);
  }
})
//===TxDetail-=====================================================|
app.post('/tx_detail',async (req,res)=>{
  try
  {
    var txhash = req.body.txid;
    var re = new RegExp('^0x([A-Fa-f0-9]{64})$');
    if((txid.length==64)&&(re.test(txid))){

      web3.eth.getTransaction(txhash).then((result)=>{
        return {"txid":result.hash,
                "confirmations":web3.eth.blockNumber - result.blockNumber,
                "from":result.from,
                "to":result.to,
                "value": result.value,
                "gas":result.gas,
                "gasPrice":result.gasPrice,
        }
      })
      .then((json)=>{
       res.send(json);
      })
      .catch((error)=>{
       res.send(error);
      })
   }
  }
  catch(e){
   console.log(e);
   res.send(e);
  }
})
//===ReceiveNotify-=================================================|
var receive_notify = web3eth.subscribe('logs', {
    address: '0x4d3aF118AC3F4B9EDd3c1b3ddc936AA71C7866E6'
  }, function (error,result){
    if(!error){
     console.log(result);
     logs.write_rec_log(true,result);
    }
});

receive_notify.on("data", function(log){
  console.log("on DATA",log);
  logs.write_rec_log(true,log);
})
.on("changed",function(log){
  console.log("on CHANGED: ", log);
  logs.write_rec_log(true,log);
})

//===CONNECT=====-==================================================|
app.listen(S_PORT,()=>{
 console.log(`Listening on port ${S_PORT}`);
})
//===FIN=====-==================================================|
