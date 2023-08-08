<template>
  <a-drawer
    v-model:visible="isVisible"
    placement="right"
    :width="500"
    class="create-staff"
  >
    <div class="py-3 flex items-center justify-between space-x-3 border-b sticky top-0 left-0 bg-white text-black z-50">
      <h2 class="main-title mb-0">{{ isEdit ? 'Edit Staff information' : 'Create New Staff' }}</h2>
      <svg @click="hide" class="cursor-pointer" width="28" height="28" viewBox="0 0 28 28" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.0002 25.6667C20.4435 25.6667 25.6668 20.4434 25.6668 14C25.6668 7.55672 20.4435 2.33337 14.0002 2.33337C7.55684 2.33337 2.3335 7.55672 2.3335 14C2.3335 20.4434 7.55684 25.6667 14.0002 25.6667Z"
          stroke="#EB5757" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17.5 10.5L10.5 17.5" stroke="#EB5757" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"/>
        <path d="M10.5 10.5L17.5 17.5" stroke="#EB5757" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="py-4">
      <a-form
        layout="vertical"
        class="space-y-3 sm:space-y-6"
        :model="formModel"
        :rules="formRules"
        @finish="handleSubmit"
      >
        <div>
          <p class="font-semibold">Instruction</p>
          <div class="notice-box">
            This is where you can assign a staff code to your employee so she/he will be able to check out their
            customers
          </div>
        </div>
        <div>
          <p class="font-semibold">Profile picture</p>
          <div class="child:!mb-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a-form-item class="sm:col-span-2">
              <upload-avatar v-model="formModel.image_url" :name="formModel.staff_name" :color="formModel.color_code"></upload-avatar>
            </a-form-item>
            <a-form-item label="Name" name="staff_name">
              <a-input v-model:value="formModel.staff_name"/>
            </a-form-item>
            <a-form-item label="Code" name="staff_code">
              <a-input-number
                      v-input-number
                      :controls="false"
                      v-model:value="formModel.staff_code"
                      string-mode
                      :maxlength="6"
                      class="!w-full"
              />
            </a-form-item>
            <a-form-item class="sm:col-span-2" label="Nick name" name="nick_name">
              <a-input v-model:value="formModel.nick_name"/>
            </a-form-item>
            <a-form-item class="sm:col-span-2" label="Cell" name="phone">
              <a-input-number
                v-input-number
                :controls="false"
                v-model:value="formModel.phone"
                class="!w-full"
                string-mode
                :formatter="usePhoneFormat"
                :parser="usePhoneParser"
              />
            </a-form-item>
            <a-form-item class="sm:col-span-2" label="Email" name="email">
              <a-input v-model:value="formModel.email"/>
            </a-form-item>
            <a-form-item class="sm:col-span-2" label="Address" name="address">
              <a-input v-model:value="formModel.address"/>
            </a-form-item>
          </div>
        </div>
        <div>
          <p class="font-semibold">Permission</p>
          <ul class="space-y-3 mb-0 font-medium text-secondary"
              v-if="formModel.permission && formModel.permission.length">
            <li class="flex items-center space-x-2" v-for="permission in formModel.permission" :key="permission.id">
              <a-switch v-model:checked="permission.status" :checked-value="1" :un-checked-value="0"/>
              <span>{{ permission.name }}</span>
            </li>
          </ul>
        </div>
        <div>
          <p class="font-semibold">Color</p>
          <ul class="grid grid-cols-6 sm:grid-cols-11 gap-3 mb-0 child:aspect-w-1 child:aspect-h-1 child:rounded">
            <li class="cursor-pointer" v-for="color in colorList" :key="color" :style="{backgroundColor: color}"
                @click="formModel.color_code = color">
              <div class="flex justify-center items-center" v-if="formModel.color_code === color">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 4.5L6.75 12.75L3 9" stroke="white" stroke-width="3" stroke-linecap="round"
                        stroke-linejoin="round"/>
                </svg>
              </div>
            </li>
          </ul>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
          <a-button type="primary" html-type="submit" :loading="isCreateStaffLoading || isUpdateStaffLoading">
            {{ isEdit ? 'Save' : 'Create now' }}
          </a-button>
          <a-button type="ghost" danger @click="hide" v-if="isEdit">Cancel</a-button>
        </div>
      </a-form>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {usePhoneFormat, usePhoneParser} from "@/utils/formatter";
import {useGeneralStore} from "@/stores/general";
import {notification} from "ant-design-vue";
import type {Rule} from "ant-design-vue/es/form";
import handleError from "@/utils/error";
import UploadAvatar from "@/components/UploadAvatar.vue";

const generalStore = useGeneralStore();
const {createStaff, updateStaff, getListPermission} = generalStore;

interface FormModel {
  id: number | undefined,
  staff_name: string,
  staff_code: string,
  nick_name: string,
  phone: string,
  email: string,
  address: string,
  permission: any[],
  color_code: string,
  status: number,
  image_url: string,
}

const colorList = [
  "#C2F8CA",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
  "#66994D",
  "#B366CC",
  "#4D8000"
];

const initModel: FormModel = {
  id: undefined,
  staff_name: '',
  staff_code: '',
  nick_name: '',
  phone: '',
  email: '',
  address: '',
  permission: [],
  color_code: colorList[0],
  status: 1,
  image_url: '',
}
const formModel = ref<FormModel>(initModel);

const emits = defineEmits(['getListStaff'])

const isGetListPermission = ref(false);
const handleGetListPermission = async () => {
  try {
    isGetListPermission.value = true;
    await getListPermission();
    initModel.permission = generalStore.listPermission;
    formModel.value.permission = generalStore.listPermission;
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetListPermission.value = false;
  }
}
handleGetListPermission();

const staffCodeValidator = (_rule: Rule, value: string | null) => {
  if (value === '' || value === null) {
    return Promise.reject('Staff code field is required');
  }
  if (value.length < 3) {
    return Promise.reject('Staff code must contain at least 3 digits');
  }
  return Promise.resolve();
}
const formRules = ref({
  staff_name: [
    {required: true, message: 'Staff name field is required'}
  ],
  staff_code: [
    {validator: staffCodeValidator},
  ]
})

const isVisible = ref(false);
const isEdit = computed(() => formModel.value.id !== undefined);

const show = (data?: any) => {
  formModel.value = {
    id: data?.user_id,
    staff_name: data?.name ?? initModel.staff_name,
    staff_code: data?.code ?? initModel.staff_code,
    nick_name: data?.nickname ?? initModel.nick_name,
    phone: data?.phone ?? initModel.phone,
    email: data?.email ?? initModel.email,
    address: data?.address ?? initModel.address,
    permission: data?.permission ?? initModel.permission,
    color_code: data?.color_code ?? initModel.color_code,
    status: data?.status ?? initModel.status,
    image_url: data?.image_url ?? initModel.image_url,
  }
  isVisible.value = true;
};

const hide = () => {
  isVisible.value = false;
};

const isCreateStaffLoading = ref(false);
const handleCreateStaff = async () => {
  try {
    isCreateStaffLoading.value = true;
    await createStaff({
      ...formModel.value,
      list_permission: formModel.value.permission.map((permission: any) => ({
        id: permission.id,
        status: permission.status,
      }))
    });
    notification.success({
      message: 'Success',
      description: 'Create staff success',
    })
    emits('getListStaff');
    hide();
  } catch (error: any) {
    handleError({
      error: error
    })
  } finally {
    isCreateStaffLoading.value = false;
  }
}

const isUpdateStaffLoading = ref(false);
const handleUpdateStaff = async () => {
  try {
    isUpdateStaffLoading.value = true;
    const data = {
      ...formModel.value,
      id: formModel.value.id!,
      is_active: formModel.value.status,
      list_permission: formModel.value.permission.map((permission: any) => ({
        id: permission.id,
        status: permission.status,
      }))
    } as any;
    delete data.permission;
    delete data.status;
    await updateStaff(data);
    notification.success({
      message: 'Success',
      description: 'Update staff success',
    });
    emits('getListStaff');
    hide();
  } catch (error: any) {
    handleError({
      error: error
    })
  } finally {
    isUpdateStaffLoading.value = false;
  }
}

const handleSubmit = () => {
  isEdit.value ? handleUpdateStaff() : handleCreateStaff();
}

defineExpose({
  show,
  hide
})
</script>

<style lang="scss" scoped>
:deep {
  @media (max-width: 640px) {
    .ant-drawer-content-wrapper {
      width: 286px !important;
    }
    .ant-form-vertical .ant-form-item {
      flex-direction: initial;
    }
  }
}

</style>

<style lang="scss">
.create-staff {
  .ant-drawer-header {
    display: none;
  }

  .ant-drawer-body {
    padding: 0 1rem;
  }

  @media (max-width: 640px) {
    .ant-drawer-content-wrapper {
      width: 286px !important;
    }
  }

  .ant-form-item-label {
    > label {
      color: var(--color-C62)
    }
  }
}

.avatar-upload {

}
</style>
