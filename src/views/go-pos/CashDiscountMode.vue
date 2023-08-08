<template>
  <div class="h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">Cash Discount Mode</h2>
      <a-form
          :label-col="{ span: 5, xl: { span: 3 } }"
          :wrapper-col="{ span: 19, xl: { span: 21 } }"
          autocomplete="off"
          class="child:!mb-0 space-y-4 label-gray"
          label-align="left"
          :model="formModel"
          :rules="formRules"
          @finish="handleUpdate"
      >
        <a-form-item label="Cash Discount (%):" name="cashDiscountMode">
          <a-input v-model:value="formModel.cashDiscountMode"/>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 0, span: 24, sm: {offset: 5, span: 19}, xl: { offset: 3, span: 21 }}">
          <a-button type="primary" html-type="submit" :loading="isLoading">Submit</a-button>
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
import {isJsonString} from "@/utils/json";

const formModel = ref({
  cashDiscountMode: 0,
});

const formRules = ref({
  cashDiscountMode: [{
    required: true,
    message: 'Please enter value'
  }]
});

const settingStore = useSettingStore();
const {getKeyStorage, updateKeyStorage} = settingStore;

const configKey = 'config.pos.cash_discount_active';
const isLoading = ref(false);

const valueOfKeyStorage = ref<any>(null);
const handleGet = async () => {
  try {
    isLoading.value = true;
    await getKeyStorage({
      key: configKey
    });
    if((settingStore?.keyStorage?.value as any).value || (settingStore?.keyStorage?.value as any).value === 0) {
        const value = settingStore?.keyStorage?.value as any;
        valueOfKeyStorage.value = value;
        return formModel.value.cashDiscountMode = value?.value ? value?.value * 100 : 0;
    }
    formModel.value.cashDiscountMode = settingStore?.keyStorage?.value ? (settingStore?.keyStorage?.value as any) * 100 : 0
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isLoading.value = false;
  }
}
handleGet();

const handleUpdate = async () => {
  try {
    isLoading.value = true;
    const payload: any = {
        key: configKey,
    }
    if(valueOfKeyStorage.value) {
        payload.value = JSON.stringify({
            ...valueOfKeyStorage.value,
            value: (formModel.value.cashDiscountMode / 100).toString(),
        })
    } else {
        payload.value = (formModel.value.cashDiscountMode / 100).toString();
    }
    await updateKeyStorage(payload);
    await handleGet();
    notification.success({
      message: 'Success',
      description: 'Update cash discount mode success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isLoading.value = false;
  }
}
</script>

<style lang="scss" scoped>
</style>
