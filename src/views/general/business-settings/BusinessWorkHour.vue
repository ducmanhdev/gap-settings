<template>
    <a-card class="grow">
        <h2 class="main-title mb-3">Bussiness Work Hours</h2>
        <div class="overflow-y-auto">
            <table class="simple-table text-xs sm:text-sm">
                <thead>
                <tr class="text-secondary">
                    <th class="text-left">DAY</th>
                    <th>IN TIME</th>
                    <th>OUT TIME</th>
                    <th class="text-right">ACTIVE</th>
                </tr>
                </thead>
                <tbody>
                <tr
                        v-if="workHours && workHours.length"
                        v-for="item in workHours"
                        :key="item.weekDay">
                    <td class="text-secondary font-medium text-tiny sm:text-[length:inherit]">
                        <span class="hidden sm:block">{{ item.weekDay }}</span>
                        <span class="sm:hidden">{{ (item.weekDay || '').slice(0, 3) }}</span>
                    </td>
                    <td class="text-center">
                        <a-time-picker
                                v-model:value="item.inTime"
                                use12-hours
                                format="hh:mm A"
                                :show-now="false"
                                :minute-step="15"
                        >
                            <template #suffixIcon></template>
                        </a-time-picker>
                    </td>
                    <td class="text-center">
                        <a-time-picker
                                v-model:value="item.outTime"
                                use12-hours
                                format="hh:mm A"
                                :show-now="false"
                                :minute-step="15"
                        >
                            <template #suffixIcon></template>
                        </a-time-picker>
                    </td>
                    <td class="text-right">
                        <a-switch v-model:checked="item.isActive"/>
                    </td>
                </tr>
                <tr v-else>
                    <td colspan="100%">
                        <p class="text-center">
                            No Data
                        </p>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </a-card>
    <div class="text-center mt-5">
        <a-button type="primary" @click="handleSave" :disabled="isSaveLoading">
            {{ isSaveLoading ? 'Saving...' : 'Save' }}
        </a-button>
    </div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import UploadPreview from "@/components/UploadPreview.vue";
import {useBusinessStore} from "@/stores/business";
import handleError from "@/utils/error";
import {notification} from "ant-design-vue";
import {useGoBookingStore} from "@/stores/go-booking";
import dayjs from "dayjs";

const businessInfo = ref({
    id: null,
    name: '',
    address: '',
    city: '',
    postal_code: '',
    state_code: '',
    short_name: '',
    phone: '',
    industry_id: '',
    logo_image: '',
    cover_image: '',
    description: '',
    country_code: '',
    open_time: '',
});

const businessStore = useBusinessStore();

const handleGetBusinessSiteInfo = async () => {
    const res: any = await businessStore.getBusinessSiteInfo();
    businessInfo.value.id = res?.id;
    businessInfo.value.name = res?.name;
    businessInfo.value.address = res?.address;
    businessInfo.value.city = res?.city;
    businessInfo.value.postal_code = res?.postal_code;
    businessInfo.value.state_code = res?.state_code;
    businessInfo.value.short_name = res?.short_name;
    businessInfo.value.phone = res?.phone;
    businessInfo.value.industry_id = res?.industry_id;
    businessInfo.value.logo_image = res?.logo_image;
    businessInfo.value.cover_image = res?.cover_image;
    businessInfo.value.description = res?.description;
    businessInfo.value.country_code = res?.country_code;
    businessInfo.value.open_time = res?.open_time;
};

const handleUpdateBusinessSiteInfo = async () => {
    await businessStore.updateBusinessSiteInfo(businessInfo.value as any);
};

const goBookingStore = useGoBookingStore();
const timeConvert = (min: number | string) => {
    min = Number(min)
    const hours = (min / 60);
    const formatHours = Math.floor(hours);
    const minutes = (hours - formatHours) * 60;
    const formatMinutes = Math.round(minutes);
    return dayjs(`${formatHours}:${formatMinutes}`, 'H:m');
};

interface WorkHour {
    day: number,
    weekDay: string,
    inTime: dayjs.Dayjs,
    outTime: dayjs.Dayjs,
    isActive: boolean,
}

const transformBusinessWorkHour = (): WorkHour[] => {
    const businessWorkHour = goBookingStore.businessWorkHour;
    return Array.from(Array(7)).map((item: any, index: number) => {
        const weekDay = dayjs().day(index).format('dddd');
        const weekDayShortLowercase = dayjs().day(index).format('dd').toLowerCase() as 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa';
        const timeOfDay = businessWorkHour[weekDayShortLowercase] as string;
        return {
            weekDay: weekDay,
            inTime: timeConvert(timeOfDay.split(', ')[0]),
            outTime: timeConvert(timeOfDay.split(', ')[1]),
            day: index,
            isActive: (businessWorkHour.working_day as string).includes(index as unknown as string) as boolean
        }
    })
};
const workHours = ref<WorkHour[]>([]);
const handleGetBusinessWorkHour = async () => {
    await goBookingStore.getBusinessWorkHour();
    workHours.value = transformBusinessWorkHour();
};

const handleUpdateBusinessWorkHour = async () => {
    const spreadData = workHours.value.reduce((result: any, current: WorkHour) => {
        const key = dayjs().day(current.day).format('dd').toLowerCase();
        const inTime = dayjs(current.inTime).hour() * 60 + dayjs(current.inTime).minute();
        const outTime = dayjs(current.outTime).hour() * 60 + dayjs(current.outTime).minute();
        result[key] = `${inTime}, ${outTime}`;
        return result;
    }, {});

    const workingDay = workHours.value
        .filter((item: WorkHour) => item.isActive)
        .map((item: WorkHour) => item.day)
        .join(',');

    const data = {
        type: goBookingStore.businessWorkHour.type,
        working_day: workingDay,
        is_active: goBookingStore.businessWorkHour.is_active,
        ...spreadData,
    }

    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
        formData.append(key, value as string);
    }
    await goBookingStore.updateBusinessWorkHour(data);
};

const isGetDataLoading = ref(false);
const handleGetData = async () => {
    try {
        isGetDataLoading.value = true;
        await Promise.all([
            // handleGetBusinessSiteInfo(),
            handleGetBusinessWorkHour(),
        ]);
    } catch (error) {
        handleError({error});
    } finally {
        isGetDataLoading.value = false;
    }
};
handleGetData();

const isSaveLoading = ref(false);
const handleSave = async () => {
    try {
        isSaveLoading.value = true;
        await Promise.all([
            // handleUpdateBusinessSiteInfo(),
            handleUpdateBusinessWorkHour(),
        ]);
        notification.success({
            message: 'Update success',
        });
    } catch (error) {
        handleError({error})
    } finally {
        isSaveLoading.value = false;
    }
};
</script>