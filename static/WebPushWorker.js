self.addEventListener("push", e => {
  const payload = e.data.json();
  console.log("push event", e, payload);
  const timeout = payload.timeout;
  const options = { ...payload, data: payload.data || {} };
  options.data.id = Date.now();
  delete options.delay;
  delete options.timeout;
  const show = async () => {
    const notification = await self.registration.showNotification(payload.title, options);
    if (timeout) {
      setTimeout(async () => {
        const notifications = await self.registration.getNotifications();
        for (const item of notifications) {
          if (item.data?.id === options.data.id) item.close();
        }
      }, timeout);
    }
  };
  if (payload.delay) {
    e.waitUntil(new Promise(resolve => setTimeout(resolve, payload.delay)).then(show));
  } else {
    e.waitUntil(show());
  }
});
self.addEventListener("notificationclick", e => {
  const target = e.notification.data?.url;
  e.notification.close();
  if (!target) return;
  e.waitUntil((async () => {
    const targetURL = new URL(target, self.location.origin);
    if (targetURL.origin !== self.location.origin) return;
    const windows = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of windows) {
      if (new URL(client.url).origin === targetURL.origin) {
        if (client.url !== targetURL.href && "navigate" in client) {
          await client.navigate(targetURL.href);
        }
        await client.focus();
        return;
      }
    }
    await clients.openWindow(targetURL.href);
  })());
});
