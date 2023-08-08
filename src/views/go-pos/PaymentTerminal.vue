<template>
  <div class="h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">Payment terminal</h2>
      <a-tabs animated v-model:activeKey="activeKey" class="custom-tabs">
        <a-tab-pane v-for="tab in tabList" :key="tab.value" :tab="tab.label">
          <a-form layout="vertical">
            <div class="grid grid-cols-2 gap-7 child:!mb-0">
              <a-form-item label="IP">
                <a-input v-model:value="data.ip">
                  <template #suffix>
                    <span class="text-success font-medium">Connected</span>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item label="PORT">
                <a-input v-model:value="data.port"/>
              </a-form-item>
              <a-form-item class="col-span-2 text-center">
                <a-button type="primary" html-type="submit" class="text-center">Connect</a-button>
              </a-form-item>
            </div>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue"
const data = ref({
  ip: '192.168.1.60',
  port: '',
});
const tabList = ref([
  {
    label: 'Clover',
    value: '1'
  },
  {
    label: 'Pax terminal',
    value: '2'
  },
]);
const activeKey = ref(tabList.value[0].value);
</script>
<style lang="scss" scoped>
</style>
