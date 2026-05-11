# private-bbs

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A simple, private bulletin board system built with Deno. It features cryptographic user identities, real-time updates, and WebPush notifications.

## Features

-   **Decentralized Identity**: User accounts are based on public/private key pairs. No registration or central authority is required.
-   **WebPush Notifications**: Get notified of new posts even when the browser tab is closed.
-   **Rooms/Channels**: Organize discussions into different rooms, configured via a JSON file.
-   **Rich Interactions**: Supports comments, likes, and deletion of posts.
-   **Simple & Self-Hosted**: Runs as a single Deno process with no external database dependencies.
-   **Customizable Theme**: Easily change the look and feel by editing the CSS file.

## Getting Started

### Prerequisites

-   [Deno](https://deno.land/) (v1.34+)

### 1. Clone the Repository

```sh
git clone https://github.com/code4fukui/private-bbs.git
cd private-bbs
```

### 2. Configure the BBS

Edit the `static/settings.json` file to customize your instance:

```json
{
  "title": "PRIVATE BBS",
  "css": "style.css",
  "url": "http://localhost:8080/",
  "rooms": ["General", "Tech", "Random"]
}
```

-   `title`: The name of your bulletin board.
-   `css`: The stylesheet to use (e.g., `style.css` or `style_nurseket.css`).
-   `url`: The public URL of your service. **This must be set correctly for push notifications to work.**
-   `rooms`: An array of strings to define the available discussion rooms.

### 3. Set up Push Notifications

Generate VAPID keys required for WebPush. This command will create a `static/vapidPublicKey.txt` for the client and a `.env` file with the private key for the server.

```sh
deno run -A https://code4fukui.github.io/WebPush/init.js yourmailaddress@yourdomain
```

### 4. Run the Server

Start the application using the `deno serve` command.

```sh
deno serve --allow-import --allow-write --allow-read --allow-net --port 8080 --host "[::]" server.js
```

Now, open your browser and navigate to `http://localhost:8080`.

## How It Works

-   **Backend**: A Deno server (`server.js`) handles API requests for posting, fetching data, and managing push subscriptions.
-   **Frontend**: A vanilla JavaScript single-page application (`static/index.html`). A user's private key is generated on the first visit and stored in `localStorage`.
-   **Data Storage**: Posts are stored as individual CBOR-encoded files in the `data/` directory, organized by date (`data/YYYYMMDD/`). A `timeline.jsonl` file tracks the order of all posts for efficient retrieval of the latest content. Access logs are stored in the `log/` directory.

## API

The server exposes a simple JSON-RPC-style API to handle client actions:

-   `add`: Creates a new post, comment, or interaction (like/remove).
-   `getLatest`: Retrieves posts created after a specified timestamp.
-   `subscribe`: Registers a client for WebPush notifications.
-   `unsubscribe`: Removes a WebPush subscription.

## Reference

This project is built using several modules from [code4fukui](https://github.com/code4fukui/):
-   [WebPush](https://github.com/code4fukui/WebPush)
-   [PubkeyUser](https://github.com/code4fukui/PubkeyUser)
-   [JSONL](https://github.com/code4fukui/JSONL)
-   [TAI64N-es](https://github.com/code4fukui/TAI64N-es)

## License

MIT License