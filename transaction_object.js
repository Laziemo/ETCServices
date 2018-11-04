/*
ETC Node Server: Transaction Object
Developed at ThroughBit Technologies Pvt. Ltd.
HYFERx Project
*/
//-<..>===========================================================~|
'use strict';
//-o_o===modules===================================================|
//-o_o===init======================================================|
//-o_o===create====================================================|
let create = (tx_output_set)=>{
  return new Promise((resolve,reject)=>{
    try{
      let send_addr = "0x4d3aF118AC3F4B9EDd3c1b3ddc936AA71C7866E6";
      let tx_object = {
        from: send_addr,
        to: tx_output_set.to,
        value: tx_output_set.amount,
        gasPrice: "2000000000",
        gas: "21000"
      }
      resolve(tx_object);  
    }
    catch(e){
      reject(e);
    }
  });
}
//-o_o===exports==================================================|
module.exports={create};
//-o_o===fin======================================================|