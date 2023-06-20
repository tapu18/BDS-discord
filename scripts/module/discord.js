import {world,system} from"@minecraft/server"
import * as mcnet from "@minecraft/server-net"
import * as admin from "@minecraft/server-admin"


class BDSdiscord{
    constructor(conf){
        this.secret = { //secretはうまくいかなかい（http request実行時の解決がされない？）のでとりあえずvariablesで
            token:admin.variables.get("BDSdiscordToken"),
            channelId:admin.variables.get("BDSdiscordChannelID"),
        }
        if(this.secret.token == undefined || this.secret.channelId == undefined ){
            console.log("token or channel id error");
        }
        this.config = {
            limit : conf && conf.limit ? conf.limit : 20
        }
        this.afterId = "-1"
    }

    async get_discord(){ //前回取得時以降の新規メッセージ取得
        if(this.afterId != "-1"){          
            let request = new mcnet.HttpRequest('https://discord.com/api/v10/channels/'+this.secret.channelId+'/messages?limit='+this.config.limit+'&after='+this.afterId);
            request.method = 'GET';
            request.addHeader("Authorization", 'Bot '+this.secret.token);
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
        let request = new mcnet.HttpRequest('https://discord.com/api/v10/channels/'+this.secret.channelId+'/messages?limit=1');
        request.method = 'GET';
        request.addHeader("Authorization", 'Bot '+this.secret.token);

        let res = await mcnet.http.request(request)
        try{  
            const data = JSON.parse(res.body);
            this.afterId = data[0].id;
            return data;
        }
        catch{
            console.log("connection error");
            return [{id:"-1"}]
        }
    }

    

    post_discord(message){
        let request = new mcnet.HttpRequest('https://discord.com/api/v10/channels/'+this.secret.channelId+'/messages');
        request.method = 'POST';
        const data = JSON.stringify({
            content: message,
            tts: false
        });
        request.body = data;
        request.addHeader("Authorization", 'Bot '+this.secret.token);
        request.addHeader("Content-Type", "application/json;charset=utf-8");
        request.addHeader("Content-Length", data.length.toString());
        
        mcnet.http.request(request).then((res)=>{
            //console.log("POST res"+res.body);
        });
    }
}


export {BDSdiscord};