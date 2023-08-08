<template>
    <a-drawer
            v-model:visible="isVisible"
            placement="right"
            :width="500"
            class="create-service"
    >
        <div class="py-3 flex items-center justify-between space-x-3 border-b sticky top-0 left-0 bg-white text-black z-50">
            <h2 class="main-title mb-0">{{ isEdit ? 'Update Service' : 'Add Service' }}</h2>
            <svg @click="hide" class="cursor-pointer" width="28" height="28" viewBox="0 0 28 28" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path
                        d="M14.0002 25.6667C20.4435 25.6667 25.6668 20.4434 25.6668 14C25.6668 7.55672 20.4435 2.33337 14.0002 2.33337C7.55684 2.33337 2.3335 7.55672 2.3335 14C2.3335 20.4434 7.55684 25.6667 14.0002 25.6667Z"
                        stroke="#EB5757" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17.5 10.5L10.5 17.5" stroke="#EB5757" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"/>
                <path d="M10.5 10.5L17.5 17.5" stroke="#EB5757" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"/>
            </svg>
        </div>
        <div class="py-4">
            <a-form
                    layout="vertical"
                    class="space-y-6"
                    :model="formModel"
                    :rules="formRules"
                    @finish="handleSubmitService"
                    :key="showKey"
            >
                <div>
                    <p class="font-semibold">Service image</p>
                    <div class="child:!mb-0 grid gap-3">
                        <a-form-item>
                            <upload-avatar v-model="formModel.image_path" :name="formModel.name"
                                           :color="categoryColor"></upload-avatar>
                        </a-form-item>
                        <a-form-item label="Service name" name="name">
                            <a-input v-model:value="formModel.name"/>
                        </a-form-item>
                        <a-form-item label="Service description" name="description">
                            <a-textarea class="resize-none !min-h-[150px]" v-model:value="formModel.note"></a-textarea>
                        </a-form-item>
                        <a-form-item label="Service duration" name="duration">
                            <div class="grid grid-cols-2 gap-3">
                                <a-select :options="durationHoursOptions" v-model:value="durationHours"></a-select>
                                <a-select :options="durationMinutesOptions" v-model:value="durationMinutes"></a-select>
                            </div>
                        </a-form-item>
                        <a-form-item label="Product price" name="price">
                            <a-input v-model:value="formModel.price" :disabled="isLeaveProductPriceBlank">
                                <template #prefix>$</template>
                            </a-input>
                            <p class="mb-0 mt-2">
                                <a-checkbox v-model:checked="isLeaveProductPriceBlank">Leave blank</a-checkbox>
                            </p>
                        </a-form-item>
                        <a-form-item label="Supply share" name="supply_share">
                            <a-input v-model:value="formModel.supply_share"/>
                        </a-form-item>
                        <a-form-item label="Category name" name="category_id">
                            <a-select v-model:value="formModel.category_id" disabled>
                                <a-select-option :value="formModel.category_id">{{
                                    formModel.cate_name
                                    }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="Visibility">
                            <div class="mb-3">
                                <a-checkbox v-model:checked="isServiceVisible">Service visible to client during online
                                    booking.
                                </a-checkbox>
                            </div>
                            <p class="text-C90 mb-4">When enabled, this service will appear in your Booking Site and
                                Embedded Widgets.
                                This will not affect your ability to choose it when you create an appointment.</p>
                            <ul class="grid grid-cols-2 gap-x-3 gap-y-4 mb-0">
                                <li class="flex items-center space-x-3">
                                    <a-switch v-model:checked="formModel.show_on_checkin" :checked-value="1"
                                              :un-checked-value="0"/>
                                    <span>Shown on Go Check In</span>
                                </li>
                                <li class="flex items-center space-x-3">
                                    <a-switch v-model:checked="formModel.show_on_pos" :checked-value="1"
                                              :un-checked-value="0"/>
                                    <span>Shown on Go POS</span>
                                </li>
                                <li class="flex items-center space-x-3">
                                    <a-switch v-model:checked="formModel.status" :checked-value="1"
                                              :un-checked-value="0"/>
                                    <span>Active</span>
                                </li>
                            </ul>
                        </a-form-item>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
                    <a-button type="primary" html-type="submit">Submit</a-button>
                    <a-button type="ghost" danger @click="hide">Cancel</a-button>
                </div>
            </a-form>
        </div>
    </a-drawer>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import {notification} from "ant-design-vue";
import {useGeneralStore} from "@/stores/general";
import handleError from "@/utils/error";
import UploadAvatar from "@/components/UploadAvatar.vue";
import {createUrl, isValidUrl} from '@/utils/url';

const emits = defineEmits(['getListService']);
const generalStore = useGeneralStore();

const isVisible = ref(false);
const isEdit = computed(() => formModel.value.id);

interface FormModel {
    id?: number,
    name: string,
    category_id: number,
    cate_name: string,
    price: number,
    web_booking_visible: '0' | '1',
    note: string,
    duration: number,
    group_id: number,
    status: 0 | 1,
    supply_share: number,
    show_on_checkin: 0 | 1,
    show_on_booking: 0 | 1,
    show_on_pos: 0 | 1,
    image_path: string,
}

const initFormModel: FormModel = {
    id: undefined,
    name: '',
    category_id: 0,
    cate_name: '',
    price: 0,
    web_booking_visible: '1',
    note: '',
    duration: 60,
    group_id: 0,
    status: 1,
    supply_share: 0,
    show_on_checkin: 1,
    show_on_booking: 1,
    show_on_pos: 1,
    image_path: '',
}
const formModel = ref<FormModel>(initFormModel);
const formRules = ref({
    name: [
        {
            required: true,
            message: 'The service name field is required'
        }
    ]
});
const durationHoursOptions = Array.from(Array(15)).map((item, index) => ({
    label: `${index} hrs`,
    value: index
}));
const durationMinutesOptions = Array.from(Array(12)).map((item, index) => ({
    label: `${index * 5} mins`,
    value: index * 5
}));

const showKey = ref(0);
const durationHours = ref(0);
const durationMinutes = ref(0);
const categoryColor = ref(null);

const show = (data?: any) => {
    showKey.value += 1;
    formModel.value = Object.entries(initFormModel).reduce((result: any, [key, value]) => {
        if (key === 'image_path') {
            result['image_path'] = createUrl(data['image_path'], data['image_base_url']);
        } else {
            result[key] = data[key] ?? value;
        }
        return result;
    }, {});
    durationHours.value = Math.floor(formModel.value.duration / 60);
    durationMinutes.value = formModel.value.duration % 60;
    categoryColor.value = data?.category_color;
    isVisible.value = true;
};

const hide = () => {
    isVisible.value = false;
};

const isServiceVisible = computed({
    get() {
        return formModel.value.web_booking_visible === '1'
    },
    set(newValue) {
        return formModel.value.web_booking_visible = newValue ? '1' : '0';
    }
});

const {createService, updateService, uploadFile} = generalStore;

const isSubmitServiceLoading = ref(false);
const handleCreateService = async () => {
    try {
        isSubmitServiceLoading.value = true;
        const data: any = {
            ...formModel.value,
            duration: durationHours.value * 60 + durationMinutes.value,
        }
        if(isValidUrl(data.image_path)) {
            const url = new URL(data.image_path);
            data.image_path = url.pathname;
            data.image_base_url = url.origin;
        }
        await createService(data);
        hide();
        emits('getListService');
        notification.success({
            message: 'Success',
            description: 'Create service success',
        });
    } catch (error) {
        handleError({
            error: error
        })
    } finally {
        isSubmitServiceLoading.value = false;
    }
};
const handleUpdateService = async () => {
    try {
        isSubmitServiceLoading.value = true;
        const data: any = {
            id: formModel.value.id!,
            data: {
                ...formModel.value,
                id: formModel.value.id!,
                duration: durationHours.value * 60 + durationMinutes.value
            },
        }
        if(isValidUrl(data.data.image_path)) {
            const url = new URL(data.data.image_path);
            data.data.image_path = url.pathname;
            data.data.image_base_url = url.origin;
        }
        await updateService(data);
        hide();
        emits('getListService');
        notification.success({
            message: 'Success',
            description: 'Update service success',
        });
    } catch (error) {
        console.error(error)
        handleError({
            error: error
        })
    } finally {
        isSubmitServiceLoading.value = false;
    }
};
const handleSubmitService = () => {
    if (formModel.value.id) {
        return handleUpdateService();
    }
    return handleCreateService();
}
const isLeaveProductPriceBlank = ref(true);

defineExpose({
    show,
    hide
})
</script>

<style lang="scss">
.create-service {
  .ant-drawer-header {
    display: none;
  }

  .ant-drawer-body {
    padding: 0 1rem;
  }

  .ant-form-item-label {
    > label {
      color: var(--color-C62)
    }
  }
}

.avatar-upload {

}
</style>
