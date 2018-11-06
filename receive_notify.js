/*
ETC Node Server: Receive notify
Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|
const bodyParser = require('body-parser');
const Web3E =  require('web3-eth');
const logs = require('./lib/logs.js');
//-o_o===init======================================================|
const node_addr = `http://localhost:${process.env.N_PORT}`;
let web3eth = new Web3E(node_addr);

let receive_notify = web3eth.subscribe('logs', {
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
});

//--fin------------------------------------------------------------|