<template>
  <div class="h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">Tax Setting</h2>
      <a-form
        :label-col="{ span: 5, xl: { span: 3 } }"
        :wrapper-col="{ span: 19, xl: { span: 21 } }"
        autocomplete="off"
        class="child:!mb-0 space-y-3 sm:space-y-4 label-gray"
        label-align="left"
        :model="formModel"
        :rules="formRules"
        @finish="handleUpdate"
      >
        <a-form-item label="Service Tax (%)" name="service_val">
          <a-input v-model:value="formModel.service_val"/>
        </a-form-item>
        <a-form-item label="Product Tax (%)" name="product_val">
          <a-input v-model:value="formModel.product_val"/>
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
import {notification} from 'ant-design-vue';
import handleError from "@/utils/error";

const formModel = ref({
  service_val: 0,
  product_val: 0
});

const formRules = ref({
  service_val: [{
    required: true,
    message: 'Please enter service tax'
  }],
  product_val: [{
    required: true,
    message: 'Please enter product tax'
  }],
});

const settingStore = useSettingStore();
const {getTaxSetting, updateTaxSetting} = settingStore;
const isLoading = ref(false);
const handleGet = async () => {
  try {
    isLoading.value = true;
    await getTaxSetting();
    formModel.value = {
      service_val: settingStore.taxSetting.find(item => item.type === 'service')?.value ? settingStore.taxSetting.find(item => item.type === 'service')!.value! * 100 : 0,
      product_val: settingStore.taxSetting.find(item => item.type === 'product')?.value ? settingStore.taxSetting.find(item => item.type === 'product')!.value! * 100 : 0
    }
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
    await updateTaxSetting({
        service_val: formModel.value.service_val / 100,
        product_val: formModel.value.product_val / 100
    } as any);
    notification.success({
      message: 'Success',
      description: 'Update tax setting success',
    });
    await handleGet();
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
