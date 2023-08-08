<template>
  <div class="sm:h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <template #title>SMS Recharge</template>
      <div class="font-medium">
        <div class="sm:space-x-4 mb-4 sm:block sm:text-left text-right grid grid-cols-[1fr_auto] sm:gap-x-0 gap-x-4">
          <span>Remaining Balance:</span>
          <span class="text-primary text-left">${{ smsRemain?.remain_balance?.price ?? 0 }}</span>
          <span>for</span>
          <span class="text-primary text-left">{{ smsRemain?.remain_balance?.sms ?? 0 }} SMS</span>
        </div>
        <div class="sm:grid grid-cols-[80px_1fr] items-center gap-3 mb-4">
          <span class="inline-block mb-1.5 sm:mb-0">SMS Count:</span>
          <div class="sm:flex items-center font-medium sm:space-x-4 max-w-[380px]">
            <a-range-picker
              v-model:value="smsCountDateRange"
              separator="to"
              :show-time="false"
              value-format="YYYY-MM-DD"
              format="DD/MM/YYYY"
              class="custom-range-picker !mb-2.5 sm:!mb-0 w-full sm:w-auto"
            >
            </a-range-picker>
            <a-select
              v-model:value="smsCountType"
              :options="smsCountTypeOptions"
              class="w-full sm:w-[110px]">
            </a-select>
          </div>
        </div>
        <div class="sm:grid grid-cols-[80px_1fr] items-center gap-3">
          <div></div>
          <div class="divide-y max-w-[380px]">
            <div class="grid grid-cols-4 gap-3 pb-2">
              <span>Sent</span>
              <span class="text-center text-primary">{{ smsRemain?.sms_count?.send?.sms ?? 0 }} SMS</span>
              <span class="text-center">=</span>
              <span class="text-right text-primary">${{ smsRemain?.sms_count?.send?.price ?? 0 }}</span>
            </div>
            <div class="grid grid-cols-4 gap-3 pt-2">
              <span>Total</span>
              <span class="text-center text-primary"></span>
              <span class="text-center"></span>
              <span class="text-right text-primary">${{ smsRemain?.sms_count?.total ?? 0 }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:mt-10">
        <div class="flex justify-between items-center space-x-3">
          <div class="font-medium">Reload History</div>
          <a-select
            :value="metaHistoryRender"
            @change="handleChangeSelectMetaHistory"
            :options="historyMetaHistoryOptions"
            :disabled="isGetSMSHistoryLoading"
          >
          </a-select>
        </div>
        <div class="p-2.5 sm:p-4 bg-CEB text-black mt-3 -mx-2.5 sm:mx-0 text-tiny sm:text-sm">
          <div
            class="grid grid-cols-[2fr_1fr_1fr_1fr] sm:grid-cols-4 gap-1 sm:gap-3 font-semibold text-center p-1 sm:p-2">
            <div>#</div>
            <div>DATE</div>
            <div>PACKAGE</div>
            <div>AMOUNT</div>
          </div>
          <div class="space-y-2.5 sm:space-y-3.5 mt-1">
            <base-loading v-if="isGetSMSHistoryLoading"></base-loading>
            <div v-else-if="smsHistory?.data"
                 class="grid grid-cols-[2fr_1fr_1fr_1fr] sm:grid-cols-4 gap-1 sm:gap-3 text-center p-1 sm:p-2 bg-white text-black shadow rounded"
                 v-for="item in smsHistory.data"
                 :key="item">
              <div>{{ item.package_code }}</div>
              <div>{{ item.created_at }}</div>
              <div>{{ item.package_sms }} SMS</div>
              <div>${{ item.package_price }}</div>
            </div>
            <a-empty v-else></a-empty>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import {useGeneralStore} from "@/stores/general";
import dayjs from "dayjs";
import BaseLoading from "@/components/BaseLoading.vue";
import handleError from "@/utils/error";

const generalStore = useGeneralStore();
const {getSMSRemain, getSMSHistory} = generalStore;

const firstDateOfMonth = dayjs().startOf("month").format('YYYY-MM-DD');
const currentDate = dayjs().format('YYYY-MM-DD');
const smsCountDateRange = ref([firstDateOfMonth, currentDate]);
const smsCountType = ref('day');
const smsCountTypeOptions = ref([
  {
    label: 'Day',
    value: 'day'
  },
  {
    label: 'Month',
    value: 'month'
  },
  {
    label: 'Year',
    value: 'year'
  },
]);

const smsRemain = computed(() => generalStore.smsRemain);
const smsHistory = computed<any>(() => generalStore.smsHistory);

const isGetSMSRemainLoading = ref(false);
const handleGetSMSRemain = async () => {
  try {
    isGetSMSRemainLoading.value = true;
    await getSMSRemain({
      from: smsCountDateRange.value[0],
      to: smsCountDateRange.value[1],
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetSMSRemainLoading.value = false;
  }
};
watch(smsCountDateRange, handleGetSMSRemain, {immediate: true});

const historyMetaHistoryOptions = ref([
  {
    label: 10,
    value: 10
  },
  {
    label: 15,
    value: 15
  },
  {
    label: 20,
    value: 20
  },
  {
    label: 25,
    value: 25
  },
  {
    label: 30,
    value: 30
  }
]);

const isGetSMSHistoryLoading = ref(false);

const itemsPerPage = ref(historyMetaHistoryOptions.value[0].value);
const metaHistoryRender = computed(() => {
  if ((smsHistory.value as any)._meta) {
    const {currentPage, totalCount} = (smsHistory.value as any)._meta;
    return `${currentPage * itemsPerPage.value - (itemsPerPage.value - 1)} - ${totalCount - currentPage * itemsPerPage.value > 0 ? currentPage * itemsPerPage.value : totalCount} of ${totalCount}`
  }
  return `0 - 0 of 0`
})
const handleGetSMSHistory = async () => {
  try {
    isGetSMSHistoryLoading.value = true;
    await getSMSHistory({
      page: 1,
      "per-page": itemsPerPage.value,
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetSMSHistoryLoading.value = false;
  }
};
watch(itemsPerPage, handleGetSMSHistory, {immediate: true});
const handleChangeSelectMetaHistory = (newValue: number) => {
  itemsPerPage.value = newValue;
}
</script>

<style lang="scss" scoped>
:deep {
  .ant-card {
    .ant-card-body {
      padding: 0.625rem;
    }
  }
}
</style>
