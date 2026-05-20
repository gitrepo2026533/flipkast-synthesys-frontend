import { toast } from "react-toastify";
import { logout } from "./actions/authActions";

const options = {
  interceptors: {
    request: [
      ({ getState }: any, config: any) => {
        const store = getState();
        const token = store?.auth?.tokens?.access;
        if (token) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = token ? `Bearer ${token}` : null;
        }
        return config;
      },
    ],
    response: [
      {
        success: function (_props: any, response: any) {
          return response;
        },
        error: function ({ dispatch }: any, error: any) {
          if ([401, 403].includes(error.response.status)) {
            dispatch(logout());
            toast.warn("Session expired! Please re-login.");

            return;
          }

          return Promise.reject(error);
        },
      },
    ],
  },
};

export default options;
