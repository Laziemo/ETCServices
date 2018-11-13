/*
ETC Node Server: Interface
Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const fs = require('fs');
const base64 = require ('base-64');
const http = require ('http');
//var rp = require ('request-promise-native');

const logs = require('./lib/logs');
const w3fx = require('./lib/web3_fx');
//-o_o===init======================================================|
const NODE_PORT = process.env.N_PORT;
const S_PORT = process.env.S_PORT;
const node_addr = `http://localhost:${NODE_PORT}`;

let app = express();
app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//===new_account-====================================================|
app.post('/new_account',(req,res)=>{
  try{
    w3fx.new_account()
    .then((account)=>{
      console.log('Created new account: ',account);
      res.send(account);
    })
    .catch((e)=>{
      console.log("Error creating new account", e);
      res.send(e);
    });
  }
  catch(e){
  	res.send(e);
  }
})
//===TxDetail-=====================================================|
app.post('/tx_detail',(req,res)=>{
  try{
   let txid = req.body.txid;
   w3fx.tx_detail(txid)
   .then((details)=>{
    console.log('Tx_Detail: ',details);
    res.send(details);
  })
  .catch((e)=>{
    console.log("Error creating new account", e);
    res.send(e);
  });
}
catch(e){
  res.send(e);
}
  
});
//===get_block=====-==================================================|
app.post('/height',(req,res)=>{
  try{
    w3fx.block_height()
    .then((height)=>{
      console.log('Current block height: ',height);
      res.send(height);
    })
    .catch((e)=>{
      console.log("Error creating new account", e);
      res.send(e);
    });
  }
  catch(e){
  	res.send(e);
  }
});
//===get_work=====-==================================================|
app.post('/get_work',(req,res)=>{
  try{
    w3fx.get_work()
    .then((work)=>{
      console.log('Work: ',work);
      res.send(work);
    })
    .catch((e)=>{
      console.log("Error getting work", e);
      res.send(e);
    });
  }
  catch(e){
  	res.send(e);
  }
});
//===CONNECT=====-==================================================|

app.listen(S_PORT,()=>{
 console.log(`Listening on port ${S_PORT}`);
})
//===FIN=====-==================================================|
