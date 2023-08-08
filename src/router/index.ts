import {createRouter, createWebHistory, RouterView} from "vue-router";
import General from "@/views/general/General.vue";
import {useUserStore} from "@/stores/auth";

const businessSettingsRoutes = [
    {
        path: "business-profile",
        name: "Business Profile",
        component: () => import("@/views/general/business-settings/EditBusinessProfile.vue"),
    },
    {
        path: "business-work-hour",
        name: "Business Work Hour",
        component: () => import("@/views/general/business-settings/BusinessWorkHour.vue"),
    },
    {
        path: "sms-recharge",
        name: "SMS Recharge",
        component: () =>
            import("@/views/general/business-settings/SmsRecharge.vue"),
    },
    // {
    //     path: "notifications",
    //     name: "Notifications",
    //     component: () =>
    //         import("@/views/general/business-settings/Notifications.vue"),
    // },
    {
        path: "select-language",
        name: "Select Language",
        component: () =>
            import("@/views/general/business-settings/SelectLanguage.vue"),
    },
    {
        path: "passcode-settings",
        name: "Passcode Settings",
        component: () =>
            import("@/views/general/business-settings/PasscodeSetting.vue"),
    },
    {
        path: "store-policies",
        name: "Store Policies",
        component: () =>
            import("@/views/general/business-settings/StorePolicies.vue"),
    },
];

const staffServiceRoutes = [
    {
        path: "staff",
        name: "Staff",
        component: () => import("@/views/general/staff-services/staff/Staff.vue"),
    },
    {
        path: "service",
        name: "Service",
        component: () => import("@/views/general/staff-services/service/Service.vue"),
    },
];

const generalSettingRoutes = [
    {
        path: "",
        name: "General Settings Index",
        component: General,
        meta: {
            showFullAside: true,
        },
    },
    {
        path: "business-settings",
        name: "Business Settings",
        component: RouterView,
        redirect: businessSettingsRoutes[0],
        children: businessSettingsRoutes,
    },
    {
        path: "staff-service",
        name: "Staff Service",
        component: RouterView,
        redirect: staffServiceRoutes[0],
        children: staffServiceRoutes,
    },
];

const goBookingRoutes = [
    {
        path: "",
        name: "Go Booking Index",
        component: () => import("@/views/go-booking/GoBooking.vue"),
        meta: {
            showFullAside: true,
        },
    },
    {
        path: "sms-content",
        name: "SMS Content",
        component: () => import("@/views/go-booking/SmsContent.vue"),
    },
    {
        path: "booking-hours",
        name: "Booking Hours",
        component: () => import("@/views/go-booking/BookingHours.vue"),
    },
    {
        path: "web-booking-settings",
        name: "Web Booking Settings",
        component: () => import("@/views/go-booking/WebBookingSettings.vue"),
    },
    {
        path: "appointment-deposit",
        name: "Appointment Deposit",
        component: () => import("@/views/go-booking/AppointmentDeposit.vue"),
    },
    {
        path: "block-time",
        name: "Block Time",
        component: () => import("@/views/go-booking/block-time/BlockTime.vue"),
    },
];

const goCheckinRoutes = [
    {
        path: "",
        name: "Go Checkin Index",
        component: () => import("@/views/go-checkin/GoCheckin.vue"),
        meta: {
            showFullAside: true,
        },
    },
    {
        path: "ticket-setting",
        name: "Ticket Setting",
        component: () => import("@/views/go-checkin/TicketSetting.vue"),
    },
    {
        path: "checkin-setting",
        name: "Checkin Setting",
        component: () => import("@/views/go-checkin/CheckinSetting.vue"),
    },
    {
        path: "checkout-setting",
        name: "Checkout Setting",
        component: () => import("@/views/go-checkin/CheckoutSetting.vue"),
    },
    {
        path: "store-rating-on-gci-app",
        name: "Store Rating on GCI app",
        component: () => import("@/views/go-checkin/StoreRatingOnGCIApp.vue"),
    },
];

const goPosRoutes = [
    {
        path: "",
        name: "Go Pos Index",
        component: () => import("@/views/go-pos/GoPos.vue"),
        meta: {
            showFullAside: true,
        },
    },
    {
        path: "payment-terminal",
        name: "Payment Terminal",
        component: () => import("@/views/go-pos/PaymentTerminal.vue"),
    },
    {
        path: "ticket-template",
        name: "Ticket Template",
        component: () => import("@/views/go-pos/TicketTemplate.vue"),
    },
    {
        path: "tax-setting",
        name: "Tax Setting",
        component: () => import("@/views/go-pos/TaxSetting.vue"),
    },
    {
        path: "standalone-pax-mode",
        name: "Standalone PAX Mode",
        component: () => import("@/views/go-pos/StandalonePaxMode.vue"),
    },
    {
        path: "staff-receipt",
        name: "Staff Receipt",
        component: () => import("@/views/go-pos/StaffReceipt.vue"),
    },
    {
        path: "cash-discount-mode",
        name: "Cash Discount Mode",
        component: () => import("@/views/go-pos/CashDiscountMode.vue"),
    },
    {
        path: "service-fee",
        name: "Service Fee",
        component: () => import("@/views/go-pos/ServiceFee.vue"),
    },
    {
        path: "tip-on-device",
        name: "Tip On Device",
        component: () => import("@/views/go-pos/TipOnDevice.vue"),
    },
    {
        path: "print-on-clover",
        name: "Print On Clover",
        component: () => import("@/views/go-pos/PrintOnClover.vue"),
    },
    {
        path: "service-selection-mode",
        name: "Service Selection Mode",
        component: () => import("@/views/go-pos/ServiceSelectionMode.vue"),
    },
    {
        path: "flex-checkin",
        name: "Flex Checkin",
        component: () => import("@/views/go-pos/FlexCheckin.vue"),
    },
    {
        path: "tip-setting",
        name: "Tip Setting",
        component: () => import("@/views/go-pos/TipSetting.vue"),
    },
];

const deviceRoutes = [
    {
        path: "",
        name: "Device Index",
        component: () => import("@/views/device/Device.vue"),
        meta: {
            showFullAside: true,
        },
    },
    // {
    //     path: "printer-setup",
    //     name: "Printer Setup",
    //     component: () => import("@/views/device/PrinterSetup.vue"),
    // },
    {
        path: "payment",
        name: "Payment",
        component: () => import("@/views/device/Payment.vue"),
    },
];

const profileRoutes = [
    {
        path: "",
        name: "Profile Index",
        component: () => import("@/views/profile/Profile.vue"),
    },
    {
        path: "/edit-information",
        name: "Edit Information",
        component: () => import("@/views/profile/EditInformation.vue"),
    },
    {
        path: "/update-password",
        name: "Update Password",
        component: () => import("@/views/profile/UpdatePassword.vue"),
    },
];

const routes = [
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/Login.vue"),
        meta: {
            emptyLayout: true,
        },
    },
    {
        path: "/",
        name: "Home",
        redirect: generalSettingRoutes[0],
    },
    {
        path: "/general",
        name: "General Settings",
        component: RouterView,
        redirect: generalSettingRoutes[0],
        children: generalSettingRoutes,
    },
    {
        path: "/go-booking",
        name: "Go Booking",
        component: RouterView,
        redirect: goBookingRoutes[0],
        children: goBookingRoutes,
    },
    {
        path: "/go-checkin",
        name: "Go Checkin",
        component: RouterView,
        redirect: goCheckinRoutes[0],
        children: goCheckinRoutes,
    },
    {
        path: "/go-pos",
        name: "Go Pos",
        component: RouterView,
        redirect: goPosRoutes[0],
        children: goPosRoutes,
    },
    // {
    //     path: "/device",
    //     name: "Device",
    //     component: RouterView,
    //     redirect: deviceRoutes[0],
    //     children: deviceRoutes,
    // },
    {
        path: "/profile",
        name: "Profile",
        component: RouterView,
        redirect: profileRoutes[0],
        children: profileRoutes,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("@/views/NotFound.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to: any) => {
    const userStore = useUserStore();
    const accessToken = localStorage.getItem('accessToken') || userStore.accessToken;
    if (!accessToken && to.name !== 'Login') return {name: "Login"};
    if (accessToken && to.name === 'Login') return {name: "Home"};
});

export default router;
