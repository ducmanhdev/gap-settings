<template>
  <div class="sm:h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">Checkin Setting</h2>
      <a-form
          layout="horizontal"
          label-align="left"
          :model="generalConfigModel">
        <a-form-item>
          <div class="flex space-x-2.5">
            <a-switch
                v-model:checked="generalConfigModel['config.services.active']"
                @change="(newValue: any) => handleUpdateGeneralConfig({
                  'config.services.active': newValue,
                })"
                v-bind="switchConfig"/>
            <span>Your customers will see all those services when they check-in</span>
          </div>
        </a-form-item>
        <a-form-item v-if="generalConfigModel['config.services.active'] !== 1">
            <div class="flex space-x-2.5">
                <a-switch
                        v-model:checked="generalConfigModel['config.services.active']"
                        @change="(newValue: any) => handleUpdateGeneralConfig({'config.services.active': newValue})"
                        v-bind="{...switchConfig, checkedValue: 2}"/>
                <span>Web checkout will show services column</span>
            </div>
        </a-form-item>
        <a-form-item>
          <div class="flex space-x-2.5">
            <a-switch v-model:checked="generalConfigModel['config.staffs.active']" @change="(newValue: any) => handleUpdateGeneralConfig({
              'config.staffs.active': newValue,
            })" v-bind="switchConfig"/>
            <span>Your customers will see all those staffs when they check-in</span>
          </div>
        </a-form-item>
        <a-form-item v-if="generalConfigModel['config.staffs.active'] !== 1">
            <div class="flex space-x-2.5">
                <a-switch v-model:checked="generalConfigModel['config.staffs.active']" @change="(newValue: any) => handleUpdateGeneralConfig({
            'config.staffs.active': newValue,
          })" v-bind="{...switchConfig, checkedValue: 2}"/>
                <span>Web checkout will show staffs column</span>
            </div>
        </a-form-item>
        <a-form-item>
          <div class="flex space-x-2.5">
            <a-switch v-model:checked="generalConfigModel['config.checkin.printer.active']" @change="(newValue: any) => handleUpdateGeneralConfig({
              'config.checkin.printer.active': newValue,
            })" v-bind="switchConfig"/>
            <span>Printer features will be activated</span>
          </div>
        </a-form-item>
        <a-form-item>
          <div class="flex space-x-2.5">
            <a-switch v-model:checked="generalConfigModel['config.checkin.ask_email.active']" @change="(newValue: any) => handleUpdateGeneralConfig({
              'config.checkin.ask_email.active': newValue,
            })" v-bind="switchConfig"/>
            <span>Your customers will be required to enter their email when check-in</span>
          </div>
        </a-form-item>
        <a-form-item>
          <div class="flex space-x-2.5">
            <a-switch v-model:checked="generalConfigModel['config.checkin.ask_birthday.active']" @change="(newValue: any) => handleUpdateGeneralConfig({
              'config.checkin.ask_birthday.active': newValue,
            })" v-bind="switchConfig"/>
            <span>Your customers will be required to enter their birthday when check-in</span>
          </div>
        </a-form-item>
        <a-form-item>
          <div class="flex space-x-2.5">
            <a-switch v-model:checked="generalConfigModel['config.review.notification']" @change="(newValue: any) => handleUpdateGeneralConfig({
              'config.review.notification': newValue,
            })" v-bind="switchConfig"/>
            <span>You will be received notification about good/bad reviews everyday by sms</span>
          </div>
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
import type {GetGeneralConfigResponse, UpdateGeneralConfigRequest} from "gap-nodejs-sdk";
import handleError from "../../utils/error";

const goCheckInStore = useGoCheckInStore();
const isLoading = ref(false);
const handleGetGeneralConfig = async () => {
  try {
    isLoading.value = true;
    await goCheckInStore.getGeneralConfig();
    generalConfigModel.value = goCheckInStore.generalConfig;
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isLoading.value = false;
  }
};
handleGetGeneralConfig();
const handleUpdateGeneralConfig = async (data: UpdateGeneralConfigRequest) => {
  try {
    const formData = new FormData() as any;
    for (const key in data) {
      formData.append('key', key)
      formData.append('value', data[key as keyof UpdateGeneralConfigRequest])
    }
    isLoading.value = true;
    await goCheckInStore.updateGeneralConfig(formData);
    notification.success({
      message: 'Success',
      description: 'Update general config success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    await handleGetGeneralConfig();
  }
}

const switchConfig = ref({
  checkedValue: 1,
  unCheckedValue: 0,
  loading: isLoading,
});

const GENERAL_CONFIG_LABEL = {
    'config.checkin.ask_birthday.active': 'Your customers will be required to enter their birthday when check-in',
    'config.checkin.ask_email.active': 'Your customers will be required to enter their email when check-in',
    'config.checkin.printer.active': 'Printer features will be activated',
    'config.review.notification': 'You will be received notification about good/bad reviews everyday by sms',
    'config.services.active': 'Your customers will see all those services when they check-in',
    'config.staffs.active': 'Your customers will see all those staffs when they check-in',
}
const generalConfigModel = ref<GetGeneralConfigResponse>({
  'config.checkin.ask_birthday.active': 0,
  'config.checkin.ask_email.active': 0,
  'config.checkin.printer.active': 0,
  'config.review.notification': 0,
  'config.services.active': 0,
  'config.staffs.active': 0,
});
</script>

<style scoped>

</style>
