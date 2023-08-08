<template>
  <div class="h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">Service Fee</h2>
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
        <a-form-item label="Service Fee (%):" name="fee">
          <a-input v-model:value="formModel.fee"/>
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
import {notification} from "ant-design-vue";
import {useGoCheckInStore} from "@/stores/go-check-in";
import handleError from "@/utils/error";

const formModel = ref({
  fee: 0,
  state: 0
})

const formRules = ref({
  fee: [{
    required: true,
    message: 'Please enter fee'
  }],
});

const goCheckInStore = useGoCheckInStore();
const {getServiceFee, updateServiceFee} = goCheckInStore;
const isLoading = ref(false);
const handleGet = async () => {
  try {
    isLoading.value = true;
    await getServiceFee();
    formModel.value = {
      fee: goCheckInStore.serviceFee?.fee || 0,
      state: goCheckInStore.serviceFee?.state || 0,
    };
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
    await updateServiceFee(formModel.value);
    await handleGet();
    notification.success({
      message: 'Success',
      description: 'Update service fee success',
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
