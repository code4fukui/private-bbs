# private-bbs

Denoで構築されたシンプルでプライベートな電子掲示板（BBS）システムです。暗号技術を用いたユーザー認証、リアルタイム更新、WebPush通知を特徴としています。

## 機能

- **分散型アイデンティティ**: ユーザーアカウントは公開鍵/秘密鍵ペアに基づいています。ユーザー登録や中央管理者は必要ありません。
- **WebPush通知**: ブラウザのタブを閉じていても、新しい投稿の通知を受け取ることができます。
- **ルーム/チャンネル**: ディスカッションを異なるルームに整理できます。JSONファイルで設定可能です。
- **多彩なインタラクション**: コメント、いいね、投稿の削除をサポートしています。
- **シンプル＆セルフホスト**: 外部データベースに依存せず、単一のDenoプロセスとして動作します。
- **カスタマイズ可能なテーマ**: CSSファイルを編集することで、見た目を簡単に変更できます。

## はじめに

### 前提条件

- [Deno](https://deno.land/) (v1.34+)

### 1. リポジトリのクローン

```sh
git clone https://github.com/code4fukui/private-bbs.git
cd private-bbs
```

### 2. BBSの設定

`static/settings.json` ファイルを編集して、インスタンスをカスタマイズします。

```json
{
  "title": "PRIVATE BBS",
  "css": "style.css",
  "url": "http://localhost:8080/",
  "rooms": ["General", "Tech", "Random"]
}
```

- `title`: 掲示板の名前。
- `css`: 使用するスタイルシート（例: `style.css` または `style_nurseket.css`）。
- `url`: サービスの公開URL。**プッシュ通知を機能させるには、これを正しく設定する必要があります。**
- `rooms`: 利用可能なルームを定義する文字列の配列。

### 3. プッシュ通知のセットアップ

WebPushに必要なVAPIDキーを生成します。このコマンドを実行すると、クライアント用の `static/vapidPublicKey.txt` と、サーバー用の秘密鍵を含む `.env` ファイルが作成されます。

```sh
deno run -A https://code4fukui.github.io/WebPush/init.js yourmailaddress@yourdomain
```

### 4. サーバーの起動

`deno serve` コマンドを使用してアプリケーションを起動します。

```sh
deno serve --allow-import --allow-write --allow-read --allow-net --port 8080 --host "[::]" server.js
```

起動後、ブラウザを開いて `http://localhost:8080` にアクセスしてください。

## 仕組み

- **バックエンド**: Denoサーバー（`server.js`）が、投稿、データ取得、プッシュ通知の購読管理などのAPIリクエストを処理します。
- **フロントエンド**: バニラJavaScriptで書かれたシングルページアプリケーション（`static/index.html`）です。初回訪問時にユーザーの秘密鍵が生成され、`localStorage` に保存されます。
- **データ保存**: 投稿はCBORエンコードされた個別のファイルとして `data/` ディレクトリに保存され、日付ごと（`data/YYYYMMDD/`）に整理されます。`timeline.jsonl` ファイルがすべての投稿の順序を記録し、最新コンテンツの効率的な取得を可能にします。アクセスログは `log/` ディレクトリに保存されます。

## API

サーバーは、クライアントのアクションを処理するためにシンプルなJSON-RPCスタイルのAPIを公開しています。

- `add`: 新しい投稿、コメント、またはインタラクション（いいね/削除）を作成します。
- `getLatest`: 指定されたタイムスタンプ以降に作成された投稿を取得します。
- `subscribe`: クライアントをWebPush通知に登録します。
- `unsubscribe`: WebPush通知の登録を解除します。

## 参考

このプロジェクトは、[code4fukui](https://github.com/code4fukui/) の以下のモジュールを使用しています。
- [WebPush](https://github.com/code4fukui/WebPush)
- [PubkeyUser](https://github.com/code4fukui/PubkeyUser)
- [JSONL](https://github.com/code4fukui/JSONL)
- [TAI64N-es](https://github.com/code4fukui/TAI64N-es)

## ライセンス

MIT License
