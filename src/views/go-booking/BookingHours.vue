<template>
  <div class="sm:h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <div class="sm:flex justify-between items-center space-y-2 sm:space-y-0 mb-3">
        <h2 class="main-title mb-0">Business Work Hours</h2>
        <button
          type="button"
          class="main-btn main-btn--secondary"
          @click.prevent="handleGetBusinessWorkHour(true)"
          :disabled="isSyncLoading"
        >
          Sync with business work hour
        </button>
      </div>
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
          <template v-if="workHours?.length">
            <booking-hours-tr
                    v-for="item in workHours"
                    :key="item.weekDay"
                    is="tr"
                    :item="item"
            >
            </booking-hours-tr>
          </template>
          <tr v-else>
            <td colspan="100%">No Data</td>
          </tr>
          </tbody>
        </table>
        <div class="sm:text-center mt-4 sm:mt-12">
          <a-button
            type="primary"
            @click.prevent="handleUpdateBusinessWorkHour"
            :loading="isLoading">
            Save
          </a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from "@/components/Breadcrumb.vue";
import {ref} from "vue";
import {useGoBookingStore} from "@/stores/go-booking";
import {notification} from "ant-design-vue";
import dayjs from "dayjs";
import handleError from "@/utils/error";
import BookingHoursTr from "./BookingHoursTr.vue";

const goBookingStore = useGoBookingStore();

const timeConvert = (min: number | string) => {
  min = Number(min)
  const hours = (min / 60);
  const formatHours = Math.floor(hours);
  const minutes = (hours - formatHours) * 60;
  const formatMinutes = Math.round(minutes);
  return dayjs(`${formatHours}:${formatMinutes}`, 'H:m');
}

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
}
const workHours = ref<WorkHour[]>([]);
const isLoading = ref(false);
const isSyncLoading = ref(false);
const handleGetBusinessWorkHour = async (isSync: boolean = false) => {
  try {
    isSync && (isSyncLoading.value = true)
    const data = isSync ? {} : {type: 'booking'};
    await goBookingStore.getBusinessWorkHour();
    workHours.value = transformBusinessWorkHour();
    if (isSync) {
      notification.success({
        message: 'Success',
        description: 'Sync business work hour success',
      });
    }
  } catch (error) {
    console.error(error);
    const description = isSync ? 'Sync business work hour failed' : 'Get business work hour failed';
    notification.error({
      message: 'Error',
      description,
    });
  } finally {
    isSyncLoading.value = false
  }
};
handleGetBusinessWorkHour();

const handleUpdateBusinessWorkHour = async () => {
  try {
    isLoading.value = true;
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
    notification.success({
      message: 'Success',
      description: 'Update business work hour success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    await handleGetBusinessWorkHour();
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
:deep {
  .ant-picker {
    text-align: center;
    font-weight: 600;
    width: 146px;
    font-size: inherit;
    @media (max-width: 640px) {
      font-weight: 500;
      padding: 4px 6px;
      width: auto;
    }
  }

  .ant-picker-input > input {
    font-size: inherit;
  }
}
</style>
