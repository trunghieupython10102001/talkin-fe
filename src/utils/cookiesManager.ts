import jsCookie from 'js-cookie';

const USER_COOKIE = 'stream-call.user';
const DEVICES_COOKIE = 'stream-call.devices';

export function getUser(): { displayName: string } {
  const userInfo = jsCookie.get(USER_COOKIE);

  if (!userInfo) {
    return { displayName: '' };
  }

  return JSON.parse(userInfo);
}

export function setUser({ displayName }: { displayName: string }) {
  jsCookie.set(USER_COOKIE, JSON.stringify({ displayName }));
}

export function getDevices(): { webcamEnabled: boolean } | null {
  const deviceInfo = jsCookie.get(DEVICES_COOKIE);

  if (!deviceInfo) {
    return null;
  }

  return JSON.parse(deviceInfo);
}

export function setDevices({ webcamEnabled }: { webcamEnabled: boolean }) {
  jsCookie.set(DEVICES_COOKIE, JSON.stringify({ webcamEnabled }));
}
