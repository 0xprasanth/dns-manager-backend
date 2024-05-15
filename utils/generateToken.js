/**
 * utils/generateToken.js
 */

function returnHash(){

    abc = "abcdefghijklmnopqrstuvwxyz1234567890".toUpperCase().split("");
    var token=""; 
    for(i=0;i<16;i++){
         token += abc[Math.floor(Math.random()*abc.length)];
    }
    return token; //Will return a 16 bit "hash"
}


module.exports = returnHash;