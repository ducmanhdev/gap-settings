<template>
  <div class="edit-info">
    <breadcrumb></breadcrumb>
    <div class="space-y-5">
      <a-card>
        <template #title>
          <div class="flex items-center justify-between space-x-1.5">
            <span class="text-[20px]">Edit Information</span>
          </div>
        </template>
        <div class="mb-7">
          <div
            class="cursor-pointer relative w-[94px] h-[94px] rounded-full bg-CE1 flex justify-center items-center"
          >
            <svg
              v-if="!avatarUrl"
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M36.6668 38.5V34.8333C36.6668 32.8884 35.8942 31.0232 34.5189 29.6479C33.1437 28.2726 31.2784 27.5 29.3335 27.5H14.6668C12.7219 27.5 10.8566 28.2726 9.48138 29.6479C8.10611 31.0232 7.3335 32.8884 7.3335 34.8333V38.5"
                stroke="#848484"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M21.9998 20.1667C26.0499 20.1667 29.3332 16.8834 29.3332 12.8333C29.3332 8.78325 26.0499 5.5 21.9998 5.5C17.9497 5.5 14.6665 8.78325 14.6665 12.8333C14.6665 16.8834 17.9497 20.1667 21.9998 20.1667Z"
                stroke="#848484"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <img v-else :src="avatarUrl" alt="" />
            <svg
              class="absolute bottom-0 right-0"
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_659_3605)">
                <path
                  d="M23.1499 19.975C23.1499 20.5054 22.9392 21.0141 22.5641 21.3892C22.189 21.7643 21.6803 21.975 21.1499 21.975H3.1499C2.61947 21.975 2.11076 21.7643 1.73569 21.3892C1.36062 21.0141 1.1499 20.5054 1.1499 19.975V8.97498C1.1499 8.44454 1.36062 7.93583 1.73569 7.56076C2.11076 7.18569 2.61947 6.97498 3.1499 6.97498H7.1499L9.1499 3.97498H15.1499L17.1499 6.97498H21.1499C21.6803 6.97498 22.189 7.18569 22.5641 7.56076C22.9392 7.93583 23.1499 8.44454 23.1499 8.97498V19.975Z"
                  fill="white"
                  stroke="#4C70F0"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.1499 17.975C14.359 17.975 16.1499 16.1841 16.1499 13.975C16.1499 11.7658 14.359 9.97498 12.1499 9.97498C9.94076 9.97498 8.1499 11.7658 8.1499 13.975C8.1499 16.1841 9.94076 17.975 12.1499 17.975Z"
                  stroke="#4C70F0"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_659_3605">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0.149902 0.974976)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-[28px]">
          <a-row>
            <a-col :span="24">
              <a-form-item>
                <p>Name:</p>
                <a-input />
              </a-form-item>
              <a-form-item>
                <p>Phone:</p>
                <a-input />
              </a-form-item>
              <a-form-item>
                <p>City:</p>
                <a-input />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-item>
                <p>Email:</p>
                <a-input />
              </a-form-item>
              <a-form-item>
                <p>Address:</p>
                <a-input />
              </a-form-item>
              <a-form-item>
                <p>Country:</p>
                <a-input />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <div class="mb-[147px]">
          <a-button type="primary" @click="openNotificationSuccess"
            >Save</a-button
          >
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { notification } from "ant-design-vue";

const avatarUrl = ref<string>("");

const openNotificationSuccess = () => {
  notification.success({
    message: "Notification",
    description: "Information saved successfully!",
    class: "custom-notification custom-notification-success",
  });
};

const openNotificationError = () => {
  notification.error({
    message: "Notification",
    description: "Information saved fail!",
    class: "custom-notification custom-notification-error",
  });
};
</script>

<style lang="scss">
.edit-info {
  .ant-card-body {
    padding: 34px;
    .ant-form-item-control-input-content {
      margin-bottom: 18px;
      p {
        color: #626262;
        font-weight: 500;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
