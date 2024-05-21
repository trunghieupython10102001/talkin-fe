import { COOKIES_STORAGE_KEY, ENOTIFY_TYPE } from "@/constants";
import { store } from "@/store";
import { authActions } from "@/store/authSlice";
import { notify } from "@/store/thunks/notify";
import { parseParams } from "@/utils";
import axios, { AxiosRequestConfig } from "axios";

import Cookies from "js-cookie";

class Request {
  instance;
  constructor() {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_BE_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    instance.interceptors.request.use(
      async (config: any) => {
        const accessToken = Cookies.get(COOKIES_STORAGE_KEY.ACCESS_TOKEN);
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (error?.response?.status === 401) {
          store.dispatch(authActions.logoutAction());
          store.dispatch(
            notify({
              text: error?.response?.data?.message,
              type: ENOTIFY_TYPE.ERROR,
            })
          );
        }
        return Promise.reject(error);
      }
    );

    this.instance = instance;
  }

  get = (url: string, params?: object, paramsSerializer?: boolean) => {
    return this.instance.get(url, {
      params,
      paramsSerializer: (params) => (paramsSerializer ? parseParams(params) : ""),
    });
  };

  post = (url: string, data?: object, config?: AxiosRequestConfig) => {
    return this.instance.post(url, data, config);
  };

  put = (url: string, data?: object, config?: AxiosRequestConfig) => {
    return this.instance.put(url, data, config);
  };

  patch = (url: string, data: object, config?: AxiosRequestConfig) => {
    return this.instance.patch(url, data, config);
  };

  delete = (url: string, data?: object) => {
    return this.instance.delete(url, { data });
  };
}

const request = new Request();

export default request;
