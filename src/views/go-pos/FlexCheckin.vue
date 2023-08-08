<template>
  <div class="h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">Flex Checkin Setting</h2>
      <div class="flex space-x-3 mb-4 text-C62">
        <a-switch
            v-model:checked="formModel.flexCheckin"
            :checked-value="'1'"
            :un-checked-value="'0'"
            @change="handleUpdate"
            :loading="isLoading"
            class="shrink-0"
        />
        <span class="self-center">Active Flex Checkin</span>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";

import {useSettingStore} from "@/stores/setting";
import {notification} from "ant-design-vue";
import handleError from "@/utils/error";

const formModel = ref({
  flexCheckin: '0',
});

const configKey = 'config.flex.checkin';
const settingStore = useSettingStore();
const {getKeyStorage, updateKeyStorage} = settingStore;

const isLoading = ref(false);
const handleGet = async () => {
  try {
    isLoading.value = true;
    await getKeyStorage({
      key: configKey
    });
    formModel.value.flexCheckin = settingStore?.keyStorage?.value ? '' + settingStore?.keyStorage?.value : '0';
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
      description: 'Update flex checkin success',
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
