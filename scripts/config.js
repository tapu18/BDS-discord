const config = {
    power:false, //ワールド起動時やreload時の初期電源状態(true/false)

    check_no_player:false, //ワールド内にプレイヤーがいない時に動かすか(true/false)

    busy_polling_rate:140, //通常時のBDS→discordのチェック間隔(tick単位)

    idle_polling_rate:3,  //アイドル時のチェック間隔倍数(2なら通常時の2倍の通信間隔になる)

    busy_to_idle:2400, //アイドル状態に移行するまでの時間(tick単位)   
}
export default config
