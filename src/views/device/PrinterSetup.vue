<template>
  <div class="h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">Printer setup</h2>
      <a-form layout="vertical" class="child:!mb-0">
        <a-form-item>
          <template #label>
            <span class="font-semibold">Printer model</span>
          </template>
          <a-input v-model:value="data.ip">
            <template #suffix>
              <span class="text-error font-medium">Disconnected</span>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item class="!mt-4">
          <div class="flex justify-between items-center">
            <span>Receipt</span>
            <a-switch v-model:checked="data.receipt"/>
          </div>
        </a-form-item>
        <a-form-item>
          <div class="flex justify-between items-center">
            <span>Payroll</span>
            <a-switch v-model:checked="data.payroll"/>
          </div>
        </a-form-item>
        <a-form-item>
          <div class="flex justify-between items-center">
            <span>Batch History</span>
            <a-switch v-model:checked="data.batchHistory"/>
          </div>
        </a-form-item>
        <a-form-item>
          <div class="flex justify-between items-center">
            <span>Staff Daily Income</span>
            <a-switch v-model:checked="data.staffDailyIncome"/>
          </div>
        </a-form-item>
        <a-form-item>
          <div class="flex items-center justify-center space-x-7">
            <a-button type="primary" ghost class="text-center" @click.prevent="handleOpenScanModal">Scan</a-button>
            <a-button type="primary" html-type="submit" class="text-center">Connect</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
  <scan-network-printer-modal ref="scanModal"></scan-network-printer-modal>
</template>

<script setup lang="ts">
import {ref} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue"
import ScanNetworkPrinterModal from "@/components/modals/ScanNetworkPrinterModal.vue";
const data = ref({
  ip: '192.168.1.60',
  receipt: true,
  payroll: true,
  batchHistory: true,
  staffDailyIncome: true,
});

const scanModal = ref<InstanceType<typeof ScanNetworkPrinterModal> | null>(null);
const handleOpenScanModal = () => {
  scanModal.value?.show();
}
</script>
<style lang="scss" scoped>
</style>
