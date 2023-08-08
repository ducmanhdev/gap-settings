import {defineStore} from 'pinia';
import type {
    GetServiceFeeResponse,
    GetServiceFeeRequest,
    UpdateServiceFeeRequest,
    GetCheckInTicketInfoRequest,
    GetCheckInTicketTemplateRequest,
    GetCheckInTicketListRequest,
    MoveCheckInSubjectRequest,
    SetCheckInDefaultTicketTemplateRequest,
    GetCheckInTicketListBlockNameRequest,
    DeleteCheckInTicketTemplateRequest,
    CreateCheckInTicketTemplateRequest,
    UpdateCheckInTicketTemplateRequest,
    SortCheckInPriorityRequest,
    GetCheckInTicketInfoResponse,
    GetCheckInTicketTemplateResponse,
    GetCheckInTicketListResponse,
    GetCheckInTicketListBlockNameResponse,
    GetGeneralConfigRequest,
    UpdateGeneralConfigRequest,
    GetGeneralConfigResponse,
    GetCheckOutConfigRequest,
    UpdateCheckOutConfigRequest,
    GetCheckOutConfigResponse,
    GetStoreRatingDisplayRequest,
    GetStoreRatingDisplayResponse, UpdateStoreRatingDisplayRequest
} from "gap-nodejs-sdk";
import {goCheckInSdk} from "@/sdk";

export const useGoCheckInStore = defineStore('goCheckInStore', {
    state: () => ({
        serviceFee: {} as GetServiceFeeResponse,
        ticketTemplate: [] as GetCheckInTicketTemplateResponse,
        ticketInfo: {} as GetCheckInTicketInfoResponse,
        ticketList: [] as GetCheckInTicketListResponse,
        ticketListBlockName: [] as GetCheckInTicketListBlockNameResponse,
        generalConfig: {} as GetGeneralConfigResponse,
        checkOutConfig: {} as GetCheckOutConfigResponse,
        storeRatingDisplay: {} as GetStoreRatingDisplayResponse
    }),
    actions: {
        async getServiceFee(data?: GetServiceFeeRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.serviceFee = await goCheckInSdk.settings.getServiceFee(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updateServiceFee(data?: UpdateServiceFeeRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.settings.updateServiceFee(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getTicketTemplate(data?: GetCheckInTicketTemplateRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.ticketTemplate = await goCheckInSdk.ticket.getCheckInTicketTemplate(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getTicketInfo(data?: GetCheckInTicketInfoRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.ticketInfo = await goCheckInSdk.ticket.getCheckInTicketInfo(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getTicketList(data?: GetCheckInTicketListRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.ticketInfo = await goCheckInSdk.ticket.getCheckInTicketList(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getTicketListBlockName(data?: GetCheckInTicketListBlockNameRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.ticketListBlockName = await goCheckInSdk.ticket.getCheckInTicketListBlockName(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async createTicketTemplate(data?: CreateCheckInTicketTemplateRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.ticket.createCheckInTicketTemplate(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async deleteTicketTemplate(data?: DeleteCheckInTicketTemplateRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.ticket.deleteCheckInTicketTemplate(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updateTicketTemplate(data?: UpdateCheckInTicketTemplateRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.ticket.updateCheckInTicketTemplate(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async moveSubject(data?: MoveCheckInSubjectRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.ticket.moveCheckInSubject(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async setDefaultTicketTemplate(data?: SetCheckInDefaultTicketTemplateRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.ticket.setCheckInDefaultTicketTemplate(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async sortPriority(data?: SortCheckInPriorityRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.ticket.sortCheckInPriority(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getGeneralConfig(data?: GetGeneralConfigRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.generalConfig = await goCheckInSdk.settings.getGeneralConfig(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updateGeneralConfig(data?: UpdateGeneralConfigRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.settings.updateGeneralConfig(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getCheckOutConfig(data?: GetCheckOutConfigRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.checkOutConfig = await goCheckInSdk.settings.getCheckOutConfig(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updateCheckOutConfig(data?: UpdateCheckOutConfigRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.settings.updateCheckOutConfig(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getStoreRatingDisplay(data?: GetStoreRatingDisplayRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.storeRatingDisplay = await goCheckInSdk.settings.getStoreRatingDisplay(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updateStoreRatingDisplay(data?: UpdateStoreRatingDisplayRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.settings.updateStoreRatingDisplay(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
    },
})
