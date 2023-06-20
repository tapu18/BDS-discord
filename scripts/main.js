import {world} from "@minecraft/server"
import Controller from "./module/controller"
import * as admin from "@minecraft/server-admin"

const config = {
  power:admin.variables.get("power"),
  check_no_player:admin.variables.get("check_no_player"), 
  polling_rate:admin.variables.get("polling_rate"), 
}

if(isValidConfig(config)){
    const c = new Controller(config);
    
}
else{
    world.sendMessage("Configの入力に間違いがあります。正しい値を入力したのちに再起動(/reload)してください。");
    console.log("Configの入力に間違いがあります。正しい値を入力したのちに再起動(/reload)してください。");
}

function isValidConfig(config) {
    if (typeof config !== 'object') {
      return false;
    }
  
    if (typeof config.power !== 'boolean') {
      return false;
    }
  
    if (typeof config.check_no_player !== 'boolean') {
      return false;
    }
  
    if (typeof config.polling_rate !== 'number' || config.polling_rate < 30) {
      return false;
    }
  
    return true;
  }

