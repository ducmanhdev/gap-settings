<template>
    <div class="flex flex-col">
        <breadcrumb class="shrink-0"></breadcrumb>
        <div class="grow space-y-5">
            <a-card>
                <a-form layout="vertical" :model="businessInfo">
                    <div class="grid grid-cols-2 gap-x-[44px] gap-y-3">
                        <div class="">
                            <a-form-item>
                                <h2 class="main-title mb-0">Basic Information</h2>
                            </a-form-item>
                            <a-form-item label="Name">
                                <a-input v-model:value="businessInfo.name" readonly/>
                            </a-form-item>
                            <a-form-item label="Short Name">
                                <a-input v-model:value="businessInfo.short_name" readonly/>
                            </a-form-item>
                            <a-form-item label="Phone">
                                <a-input v-model:value="businessInfo.phone" readonly/>
                            </a-form-item>
                            <a-form-item label="Address">
                                <a-input v-model:value="businessInfo.address" readonly/>
                            </a-form-item>
                            <a-form-item label="City">
                                <a-input v-model:value="businessInfo.city"/>
                            </a-form-item>
                            <a-form-item label="Country Code">
                                <a-input v-model:value="businessInfo.country_code"/>
                            </a-form-item>
                            <div class="grid grid-cols-2 gap-[26px]">
                                <a-form-item label="State Code">
                                    <a-input v-model:value="businessInfo.state_code"/>
                                </a-form-item>
                                <a-form-item label="Postal Code">
                                    <a-input v-model:value="businessInfo.postal_code"/>
                                </a-form-item>
                            </div>
                            <a-form-item label="Logo Image">
                                <upload-preview v-model="businessInfo.logo_image"></upload-preview>
                            </a-form-item>
                        </div>
                        <div class="">
                            <a-form-item>
                                <h2 class="main-title mb-0">Business Details</h2>
                            </a-form-item>
                            <a-form-item label="Open Time">
                                <a-textarea v-model:value="businessInfo.open_time"/>
                            </a-form-item>
                            <a-form-item label="Industry ID">
                                <a-input v-model:value="businessInfo.industry_id"/>
                            </a-form-item>
                            <a-form-item label="Description">
                                <a-textarea v-model:value="businessInfo.description"/>
                            </a-form-item>
                            <a-form-item label="Cover Image">
                                <upload-preview v-model="businessInfo.cover_image"></upload-preview>
                            </a-form-item>
                        </div>
                    </div>
                </a-form>
            </a-card>
            <div class="text-center">
                <a-button type="primary" @click="handleSave" :disabled="isSaveLoading">
                    {{ isSaveLoading ? 'Saving...' : 'Save' }}
                </a-button>
            </div>
        </div>
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
    businessInfo.value.industry_id = res?.industry_id || "";
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
            handleGetBusinessSiteInfo(),
            // handleGetBusinessWorkHour(),
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
        await handleUpdateBusinessSiteInfo(),
            // handleUpdateBusinessWorkHour(),

        notification.success({
            message: 'Update success',
        });
    } catch (error) {
        console.error(error);
        
        handleError({error})
    } finally {
        isSaveLoading.value = false;
    }
};
</script>

<style lang="scss" scoped>
:deep {
  .ant-form-item-label {
    > label {
      color: var(--color-secondary);
    }
  }
}

textarea.ant-input {
  min-height: 192px;
  resize: none;
}
</style>
