<template>
    <div>
        <div
            class="cursor-pointer mx-auto relative w-[94px] h-[94px] rounded-full bg-CE1 flex justify-center items-center text-white text-lg"
            @click="handleShowCropper"
            :style="{backgroundColor: !isValidUrl && color ? color : ''}"
        >
            <div v-if="!isValidUrl && name">{{ shortName }}</div>
            <svg v-if="!isValidUrl && !name" width="44" height="44" viewBox="0 0 44 44" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M36.6668 38.5V34.8333C36.6668 32.8884 35.8942 31.0232 34.5189 29.6479C33.1437 28.2726 31.2784 27.5 29.3335 27.5H14.6668C12.7219 27.5 10.8566 28.2726 9.48138 29.6479C8.10611 31.0232 7.3335 32.8884 7.3335 34.8333V38.5"
                    :stroke="defaultAvatarSvgStroke" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <path
                    d="M21.9998 20.1667C26.0499 20.1667 29.3332 16.8834 29.3332 12.8333C29.3332 8.78325 26.0499 5.5 21.9998 5.5C17.9497 5.5 14.6665 8.78325 14.6665 12.8333C14.6665 16.8834 17.9497 20.1667 21.9998 20.1667Z"
                    :stroke="defaultAvatarSvgStroke" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <img v-if="isValidUrl" :src="url" alt="" class="w-full h-full rounded-full object-cover">
            <svg class="absolute bottom-0 right-0" width="25" height="25" viewBox="0 0 25 25" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_659_3605)">
                    <path
                        d="M23.1499 19.975C23.1499 20.5054 22.9392 21.0141 22.5641 21.3892C22.189 21.7643 21.6803 21.975 21.1499 21.975H3.1499C2.61947 21.975 2.11076 21.7643 1.73569 21.3892C1.36062 21.0141 1.1499 20.5054 1.1499 19.975V8.97498C1.1499 8.44454 1.36062 7.93583 1.73569 7.56076C2.11076 7.18569 2.61947 6.97498 3.1499 6.97498H7.1499L9.1499 3.97498H15.1499L17.1499 6.97498H21.1499C21.6803 6.97498 22.189 7.18569 22.5641 7.56076C22.9392 7.93583 23.1499 8.44454 23.1499 8.97498V19.975Z"
                        fill="white" stroke="#4C70F0" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round"/>
                    <path
                        d="M12.1499 17.975C14.359 17.975 16.1499 16.1841 16.1499 13.975C16.1499 11.7658 14.359 9.97498 12.1499 9.97498C9.94076 9.97498 8.1499 11.7658 8.1499 13.975C8.1499 16.1841 9.94076 17.975 12.1499 17.975Z"
                        stroke="#4C70F0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                    <clipPath id="clip0_659_3605">
                        <rect width="24" height="24" fill="white" transform="translate(0.149902 0.974976)"/>
                    </clipPath>
                </defs>
            </svg>
        </div>
        <div class="mt-4 text-center">
            <div v-if="isUploadLoading" class="">Loading...</div>
            <div v-if="uploadMessage" :class="{'text-success': isUploadSuccess, 'text-error': isUploadError}"> {{ uploadMessage }} </div>
        </div>
        <div class="flex space-x-3 justify-center mt-4">
            <button
                type="button"
                class="main-btn main-btn--outline-primary"
                v-if="!isValidUrl"
                @click.prevent="handleShowCropper"
            >
                Add picture
            </button>
            <button
                type="button"
                class="main-btn main-btn--outline-primary"
                v-if="isValidUrl"
                @click.prevent="handleShowCropper"
            >
                Change picture
            </button>
            <button
                type="button"
                class="main-btn main-btn--outline-danger"
                v-if="isValidUrl"
                @click.prevent="handleRemove"
            >
                Delete picture
            </button>
        </div>
        <avatar-cropper v-model="isShowCropper" @uploading="handleUploading" upload-url="/"/>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
// @ts-ignore
import AvatarCropper from "vue-avatar-cropper";
import {useBusinessStore} from "@/stores/business";
import {isValidUrl as utilIsValidURl} from "@/utils/url";

const businessStore = useBusinessStore();
const props = defineProps<{
    modelValue: string,
    name?: string,
    color?: string | null,
}>();
const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void,
}>();
const isUploadLoading = ref(false);
const isUploadError = ref(false);
const isUploadSuccess = ref(false);
const uploadMessage = ref('');
const deleteUrl = ref('');
const url = computed(({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emits('update:modelValue', newValue)
    }
}));
const isValidUrl = computed(() => utilIsValidURl(url.value));
const shortName = computed(() =>
    (props?.name || '')
        .split(' ')
        .map((char: string) => char[0]?.toUpperCase())
        .join('')
        .slice(0, 3)
);
const defaultAvatarSvgStroke = computed(() => props.color ? '#fff' : '#848484');
const handleRemove = () => {
    deleteUrl.value = '';
    url.value = '';
    isUploadSuccess.value = false;
    isUploadError.value = false;
    uploadMessage.value = '';
};
const handleUpload = async (formData: any) => {
    try {
        isUploadLoading.value = true;
        isUploadError.value = false;
        isUploadSuccess.value = false;
        uploadMessage.value = '';
        deleteUrl.value = '';
        url.value = '';
        const res: any = await businessStore.upload(formData);
        isUploadSuccess.value = true;
        uploadMessage.value = 'Upload success';
        deleteUrl.value = res[0]?.delete_url;
        url.value = res[0]?.url;
    } catch (error: any) {
        isUploadError.value = true;
        uploadMessage.value = error.message;
    } finally {
        isUploadLoading.value = false;
    }
};
const handleUploading = async ({form, request, response}: any) => {
    handleUpload(form);
};
const isShowCropper = ref(false);
const handleShowCropper = () => isShowCropper.value = true;
</script>

<style lang="scss" scoped>
:deep {
  .avatar-cropper .avatar-cropper-img-input {
    display: none !important;
  }
}
</style>
