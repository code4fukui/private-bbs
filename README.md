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
