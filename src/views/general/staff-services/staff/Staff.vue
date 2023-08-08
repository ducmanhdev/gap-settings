<template>
  <div class="sm:h-full flex flex-col">
    <breadcrumb class="shrink-0"></breadcrumb>
    <a-card class="grow" :body-style="{padding: 0, height: '100%'}">
      <div class="grid grid-cols-1 sm:grid-cols-[312px_1fr] gap-3.5 sm:gap-0 sm:h-full">
        <div
          class="shadow sm:shadow-lg rounded-lg sm:rounded-none bg-white sm:bg-inherit sm:h-full grid grid-rows-[auto_1fr]">
          <div class="px-4">
            <div class="min-h-[60px] py-2 border-b flex justify-between items-center space-x-3">
              <p class="main-title mb-0">Staff</p>
              <svg @click="handleOpenCreateStaff" class="cursor-pointer" width="28" height="28" viewBox="0 0 28 28"
                   fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" rx="4" fill="#129BA4"/>
                <path d="M14 8V20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 14H20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="py-3">
              <div class="relative">
                <a-dropdown placement="bottomRight" :trigger="['click']" overlay-class-name="!min-w-0">
                  <div class="relative">
                    <input
                      v-model="searchStaffKeyWords"
                      @click.stop
                      type="text"
                      class="mr-4 rounded-3xl border border-transparent text-A4 w-full h-[34px] text-sm appearance-none outline-none pl-[34px] pr-4 transition bg-[url('@/assets/images/icon-search.svg')] bg-no-repeat bg-[left_10px_center] shadow-[0_0_4px_0_rgba(0,0,0,0.15)] focus:border-primary focus:shadow-none"
                      placeholder="Search ...">
                    <div
                      class="cursor-pointer w-5 h-5 flex items-center justify-center absolute top-1/2 right-4 -translate-y-1/2 text-primary"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.3337 2.5H1.66699L8.33366 10.3833V15.8333L11.667 17.5V10.3833L18.3337 2.5Z"
                              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <template #overlay>
                    <a-menu v-model:selected-keys="filterSelected" @click="handleSelectFilter">
                      <a-menu-item v-for="item in filterList" :key="item.key">{{ item.text }}</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </div>
          </div>
          <div class="mb-0 relative">
            <base-loading-overlay v-if="isSortListStaffLoading"></base-loading-overlay>
            <div class="px-4" v-if="isGetListStaffLoading">
              <a-skeleton active/>
            </div>
            <div v-else-if="listStaff && listStaff.length"
                 class="sm:absolute top-0 left-0 right-0 bottom-0 overflow-auto">
              <draggable
                v-model="listStaff"
                @end="handleSortStaffList"
                handle=".drag-button"
                item-key="id"
              >
                <template #item="{element}">
                  <staff-item
                    :key="element.user_id"
                    :name="element.name"
                    :color-code="element.color_code"
                    :image-url="element.image_url"
                    :status="element.status"
                    :is-active="staffSelected.user_id === element.user_id"
                    @click="staffSelected = element"
                  >
                  </staff-item>
                </template>
              </draggable>
            </div>
            <div class="text-center py-2 sm:py-0" v-else>Empty staff</div>
          </div>
        </div>
        <div
          class="shadow sm:shadow-none rounded-lg sm:rounded-none bg-white sm:bg-inherit px-4 sm:h-full grid-cols-1 grid grid-rows-[auto_1fr]">
          <div
            class="sm:min-h-[60px] py-2 border-b sm:flex items-center justify-between space-y-2 sm:space-y-0 sm:space-x-3">
            <p class="main-title mb-0">{{ isEdit ? 'Configuration' : 'Staff information' }}</p>
            <button type="button" class="main-btn main-btn--danger" v-if="!isEdit && staffSelected" @click="handleDeleteStaff">
              Delete staff
            </button>
          </div>
          <div class="py-3 sm:h-full" v-if="staffSelected">
            <a-tabs v-if="isEdit" v-model:activeKey="activeEditTab" class="custom-tabs">
              <a-tab-pane key="Commission" tab="Commission">
                <edit-commission
                  :loading="isGetListCommissionByStaffLoading"
                  :staff-id="staffSelected?.user_id"
                  @back="handleHideEdit"
                  @reload-commission="handleReloadEditCommission('commission')"
                >
                </edit-commission>
              </a-tab-pane>
              <a-tab-pane key="Salary + Commission" tab="Salary + Commission">
                <edit-salary-commission
                  :loading="isGetListCommissionByStaffLoading"
                  :staff-id="staffSelected?.user_id"
                  @back="handleHideEdit"
                  @reload-commission="handleReloadEditCommission('salary_commission')"
                >
                </edit-salary-commission>
              </a-tab-pane>
              <a-tab-pane key="Salary" tab="Salary">
                <edit-salary
                  :loading="isGetListCommissionByStaffLoading"
                  :staff-id="staffSelected?.user_id"
                  @back="handleHideEdit"
                  @reload-commission="handleReloadEditCommission('salary')"
                >
                </edit-salary>
              </a-tab-pane>
            </a-tabs>
            <a-tabs v-else v-model:activeKey="activeInfoTab" class="custom-tabs h-full grid grid-rows-[auto_1fr]">
              <a-tab-pane key="Information" tab="Information">
                <information
                  :staff-info="staffSelected"
                  :is-get-list-commission-by-staff-loading="isGetListCommissionByStaffLoading"
                  @update-staff="handleOpenUpdateStaff(staffSelected)"
                  @update-commission="handleShowEdit"
                  @reload-role-appointment="handleReloadRoleAppointment"
                  @reload-commission-type="handleReloadCommissionType"
                >
                </information>
              </a-tab-pane>
              <a-tab-pane key="Services" tab="Services">
                <services :staff-id="staffSelected?.user_id"></services>
              </a-tab-pane>
              <a-tab-pane key="Working hours" tab="Working hours">
                <working-hours :staff-id="staffSelected?.user_id"></working-hours>
              </a-tab-pane>
            </a-tabs>
          </div>
          <a-empty class="py-3" v-else></a-empty>
        </div>
      </div>
    </a-card>
  </div>
  <create-staff ref="createStaffRef" @get-list-staff="handleGetListStaff"></create-staff>
  <confirm-modal ref="confirmModalRef"></confirm-modal>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import StaffItem from "@/components/StaffItem.vue";
import Information from "./Information.vue";
import EditSalary from "./EditSalary.vue";
import EditCommission from "./EditCommission.vue";
import EditSalaryCommission from "./EditSalaryCommission.vue";
import CreateStaff from "./CreateStaff.vue";
import Services from "./Services.vue";
import WorkingHours from "./WorkingHours.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import {useGeneralStore} from "@/stores/general";
import {notification} from "ant-design-vue";
import BaseLoadingOverlay from "@/components/BaseLoadingOverlay.vue"
import type {GetListStaffResponse} from "gap-nodejs-sdk";
import handleError from "@/utils/error";
import draggable from 'vuedraggable';

const generalStore = useGeneralStore();
const {getListStaff, sortStaff, deleteStaff, updateStaffCommission, getListCommissionByStaff} = generalStore;

const filterList = ref([
  {
    text: 'All',
    key: null
  },
  {
    text: 'Active',
    key: 1
  },
  {
    text: 'Inactive',
    key: 0
  }
]);
const filterSelected = ref<any[]>([filterList.value[0].key]);
const handleSelectFilter = ({key}: { key: null }) => {
  filterSelected.value = [key];
}

const listStaff = ref<GetListStaffResponse>([]);
const staffSelected = ref<any>(null);
const isGetListStaffLoading = ref(false);
const handleGetListStaff = async () => {
  try {
    isGetListStaffLoading.value = true;
    await getListStaff({
      page: 1,
      'per-page': 100,
      sort: 'user_id',
      status: filterSelected.value[0]
    });
    listStaff.value = generalStore.listStaff?.data || [];

    const listStaffContainsStaffSelected = listStaff.value.find((staff: any) => staff?.user_id === staffSelected.value?.user_id);
    if(!listStaffContainsStaffSelected) staffSelected.value = listStaff.value[0];
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetListStaffLoading.value = false;
  }
};
watch(filterSelected, handleGetListStaff, {immediate: true});

const isSortListStaffLoading = ref(false);
const handleSortStaffList = async () => {
  try {
    isSortListStaffLoading.value = true;
    await sortStaff({
      employees: listStaff.value.map((item: any) => item?.user_id).join(','),
    });
    notification.success({
      message: 'Success',
      description: 'Sort list staff success!'
    })
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSortListStaffLoading.value = false;
  }
}

const searchStaffKeyWords = ref('');
watch(searchStaffKeyWords, (newKeywords: string) => {
  if (newKeywords === '') {
    listStaff.value = generalStore.listStaff?.data || [];
  } else {
    listStaff.value = (generalStore.listStaff?.data || []).filter((item: any) => item.name.toLowerCase().includes(newKeywords.toLowerCase()))
    staffSelected.value = listStaff.value[0]
  }
});

const activeInfoTab = ref('Information');
const activeEditTab = ref('Commission');
const isEdit = ref(false);
const handleShowEdit = () => {
  isEdit.value = true;
};
const handleHideEdit = () => {
  isEdit.value = false;
};

const confirmModalRef = ref<InstanceType<typeof ConfirmModal> | null>(null);
const createStaffRef = ref<InstanceType<typeof CreateStaff> | null>(null);
const handleOpenCreateStaff = () => {
  createStaffRef.value?.show();
}
const handleOpenUpdateStaff = (staffData: any) => {
  createStaffRef.value?.show(staffData);
}
const handleDeleteStaff = async () => {
  try {
    await confirmModalRef.value?.show({
      headerTitle: 'Delete Staff',
      bodyImage: 'delete-staff.svg',
      bodyTitle: 'Oh no!',
      bodyMessage: 'Do you want to delete this staff?'
    });
    await deleteStaff({
      id: staffSelected.value?.user_id,
    });
    notification.success({
      message: 'Success',
      description: 'Delete list staff success!'
    })
    handleGetListStaff();
  } catch (error) {
    if (!error) return;
    handleError({
      error: error
    })
  }
}

const isGetListCommissionByStaffLoading = ref(false);
const handleGetListCommissionByStaff = async () => {
  try {
    if (!staffSelected.value?.user_id) return;
    isGetListCommissionByStaffLoading.value = true;
    await getListCommissionByStaff({staff_id: staffSelected.value.user_id});
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetListCommissionByStaffLoading.value = false;
  }
};

type CommissionType = 'commission' | 'salary_commission' | 'salary';
const handleReloadCommissionType = async (_commissionType: CommissionType) => {
  try {
    await updateStaffCommission({
      id: staffSelected.value?.user_id,
      staff_code: staffSelected.value.code,
      commission_type: _commissionType,
    } as any);
    const staffSelectedIndex = listStaff.value.findIndex((item: any) => item.user_id === staffSelected.value.user_id);
    if (staffSelectedIndex !== -1) {
      (listStaff.value[staffSelectedIndex] as any).commission_type = _commissionType;
    }
  } catch (error) {
    handleError({
      error: error
    })
  }
};
const handleReloadEditCommission = (_commissionType: CommissionType) => {
  handleGetListCommissionByStaff();
  handleReloadCommissionType(_commissionType)
};
const handleReloadRoleAppointment = async (newRoleAppointment: number) => {
  const staffSelectedIndex = listStaff.value.findIndex((item: any) => item.user_id === staffSelected.value.user_id);
  if (staffSelectedIndex !== -1) {
    (listStaff.value[staffSelectedIndex] as any).booking_active = newRoleAppointment;
  }
};
watch(staffSelected, () => {
  isEdit.value = false;
  activeInfoTab.value = 'Information';
  activeEditTab.value = 'Commission';
  handleGetListCommissionByStaff();
}, {immediate: true, deep: true});
</script>

<style lang="scss" scoped>
:deep {
  @media (max-width: 640px) {
    .ant-card {
      background-color: transparent;
      box-shadow: none;
    }
    .custom-tabs {
      .ant-tabs-nav-list {
        flex-wrap: wrap;
        gap: 0.625rem;

        .ant-tabs-tab {
          flex: 0 0 auto
        }

        //.ant-tabs-tab-btn{
        //  font-size: 0.75rem;
        //}
      }
    }
  }

  .ant-tabs-content {
    height: 100%;
  }
}
</style>
