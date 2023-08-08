<template>
  <div class="">
    <div class="sm:text-right">
      <button type="button" class="main-btn main-btn--primary" @click.prevent="handleOpenUpdateStaffWorkHour">Edit
      </button>
    </div>
    <div class="mt-2">
      <div class="grid grid-cols-[1rem_1fr_1fr_1fr] items-center gap-3 font-semibold p-2">
        <div></div>
        <div></div>
        <div>IN</div>
        <div>OUT</div>
      </div>
      <div class="space-y-3.5 mt-1 text-xs sm:text-sm">
        <base-loading v-if="isGetStaffWorkHourLoading"></base-loading>
        <template v-else-if="workHours && workHours.length" v-for="item in workHours" :key="item">
          <div
            :class="{'text-C90': !item.isActive}"
            class="transition hover:border-primary grid grid-cols-[1rem_1fr_1fr_1fr] items-center gap-3 p-2 bg-white text-black border rounded">
            <div>
              <svg v-if="item.isActive" width="16" height="16" viewBox="0 0 16 16" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="#279D3A" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.99984 14.9999C11.8657 14.9999 14.9997 11.866 14.9997 8.00008C14.9997 4.13418 11.8657 1.00024 7.99984 1.00024C4.13393 1.00024 1 4.13418 1 8.00008C1 11.866 4.13393 14.9999 7.99984 14.9999Z"
                  stroke="#EB5757" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.1003 5.90015L5.90039 10.1" stroke="#EB5757" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round"/>
                <path d="M5.90039 5.90015L10.1003 10.1" stroke="#EB5757" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <span class="hidden sm:block">{{ item.weekDay }}</span>
              <span class="sm:hidden">{{ (item.weekDay || '').slice(0, 3) }}</span>
            </div>
            <div>{{ item.inTime }}</div>
            <div>{{ item.outTime }}</div>
          </div>
        </template>
        <a-empty v-else></a-empty>
      </div>
    </div>
  </div>
  <working-hours-modal
    ref="workHoursModalRef"
    @get-staff-work-hour="handleGetStaffWorkHour">
  </working-hours-modal>
</template>

<script setup lang="ts">
import {useGeneralStore} from "@/stores/general";
import {ref, watch} from "vue";
import dayjs from "dayjs";
import WorkingHoursModal from "./WorkingHoursModal.vue"
import BaseLoading from "@/components/BaseLoading.vue"
import handleError from "@/utils/error";

const generalStore = useGeneralStore();
const {getStaffWorkHour, updateStaffWorkHour} = generalStore;

interface Props {
  staffId: number,
}

const props = defineProps<Props>();

const timeConvert = (min: number | string) => {
  min = Number(min)
  const hours = (min / 60);
  const formatHours = Math.floor(hours);
  const minutes = (hours - formatHours) * 60;
  const formatMinutes = Math.round(minutes);
  return dayjs(`${formatHours}:${formatMinutes}`, 'H:m').format('hh:mm A');
}

interface WorkHour {
  day: number,
  weekDay: string,
  inTime: string,
  outTime: string,
  isActive: boolean,
}

const transformBusinessWorkHour = (): WorkHour[] => {
  const staffWorkHour = generalStore.staffWorkHour;
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
const workHours = ref<WorkHour[]>([]);
const isGetStaffWorkHourLoading = ref(false);
const handleGetStaffWorkHour = async () => {
  try {
    isGetStaffWorkHourLoading.value = true;
    await getStaffWorkHour({
      id: props.staffId
    });
    workHours.value = transformBusinessWorkHour();
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetStaffWorkHourLoading.value = false;
  }
};
watch(() => props.staffId, handleGetStaffWorkHour, {immediate: true});

const workHoursModalRef = ref<InstanceType<typeof WorkingHoursModal> | null>(null);
const handleOpenUpdateStaffWorkHour = () => {
  workHoursModalRef.value?.show({
    workHours: workHours.value,
    staffId: props.staffId
  });
}
</script>

<style scoped>

</style>
