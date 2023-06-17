import {world} from "@minecraft/server"
import Controller from "./module/controller"
import config from "./config"

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
  
    if (typeof config.busy_polling_rate !== 'number' || config.busy_polling_rate < 0) {
      return false;
    }
  
    if (typeof config.idle_polling_rate !== 'number' || config.idle_polling_rate < 0) {
      return false;
    }
  
    if (typeof config.busy_to_idle !== 'number' || config.busy_to_idle < 0) {
      return false;
    }
  
    return true;
  }

