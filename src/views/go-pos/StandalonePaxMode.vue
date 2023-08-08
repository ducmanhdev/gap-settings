<template>
  <div class="h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">Standalone PAX Mode</h2>
      <div class="flex space-x-3 mb-4 text-C62">
        <a-switch
            v-model:checked="formModel.standalonePaxMode"
            :checked-value="'1'"
            :un-checked-value="'0'"
            @change="handleUpdate"
            :loading="isLoading"
            class="shrink-0"
        />
        <span class="self-center">This mode will allow Go POS to be used without the credit card terminal. After you turn it on, you will need to close and reopen the Go POS app</span>
      </div>
      <div class="notice-box">Notice: Please remember disabling this mode when you use semi-integrated PAX along with Go
        POS app
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
  standalonePaxMode: '1',
});

const configKey = 'config.pos.pax_standalone_active';
const settingStore = useSettingStore();
const {getKeyStorage, updateKeyStorage} = settingStore;

const isLoading = ref(false);
const handleGet = async () => {
  try {
    isLoading.value = true;
    await getKeyStorage({
      key: configKey
    });
    formModel.value.standalonePaxMode = settingStore?.keyStorage?.value || '0';
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
      description: 'Update standalone pax mode success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
</style>
