<template>
  <a-drawer
      v-model:visible="isVisible"
      placement="right"
      :width="500"
      class="create-service"
  >
    <div class="py-3 flex items-center justify-between space-x-3 border-b sticky top-0 left-0 bg-white text-black z-50">
      <h2 class="main-title mb-0">{{ isEdit ? 'Update Product' : 'Add Product' }}</h2>
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
          @finish="handleSubmitProduct"
          :key="showKey"
      >
        <div>
          <div class="child:!mb-0 grid gap-3">
            <a-form-item label="Product name" name="name">
                <a-input v-model:value="formModel.name"/>
            </a-form-item>
            <a-form-item label="Product description" name="description">
              <a-textarea class="resize-none !min-h-[150px]" v-model:value="formModel.description"></a-textarea>
            </a-form-item>
            <a-form-item label="Product price" name="price">
              <a-input v-model:value="formModel.price" :disabled="isLeaveProductPriceBlank">
                <template #prefix>$</template>
              </a-input>
              <p class="mb-0 mt-2"><a-checkbox v-model:checked="isLeaveProductPriceBlank">Leave blank</a-checkbox></p>
            </a-form-item>
            <a-form-item label="Category name" name="category_name">
              <a-select v-model:value="props.categoryName" disabled></a-select>
            </a-form-item>
            <a-form-item label="Visibility">
              <ul class="grid grid-cols-2 gap-x-3 gap-y-4 mb-0">
                <li class="flex items-center space-x-3">
                  <a-switch v-model:checked="formModel.status" :checked-value="1" :un-checked-value="0"/>
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
import type { CreatePosProductRequest } from "gap-nodejs-sdk";
import handleError from "@/utils/error";

const emits = defineEmits(['getListProduct']);
const generalStore = useGeneralStore();

const isVisible = ref(false);
const isEdit = computed(() => formModel.value.id);

interface Props {
  categoryId: number,
  categoryName: string,
}

const props = defineProps<Props>()

interface FormModel {
  id?: number,
  name: string,
  price: number,
  description: string,
  group_id: string,
  status: 0 | 1,
}

const initFormModel: FormModel = {
  id: undefined,
  name: '',
  price: 0,
  description: '',
  group_id: 'both',
  status: 1,
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

const showKey = ref(0);
const show = (data?: any) => {
  showKey.value += 1;
  formModel.value = Object.entries(initFormModel).reduce((result: any, [key, value]) => {
    result[key] = data[key] ?? value;
    return result;
  }, {});
  isLeaveProductPriceBlank.value = formModel.value.price === 0;
  isVisible.value = true;
};
const hide = () => {
  isVisible.value = false;
};

const {createProduct, updateProduct} = generalStore;

const isSubmitProductLoading = ref(false);
const handleCreateProduct = async () => {
  try {
    isSubmitProductLoading.value = true;
    const data: CreatePosProductRequest = {
      ...formModel.value,
      category_id: props.categoryId,
    }
    await createProduct(data);
    hide();
    emits('getListProduct');
    notification.success({
      message: 'Success',
      description: 'Create product success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSubmitProductLoading.value = false;
  }
};
const handleUpdateProduct = async () => {
  try {
    isSubmitProductLoading.value = true;
    await updateProduct({
      ...formModel.value,
      id: formModel.value.id!,
      category_id: props.categoryId,
    });
    hide();
    emits('getListProduct');
    notification.success({
      message: 'Success',
      description: 'Update product success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSubmitProductLoading.value = false;
  }
};
const handleSubmitProduct = () => {
  if (formModel.value.id) {
    return handleUpdateProduct();
  }
  return handleCreateProduct();
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
