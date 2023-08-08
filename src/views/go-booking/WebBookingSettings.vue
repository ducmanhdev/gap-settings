<template>
  <div class="sm:h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">Web Booking settings</h2>
      <a-form layout="horizontal"
              label-align="left"
              :model="formModel">
        <a-form-item>
          <div class="flex space-x-2.5">
            <a-switch
              v-model:checked="formModel['config.appointment.web_booking.skip_staff.active']"
              v-bind="switchConfig"
              @change="(newValue: any) => handleUpdateSettings('config.appointment.web_booking.skip_staff.active', newValue)"
            />
            <span>Show skip button on your online booking page</span>
          </div>
        </a-form-item>
        <a-form-item>
          <div class="flex space-x-2.5">
            <a-switch
              v-model:checked="formModel['module.appointment.any_staff']"
              v-bind="switchConfig"
              @change="(newValue: any) => handleUpdateSettings('module.appointment.any_staff', newValue)"
            />
            <span>"Any Staff" option will be used when your customer doesn't know who to book online.</span>
          </div>
        </a-form-item>
        <a-form-item>
          <div class="flex space-x-2.5 mb-5" v-if="formModel['module.appointment.any_staff'] === '1'">
            <a-switch
              v-model:checked="formModel['module.appointment.any_staff.auto_assign']"
              v-bind="switchConfig"
              @change="(newValue: any) => handleUpdateSettings('module.appointment.any_staff.auto_assign', newValue)"
            />
            <span>Appointment will be assigned automatically by the system to any staff available that time and can do the service.</span>
          </div>
          <ul class="space-y-3 mb-4 sm:pl-[54px]">
            <li class="flex items-center space-x-2">
              <div class="w-2.5 h-2.5 rounded-full"
                   :style="{backgroundColor: formModel['appointment.any_staff.color_code']}">
              </div>
              <div class="w-[170px]">Any staff color</div>
              <label
                class="block w-6 h-6 rounded cursor-pointer"
                :class="{'opacity-50 pointer-event-none': isLoading}"
                :style="{backgroundColor: formModel['appointment.any_staff.color_code']}"
              >
                <input
                  class="opacity-0 w-6 h-6 pointer-events-none"
                  type="color"
                  v-model="formModel['appointment.any_staff.color_code']"
                  @change="(event: any) => handleUpdateSettings('appointment.any_staff.color_code', event.target.value)"
                >
              </label>
            </li>
            <li class="flex items-center space-x-2">
              <div class="w-2.5 h-2.5 rounded-full"
                   :style="{backgroundColor: formModel['appointment.appointment_event.done.color_code']}"></div>
              <div class="w-[170px]">Booking done color</div>
              <label
                class="block w-6 h-6 rounded cursor-pointer"
                :class="{'opacity-50 pointer-event-none': isLoading}"
                :style="{backgroundColor: formModel['appointment.appointment_event.done.color_code']}"
              >
                <input
                  class="opacity-0 w-6 h-6 pointer-events-none"
                  type="color"
                  v-model="formModel['appointment.appointment_event.done.color_code']"
                  @change="(event: any) => handleUpdateSettings('appointment.appointment_event.done.color_code', event.target.value)"
                >
              </label>
            </li>
            <li class="flex items-center space-x-2">
              <div class="w-2.5 h-2.5 rounded-full"
                   :style="{backgroundColor: formModel['appointment.appointment_event.cancel.color_code']}"></div>
              <div class="w-[170px]">Booking cancel color</div>
              <label
                class="block w-6 h-6 rounded cursor-pointer"
                :class="{'opacity-50 pointer-event-none': isLoading}"
                :style="{backgroundColor: formModel['appointment.appointment_event.cancel.color_code']}">
                <input
                  class="opacity-0 w-6 h-6 pointer-events-none"
                  type="color"
                  v-model="formModel['appointment.appointment_event.cancel.color_code']"
                  @change="(event: any) => handleUpdateSettings('appointment.appointment_event.cancel.color_code', event.target.value)"
                >
              </label>
            </li>
          </ul>
        </a-form-item>
        <a-form-item>
          <div class="flex space-x-2.5">
            <a-switch
              v-model:checked="formModel['module.appointment.active']"
              v-bind="switchConfig"
              @change="(newValue: any) => handleUpdateSettings('module.appointment.active', newValue)"
            />
            <span>Please press "Activate" only when you have completed all information in Setting, Services and Staff tabs. After you hit "Activate", all information will officially appear on your online booking and customers can start booking with your business.</span>
          </div>
        </a-form-item>
        <a-form-item>
          <div class="flex space-x-2.5">
            <a-switch
              v-model:checked="formModel['config.service.show_price']"
              v-bind="switchConfig"
              @change="(newValue: any) => handleUpdateSettings('config.service.show_price', newValue)"
            />
            <span>Show service price on your online booking page</span>
          </div>
        </a-form-item>
        <a-form-item>
          <div class="flex space-x-2.5">
            <a-switch
              v-model:checked="formModel['module.appointment.skip_owner_confirm']"
              v-bind="switchConfig"
              @change="(newValue: any) => handleUpdateSettings('module.appointment.skip_owner_confirm', newValue)"
            />
            <span>You don't need to confirm your online bookings, which means all online bookings from your customers will be automatically confirmed right after they book.</span>
          </div>
        </a-form-item>
        <a-form-item>
          <div class="flex space-x-2.5">
            <a-switch
              v-model:checked="formModel['appointment.calendar.hide_unassigned_no_booking']"
              v-bind="switchConfig"
              @change="(newValue: any) => handleUpdateSettings('appointment.calendar.hide_unassigned_no_booking', newValue)"
            />
            <span>Hide unassigned column when having no appointment</span>
          </div>
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

const isLoading = ref(false);
const switchConfig = {
  checkedValue: '1',
  unCheckedValue: '0',
  loading: isLoading.value,
}

const settingStore = useSettingStore();
const {getKeyStorage, updateKeyStorage} = settingStore;

const formModel = ref({
  'config.appointment.web_booking.skip_staff.active': "0",
  'module.appointment.any_staff': '1',
  'module.appointment.any_staff.auto_assign': '1',
  'appointment.any_staff.color_code': 'var(--color-primary)',
  'appointment.appointment_event.done.color_code': 'var(--color-primary)',
  'appointment.appointment_event.cancel.color_code': 'var(--color-primary)',
  'module.appointment.active': '0',
  'config.service.show_price': '1',
  'module.appointment.skip_owner_confirm': '0',
  'appointment.calendar.hide_unassigned_no_booking': '0',
});

const handleGetSettings = async () => {
  try {
    isLoading.value = true;
    await Promise.all(
      Object.keys(formModel.value).map((key: any) => {
        return getKeyStorage({key})
          .then(res => (formModel.value as any)[key] = (res as any).value.toString())
          .catch(error => error);
      })
    )
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isLoading.value = false;
  }
}
handleGetSettings();

const handleUpdateSettings = async (key: string, value: string) => {
  try {
    await updateKeyStorage({key, value});
    notification.success({
      message: 'Success',
      description: 'Update settings success'
    })
  } catch (error) {
    handleError({
      error: error
    })
  }
}
</script>

<style scoped>

</style>
