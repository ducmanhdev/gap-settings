<template>
  <div class="divide-y" v-if="staffInfo">
    <div class="py-4">
      <div class="grid grid-cols-[auto_1fr] gap-4">
        <div
          :style="{'background-color': staffInfo.color_code, 'padding': staffInfo.image_url ? '0px' : '4px' }"
          class="text-white text-2xl font-semibold w-[50px] sm:w-[73px] h-[50px] sm:h-[73px] overflow-hidden rounded-full font-semibold flex justify-center items-center text-center">
          <img v-if="staffInfo.image_url" :src="staffInfo.image_url" alt="" class="w-full h-full object-fit-cover">
          <span v-else>{{ staffSortName }}</span>
        </div>
        <div
          class="space-y-2 grid grid-cols-1 sm:grid-cols-2 gap-1 child:grid child:grid-cols-[auto_auto] sm:child:grid-cols-[2fr_3fr] sm:child:items-center child:gap-2">
          <div>
            <span class="font-medium">Name:</span>
            <span>{{ staffInfo.name || 'N/A' }}</span>
          </div>
          <div>
            <span class="font-medium">Type:</span>
            <span>Staff</span>
          </div>
          <div>
            <span class="font-medium">Nick Name:</span>
            <span>{{ staffInfo.nickname || 'N/A' }}</span>
          </div>
          <div>
            <span class="font-medium">Code:</span>
            <span>{{ staffInfo.code || 'N/A' }}</span>
          </div>
          <div>
            <span class="font-medium">Cell:</span>
            <span>{{ usePhoneFormat(staffInfo.phone) || 'N/A' }}</span>
          </div>
          <div>
            <span class="font-medium">Email:</span>
            <span class="break-all">{{ staffInfo.email || 'N/A' }}</span>
          </div>
          <div>
            <span class="font-medium">Address:</span>
            <span>{{ staffInfo.address || 'N/A' }}</span>
          </div>
          <div></div>
          <div>
            <span class="font-medium">Active status:</span>
            <span>
              <a-switch
                :checked="staffInfo.status"
                @change="handleUpdateStatus"
                :loading="isUpdateStaffLoading"
                :checked-value="1"
                :un-checked-value="0"/>
            </span>
          </div>
          <div>
            <span class="font-medium">Booking staff:</span>
            <span>
              <a-switch
                :checked="staffInfo.booking_active"
                @change="handleUpdateRoleAppointment"
                :loading="isUpdateRoleAppointmentLoading"
              />
            </span>
          </div>
        </div>
      </div>
      <div class="mt-5">
        <a-button type="primary" class="!min-w-0 sm:!min-w-[190px]" @click="handleUpdateStaff">Edit information
        </a-button>
      </div>
    </div>
    <div class="py-4 space-y-3">
      <div class="sm:flex items-center justify-between mb-4">
        <div class="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-6">
          <button
            type="button"
            v-for="item in listCommissionTabs"
            :key="item.label"
            class="main-btn relative text-black"
            :class="[listCommissionTabSelected === item.value ? 'main-btn--primary' : 'main-btn--outline-primary']"
            @click="listCommissionTabSelected = item.value">
            {{ item.label }}
            <span
              @click.stop="handleChangeStaffCommissionType(item.value as any)"
              class="absolute top-[-10px] right-[-10px] z-50"
            >
                <svg v-if="staffInfo.commission_type === item.value" width="20" height="20" viewBox="0 0 20 20"
                     fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.5" fill="#129BA4" stroke="#129BA4"/>
                  <path d="M14.6667 6.5L8.25004 12.9167L5.33337 10" stroke="white" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 20 20"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9.5" class="fill-white stroke-secondary"/>
              <path d="M14.6667 6.5L8.25004 12.9167L5.33337 10" stroke="white" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round"/>
            </svg>
            </span>
          </button>
        </div>
        <button type="button" class="main-btn main-btn--primary w-[63px] mt-3 sm:mt-0" @click="handleUpdateCommission">
          Edit
        </button>
      </div>
      <base-loading v-if="isGetListCommissionByStaffLoading"></base-loading>
      <template v-else-if="listCommissionByStaff">
        <div v-if="listCommissionByStaff.salary_by_period">
          <p class="mb-1 font-medium">Salary by period</p>
          <p class="mb-0 text-primary font-semibold">{{ listCommissionByStaff?.salary_by_period }}</p>
        </div>
        <div>
          <p class="mb-1 font-medium">Employee - Owner Commission</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 font-semibold">
            <div>
              <p class="mb-1 font-normal text-secondary">For Service</p>
              <p class="mb-0 text-primary">{{ useNumberToPercentageFormat(listCommissionByStaff?.service_rate!) }}</p>
            </div>
            <div>
              <p class="mb-1 font-normal text-secondary">For Product</p>
              <p class="mb-0 text-primary">{{ useNumberToPercentageFormat(listCommissionByStaff?.product_rate!) }}</p>
            </div>
            <div>
              <p class="mb-1 font-normal text-secondary">For Giftcard</p>
              <p class="mb-0 text-primary">{{ useNumberToPercentageFormat(listCommissionByStaff?.gift_card_rate!) }}</p>
            </div>
          </div>
        </div>
        <div>
          <p class="mb-1 font-medium">Cash - Check Percentage</p>
          <p class="mb-0 text-primary font-semibold">{{
              useNumberToPercentageFormat(listCommissionByStaff?.cash_check_percentage!)
            }}</p>
        </div>
        <div>
          <p class="mb-1 font-medium">Percentage Charge For Credit Tips</p>
          <p class="mb-0 text-primary font-semibold">{{ listCommissionByStaff?.tip_to_check_percentage! * 100 }}%</p>
        </div>
      </template>
      <a-empty v-else>
        <template #description>Commission not found for staff</template>
      </a-empty>
    </div>
  </div>
  <confirm-modal ref="confirmModalRef"></confirm-modal>
</template>

<script setup lang="ts">
import {ref, computed, watch, watchEffect} from "vue";
import {usePhoneFormat} from "@/utils/formatter";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import {useGeneralStore} from "@/stores/general";
import {useNumberToPercentageFormat} from "@/utils/formatter";
import BaseLoading from "@/components/BaseLoading.vue";
import {notification} from "ant-design-vue";
import handleError from "@/utils/error";

interface Props {
  staffInfo: any,
  isGetListCommissionByStaffLoading: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  isGetListCommissionByStaffLoading: false,
});

const staffSortName = computed(() => props.staffInfo.name.split(' ').map((item: string) => item.charAt(0).toUpperCase()).join('').slice(0, 4));

const emits = defineEmits(['updateStaff', 'updateCommission', 'getListStaff', 'reloadRoleAppointment', 'reloadCommissionType']);

const confirmModalRef = ref<InstanceType<typeof ConfirmModal> | null>(null);

const handleUpdateStaff = async () => {
  emits('updateStaff');
}
const handleUpdateCommission = () => {
  emits('updateCommission')
}
const listCommissionTabs = ref([
  {
    label: 'Commission',
    value: 'commission'
  },
  {
    label: 'Salary + Commission',
    value: 'salary_commission'
  },
  {
    label: 'Salary',
    value: 'salary'
  }
]);
const listCommissionTabSelected = ref(listCommissionTabs.value[0].value);
watch(() => props.staffInfo.commission_type, (commissionType) => {
    listCommissionTabSelected.value = commissionType || listCommissionTabs.value[0].value;
}, {
    immediate: true,
})

const generalStore = useGeneralStore();
const {updateStaff, updateRoleAppointment} = generalStore;

const getCommissionContent = (key: 'commission' | 'salary_commission' | 'salary') => {
    if (
        generalStore.listCommission &&
        Object.keys(generalStore.listCommission).length > 0 &&
        generalStore.listCommission[key] &&
        !Object.values(generalStore.listCommission[key] as any).every(item => item === null)
    ) {
        return generalStore.listCommission[key]
    }
    return null;
}
const handleChangeStaffCommissionType = async (_commissionType: 'commission' | 'salary_commission' | 'salary') => {
  try {
    if (_commissionType === props.staffInfo.commission_type) return;
    if (!getCommissionContent(_commissionType)) return;
    await confirmModalRef.value?.show({
      bodyImage: 'delete-staff.svg',
      bodyTitle: 'Confirm!',
      bodyMessage: 'Are you sure you want to set Commission for this staff?'
    });
    emits('reloadCommissionType', _commissionType)
  } catch (error) {
    if (!error) return;
    handleError({
      error: error
    })
  }
};
const listCommissionByStaff = computed(() => {
  const key = listCommissionTabSelected.value as 'commission' | 'salary_commission' | 'salary'
  return getCommissionContent(key);
});
const isUpdateStaffLoading = ref(false);
const handleUpdateStatus = async (isChecked: 0 | 1) => {
  let confirmModalMessage = `Do you want to ${isChecked === 0 ? 'inactive' : 'active'} this staff?`;
  try {
    isUpdateStaffLoading.value = true;
    await confirmModalRef.value?.show({
      bodyImage: 'delete-staff.svg',
      bodyTitle: 'Confirm!',
      bodyMessage: confirmModalMessage
    });
    await updateStaff({
      id: props.staffInfo.user_id,
      is_active: isChecked,
    } as any);
    props.staffInfo.status = isChecked;
    emits('getListStaff');
    notification.success({
      message: 'Success',
      description: 'Update status of staff success',
    });
  } catch (error: any) {
    if (!error) return;
    handleError({
      error: error
    })
  } finally {
    isUpdateStaffLoading.value = false;
  }
};

const isUpdateRoleAppointmentLoading = ref(false);
const handleUpdateRoleAppointment = async (isChecked: boolean) => {
  try {
    const isActive = isChecked ? 1 : 0;
    isUpdateRoleAppointmentLoading.value = true;
    await updateRoleAppointment({
      id: props.staffInfo.user_id,
      is_active: isActive
    });
    emits('reloadRoleAppointment', isChecked);
    notification.success({
      message: 'Success',
      description: 'Update role appointment success!',
    });
  } catch (error: any) {
    handleError(error)
  } finally {
    isUpdateRoleAppointmentLoading.value = false;
  }
};
</script>

<style scoped>

</style>
