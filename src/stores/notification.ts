import {defineStore} from 'pinia';
import type {GetNotifyAppointmentRequest, GetNotifySystemRequest, MaskAsReadRequest} from "gap-nodejs-sdk";
import {goCheckInSdk} from "@/sdk";

export const useNotificationStore = defineStore('notificationStore', {
    state: () => ({
        listNotifyAppointment: {} as any,
        listNotifySystem: {} as any,
    }),
    getters: {
        unreadNotificationCounter(state) {
            return (state.listNotifyAppointment?.data || []).filter((item: any) => item.is_read === 0).length + (state.listNotifySystem?.data || []).filter((item: any) => item.is_read === 0).length
        }
    },
    actions: {
        async getNotifyAppointment(data?: GetNotifyAppointmentRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.listNotifyAppointment = await goCheckInSdk.notification.getNotifyAppointment(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getNotifySystem(data?: GetNotifySystemRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.listNotifySystem = await goCheckInSdk.notification.getNotifySystem(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async maskAsRead(data?: {id: number, type: 'appointment' | 'normal'}): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.notification.maskAsRead(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
    }
})
