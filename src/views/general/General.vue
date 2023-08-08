<template>
  <div class="mb-3 flex flex-col sm:flex-row items-start justify-between">
    <breadcrumb class="!mb-0"></breadcrumb>
    <a-dropdown placement="bottomRight">
      <button type="button" class="main-btn ml-auto mt-2.5 sm:mt-0 sm:ml-3 main-btn--secondary">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.99999 18.3333C14.6024 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39759 14.6024 1.66663 9.99999 1.66663C5.39762 1.66663 1.66666 5.39759 1.66666 9.99996C1.66666 14.6023 5.39762 18.3333 9.99999 18.3333Z"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10 6.66663V13.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round"/>
          <path d="M6.66666 10H13.3333" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round"/>
        </svg>
        <span>Create</span>
      </button>
      <template #overlay>
        <a-menu style="min-width: 138px;">
          <a-menu-item v-for="item in createMenuList" :key="item.title">{{ item.title }}</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
  <div class="space-y-3.5 sm:space-y-5">
    <a-card
      v-for="group in settingsList"
      :key="group.title">
      <template #title>
        <div class="flex items-center space-x-1.5">
          <img class="w-6 sm:w-[30px] shrink-0" :src="getImageUrl(group.icon)" alt="">
          <span>{{ group.title }}</span>
        </div>
      </template>
      <div class="mx-auto max-w-[530px] grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <router-link
          :to="setting.route"
          class="flex items-center space-x-3 max-w-[250px] text-inherit"
          v-for="setting in group.settings"
          :key="setting.title">
          <img :src="getImageUrl(setting.icon)" alt="" class="w-18 flex-shrink-0">
          <div class="flex-grow">
            <p class="font-medium mb-0.5">{{ setting.title }}</p>
            <p class="text-tiny line-clamp-2 mb-0">{{ setting.summary }}</p>
          </div>
        </router-link>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {getImageUrl} from "@/utils/url";
import type {RouteParamsRaw} from "vue-router";
import Breadcrumb from "@/components/Breadcrumb.vue";

interface SettingList {
  icon: string,
  title: string,
  settings: Setting[]
}

interface Setting {
  icon: string,
  title: string,
  summary: string,
  route: RouteParamsRaw,
}

const settingsList = ref<SettingList[]>([
  {
    icon: 'business-settings.svg',
    title: 'Business settings',
    settings: [
      {
        icon: 'business-profile.svg',
        title: 'Business Profile',
        summary: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
        route: {
          name: 'Business Profile'
        },
      },
      // {
      //   icon: 'booking-hours.svg',
      //   title: 'Business Work Hour',
      //   summary: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
      //   route: {
      //     name: 'Business Work Hour'
      //   },
      // },
      // {
      //   icon: 'notifications.svg',
      //   title: 'Notifications',
      //   summary: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
      //   route: {
      //     name: 'Notifications'
      //   },
      // },
      {
        icon: 'sms-recharge.svg',
        title: 'SMS Recharge',
        summary: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
        route: {
          name: 'SMS Recharge'
        },
      },
      {
        icon: 'passcode-settings.svg',
        title: 'Passcode Settings',
        summary: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
        route: {
          name: 'Passcode Settings'
        },
      },
      {
        icon: 'store-policies.svg',
        title: 'Store Policies',
        summary: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
        route: {
          name: 'Store Policies'
        },
      },
      {
        icon: 'languages.svg',
        title: 'Languages',
        summary: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
        route: {
          name: 'Select Language'
        },
      },
    ]
  },
  {
    icon: 'service-staff.svg',
    title: 'Service & Staff',
    settings: [
      {
        icon: 'service.svg',
        title: 'Service',
        summary: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
        route: {
          name: 'Service'
        },
      },
      {
        icon: 'staff.svg',
        title: 'Staff',
        summary: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
        route: {
          name: 'Staff'
        },
      },
    ]
  }
]);

const createMenuList = ref([
  {
    title: 'Customer',
    route: {
      name: 'Business Profile'
    },
  },
  {
    title: 'Staff',
    route: {
      name: 'Business Profile'
    },
  },
  {
    title: 'Service',
    route: {
      name: 'Business Profile'
    },
  },
  {
    title: 'Product',
    route: {
      name: 'Business Profile'
    },
  },
  {
    title: 'Expense',
    route: {
      name: 'Business Profile'
    },
  },
  {
    title: 'Cash Registry',
    route: {
      name: 'Business Profile'
    },
  },
]);
</script>

<style scoped>

</style>
