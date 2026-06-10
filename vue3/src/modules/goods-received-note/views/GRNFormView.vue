<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'
import FormField from '../../../shared/components/FormField.vue'
import AccountingSection from '../components/AccountingSection.vue'
import SignatureSection from '../components/SignatureSection.vue'
import numberToWords from '../../../shared/utils/number-to-words'
import type { CreateGRNDto, Division, Product, Warehouse } from '../../../shared/types/api'
import { api } from '../../../services/api'

const { data: warehousesData, isLoading: isWhLoading } = useQuery<Warehouse[]>({
  queryKey: ['warehouses'],
  queryFn: api.getWarehouses,
})

const { data: divisionsData, isLoading: isDivLoading } = useQuery<Division[]>({
  queryKey: ['divisions'],
  queryFn: api.getDivisions,
})

const { data: productsData, isLoading: isProdLoading } = useQuery<Product[]>({
  queryKey: ['products'],
  queryFn: api.getProducts,
})

const isDataLoading = computed(() => isWhLoading.value || isDivLoading.value || isProdLoading.value)
const warehouses = computed(() => warehousesData.value ?? [])
const divisions = computed(() => divisionsData.value ?? [])
const productsList = computed(() => productsData.value ?? [])
const router = useRouter()
const loading = ref(false)

const formData = ref<Partial<CreateGRNDto>>({
  receipt_date: new Date().toISOString().split('T')[0],
  debit_amount: 0,
  credit_amount: 0,
  source_documents: 0,
  preparer_name: '',
  deliverer_name: '',
  storekeeper_name: '',
  chief_accountant_name: '',
  products: [{
    id: Date.now(),
    product_id: 0,
    qty_actual: 0,
    qty_document: 0,
    unit_price: 0,
  }],
})

const addProduct = () => {
  formData.value.products = [
    ...(formData.value.products || []),
    {
      id: Date.now(),
      product_id: 0,
      qty_actual: 0,
      qty_document: 0,
      unit_price: 0,
    },
  ]
}

const removeProduct = (index: number) => {
  formData.value.products = (formData.value.products || []).filter((_, i) => i !== index)
}

const totalAmount = computed(() => {
  return (formData.value.products || []).reduce((sum, p) => sum + (p.qty_actual * p.unit_price), 0)
})
const products = computed(() => formData.value.products ?? [])

const selectedProductById = (productId: number | undefined) => {
  return productsList.value.find(p => p.id === productId)
}

const sourceDocuments = computed({
  get: () => formData.value.source_documents ?? 0,
  set: (value: number) => {
    formData.value.source_documents = value
  },
})
const preparerName = computed({
  get: () => formData.value.preparer_name ?? '',
  set: (value: string) => {
    formData.value.preparer_name = value
  },
})
const delivererName = computed({
  get: () => formData.value.deliverer_name ?? '',
  set: (value: string) => {
    formData.value.deliverer_name = value
  },
})
const storekeeperName = computed({
  get: () => formData.value.storekeeper_name ?? '',
  set: (value: string) => {
    formData.value.storekeeper_name = value
  },
})
const accountantName = computed({
  get: () => formData.value.chief_accountant_name ?? '',
  set: (value: string) => {
    formData.value.chief_accountant_name = value
  },
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await api.createGoodsReceivedNote(formData.value as CreateGRNDto)
    toast.success('Tạo phiếu nhập kho thành công!')
    router.push('/division')
  } catch (error) {
    toast.error('Có lỗi xảy ra khi tạo phiếu.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 mt-4 flex flex-col gap-6">
    <div class="bg-white rounded-xl paper-shadow p-4 flex flex-col gap-6 border border-outline-variant">

      <section class="grid grid-cols-1 gap-4">
        <div class="grid grid-cols-2 gap-4">
          <FormField label="NGÀY LẬP">
            <input
              v-model="formData.receipt_date"
              class="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary w-full"
              type="date"
              required
            />
          </FormField>
          <div class="grid grid-cols-2 gap-4">
            <FormField label="NỢ">
              <input
                v-model.number="formData.debit_amount"
                class="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary w-full"
                type="number"
              />
            </FormField>
            <FormField label="CÓ">
              <input
                v-model.number="formData.credit_amount"
                class="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary w-full"
                type="number"
              />
            </FormField>
          </div>
        </div>

        <FormField label="KHO HÀNG">
          <select
            v-model="formData.warehouse_id"
            class="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary"
            required
          >
            <option disabled value="">Chọn kho...</option>
            <option
              v-for="warehouse in warehouses"
              :key="warehouse.id"
              :value="warehouse.id"
            >
              {{ warehouse.name }}
            </option>
          </select>
        </FormField>

        <FormField label="BỘ PHẬN / PHÒNG BAN">
          <select
            v-model="formData.division_id"
            class="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary"
          >
            <option disabled value="">Chọn bộ phận...</option>
            <option
              v-for="division in divisions"
              :key="division.id"
              :value="division.id"
            >
              {{ division.name }}
            </option>
          </select>
        </FormField>
      </section>

      <hr class="border-outline-variant" />

      <section class="flex flex-col gap-4">
        <FormField label="HỌ TÊN NGƯỜI GIAO">
          <input
            v-model="formData.deliverer_name"
            class="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary"
            placeholder="Nhập tên người giao hàng..."
            type="text"
          />
        </FormField>
      </section>

      <hr class="border-outline-variant" />

      <section class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <h2 class="font-title-sm text-title-sm text-primary uppercase">Danh sách vật tư</h2>
          <button
            type="button"
            @click="addProduct"
            class="flex items-center gap-1 text-secondary font-label-caps text-label-caps"
          >
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            THÊM
          </button>
        </div>

        <div class="flex flex-col gap-4">
          <div
            v-for="(product, index) in products"
            :key="product.id"
            class="border border-outline-variant rounded-lg p-4 bg-white relative"
          >
            <button
              type="button"
              @click="removeProduct(index)"
              class="absolute top-2 right-2 text-error"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField label="VẬT TƯ">
                <select
                  v-model="product.product_id"
                  class="border-outline-variant rounded-lg font-body-md text-body-md p-2 focus:ring-secondary focus:border-secondary w-full"
                  required
                >
                  <option disabled value="">Chọn vật tư...</option>
                  <option
                    v-for="p in productsList"
                    :key="p.id"
                    :value="p.id"
                  >
                    {{ p.name }}
                  </option>
                </select>
              </FormField>
              <div v-if="selectedProductById(product.product_id)" class="flex gap-4 items-end pb-2">
                <div class="flex flex-col">
                  <span class="text-outline text-[10px] uppercase font-bold">Mã số</span>
                  <span class="font-bold text-primary">{{ selectedProductById(product.product_id)?.code }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-outline text-[10px] uppercase font-bold">ĐVT</span>
                  <span class="font-bold text-primary">{{ selectedProductById(product.product_id)?.calculation_unit }}</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4 bg-surface p-3 rounded-lg">
              <div class="flex flex-col">
                <span class="text-outline text-[10px] uppercase font-bold">Theo chứng từ</span>
                <input
                  v-model.number="product.qty_document"
                  class="bg-transparent border-b border-outline-variant p-0 font-bold focus:ring-0"
                  type="number"
                  step="0.001"
                />
              </div>
              <div class="flex flex-col">
                <span class="text-outline text-[10px] uppercase font-bold">Thực nhập</span>
                <input
                  v-model.number="product.qty_actual"
                  class="bg-transparent border-b border-outline-variant p-0 font-bold focus:ring-0"
                  type="number"
                  step="0.001"
                />
              </div>
              <div class="flex flex-col">
                <span class="text-outline text-[10px] uppercase font-bold">Đơn giá</span>
                <input
                  v-model.number="product.unit_price"
                  class="bg-transparent border-b border-outline-variant p-0 font-bold focus:ring-0"
                  type="number"
                />
              </div>
            </div>
            <div class="text-right mt-2">
              <span class="text-outline text-[10px] uppercase font-bold mr-2">Thành tiền:</span>
              <span class="font-bold text-secondary">
                {{ (product.qty_actual * product.unit_price).toLocaleString('vi-VN') }} VNĐ
              </span>
            </div>
          </div>
        </div>
      </section>

      <AccountingSection
        :total="totalAmount"
        :total-in-words="numberToWords(totalAmount)"
        :source-docs="sourceDocuments"
        @update:source-docs="(value: number) => sourceDocuments = value"
      />

      <SignatureSection
        :preparer="preparerName"
        :deliverer="delivererName"
        :storekeeper="storekeeperName"
        :accountant="accountantName"
        @update:preparer="(value: string) => preparerName = value"
        @update:deliverer="(value: string) => delivererName = value"
        @update:storekeeper="(value: string) => storekeeperName = value"
        @update:accountant="(value: string) => accountantName = value"
      />
    </div>

    <div class="flex flex-col gap-2 mb-8">
      <button
        @click="handleSubmit"
        :disabled="loading"
        class="w-full bg-primary text-on-primary font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"
      >
        {{ loading ? 'Đang lưu...' : 'Lưu phiếu' }}
      </button>
      <button
        @click="router.back()"
        class="w-full bg-transparent text-on-surface-variant border border-outline-variant font-bold py-4 rounded-xl hover:bg-surface-container transition-colors"
      >
        Hủy bỏ
      </button>
    </div>
  </div>
</template>
