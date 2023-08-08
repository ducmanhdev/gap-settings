<template>
  <div class="sm:h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">SMS Content</h2>
      <base-loading v-if="isLoading"></base-loading>
      <a-form v-else-if="formModel" layout="vertical" :model="formModel">
        <a-form-item
          v-if="formModel"
          v-for="item in formModel"
          :label="item.label"
        >
          <div :class="{'grid grid-cols-1 sm:grid-cols-[1fr_60px] gap-2 sm:gap-4': item.isEdit}">
            <a-input v-model:value="item.value" @change="item.isEdit = true" class="!hidden sm:!block"/>
            <a-textarea
              v-model:value="item.value"
              @change="item.isEdit = true"
              auto-size
              class="sm:!hidden !text-C90 !font-normal"
            />
            <button
              type="button"
              class="main-btn main-btn--secondary"
              v-if="item.isEdit"
              @click.prevent="item.handleUpdate"
              :disabled="item.isUpdateLoading"
            >Save
            </button>
          </div>
        </a-form-item>
      </a-form>
      <a-empty v-else></a-empty>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from "@/components/Breadcrumb.vue";
import BaseLoading from "@/components/BaseLoading.vue";
import {ref} from "vue";
import {useGoBookingStore} from "@/stores/go-booking";
import {notification} from "ant-design-vue";
import handleError from "@/utils/error";

const goBookingStore = useGoBookingStore();

const {getSMSContent, updateSMSContent} = goBookingStore;

const labelList = new Map([
  ['config.appointment.content_sms.customer.scheduled', 'SMS sent when your customer completes a booking online'],
  ['config.appointment.content_sms.customer.confirmed', 'SMS sent when customer’s booking is confirmed'],
  ['config.appointment.content_sms.customer.canceled', 'SMS sent when you can\'t fulfill an appointment request'],
  ['config.appointment.remind_content', 'SMS sent reminder customer\n'],
  ['config.gocheckin.sms_for_waiting_customer_content', 'SMS sent for waiting customer\n'],
])

const isLoading = ref(false);
const handleUpdateSMSContent = (key: string) => {
  return async () => {
    try {
      const formData = new FormData() as any;
      formData.append('key', key);
      formData.append('value', formModel.value[key].value);

      formModel.value[key].isUpdateLoading = true;
      await updateSMSContent(formData);
      notification.success({
        message: 'Success',
        description: 'Update sms content success',
      });
    } catch (error) {
      handleError({
        error: error
      })
    } finally {
      formModel.value[key].isEdit = false;
      formModel.value[key].isUpdateLoading = false;
    }
  }
}

const formModel = ref<any>(null);
const handleGetSMSContent = async () => {
  try {
    isLoading.value = true;
    await getSMSContent();
    formModel.value = Object.entries(goBookingStore.smsContent).reduce((result: any, [key, value]) => {
      result[key] = {
        label: labelList.get(key),
        value,
        isEdit: false,
        handleUpdate: handleUpdateSMSContent(key),
        isUpdateLoading: false,
      };
      return result;
    }, {});
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isLoading.value = false;
  }
}
handleGetSMSContent();
</script>

<style scoped>

</style>
