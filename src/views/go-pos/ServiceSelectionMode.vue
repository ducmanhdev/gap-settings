<template>
  <div class="h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">Service Selection Mode</h2>
      <a-form>
        <a-form-item>
          <a-select
              v-model:value="formModel.mode"
              :options="modeList"
              :loading="isLoading"
              @change="handleUpdate"
          />
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";

import {useSettingStore} from "@/stores/setting";
import {notification} from "ant-design-vue";
import handleError from "@/utils/error";

const modeList = ref([
  {
    label: 'Service - Staff',
    value: '0',
  },
  {
    label: 'Staff - Service',
    value: '1',
  }
]);

const formModel = ref({
  mode: '0',
});

const formRules = ref({
  mode: [{
    required: true,
    message: 'Please enter value'
  }]
});

const configKey = 'config.pos.order_page_staff_first';
const settingStore = useSettingStore();
const {getKeyStorage, updateKeyStorage} = settingStore;

const isLoading = ref(false);
const handleGet = async () => {
  try {
    isLoading.value = true;
    await getKeyStorage({
      key: configKey
    })
    formModel.value.mode = settingStore?.keyStorage?.value || '0';
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isLoading.value = false;
  }
};
handleGet();

const handleUpdate = async (newValue: any) => {
  try {
    isLoading.value = true;
    await updateKeyStorage({
      key: configKey,
      value: newValue,
    });
    notification.success({
      message: 'Success',
      description: 'Update service selection mode success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isLoading.value = false
  }
};
</script>

<style lang="scss" scoped>
</style>
