import {defineStore} from 'pinia';
import {posSdk} from "../sdk";
import type {
    GetPosTicketTemplateResponse,
    GetPosTicketTemplateRequest,
    GetPosTicketInfoRequest,
    GetPosTicketListRequest,
    GetPosTicketListBlockNameRequest,
    CreatePosTicketTemplateRequest,
    DeletePosTicketTemplateRequest,
    UpdatePosTicketTemplateRequest,
    MovePosSubjectRequest,
    SetPosDefaultTicketTemplateRequest,
    SortPosPriorityRequest,
    GetPosTicketInfoResponse,
    GetPosTicketListResponse,
    GetPosTicketListBlockNameResponse
} from "gap-nodejs-sdk";

export const useGoPosStore = defineStore('posStore', {
    state: () => ({
        ticketTemplate: [] as GetPosTicketTemplateResponse,
        ticketInfo: {} as GetPosTicketInfoResponse,
        ticketList: [] as GetPosTicketListResponse,
        ticketListBlockName: [] as GetPosTicketListBlockNameResponse,
    }),
    actions: {
        async getTicketTemplate(data?: GetPosTicketTemplateRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.ticketTemplate = await posSdk.ticket.getPosTicketTemplate(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getTicketInfo(data?: GetPosTicketInfoRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.ticketInfo = await posSdk.ticket.getPosTicketInfo(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getTicketList(data?: GetPosTicketListRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.ticketInfo = await posSdk.ticket.getPosTicketList(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getTicketListBlockName(data?: GetPosTicketListBlockNameRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.ticketListBlockName = await posSdk.ticket.getPosTicketListBlockName(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async createTicketTemplate(data?: CreatePosTicketTemplateRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await posSdk.ticket.createPosTicketTemplate(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async deleteTicketTemplate(data?: DeletePosTicketTemplateRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await posSdk.ticket.deletePosTicketTemplate(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updateTicketTemplate(data?: UpdatePosTicketTemplateRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await posSdk.ticket.updatePosTicketTemplate(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async moveSubject(data?: MovePosSubjectRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await posSdk.ticket.movePosSubject(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async setDefaultTicketTemplate(data?: SetPosDefaultTicketTemplateRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await posSdk.ticket.setPosDefaultTicketTemplate(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async sortPriority(data?: SortPosPriorityRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await posSdk.ticket.sortPosPriority(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
    },
})
