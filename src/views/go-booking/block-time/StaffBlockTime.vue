<template>
    <div class="staff-block-time rounded-lg shadow-lg">
        <div class="staff-block-time__left">
            <template v-if="staffList?.data?.length">
                <div class="staff-block-time__left__list">
                    <div class="overflow-y-auto">
                        <staff-item
                                v-for="staff in staffList?.data"
                                :key="staff.user_id"
                                :name="staff.name"
                                :color-code="staff.color_code"
                                :image-url="staff.image_url"
                                :status="staff.status"
                                :is-active="activeStaff?.user_id === staff.user_id"
                                hide-drag-icon
                                @click="handleActiveStaff(staff)"
                        >
                        </staff-item>
                    </div>
                </div>
                <paginate
                        class="mt-2.5 !mb-5"
                        v-if="staffList?._meta"
                        :page-count="staffList?._meta?.pageCount"
                        :prev-text="'<'"
                        :next-text="'>'"
                        :container-class="'pagination'"
                        v-model="page"
                        :click-handler="handlePaginationClick"
                        first-last-button
                ></paginate>
            </template>
            <a-empty v-else class="p-4"></a-empty>
        </div>
        <staff-block-time-right :active-staff="activeStaff"/>
    </div>
</template>
<script lang="ts" setup>
import {ref, computed} from "vue";
import StaffItem from "@/components/StaffItem.vue";
import StaffBlockTimeRight from "./StaffBlockTimeRight.vue";
import {useGoBookingStore} from "@/stores/go-booking";
import handleError from "@/utils/error";

const page = ref(1);

const goBookingStore = useGoBookingStore();
const staffList = computed<{ data: any[], _meta: any }>(() => goBookingStore.listStaff);
const isGetListStaffLoading = ref(false);
const handleGetListStaff = async () => {
    try {
        isGetListStaffLoading.value = true;
        await goBookingStore.getListStaff({page: page.value, 'per-page': 20});
        page.value = staffList.value._meta?.currentPage;
        if (!staffList.value?.data?.length) return;
        await handleActiveStaff(staffList.value?.data[0]);
    } catch (error: any) {
        handleError({error});
    } finally {
        isGetListStaffLoading.value = false;
    }
}
handleGetListStaff();

const handlePaginationClick = (page: number) => {
    handleGetListStaff();
}
const activeStaff = ref<any>(null);
const handleActiveStaff = async (staff: any) => {
    activeStaff.value = staff;
};
</script>
<style lang="scss" scoped>
.staff-block-time {
  background-color: #fff;
  width: 100%;
  color: #626262;
  display: flex;

  &__left {
    width: 40%;
    max-width: 360px;
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, .05);
    display: flex;
    flex-direction: column;
    flex-grow: 0;

    &__list {
      flex-grow: 1;
      position: relative;
      min-height: 200px;

      .overflow-y-auto {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow: auto;
        border-radius: 0.5rem 0 0 0;
      }
    }

    .pagination {
      flex-shrink: 0;
    }
  }

  @media (max-width: 768px) {
    display: block;
      &__left{
          width: 100%;
          max-width: 100%;
      }
  }
}
</style>
