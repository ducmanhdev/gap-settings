<template>
    <base-loading v-if="isGetListServiceByStaffLoading"></base-loading>
    <div v-else-if="listByCategory && listByCategory.length" class="relative sm:h-full">
        <div class="sm:absolute inset-0 overflow-auto space-y-6">
            <div class="space-y-2.5 sm:space-y-4" v-for="item in listByCategory" :key="item">
                <a-checkbox
                        v-if="item.services"
                        :checked="item.services.every((sv: any) => sv.isSelected)"
                        @change="toggleItemServices(item.id)"
                        class="block w-full !p-2 rounded bg-[#EAF2FF] text-black">
                    {{ item.name }}
                </a-checkbox>
                <div class="max-w-[468px] grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                            type="button"
                            v-for="service in item.services"
                            :key="item"
                            class="main-btn px-2"
                            @click="toggleItemService([service.id])"
                            :class="[service.isSelected ? 'main-btn--secondary' : 'main-btn--outline-secondary']">
                        {{ service.name }}
                    </button>
                </div>
            </div>
        </div>
        <base-loading-overlay v-if="isToggleServicesLoading"></base-loading-overlay>
    </div>
    <a-empty v-else></a-empty>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {useGeneralStore} from "@/stores/general";
import BaseLoading from "@/components/BaseLoading.vue";
import BaseLoadingOverlay from "@/components/BaseLoadingOverlay.vue";
import handleError from "@/utils/error";

const emits = defineEmits<{
    (e: 'confirm', items: any): void
}>();

interface Props {
    staffId: number,
}

const props = defineProps<Props>()

const generalStore = useGeneralStore();
const listByCategory = ref<any[]>([]);
const {getListByCategory, addListServiceByStaff, deleteListServiceByStaff, getListServiceByStaff} = generalStore;
const handleGetListByCategory = () => {
    return new Promise(async (resolve, reject) => {
        try {
            if (listByCategory.value?.length) {
                return resolve(null);
            }
            await getListByCategory();
            listByCategory.value = generalStore.listByCategory.data
                .filter((item: any) => item.services?.length)
                .map((item: any) => ({
                    ...item,
                    services: item.services
                        .filter((sv: any) => sv.status === 1)
                        .map((sv: any) => ({
                            ...sv,
                            isSelected: false,
                        })),
                }));
            resolve(null);
        } catch (error) {
            reject();
        }
    })
}

const isToggleServicesLoading = ref(false);
const handleAddListServices = async (idArr: number[]) => {
    try {
        isToggleServicesLoading.value = true;
        await addListServiceByStaff({
            staff_id: props.staffId,
            services: idArr.join(','),
        })
        listByCategory.value = listByCategory.value.map(item => ({
            ...item,
            services: item.services.map((sv: any) => ({
                ...sv,
                isSelected: idArr.includes(sv.id) ? true : sv.isSelected,
            })),
        }))
    } catch (error) {
        handleError({
            error: error
        })
    } finally {
        isToggleServicesLoading.value = false;
    }
}
const handleDeleteListServices = async (idArr: number[]) => {
    try {
        isToggleServicesLoading.value = true;
        await deleteListServiceByStaff({
            staff_id: props.staffId,
            services: idArr.join(','),
        });
        listByCategory.value = listByCategory.value.map(item => ({
            ...item,
            services: item.services.map((sv: any) => ({
                ...sv,
                isSelected: idArr.includes(sv.id) ? false : sv.isSelected,
            })),
        }))
    } catch (error) {
        handleError({
            error: error
        })
    } finally {
        isToggleServicesLoading.value = false;
    }
}
const toggleItemService = async (idArr: number[]) => {
    const serviceList = listByCategory.value.map((item: any) => item.services).flat();
    const serviceItem = serviceList.find((service: any) => service.id === idArr[0]);
    if (!serviceItem) return;
    if (serviceItem.isSelected) {
        return handleDeleteListServices(idArr)
    }
    handleAddListServices(idArr)
}
const toggleItemServices = async (id: number) => {
    const index = listByCategory.value.findIndex(item => item.id === id);
    const servicesIdArr = listByCategory.value[index].services.map((sv: any) => sv.id);
    const isAllServicesChecked = listByCategory.value[index].services.every((sv: any) => sv.isSelected);
    if (isAllServicesChecked) {
        return handleDeleteListServices(servicesIdArr);
    }
    handleAddListServices(servicesIdArr)
}

const isGetListServiceByStaffLoading = ref(false);
const handleGetListServiceByStaff = async () => {
    try {
        isGetListServiceByStaffLoading.value = true;
        await handleGetListByCategory();
        await getListServiceByStaff({id: props.staffId});
        listByCategory.value = listByCategory.value.map((item: any) => ({
            ...item,
            services: item.services.map((sv: any) => ({
                ...sv,
                isSelected: generalStore.listServiceByStaff.some((item: any) => item.service.id === sv.id),
            })),
        }));
    } catch (error) {
        handleError({
            error: error
        })
    } finally {
        isGetListServiceByStaffLoading.value = false;
    }
}
watch(() => props.staffId, handleGetListServiceByStaff, {immediate: true})
</script>

<style lang="scss" scoped>

</style>
