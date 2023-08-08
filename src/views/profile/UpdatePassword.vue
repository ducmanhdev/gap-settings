<template>
  <div class="edit-info">
    <breadcrumb></breadcrumb>
    <div class="space-y-5">
      <a-card>
        <template #title>
          <div class="flex items-center justify-between space-x-1.5">
            <span class="text-[20px]">Edit Password</span>
          </div>
        </template>
        <div class="">
          <a-row>
            <a-col :span="24">
              <a-form-item>
                <p>Old Password:</p>
                <a-input-password />
              </a-form-item>
              <a-form-item>
                <p>New Password:</p>
                <a-input-password />
              </a-form-item>
              <a-form-item>
                <p>Enter the password:</p>
                <a-input-password />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <div class="mb-[147px]">
          <a-button type="primary">Save</a-button>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from "@/components/Breadcrumb.vue";
</script>

<style lang="scss">
.edit-info {
  .ant-card-body {
    padding: 18px 35px;
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
