<template>
  <div class="h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">Passcode setting</h2>
      <a-form
        layout="horizontal"
        label-align="left"
        :model="formModel"
        :rules="formRules"
        :label-col="{ span: 24, md: {span: 6} }"
        class="child:!mb-0 space-y-4"
        @finish="handleUpdateSettings('configPassword')"
      >
        <a-form-item :wrapper-col="{ offset: 0 }">
          <div class="flex space-x-2.5">
            <a-switch
              :checked="formModel['config.pos.turn_passcode_active']"
              :checked-value="'1'"
              :un-checked-value="'0'"
              @change="handleUpdateSettings('turnPasscode')"
            />
            <span>Passcode is required for sensitive data in GoPOS App</span>
          </div>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 0 }" class="!mt-1">
          <div class="flex space-x-2.5">
            <a-switch
              :checked="formModel['config.pos.web_admin_passcode_active']"
              :checked-value="'1'"
              :un-checked-value="'0'"
              @change="handleUpdateSettings('adminPasscode')"
            />
            <span>Passcode is required when accessing GoPOS Admin</span>
          </div>
        </a-form-item>
        <a-form-item label="New Passcode" name="passcode">
          <a-input-password v-model:value="formModel.passcode">
            <template #prefix>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.8333 9.16666H4.16667C3.24619 9.16666 2.5 9.91285 2.5 10.8333V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V10.8333C17.5 9.91285 16.7538 9.16666 15.8333 9.16666Z"
                  stroke="#909090" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path
                  d="M5.8335 9.16666V5.83332C5.8335 4.72825 6.27248 3.66845 7.05388 2.88704C7.83529 2.10564 8.89509 1.66666 10.0002 1.66666C11.1052 1.66666 12.165 2.10564 12.9464 2.88704C13.7278 3.66845 14.1668 4.72825 14.1668 5.83332V9.16666"
                  stroke="#909090" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item label="Confirm Passcode" name="confirmPasscode">
          <a-input-password v-model:value="formModel.confirmPasscode">
            <template #prefix>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.8333 9.16666H4.16667C3.24619 9.16666 2.5 9.91285 2.5 10.8333V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V10.8333C17.5 9.91285 16.7538 9.16666 15.8333 9.16666Z"
                  stroke="#909090" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path
                  d="M5.8335 9.16666V5.83332C5.8335 4.72825 6.27248 3.66845 7.05388 2.88704C7.83529 2.10564 8.89509 1.66666 10.0002 1.66666C11.1052 1.66666 12.165 2.10564 12.9464 2.88704C13.7278 3.66845 14.1668 4.72825 14.1668 5.83332V9.16666"
                  stroke="#909090" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item :wrapper-col="{ md: {offset: 6} }" class="mb-0">
          <a-button type="primary" html-type="submit" :loading="isUpdateConfigPassword">Submit</a-button>
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
import type {UpdateKeyStorageRequest} from "gap-nodejs-sdk";
import type {Rule} from "ant-design-vue/es/form";
import {usePasscodeStore} from "@/stores/passcode"
import handleError from "@/utils/error";

const passcodeStore = usePasscodeStore();

const settingStore = useSettingStore();
const {getKeyStorage, updateKeyStorage} = settingStore;

const formModel = ref({
  'config.pos.turn_passcode_active': '0',
  'config.pos.web_admin_passcode_active': '0',
  passcode: '',
  confirmPasscode: '',
});

const validatePasscode = async (_rule: Rule, value: string) => {
  if (value === '' || value.length !== 4) {
    return Promise.reject('New passcode length need to be exactly 4');
  }
  return Promise.resolve();
};

const validateConfirmPasscode = async (_rule: Rule, value: string) => {
  if (value === '' || value.length !== 4) {
    return Promise.reject('Confirm passcode length need to be exactly 4');
  }
  if (value !== formModel.value.passcode) {
    return Promise.reject("Two passcode don't match!");
  }
  return Promise.resolve();
};

const formRules: Record<string, Rule[]> = {
  passcode: [{validator: validatePasscode, trigger: 'change'}],
  confirmPasscode: [{validator: validateConfirmPasscode, trigger: 'change'}],
};

const isGetSettingsLoading = ref(false);
const handleGetSettings = async () => {
  try {
    isGetSettingsLoading.value = true;
    await Promise.all(
      ['config.pos.turn_passcode_active', 'config.pos.web_admin_passcode_active'].map((key: any) => {
        return getKeyStorage({key: key})
          .then(res => (formModel.value as any)[key] = (res as any).value.toString())
          .catch(error => error);
      })
    )
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetSettingsLoading.value = false;
  }
}
handleGetSettings();

const isUpdateSettingsLoading = ref(false);
const handleDoUpdateSettings = async (data: UpdateKeyStorageRequest) => {
  try {
    isUpdateSettingsLoading.value = true;
    await updateKeyStorage(data);
    notification.success({
      message: 'Success',
      description: 'Update passcode settings success',
    })
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isUpdateSettingsLoading.value = false;
  }
};
const isUpdateConfigPassword = ref(false);
const handleUpdateSettings = async (key: 'configPassword' | 'turnPasscode' | 'adminPasscode') => {
  switch (key) {
    case 'configPassword': {
      try {
        isUpdateConfigPassword.value = true;
        await handleDoUpdateSettings({
          key: 'config.passcode',
          value: formModel.value.passcode
        });
        formModel.value.passcode = '';
        formModel.value.confirmPasscode = '';
      } finally {
        isUpdateConfigPassword.value = false;
      }
      break;
    }
    case 'turnPasscode': {
      try {
        const key = 'config.pos.turn_passcode_active';
        await passcodeStore.show();
        formModel.value[key] = formModel.value[key] === '0' ? '1' : '0';
        await handleDoUpdateSettings({
          key: key,
          value: formModel.value[key],
        })
      } catch (error) {
        handleError({
          error: error
        })
      }
      break;
    }
    case 'adminPasscode': {
      try {
        await passcodeStore.show();
        const key = 'config.pos.web_admin_passcode_active';
        formModel.value[key] = formModel.value[key] === '0' ? '1' : '0';
        await handleDoUpdateSettings({
          key: key,
          value: formModel.value[key],
        })
      } catch (error) {
        handleError({
          error: error
        })
      }
      break;
    }
    default: {

    }
  }
}
</script>

<style lang="scss" scoped>
:deep {
  .ant-form-item-label > label {
    font-size: 1rem;
    color: inherit;
  }

  .ant-input-affix-wrapper {
    padding-left: 0.875rem;
    padding-right: 0.875rem;
  }

  .ant-input-prefix {
    margin-right: 0.5rem;
  }
}
</style>
