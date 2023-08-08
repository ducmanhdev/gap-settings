import {defineStore} from 'pinia';
import type {
    AddListServiceByStaffRequest,
    CreateCheckInCategoryRequest,
    CreateCheckInServiceRequest,
    CreateComboRequest,
    CreatePosProductRequest,
    CreateStaffRequest,
    DataWithMetaResponse,
    DeleteCheckInCategoryRequest,
    DeleteCheckInServiceRequest,
    DeleteComboRequest,
    DeleteListServiceByStaffRequest,
    DeletePosProductRequest,
    DeleteStaffRequest,
    GetCheckInListByCategoryRequest,
    GetCheckInListByCategoryResponse,
    GetCheckInListCategoryRequest,
    GetCheckInListCategoryResponse,
    GetCheckInListServiceRequest,
    GetCheckInListServiceResponse,
    GetComboSiteListRequest,
    GetComboSiteListResponse,
    GetListCommissionByStaffRequest, GetListCommissionByStaffResponse,
    GetListPermissionRequest,
    GetListPermissionResponse,
    GetListServiceByStaffRequest, GetListServiceByStaffResponse,
    GetListStaffRequest,
    GetListStaffResponse,
    GetPoliciesRequest,
    GetPoliciesResponse,
    GetPosListProductRequest,
    GetPosListProductResponse,
    GetSMSHistoryRequest,
    GetSMSHistoryResponse,
    GetSMSRemainRequest,
    GetSMSRemainResponse,
    GetStaffWorkHourRequest,
    GetStaffWorkHourResponse, SaveCommissionRequest,
    ShortCheckInCategoryRequest,
    ShortCheckInServiceRequest,
    SortComboRequest,
    SortPostListProductRequest,
    SortStaffRequest,
    UpdateCheckInCategoryRequest,
    UpdateCheckInServiceRequest,
    UpdateComboRequest,
    UpdatePoliciesRequest,
    UpdatePosProductRequest, UpdateRoleAppointmentRequest, UpdateStaffCommissionRequest,
    UpdateStaffRequest,
    UpdateStaffWorkHourRequest,
    UploadFileRequest
} from "gap-nodejs-sdk";
import {goCheckInSdk, posSdk} from "@/sdk";

export const useGeneralStore = defineStore('generalStore', {
    state: () => ({
        listCategory: [] as GetCheckInListCategoryResponse,
        listByCategory: {} as DataWithMetaResponse<GetCheckInListByCategoryResponse>,
        listService: [] as GetCheckInListServiceResponse,
        listProduct: [] as GetPosListProductResponse,
        listCombo: {} as DataWithMetaResponse<GetComboSiteListResponse>,
        smsRemain: {} as GetSMSRemainResponse,
        smsHistory: {} as GetSMSHistoryResponse,
        policies: [] as GetPoliciesResponse,
        listStaff: {} as DataWithMetaResponse<GetListStaffResponse>,
        staffWorkHour: {} as GetStaffWorkHourResponse,
        listPermission: [] as GetListPermissionResponse,
        listCommission: {} as GetListCommissionByStaffResponse,
        listServiceByStaff: [] as GetListServiceByStaffResponse
    }),
    actions: {
        async getListCategory(data?: GetCheckInListCategoryRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.listCategory = await goCheckInSdk.category.getCheckInListCategory(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async sortCategory(data?: ShortCheckInCategoryRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.category.sortCheckInCategory(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async createCategory(data?: CreateCheckInCategoryRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.category.createCheckInCategory(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updateCategory(data?: UpdateCheckInCategoryRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.category.updateCheckInCategory(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async deleteCategory(data?: DeleteCheckInCategoryRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.category.deleteCheckInCategory(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getListByCategory(data?: GetCheckInListByCategoryRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.listByCategory = await goCheckInSdk.service.getCheckInListByCategory(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getListService(data?: GetCheckInListServiceRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.listService = await goCheckInSdk.service.getCheckInListService(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async sortService(data?: ShortCheckInServiceRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.service.sortCheckInService(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async createService(data?: CreateCheckInServiceRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.service.createCheckInService(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updateService(data?: UpdateCheckInServiceRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.service.updateCheckInService(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async deleteService(data?: DeleteCheckInServiceRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.service.deleteCheckInService(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async uploadFile(data?: UploadFileRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await posSdk.service.uploadFile(data);
                    resolve(response);
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getListProduct(data?: GetPosListProductRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.listProduct = await posSdk.product.getPosListProduct(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async createProduct(data?: CreatePosProductRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await posSdk.product.createPosProduct(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updateProduct(data?: UpdatePosProductRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await posSdk.product.updatePosProduct(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async deleteProduct(data?: DeletePosProductRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await posSdk.product.deletePosProduct(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async sortProduct(data?: SortPostListProductRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await posSdk.product.sortPostListProduct(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getComboSiteList(data?: GetComboSiteListRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.listCombo = await posSdk.combo.getComboSiteList(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async createCombo(data?: CreateComboRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await posSdk.combo.createCombo(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updateCombo(data?: UpdateComboRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await posSdk.combo.updateCombo(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async deleteCombo(data?: DeleteComboRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await posSdk.combo.deleteCombo(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async sortCombo(data?: SortComboRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await posSdk.combo.sortCombo(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getSMSRemain(data?: GetSMSRemainRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.smsRemain = await goCheckInSdk.sms.getSMSRemain(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getSMSHistory(data?: GetSMSHistoryRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.smsHistory = await goCheckInSdk.sms.getSMSHistory(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getPolicies(data?: GetPoliciesRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.policies = await goCheckInSdk.settings.getPolicies(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updatePolicies(data?: UpdatePoliciesRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.settings.updatePolicies(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getListStaff(data?: GetListStaffRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.listStaff = await goCheckInSdk.staff.getListStaff(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async createStaff(data?: CreateStaffRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.staff.createStaff(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updateStaff(data?: UpdateStaffRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.staff.updateStaff(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async deleteStaff(data?: DeleteStaffRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.staff.deleteStaff(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async sortStaff(data?: SortStaffRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.staff.sortStaff(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getStaffWorkHour(data?: GetStaffWorkHourRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.staffWorkHour = await goCheckInSdk.staff.getStaffWorkHour(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updateStaffWorkHour(data?: UpdateStaffWorkHourRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.staff.updateStaffWorkHour(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getListServiceByStaff(data?: GetListServiceByStaffRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.listServiceByStaff = await goCheckInSdk.staff.getListServiceByStaff(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async addListServiceByStaff(data?: AddListServiceByStaffRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.staff.addListServiceByStaff(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async deleteListServiceByStaff(data?: DeleteListServiceByStaffRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.staff.deleteListServiceByStaff(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },

        async getListPermission(data?: GetListPermissionRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.listPermission = await goCheckInSdk.staff.getListPermission(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async getListCommissionByStaff(data?: GetListCommissionByStaffRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.listCommission = await posSdk.commission.getListCommissionByStaff(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async saveCommission(data?: SaveCommissionRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.staff.saveCommission(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updateStaffCommission(data?: UpdateStaffCommissionRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.staff.updateStaffCommission(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        async updateRoleAppointment(data?: UpdateRoleAppointmentRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.staff.updateRoleAppointment(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
    },
})
