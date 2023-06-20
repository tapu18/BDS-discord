import {world,system} from "@minecraft/server";
import {BDSdiscord} from './discord';
class Controller{
    constructor(conf){
        this.discord = new BDSdiscord();
        this.config = conf;
        this.power = this.config.power;
        this.nochat_interval = 0;
        
        this.eventIDs ={
            chatSend:undefined,
            playerJoin:undefined,
            playerLeave:undefined,
            runInterval:undefined
        }

        world.afterEvents.chatSend.subscribe((ev)=>{
            if(ev.sender.isOp){
                if(ev.message == "!discord start"){
                    if(this.power){
                        world.sendMessage("discordと既に通信中です");
                        //console.log("discordと既に通信中です");
                    }
                    else{
                        this.run();
                        this.power = true;       
                        //console.log("discordとの通信を開始しました");
                    }
                }
                else if(ev.message == "!discord stop"){
                    if(!this.power){
                        world.sendMessage("discordとの通信は既に行われていません");
                        //console.log("discordとの通信は既に行われていません");
                    }
                    else{
                        this.stop();
                        this.power = false;
                        //console.log("discordとの通信を開始しました");
                    }
                }            
            }
        })
        if(this.power) this.run(); //デフォルトonなら開始
    }
    
    async run(){
        /* BDS->discord */
        await this.discord.get_recently_discord(); //開始前に一度最新のメッセージを取得しておく
        world.sendMessage("discordとの通信を開始しました");
        console.log("Start communication with discord");
        this.eventIDs.chatSend = world.afterEvents.chatSend.subscribe((ev)=>{
            if(!ev.sendToTargets){
                if(ev.sender !=undefined)
                    this.discord.post_discord("<"+ev.sender.name+"> " + ev.message);
                else
                    this.discord.post_discord(ev.message);     
            }
        })
        
        this.eventIDs.playerJoin = world.afterEvents.playerJoin.subscribe((ev)=>{
            this.discord.post_discord('**'+ev.playerName+'がサーバーに訪れました**')
        });
        
        this.eventIDs.playerLeave = world.afterEvents.playerLeave.subscribe((ev)=>{
            this.discord.post_discord('**'+ev.playerName+'がサーバーから去りました**')
        });

        /* discord->BDS */
        this.eventIDs.runInterval = system.runInterval(()=>{
            if(this.config.check_no_player || world.getAllPlayers().length != 0){
                this.discord.get_discord().then((data)=>{
                    if(data != undefined && data[0] != undefined){
                        data.forEach(element => {
                            if(! element.author.bot ==true){//botメッセージは除外     
                                world.sendMessage(`<discord:${element.author.username}>${element.content}`);
                                //console.log(`<discord:${element.author.username}>${element.content}`);
                            }
                        });
                    }
                });
            }
        },this.config.polling_rate);
    }

    stop(){
        if(this.eventIDs.chatSend !=undefined) world.afterEvents.chatSend.unsubscribe(this.eventIDs.chatSend);
        if(this.eventIDs.playerJoin !=undefined) world.afterEvents.playerJoin.unsubscribe(this.eventIDs.playerJoin);
        if(this.eventIDs.playerLeave !=undefined) world.afterEvents.playerJoin.unsubscribe(this.eventIDs.playerLeave);
        if(this.eventIDs.runInterval !=undefined) system.clearRun(this.eventIDs.runInterval);
        world.sendMessage("discordとの通信を終了しました");
        console.log("Stop communication with discord");
    }
}
export default Controller