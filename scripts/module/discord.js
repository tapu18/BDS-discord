import {world,system} from"@minecraft/server"
import * as mcnet from "@minecraft/server-net"
import * as admin from "@minecraft/server-admin"


class BDSdiscord{
    constructor(conf){
        this.seecret = {
            token:admin.secrets.get("BDSdiscordToken"),
            channelId:admin.secrets.get("BDSdiscordChannelID"),
        }
        this.seecret = {
            token:"MTExODgzOTY0NjI5ODgzNjk5Mg.GcPYuI.o4bXLx9G_JegZ4J02NJAbyUPx9vVGyldLbpP3U",
            channelId:"854775142261850155",
        }
        this.config = {
            limit : conf && conf.limit ? conf.limit : 20
        }
        this.afterId = "-1"

        if(this.seecret.token == undefined || this.seecret.channelId == undefined){
            console.log("[BDS discord]tokenまたはchannel IDが入力されていません。設定をお確かめください。");
            world.sendMessage("[BDS discord]tokenまたはchannel IDが入力されていません。設定をお確かめください。");
        }
        else{
            this.get_recently_discord().then((res)=>{//現在の最新メッセージのIDを保存しておく 
                this.afterId = (res && res[0] && res[0].id) ? res[0].id : "-1";
            });   
        }
    }

    async get_discord(){ //前回取得時以降の新規メッセージ取得
        if(this.afterId != "-1"){          
            let request = new mcnet.HttpRequest('https://discord.com/api/v10/channels/'+this.seecret.channelId+'/messages?limit='+this.config.limit+'&after='+this.afterId);
            request.method = 'GET';
            request.addHeader("Authorization", 'Bot '+this.seecret.token);

            const res = await mcnet.http.request(request);
            try{  
                let data = JSON.parse(res.body);
                if(data[0] && data[0].id){
                    this.afterId = data[0].id;
                }
                if(data.length && data.length > 1) data = data.reverse(); //新着順なので時系列順にするため反転
                return data;
            }
            catch{
                console.log("connection error");
                return [{id:"-1"}]
            }
        }
        return undefined;
    }

    async get_recently_discord(){
        let request = new mcnet.HttpRequest('https://discord.com/api/v10/channels/'+this.seecret.channelId+'/messages?limit=1');
        request.method = 'GET';
        request.addHeader("Authorization", 'Bot '+this.seecret.token);

        let res = await mcnet.http.request(request)
        try{  
            const data = JSON.parse(res.body);
            return data;
        }
        catch{
            console.log("connection error");
            return [{id:"-1"}]
        }
    }

    

    post_discord(message){
        let request = new mcnet.HttpRequest('https://discord.com/api/v10/channels/'+this.seecret.channelId+'/messages');
        request.method = 'POST';
        const data = JSON.stringify({
            content: message,
            tts: false
        });
        request.body = data;
        request.addHeader("Authorization", 'Bot '+this.seecret.token);
        request.addHeader("Content-Type", "application/json;charset=utf-8");
        request.addHeader("Content-Length", data.length.toString());
        
        mcnet.http.request(request).then((res)=>{
            //console.log("POST res"+res.body);
        });
    }
}


export {BDSdiscord};