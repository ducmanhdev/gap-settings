<template>
  <div class="m-staff-item" :style="{ 'border-color': staff.color_code }">
    <div class="m-staff-item__info">
      <div
          class="m-staff-item__info__avatar"
          :style="{
                    backgroundColor: staff?.color_code,
                    backgroundImage: `url(${staff?.image_url})`
                  }"
      >
        {{
          staff?.image_url ? '' : staff?.name?.split(" ").map((item: any) => item.charAt(0)).join("").slice(0, 2)
        }}
      </div>
      <p class="m-staff-item__info__title">{{ staff.name }}</p>
    </div>
    <svg v-if="staff.status === 1" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         class="m-staff-item__icon feather feather-check w-6 h-6">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <svg v-if="staff.status === 0" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         class="m-staff-item__icon feather feather-x w-6 h-6 stroke-current !text-danger">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  staff: any
}>()
</script>

<style lang="scss" scoped>
.m-staff-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-left: 5px solid;
  cursor: pointer;

  &.active {
    background: linear-gradient(
            118deg,
            rgba(41, 121, 255, 1),
            rgba(41, 121, 255, 0.7)
    );
    color: #fff;
  }

  &.active &__icon {
    color: currentColor;
  }

  &__info {
    display: flex;
    align-items: center;

    &__avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      border: 2px solid #fff;
      flex-shrink: 0;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }

    &__title {
      font-size: 14px;
      font-weight: 600;
    }
  }

  &__icon {
    color: var(--primary)
  }
}
</style>