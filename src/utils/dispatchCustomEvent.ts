export default function dispatchCustomEvent(eventName: string, data?: object) {
  const pushChangeEvent = new CustomEvent(eventName, {
    detail: {
      data,
    },
  });

  window.dispatchEvent(pushChangeEvent);
}
