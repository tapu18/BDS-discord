# BDS-discord
WebSocketを使用出来ないBedrock dedicated server環境において、特定のチャンネルとマイクラ内のチャットを通信可能にするビヘイビアパックです。
discord botを作成し、tokenとチャンネルIDを設定することで通信が可能になります。

## 技術的情報
このスクリプトはserver-netモジュールを使用してdiscordと通信を行います。マイクラ→discordはマイクラ側でチャットやワールド入出時をeventで検知して送信しています。discord→マイクラは数秒おきに（デフォルト7秒）マイクラ側からdiscordに新規メッセージの確認を行うというかなり強引な手法がとられています。そのため、node.jsが利用できる、websocket通信が利用できる、などの環境であればこのアドオンを使用せずに他の方法をとる方が良いかもしれません。

## 導入方法
### discord BOTの作成
https://discord.com/developers からbotを作成しtokenを取得してください（具体的な作り方は省略）。注意点として、bot作成時にMESSAGE CONTENT INTENTにチェックを入れること、URL作成時にメッセージの書き込みと読み込みの権限を与えるようにしてください。
botを通信したいdiscordサーバに参加させたら、通信させるチャンネルのIDも必要ですのでコピーしてください。
### configの設定
config_tmp 内にある20fd352d-8fd2-47d3-a12e-6ff565eef8e3ファイルを丸ごと(BDSディレクトリ)/config　内に設置し (BDSディレクトリ)/config/20fd352d-8fd2-47d3-a12e-6ff565eef8e3/variables.json　となるようにしてください。その後variables.jsonを開きdiscord botのtokenと通信を行うチャンネルIDを入力してください。
### マイクラに導入 
configの設定を終えたら、ワールドに導入してサーバを起動してください。正常に設定がなされていればワールド内でOP権限をもつプレイヤーがチャット内に
```
!discord start
```
と入力すると通信が開始されます。終了時は
```
!discord stop
```
としてください。



## 各種パラメータ
configのvariables.jsonにはいくつか設定変更できるパラメータがあります。
### power
ワールド起動時やreloadコマンド実行時のデフォルトの通信状態。trueで起動時に通信開始、falseで起動時は通信停止状態になります。(デフォルト：false)
### check_no_player
ワールド内にプレイヤーがいないときにも動作させるかどうか。trueだと通信を行う、falseだと通信を行いません。(デフォルト：false)
### polling_rate
どのくらいの頻度でマイクラ側がdiscordに新着メッセージがあるかを確認するか。tick単位で30以下はエラーとなる（デフォルト：140）。

## 既知の問題点
### コンソールにWARNが表示され続ける
httpでデータを受け取る際にマイクラがjson→textに変換したというメッセージを常にコンソールに出力されてしまいます。
### server-adminのsecret文字列が使用出来ない
本来であればbotのtokenはminecraft/server-adminのsecretStringで扱うべきですが、エラーに悩まされたため使用出来ていません。

## 今後の開発予定
- discord→マイクラのコマンドの実行を可能にする
- server UIによる設定を可能にする
- エラー処理をもう少し丁寧にする
- その他変更可能な設定を充実させる

## ライセンス
MIT