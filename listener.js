/*
ETC Node Server: Receive notify
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
const tx_object = require('./lib/transaction_object');
const w3fx = require('./lib/web3_fx');
const logs = require('.//lib/logs');
//-o_o===init======================================================|
const SEND_PORT = process.env.SEND_PORT;

let app = express();
app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//===test-send-====================================================|
app.post('/test_send',(req,res)=>{
  try{
    let imported = process.env.PK;
    let outputs={
    to:"0xC5Bc04cBaDAdc4496b10D6bAC877fb28c19a0c95",
    amount:10000000000000,
    orderId:"TBETC000001"
    }
    tx_object.create(outputs)
    .then((tx_obj)=>{
      console.log("Created transaction object: \n", tx_obj);
      w3fx.sign(tx_obj,imported)
      .then((signed_tx)=>{
        console.log("Signed transaction:\n",signed_tx);
        w3fx.broadcast(signed_tx)
        .then((result)=>{
          console.log("Broadcasted transaction:\n",result);
          res.send(result);
        })
      })
    })
    .catch((e)=>{
      console.log(e);
      res.send(e);
    });
  }
  catch(e){
    console.log(e);
    res.send(e);
  }
});
//--connect--------------------------------------------------------|
app.listen(SEND_PORT,()=>{
  console.log(`Test Send: Listening on port ${SEND_PORT}`);
 });
//--fin------------------------------------------------------------|