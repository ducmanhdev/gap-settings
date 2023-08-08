<template>
  <div class="sm:h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow">
      <h2 class="main-title">Tip Setting</h2>
      <div class="flex space-x-3 my-4 text-C62">
        <a-switch
          v-model:checked="formModel.status"
          :checked-value="1"
          :un-checked-value="0"
          class="shrink-0"/>
        <span class="self-center">Tip or no tip</span>
      </div>
      <p>Setup to 4 default tips for a customer to choose from when signing on screen (in addition to options for custom
        and no tip).</p>
      <p>If you are setup to have customers sign on on the printed receipt, the calculated tip and total for these
        suggestions will appear at the bottom of the receipt.</p>
      <a-radio-group class="!flex sm:justify-start justify-between space-x-3 sm:child:min-w-[120px] !mt-3 sm:!mt-4"
                     v-model:value="formModel.type">
        <a-radio value="percent">%</a-radio>
        <a-radio value="usd">$</a-radio>
      </a-radio-group>
      <div class="mt-4 sm:mt-7">
        <div class="flex items-center justify-between space-x-3">
          <p class="mb-0 font-semibold">Choose options</p>
          <button class="main-btn main-btn--secondary" type="button" @click="handleCreateTip">Create</button>
        </div>
        <div class="mt-3 overflow-auto">
          <a-table class="a-simple-table whitespace-nowrap" :dataSource="formModel.tip_items" :columns="columns"
                   :pagination="false">
            <template #bodyCell="{title, column, record, index}">
              <template v-if="column.dataIndex === 'checkbox'">
                <a-checkbox v-model:checked="record.active"/>
              </template>
              <template v-else-if="column.dataIndex === 'actions'">
                <svg @click="handleDeleteItems(index)" class="cursor-pointer mx-auto" width="18" height="18"
                     viewBox="0 0 18 18"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.25 4.5H3.75H15.75" stroke="#909090" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round"/>
                  <path
                    d="M14.25 4.5V15C14.25 15.3978 14.092 15.7794 13.8107 16.0607C13.5294 16.342 13.1478 16.5 12.75 16.5H5.25C4.85218 16.5 4.47064 16.342 4.18934 16.0607C3.90804 15.7794 3.75 15.3978 3.75 15V4.5M6 4.5V3C6 2.60218 6.15804 2.22064 6.43934 1.93934C6.72064 1.65804 7.10218 1.5 7.5 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V4.5"
                    stroke="#909090" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </template>
              <template v-else-if="column.dataIndex === 'value'">
                <input type="text" class="appearance-none text-center outline-none" v-model="record.value">
              </template>
              <template v-else-if="column.dataIndex === 'title'">
                <input type="text" class="appearance-none text-center outline-none" v-model="record.title">
              </template>
            </template>
          </a-table>
        </div>
        <div class="sm:text-center mt-3">
          <a-button type="primary" @click="handleUpdate" v-if="formModel.tip_items" :loading="isUpdateLoading">Save</a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import {useSettingStore} from "@/stores/setting";
import {notification} from "ant-design-vue";
import type {GetTipResponse} from "gap-nodejs-sdk";
import handleError from "@/utils/error";

const formModel = ref<GetTipResponse>({
  type: "percent",
  status: 0,
  tip_items: []
})

const settingStore = useSettingStore();
const {getTip, updateTip} = settingStore;

const isGetLoading = ref(false);
const handleGet = async () => {
  try {
    isGetLoading.value = true;
    await getTip();
    formModel.value = {
      ...settingStore.tip,
      tip_items: (settingStore.tip as any).tip_items.map((item: any) => ({
        ...item,
        active: item.active === 1
      }))
    };
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetLoading.value = false;
  }
}
handleGet();

const handleCreateTip = async () => {
  formModel.value = {
    ...formModel.value,
    tip_items: [
      ...(formModel.value.tip_items || []),
      {
        title: "",
        active: false as any,
        value: undefined,
      }
    ]
  }
}

const isUpdateLoading = ref(false);
const handleUpdate = async () => {
  try {
    isUpdateLoading.value = true;
    await updateTip({
      value: {
        ...formModel.value,
        tip_items: (formModel.value as any).tip_items.map((item: any) => ({
          ...item,
          active: item.active ? 1 : 0
        }))
      }
    });
    notification.success({
      message: 'Success',
      description: 'Update tip success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isUpdateLoading.value = false;
  }
}
const columns = ref([
  {
    title: '',
    dataIndex: 'checkbox',
    key: 'checkbox',
    align: 'center'
  },
  {
    title: 'Tip (%)',
    dataIndex: 'value',
    key: 'value',
    align: 'center'
  },
  {
    title: 'Tip suggestions',
    dataIndex: 'title',
    key: 'title',
    align: 'center'
  },
  {
    title: '',
    dataIndex: 'actions',
    key: 'actions',
    align: 'center'
  },
]);
const handleDeleteItems = (index: number) => (formModel.value.tip_items || []).splice(index, 1);
</script>

<style lang="scss" scoped>
</style>
