import { toast, ToastContent } from "react-toastify"

export interface ToastSettingState {
  position:
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center"
  autoClose: number
  hideProgressBar: boolean
  closeOnClick: boolean
  pauseOnHover: boolean
  draggable: true
  progress: any
  theme: "light" | "dark" | "colored"
  transition: any
}

const initialSetting: ToastSettingState = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: null,
  theme: "light",
  transition: null,
}

const alert = (message: string) =>
  toast<ToastContent<ToastSettingState>>(message, initialSetting)

const info = (message: string) =>
  toast<ToastContent<ToastSettingState>>(message, {
    ...initialSetting,
    type: "info",
  })

const error = (message: string) =>
  toast<ToastContent<ToastSettingState>>(message, {
    ...initialSetting,
    type: "error",
  })

const warning = (message: string) =>
  toast<ToastContent<ToastSettingState>>(message, {
    ...initialSetting,
    type: "warning",
  })

const success = (message: string) =>
  toast<ToastContent<ToastSettingState>>(message, {
    ...initialSetting,
    type: "success",
  })
export { alert, info, error, warning, success }
