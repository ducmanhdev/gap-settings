import {defineStore} from 'pinia';
import type {
    GetKeyStorageRequest,
    GetKeyStorageResponse,
    GetTaxSettingRequest,
    GetTaxSettingResponse,
    GetTipResponse,
    UpdateKeyStorageRequest,
    UpdateTaxSettingRequest,
    UpdateTipRequest
} from "gap-nodejs-sdk";
import {posSdk, settingsSdk} from "../sdk";
import {isJsonString} from "../utils/json";

export const useSettingStore = defineStore('settingStore', {
    state: () => ({
        taxSetting: [] as GetTaxSettingResponse,
        tip: {} as GetTipResponse,
        keyStorage: {} as GetKeyStorageResponse
    }),
    actions: {
        async getTaxSetting(data?: GetTaxSettingRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.taxSetting = await posSdk.setting.getTaxSetting(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updateTaxSetting(data?: UpdateTaxSettingRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await posSdk.setting.updateTaxSetting(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getTip(data?: GetTipResponse): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.tip = await posSdk.setting.getTip(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updateTip(data?: UpdateTipRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await posSdk.setting.updateTip(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getKeyStorage(data?: GetKeyStorageRequest): Promise<GetKeyStorageResponse> {
            return new Promise(async (resolve, reject) => {
                try {
                    let response = await settingsSdk.keyStorage.getKeyStorage(data);
                    if (!response.value && response.value !== 0) {
                        throw new Error('No data!')
                    }
                    if (isJsonString(response.value)) {
                        response.value = JSON.parse(response.value);
                    }
                    this.keyStorage = response;
                    resolve(response);
                } catch (error) {
                    console.error(error)
                    reject(error);
                }
            });
        },
        async updateKeyStorage(data?: UpdateKeyStorageRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await settingsSdk.keyStorage.updateKeyStorage(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
    },
})
