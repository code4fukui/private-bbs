# private-bbs

## how to run

### set up for notifications

```sh
deno run -A https://code4fukui.github.io/WebPush/init.js yourmailaddress@yourdomain
```

### start the service

```sh
deno serve --allow-import --allow-write --allow-read --allow-net --port 8080 --host "[::]" server.js
```

## memo

- インスタントURLで入る
    - 一度入ったら、その端末でしか見えない (localStorageに秘密鍵)
    - URLに名前を入れておく
    - 初回にはルールが表示されて、同意するボタンを表示
- 管理者は、名前を入れて、インスタントURLを発行できる
- 見る、コメントする
    - コメントが見られる
    - 最新コメントがあったものが優先表示
- 投稿
    - UUID、親投稿UUID（or なし）、本文、日時、名前、公開鍵、電子署名
    - 日時別の記録（ファイル記録）
    - 最新スレッド100のリスト（ローカルで構成）
