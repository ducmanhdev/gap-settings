import {defineStore} from 'pinia';
import {useSettingStore} from "./setting";
import type {GetKeyStorageResponse} from "gap-nodejs-sdk";
import {notification} from "ant-design-vue";

export const usePasscodeStore = defineStore('passcodeStore', {
    state: () => ({
        isValidateLoading: false,
        validateError: null,
        isVisible: false,
        onConfirmSuccess: null as any,
        onConfirmFailed: null as any,
    }),
    actions: {
        show() {
            return new Promise((resolve, reject) => {
                this.isVisible = true;
                this.onConfirmSuccess = resolve;
                this.onConfirmFailed = reject;
            })
        },
        hide() {
            this.isVisible = false;
            this.onConfirmSuccess = null;
            this.onConfirmFailed = null;
        },
        async validate(passcode: string) {
            try {
                this.isValidateLoading = true;
                const settingStore = useSettingStore();
                const response: GetKeyStorageResponse = await settingStore.getKeyStorage({
                    key: "config.passcode",
                });
                if (passcode && passcode === response.value!.toString()) {
                    this.onConfirmSuccess();
                } else {
                    notification.error({
                        message: 'Error',
                        description: 'Passcode not match!'
                    });
                    this.onConfirmFailed();
                }
                this.hide();
            } catch (error: any) {
                this.validateError = error.message;
            } finally {
                this.isValidateLoading = false;
            }
        }
    }
})
