<template>
  <div class="sm:h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <a-form>
        <div class="space-y-4 sm:space-y-9">
          <div>
            <h2 class="main-title">Setting Deposit Type</h2>
            <a-radio-group v-model:value="formModel.deposit_type" class="w-full" style="font-size: inherit">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 child:!mb-0 sm:child:max-w-[250px]">
                <div>
                  <p class="mb-2">Percentage deposit</p>
                  <div class="flex items-center space-x-3.5">
                    <a-radio class="!mr-0" value="percent"></a-radio>
                    <div>%</div>
                    <a-input-number class="grow sm:grow-0" v-model:value="formModel.deposit_percent_value"/>
                  </div>
                </div>
                <div>
                  <p class="mb-2">Fixed deposit amount</p>
                  <div class="flex items-center space-x-3.5">
                    <a-radio class="!mr-0" value="fixed"></a-radio>
                    <div>$</div>
                    <a-input-number class="grow sm:grow-0" v-model:value="formModel.deposit_fixed_value"/>
                  </div>
                </div>
              </div>
            </a-radio-group>
          </div>
          <div>
            <h2 class="main-title mb-1 sm:mb-3">Setting Cancel Policy</h2>
            <a-form-item>
              <div class="sm:flex items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <div>Customer's appointment is not allowed to cancel within:</div>
                <div class="inline-flex space-x-2.5">
                  <a-switch
                    v-model:checked="formModel.cancel_policy"
                    :checked-value="1"
                    :un-checked-value="0"
                  />
                  <span>Allow</span>
                </div>
              </div>
            </a-form-item>
            <a-form-item class="!mt-3 sm:!mt-0">
              <a-radio-group v-model:value="formModel.cancel_policy_time">
                <div class="space-y-3">
                  <div class="sm:flex items-center space-y-3 sm:space-y-0 sm:space-x-3" v-for="item in cancelTimeList" :key="item.value">
                    <a-radio class="shrink-0" :value="item.value">
                      {{ item.label }}
                    </a-radio>
                    <a-input
                      v-if="formModel.cancel_policy_time !== 1440 &&
                        formModel.cancel_policy_time !== 2880 &&
                        item.label === 'Custom Hours'"
                      v-model:value.number="item.value"/>
                  </div>
                </div>
              </a-radio-group>
            </a-form-item>
          </div>
          <div class="sm:text-center">
            <a-button type="primary" html-type="submit" :loading="isUpdateLoading" :disabled="isGetLoading"
                      @click.prevent="handleUpdate">Save
            </a-button>
          </div>
        </div>
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

const settingStore = useSettingStore();
const {getKeyStorage, updateKeyStorage} = settingStore;

interface FormModel {
  cancel_policy: 0 | 1,
  cancel_policy_time: number,
  deposit_type: 'fixed' | 'percent',
  deposit_value: number,
  deposit_fixed_value: number,
  deposit_percent_value: number,
  status: 0 | 1,
}

const formModel = ref<FormModel>({
  cancel_policy: 0,
  cancel_policy_time: 1440,
  deposit_type: "fixed",
  deposit_value: 0,
  deposit_fixed_value: 0,
  deposit_percent_value: 0,
  status: 0,
});

const cancelTimeList = ref([
  {
    label: '24 Hours',
    value: 1440,
  },
  {
    label: '48 Hours',
    value: 2880,
  },
  {
    label: 'Custom Hours',
    value: 0,
  }
]);

const key = 'config.appointment.deposit_setting';
const isGetLoading = ref(false);
const isUpdateLoading = ref(false);
const handleGet = async () => {
  try {
    isGetLoading.value = true;
    const response = await getKeyStorage({key});
    const responseValue = response.value as unknown as FormModel;
    formModel.value = {...formModel.value, ...responseValue};
    if (formModel.value.cancel_policy_time !== 1440 &&
      formModel.value.cancel_policy_time !== 2880
    ) {
      cancelTimeList.value.find(item => item.label === 'Custom Hours')!.value = responseValue.cancel_policy_time
    }
    if (formModel.value.deposit_type === 'fixed') {
      formModel.value.deposit_fixed_value = responseValue.deposit_value;
    }
    if (formModel.value.deposit_type === 'percent') {
      formModel.value.deposit_percent_value = responseValue.deposit_value;
    }
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetLoading.value = false;
  }
}
handleGet();

const handleUpdate = async () => {
  try {
    if (formModel.value.deposit_percent_value as any === null) {
      formModel.value.deposit_percent_value = 0;
    }
    if (formModel.value.deposit_percent_value as any === null) {
      formModel.value.deposit_percent_value = 0;
    }
    const data = {...formModel.value} as any;
    data.deposit_value = data.deposit_type === 'fixed' ? data.deposit_fixed_value : data.deposit_percent_value;
    delete data.deposit_fixed_value;
    delete data.deposit_percent_value;
    isUpdateLoading.value = true;
    await updateKeyStorage({
      key: key,
      value: JSON.stringify(data)
    });
    notification.success({
      message: 'Success',
      description: 'Update appointment deposit success'
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isUpdateLoading.value = false;
  }
}
</script>

<style scoped>

</style>
