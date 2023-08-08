<template>
  <div class="h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">Checkout Setting</h2>
      <h3 class="sub-title">Checkout Type</h3>
      <a-form
        :model="formModel"
        :rules="formRules"
        @finish="handleUpdateCheckOutConfig"
        class="child:!mb-0 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <a-form-item
          name="type"
          :class="{'sm:col-span-2': formModel.type === 'manual'}">
          <a-select
            class="w-full shadow"
            v-model:value="formModel.type"
            :disabled="isLoading"
            :options="checkOutTypeOptions"
          ></a-select>
        </a-form-item>
        <a-form-item
          name="point_bonus"
          v-if="formModel.type !== 'manual'">
          <a-input
            class="w-full shadow"
            v-model:value="formModel.point_bonus"
            :disabled="isLoading"
          ></a-input>
        </a-form-item>
        <a-form-item class="sm:text-center sm:col-span-2 ">
          <a-button
            type="primary"
            html-type="submit"
            :disabled="isLoading"
            class="w-full sm:w-auto"
          >
            Save
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import {useGoCheckInStore} from "../../stores/go-check-in";
import {notification} from "ant-design-vue";
import type {UpdateCheckOutConfigRequest} from "gap-nodejs-sdk";
import handleError from "../../utils/error";

const checkOutTypeOptions = ref([
  {
    label: 'Manual Checkout',
    value: 'manual',
  },
  {
    label: 'Auto Checkout',
    value: 'auto',
  },
  {
    label: 'Hybrid Checkout',
    value: 'hybrid',
  }
]);

const formModel = ref<UpdateCheckOutConfigRequest>({
  point_bonus: 0,
  type: 'manual'
});

const formRules = ref({
  point_bonus: [
    {
      required: true,
      message: 'Please enter point bonus!'
    }
  ],
  type: [
    {
      required: true,
      message: 'Please select type!'
    }
  ]
})

const goCheckInStore = useGoCheckInStore();
const isLoading = ref(false);

const handleGetCheckOutConfig = async () => {
  try {
    isLoading.value = true;
    await goCheckInStore.getCheckOutConfig();
    formModel.value = goCheckInStore.checkOutConfig as UpdateCheckOutConfigRequest;
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isLoading.value = false;
  }
};
handleGetCheckOutConfig();

const handleUpdateCheckOutConfig = async () => {
  try {
    isLoading.value = true;
    await goCheckInStore.updateCheckOutConfig(formModel.value);
    notification.success({
      message: 'Error',
      description: 'Update checkout config success',
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

<style scoped>
</style>
