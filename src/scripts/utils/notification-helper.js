import CONFIG from "../config";
import { convertBase64ToUint8Array } from "./index";
import {
  subscribePushNotification,
  unsubscribePushNotification,
} from "../data/api";
export function isNotificationAvailable() {
  return "Notification" in window;
}

export function isNotificationGranted() {
  return Notification.permission === "granted";
}
export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
  };
}

export async function subscribe() {
  /* ...kode lainnya disembunyikan... */

  console.log("Mulai berlangganan push notification...");

  const failureSubscribeMessage =
    "Langganan push notification gagal diaktifkan.";
  const successSubscribeMessage =
    "Langganan push notification berhasil diaktifkan.";
  let pushSubscription;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    pushSubscription = await registration.pushManager.subscribe(
      generateSubscribeOptions()
    );

    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await subscribePushNotification({ endpoint, keys });
    if (!response.ok) {
      console.error("subscribe: response:", response);
      alert(failureSubscribeMessage);
      // Undo subscribe to push notification
      await pushSubscription.unsubscribe();
      return;
    }

    alert(successSubscribeMessage);
  } catch (error) {
    console.error("subscribe: error:", error);
    alert(failureSubscribeMessage);
  }
}
export async function unSubscribe() {
  /* ...kode lainnya disembunyikan... */

  console.log("Mulai membatalkan push notification...");

  const failureSubscribeMessage =
    "membatalkan push notification gagal diaktifkan.";
  const successSubscribeMessage =
    "membatalkan push notification berhasil diaktifkan.";
  let pushSubscription;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    pushSubscription = await registration.pushManager.subscribe(
      generateSubscribeOptions()
    );

    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await unsubscribePushNotification({ endpoint, keys });
    if (!response.ok) {
      console.error("subscribe: response:", response);
      alert(failureSubscribeMessage);
      // Undo subscribe to push notification
      await pushSubscription.unsubscribe();
      return;
    }

    alert(successSubscribeMessage);
  } catch (error) {
    console.error("subscribe: error:", error);
    alert(failureSubscribeMessage);
  }
}
export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error("Notification API unsupported.");
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === "denied") {
    alert("Izin notifikasi ditolak.");
    return false;
  }

  if (status === "default") {
    alert("Izin notifikasi ditutup atau diabaikan.");
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return await registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

// export async function subscribe() {
//   if (!(await requestNotificationPermission())) {
//     return;
//   }
//   console.log("test");

//   if (await isCurrentPushSubscriptionAvailable()) {
//     alert("Sudah berlangganan push notification.");
//     return;
//   }
//   console.log("test2");
//   console.log("Mulai berlangganan push notification...");
// }
