const WebPush = {};

WebPush.getID = () => {
  const uuid = localStorage.getItem("subscription");
  if (uuid) {
    return uuid;
  }
  return null; // WebPush.subscribe();
};
WebPush.subscribe = async (u) => {
  return new Promise((resolve, reject) => {
    if (!window.PushManager) {
      reject("not supported WebPush");
      return;
    }
    //localStorage.removeItem("subscription")
    const uuid = WebPush.getID();
    console.log("WebPush uuid", uuid);
    if (uuid) {
      resolve(uuid);
      return;
    }
    Notification.requestPermission(async permission => {
      console.log(permission); // 'default', 'granted', 'denied'
      if (permission !== "granted") {
        reject("not granted");
        return;
      }
      //const vapidPublicKey = new Uint8Array(await (await fetch("./vapidPublicKey.bin")).arrayBuffer());
      const vapidPublicKeyTxt = await (await fetch("./vapidPublicKey.txt")).text();
      const vapidPublicKey = WebPush.base64ToUint8Array(vapidPublicKeyTxt);
      const registration = await navigator.serviceWorker.register("./WebPushWorker.js", { scope: "/" });
      console.log(registration, vapidPublicKey);
      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });
      console.log("subscription", subscription);
      const ss2 = JSON.parse(JSON.stringify(subscription));
      const res = await u.fetch("subscribe", ss2);
      console.log(res);
      localStorage.setItem("subscription", res.uuid);
      resolve(res.uuid);
    });
  });
};
WebPush.unsubscribe = async (u) => {
  localStorage.removeItem("subscription");
  return new Promise((resolve, reject) => {
    if (!window.PushManager) {
      reject("not supported WebPush");
      return;
    }
    Notification.requestPermission(async permission => {
      console.log(permission); // 'default', 'granted', 'denied'
      if (permission !== "granted") {
        reject("not granted");
        return;
      }

      //const vapidPublicKey = new Uint8Array(await (await fetch("./vapidPublicKey.bin")).arrayBuffer());
      const vapidPublicKeyTxt = await (await fetch("./vapidPublicKey.txt")).text();
      const vapidPublicKey = WebPush.base64ToUint8Array(vapidPublicKeyTxt);
      const registration = await navigator.serviceWorker.register("./WebPushWorker.js", { scope: "/" });
      console.log(registration, vapidPublicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });
      const res = await subscription.unsubscribe();
      console.log(res);
      const uuid = WebPush.getID();
      if (uuid) {
        await u.fetch("unsubscribe", { uuid });
      }
      resolve(uuid);
    });
  });
}
WebPush.base64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  //const rawData = new Buffer(base64, "base64").toString("ascii");
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
WebPush.push = async (u, data) => {
  const uuid = WebPush.getID();
  if (!uuid) {
    return { err: "no subscription"}
  }
  return await u.fetch("push", { uuid, data });
};

export { WebPush };