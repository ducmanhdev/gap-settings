<template>
    <div>
        <p class="border-b border-#e5e5e5 pb-3 mb-0 text-lg flex items-center justify-between">
            <span>Time Off For Business:</span>
            <button
                    class="bg-[#2979FF] text-white px-2 py-2 rounded-lg mr-3 hover:shadow-lg"
                    @click="timeOffModalRef.open()"
            >
                <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-plus h-5 w-5 stroke-current"
                >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
        </p>
        <div class="overflow-x-auto pb-3">
            <div v-if="businessTimeOff?.data?.length"
                 class="min-w-[500px]"
                 :class="{'opacity-50 pointer-events-none': isGetListBusinessTimeOffLoading}">
                <time-off-staff-item
                        v-for="item in businessTimeOff.data"
                        :key="item.id"
                        :item="item"
                        @delete="handleDeleteTimeOffStaffItem(item.id)"
                        @click="timeOffModalRef.open(item)"
                />
                <paginate
                        :page-count="businessTimeOff?._meta?.pageCount"
                        :prev-text="'<'"
                        :next-text="'>'"
                        :container-class="'pagination'"
                        v-model="page"
                        :click-handler="handlePaginationClick"
                        first-last-button
                >
                </paginate>
            </div>
            <a-empty v-else></a-empty>
        </div>
        <Teleport to="body">
            <modal-time ref="timeOffModalRef" @refresh="handleGetListBusinessTimeOff"/>
        </Teleport>
    </div>
</template>
<script lang="ts" setup>
import {ref, computed} from "vue";
import ModalTime from "./ModalTime.vue";
import TimeOffStaffItem from "./TimeOffStaffItem.vue";
import {useGoBookingStore} from "@/stores/go-booking";
import handleError from "@/utils/error";
import {notification} from "ant-design-vue";

const timeOffModalRef = ref<any>(null);
const bookingStore = useGoBookingStore();

const businessTimeOff = computed(() => bookingStore.listBusinessTimeOff);
const isGetListBusinessTimeOffLoading = ref(false);
const page = ref(1);
const handleGetListBusinessTimeOff = async () => {
    try {
        isGetListBusinessTimeOffLoading.value = true;
        await bookingStore.getListBusinessTimeOff({
            page: page.value,
        });
        page.value = businessTimeOff.value._meta.currentPage;
    } catch (error: any) {
        console.error(error);
    } finally {
        isGetListBusinessTimeOffLoading.value = false;
    }
};
handleGetListBusinessTimeOff();

const isDeleteTimeOffStaffItem = ref(false);
const handleDeleteTimeOffStaffItem = async (id: number) => {
    try {
        isDeleteTimeOffStaffItem.value = true;
        await bookingStore.deleteBusinessTimeOff({id});
        await handleGetListBusinessTimeOff();
        notification.success({
            message: 'Delete success!'
        })
    } catch (error: any) {
        handleError({error});
    } finally {
        isDeleteTimeOffStaffItem.value = false;
    }
};
const handlePaginationClick = () => {
    handleGetListBusinessTimeOff();
};
</script>
<style lang="scss" scoped>
</style>
