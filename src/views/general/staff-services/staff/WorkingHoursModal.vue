<template>
    <a-modal v-model:visible="isVisible"
             title="Edit Working Hour"
             :width="900"
             centered
             :footer="false"
    >
        <div class="flex justify-end mb-3">
            <button
                    type="button"
                    class="main-btn main-btn--secondary"
                    @click.prevent="handleSetDefaultStaffWorkHour"
                    :disabled="isSetDefaultStaffWorkHourLoading"
            >
                Set working hours default
            </button>
        </div>
        <div class="overflow-y-auto">
            <table class="simple-table">
                <thead>
                <tr class="text-secondary">
                    <th class="text-left">DAY</th>
                    <th class="text-center">IN TIME</th>
                    <th class="text-center">OUT TIME</th>
                    <th class="text-right">ACTIVE</th>
                </tr>
                </thead>
                <tbody>
                <template v-if="workHours?.length">
                    <working-hours-modal-tr
                        v-for="item in workHours"
                        :key="item.weekDay"
                        is="tr"
                        :item="item">
                    </working-hours-modal-tr>
                </template>
                <tr v-else>
                    <td colspan="100%">
                        <a-empty></a-empty>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="flex justify-center space-x-3 text-center mt-4">
                <a-button
                        type="primary"
                        @click.prevent="handleUpdateStaffWorkHour"
                        :loading="isUpdateStaffWorkHourLoading">
                    Save
                </a-button>
                <a-button
                        type="ghost"
                        danger
                        @click.prevent="hide"
                >
                    Cancel
                </a-button>
            </div>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {notification} from "ant-design-vue";
import {useGeneralStore} from "@/stores/general";
import {useGoBookingStore} from "@/stores/go-booking";
import dayjs from "dayjs";
import type {GetBusinessWorkHourResponse} from "gap-nodejs-sdk";
import handleError from "@/utils/error";
import WorkingHoursModalTr from "./WorkingHoursModalTr.vue";

const generalStore = useGeneralStore();
const {updateStaffWorkHour} = generalStore;

const emits = defineEmits(['getStaffWorkHour']);

interface WorkHour {
    day: number,
    weekDay: string,
    inTime: string,
    outTime: string,
    isActive: boolean,
}

const isVisible = ref(false);

const workHours = ref<WorkHour[]>([]);
const staffId = ref<null | number>(null);

interface ShowData {
    workHours: WorkHour[],
    staffId: number,
}

const show = (data: ShowData) => {
    workHours.value = data.workHours;
    staffId.value = data.staffId;
    isVisible.value = true;
};

const hide = () => {
    isVisible.value = false;
};

const isUpdateStaffWorkHourLoading = ref(false);
const handleUpdateStaffWorkHour = async () => {
    try {
        isUpdateStaffWorkHourLoading.value = true;
        const spreadData = workHours.value.reduce((result: any, current: WorkHour) => {
            const key = dayjs().day(current.day).format('dd').toLowerCase();
            const inTime = dayjs(current.inTime, 'hh:mm A').hour() * 60 + dayjs(current.inTime, 'hh:mm A').minute();
            const outTime = dayjs(current.outTime, 'hh:mm A').hour() * 60 + dayjs(current.outTime, 'hh:mm A').minute();
            result[key] = `${inTime}, ${outTime}`;
            return result;
        }, {});

        const workingDay = workHours.value
            .filter((item: WorkHour) => item.isActive)
            .map((item: WorkHour) => item.day)
            .join(',');

        const data = {
            id: staffId.value,
            working_day: workingDay,
            ...spreadData,
        }
        await updateStaffWorkHour(data);
        notification.success({
            message: 'Success',
            description: 'Update staff work hour success',
        });
        hide();
        emits('getStaffWorkHour');
    } catch (error) {
        handleError({
            error: error
        })
    } finally {
        isUpdateStaffWorkHourLoading.value = false;
    }
};

const goBookingStore = useGoBookingStore();
const {getBusinessWorkHour} = goBookingStore;

const timeConvert = (min: number | string) => {
    min = Number(min)
    const hours = (min / 60);
    const formatHours = Math.floor(hours);
    const minutes = (hours - formatHours) * 60;
    const formatMinutes = Math.round(minutes);
    return dayjs(`${formatHours}:${formatMinutes}`, 'H:m').format('hh:mm A');
}

const transformBusinessWorkHour = (data: GetBusinessWorkHourResponse): WorkHour[] => {
    const staffWorkHour = data;
    return Array.from(Array(7)).map((item: any, index: number) => {
        const weekDay = dayjs().day(index).format('dddd');
        const weekDayShortLowercase = dayjs().day(index).format('dd').toLowerCase() as 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa';
        const timeOfDay = staffWorkHour[weekDayShortLowercase] as string;
        return {
            weekDay: weekDay,
            inTime: timeConvert(timeOfDay.split(', ')[0]),
            outTime: timeConvert(timeOfDay.split(', ')[1]),
            day: index,
            isActive: (staffWorkHour.working_day as string).includes(index as unknown as string) as boolean
        }
    })
}

const isSetDefaultStaffWorkHourLoading = ref(false);
const handleSetDefaultStaffWorkHour = async () => {
    try {
        isSetDefaultStaffWorkHourLoading.value = true;
        await getBusinessWorkHour({
            type: 'booking'
        })
        workHours.value = transformBusinessWorkHour(goBookingStore.businessWorkHour);
    } catch (error) {
        handleError({
            error: error
        })
    } finally {
        isSetDefaultStaffWorkHourLoading.value = false;
    }
}
defineExpose({
    show,
    hide
})
</script>

<style scoped>

</style>
