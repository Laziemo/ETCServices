/*
ETC Node Server: Transaction Object
Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules====================================================|
const w3fx = require('./web3_fx');
const Web3ETH =  require('web3-eth');
//-o_o===init=======================================================|
const node_addr = `http://localhost:${process.env.N_PORT}`;
let web3eth = new Web3ETH(node_addr); 
//-o_o===create====================================================|
let create = (to,amount,private_key)=>{
  return new Promise((resolve,reject)=>{
    try{
      let send_acc = w3fx.account_from_key(private_key)
      .then((send_acc)=>{
        let tx_object = {
          from: send_acc.address,
          to: to,
          value: amount,
          gasPrice:"20000000000",
          gas: "21000",
          nonce: Math.floor(Math.random() * 100000000) + 197674
        }
        resolve(tx_object);  
      })
      .catch((e)=>{
        reject(e);
      });
    }
    catch(e){
      reject(e);
    }
  });
}
//-o_o===exports==================================================|
module.exports={create};
//-o_o===fin======================================================|