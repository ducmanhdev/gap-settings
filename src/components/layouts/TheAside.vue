<template>
  <aside
    @Mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    class="w-[78px] sm:w-[60px] shrink-0 px-1.5 py-1.5 sm:px-2 sm:py-3 transition-all bg-white text-black text-lg shadow-[0_0_6px_rgba(0,0,0,0.15)] absolute top-0 left-0 h-full z-[51] overflow-y-auto"
    :class="{'sm:!w-[315px] sm:px-3.5': isShowFullAside || isMouseEnter}">
    <ul class="space-y-3 mb-0">
      <li
        v-for="menu in menuList"
        :key="menu.text">
        <router-link
          :to="menu.route"
          class="relative rounded-[10px] sm:rounded-lg text-center sm:text-left flex flex-col sm:flex-row items-center justify-center text-inherit hover:text-inherit focus:text-inherit p-2 sm:after:hidden after:inset-y-0 after:w-2 after:-left-2 after:rounded-r sm:after:bg-primary after:absolute"
          :class="[(isShowFullAside || isMouseEnter) && 'sm:py-1.5 sm:px-3 sm:justify-start']"
          :active-class="`${(isShowFullAside || isMouseEnter) && '!bg-CF2 font-bold sm:after:!hidden'} bg-CF2 sm:bg-transparent font-bold sm:after:!block`"
        >
          <span v-html="menu.icon"></span>
          <span class="ml-2.5 hidden" :class="{'sm:block': isShowFullAside || isMouseEnter}">{{ menu.text }}</span>
          <span class="text-tiny leading-tight mt-1.5 sm:hidden">{{ menu.mobileText }}</span>
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useRoute} from "vue-router";
import type {RouteParamsRaw} from "vue-router";

interface Menu {
  icon: string,
  text: string,
  mobileText: string,
  route: RouteParamsRaw,
}

const menuList = ref<Menu[]>([
  {
    icon: `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="34" height="34" rx="6" fill="#D0FDD7"/>
            <path d="M15.3333 9.5H9.5V15.3333H15.3333V9.5Z" stroke="#279D3A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M24.5 9.5H18.6667V15.3333H24.5V9.5Z" stroke="#279D3A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M24.5 18.6666H18.6667V24.5H24.5V18.6666Z" stroke="#279D3A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.3333 18.6666H9.5V24.5H15.3333V18.6666Z" stroke="#279D3A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`,
    text: 'General settings',
    mobileText: 'General',
    route: {
      name: 'General Settings'
    },
  },
  {
    icon: `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="34" height="34" rx="6" fill="#D7EBB0"/>
          <path d="M22.8333 9.33331H11.1667C10.2462 9.33331 9.5 10.0795 9.5 11V22.6666C9.5 23.5871 10.2462 24.3333 11.1667 24.3333H22.8333C23.7538 24.3333 24.5 23.5871 24.5 22.6666V11C24.5 10.0795 23.7538 9.33331 22.8333 9.33331Z" stroke="#668A21" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20.3333 7.66669V11" stroke="#668A21" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M13.6667 7.66669V11" stroke="#668A21" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9.5 14.3333H24.5" stroke="#668A21" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
    text: 'Go Booking',
    mobileText: 'Go Booking',
    route: {
      name: 'Go Booking'
    },
  },
  {
    icon: `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="34" height="34" rx="6" fill="#A9E9F8"/>
          <path d="M10.3333 23.25C10.3333 22.6975 10.5528 22.1676 10.9435 21.7769C11.3342 21.3862 11.8641 21.1667 12.4167 21.1667H23.6667" stroke="#1288A4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.4167 8.66669H23.6667V25.3334H12.4167C11.8641 25.3334 11.3342 25.1139 10.9435 24.7232C10.5528 24.3325 10.3333 23.8026 10.3333 23.25V10.75C10.3333 10.1975 10.5528 9.66758 10.9435 9.27688C11.3342 8.88618 11.8641 8.66669 12.4167 8.66669V8.66669Z" stroke="#1288A4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
    text: 'Go Checkin',
    mobileText: 'Go Checkin',
    route: {
      name: 'Go Checkin'
    },
  },
  {
    icon: `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="34" height="34" rx="6" fill="#DCBCEE"/>
        <path d="M23.6667 8.66669H10.3333C9.41285 8.66669 8.66666 9.41288 8.66666 10.3334V13.6667C8.66666 14.5872 9.41285 15.3334 10.3333 15.3334H23.6667C24.5871 15.3334 25.3333 14.5872 25.3333 13.6667V10.3334C25.3333 9.41288 24.5871 8.66669 23.6667 8.66669Z" stroke="#6E209D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M23.6667 18.6667H10.3333C9.41285 18.6667 8.66666 19.4129 8.66666 20.3334V23.6667C8.66666 24.5872 9.41285 25.3334 10.3333 25.3334H23.6667C24.5871 25.3334 25.3333 24.5872 25.3333 23.6667V20.3334C25.3333 19.4129 24.5871 18.6667 23.6667 18.6667Z" stroke="#6E209D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 12H12.0083" stroke="#6E209D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 22H12.0083" stroke="#6E209D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    text: 'Go POS settings',
    mobileText: 'Go POS',
    route: {
      name: 'Go Pos'
    },
  },
  // {
  //   icon: `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
  //   <rect width="34" height="34" rx="6" fill="#F9D4C0"/>
  //   <path d="M11 14V7H23V14" stroke="#D96425" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  //   <path d="M11 23H9C8.46957 23 7.96086 22.7893 7.58579 22.4142C7.21071 22.0391 7 21.5304 7 21V16C7 15.4696 7.21071 14.9609 7.58579 14.5858C7.96086 14.2107 8.46957 14 9 14H25C25.5304 14 26.0391 14.2107 26.4142 14.5858C26.7893 14.9609 27 15.4696 27 16V21C27 21.5304 26.7893 22.0391 26.4142 22.4142C26.0391 22.7893 25.5304 23 25 23H23" stroke="#D96425" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  //   <path d="M23 19H11V27H23V19Z" stroke="#D96425" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  //   </svg>`,
  //   text: 'Device Settings',
  //   mobileText: 'Device Settings',
  //   route: {
  //     name: 'Device'
  //   },
  // },
]);

const route = useRoute();
const isShowFullAside = computed(() => route.meta.showFullAside);

const isMouseEnter = ref(false);
const handleMouseEnter = () => {
  isMouseEnter.value = true;
}
const handleMouseLeave = () => {
  isMouseEnter.value = false;
}
</script>

<style scoped>

</style>
