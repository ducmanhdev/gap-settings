<template>
  <div>
    <breadcrumb></breadcrumb>
    <div class="space-y-5">
      <a-card>
        <template #title>
          <div class="flex items-center justify-between space-x-1.5">
            <span>Profile Information</span>
            <router-link :to="{ name: 'Edit Information' }">
              <button
                  type="button"
                  class="main-btn main-btn--secondary text-sm"
              >
                Edit Profile
              </button>
            </router-link>
          </div>
        </template>
        <div class="mb-7">
          <img
              src="@/assets/images/avatar.jpg"
              alt=""
              class="w-[94px] h-[94px] object-cover rounded-full"
          />
        </div>
        <div class="child:grid child:grid-cols-[120px_1fr] gap-3 space-y-2 font-medium">
          <div v-for="key in Object.keys(profileData).filter(key => key !== 'password')" :key="key">
            <span class="text-secondary capitalize">{{ key }} :</span>
            // @ts-ignore
            <span>{{ profileData[key as keyof typeof profileData] }}</span>
          </div>
        </div>
      </a-card>
      <a-card>
        <template #title>
          <div class="flex items-center justify-between space-x-1.5">
            <span>Passcode</span>
            <router-link :to="{ name: 'Update Password' }">
              <button
                  type="button"
                  class="main-btn main-btn--secondary text-sm"
              >
                Change pass
              </button>
            </router-link>
          </div>
        </template>
        <div
            class="child:grid child:grid-cols-[120px_1fr] gap-3 space-y-2 font-medium"
        >
          <div>
            <span class="text-secondary capitalize">Password:</span>
            <span>{{ password }}</span>
          </div>
        </div>
      </a-card>
      <div>
        <button
            type="button"
            class="main-btn main-btn--danger"
            @click="handleDeleteAccount"
        >
          Delete account
        </button>
      </div>
    </div>
  </div>
  <confirm-modal ref="confirmModalRef"></confirm-modal>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import {notification} from "ant-design-vue";
import {useUserStore} from "@/stores/auth";
import handleError from "@/utils/error";

const userStore = useUserStore();
const profileData = ref({
  name: "Toan Nguyen",
  phone: "(+08) 6524 2459",
  email: "toan.nguyen@dtsmart.vn",
  address: "524/87A Pasteur, District 3",
  city: "HCM City",
  country: "Viet Nam",
  password: "test123",
});

const password = computed(() => profileData.value.password.replaceAll(/./g, "*"));

const confirmModalRef = ref<InstanceType<typeof ConfirmModal> | null>(null);
const handleDeleteAccount = async () => {
  try {
    await confirmModalRef.value?.show({
      headerTitle: "Delete account",
      bodyImage: "delete-account.png",
      bodyTitle: "Oh no!",
      bodyMessage: "Do you want to delete this account? Are you sure?",
    });
    notification.error({
      message: 'Success',
      description: 'Delete account success!',
      onClose() {
        userStore.logout();
      }
    });
  } catch (error) {
    if(!error) return;
    handleError({
      error: error
    })
  }
};
</script>

<style scoped></style>
