'use strict';

module.exports = function(err, res){

//  console.log(`ERR.NAME -> ${err.name} \n ERR.MSG -> ${err.message}`);

  let msg = err.message.toLowerCase();

  if(msg.includes('validation'))
    return res.status(400).send(`${err.name}: ${err.message}`);
  if(msg.includes('authorization'))
    return res.status(401).send(`${err.name}: ${err.message}`);
  if(msg.includes('path error'))
    return res.status(404).send(`${err.name}: ${err.message}`);
  if(msg.includes('objectid failed'))
    return res.status(404).send(`${err.name}: ${err.message}`);
  if(msg.includes('duplicate key'))
    return res.status(409).send(`${err.name}: ${err.message}`);

  return res.status(500).send(`${err.name}: ${err.message}`);
};
