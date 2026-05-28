<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'
import FormField from '../../components/FormField.vue'
import AccountingSection from '../../components/AccountingSection.vue'
import SignatureSection from '../../components/SignatureSection.vue'
import numberToWords from '../../utils/number-to-words'
import type { CreateGRNDto, Division, Product, Unit, Warehouse } from '../../types/api'
import { api } from '../../services/api'

const { data: warehousesData, isLoading: isWhLoading } = useQuery<Warehouse[]>({
  queryKey: ['warehouses'],
  queryFn: api.getWarehouses,
})

const { data: unitsData, isLoading: isUnitLoading } = useQuery<Unit[]>({
  queryKey: ['units'],
  queryFn: api.getUnits,
})

const { data: divisionsData, isLoading: isDivLoading } = useQuery<Division[]>({
  queryKey: ['divisions'],
  queryFn: api.getDivisions,
})

const { data: productsData, isLoading: isProdLoading } = useQuery<Product[]>({
  queryKey: ['products'],
  queryFn: api.getProducts,
})

const isDataLoading = computed(() => isWhLoading.value || isUnitLoading.value || isDivLoading.value || isProdLoading.value)
const warehouses = computed(() => warehousesData.value ?? [])
const units = computed(() => unitsData.value ?? [])
const divisions = computed(() => divisionsData.value ?? [])
const productsList = computed(() => productsData.value ?? [])
const router = useRouter()
const selectedUnitId = ref<number | null>(null)
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
  ref_doc_type: '',
  ref_doc_number: '',
  ref_doc_date: '',
  ref_doc_issuer: '',
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

const selectedWarehouse = computed(() => {
  return warehouses.value.find(w => w.id === formData.value.warehouse_id)
})

const filteredDivisions = computed(() => {
  return divisions.value.filter(div => !selectedUnitId.value || div.unit_id === selectedUnitId.value)
})
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
    await api.createGoodsReceivedNote(formData.value)
    toast.success('Tạo phiếu nhập kho thành công!')
  } catch (error: any) {
    const details = error?.error?.details
    if (Array.isArray(details) && details.length > 0) {
      const messages = details.map((item: { message?: string }) => item.message).filter(Boolean).join(', ')
      const fields = details.map((item: { field?: string }) => item.field).filter(Boolean).join(', ')
      toast.error(`${error?.error?.message || 'Có lỗi xảy ra'} - ${messages} - ${fields}`)
    } else {
      toast.error(error?.error?.message || error?.message || 'Không thể kết nối tới server.')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface-container-lowest pb-12">
    <!-- Header -->
    <header class="bg-surface shadow-sm sticky top-0 z-50 border-b border-outline-variant/30">
      <div class="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button @click="router.back()" class="p-2 -ml-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant flex items-center justify-center">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div class="h-6 w-px bg-outline-variant/50"></div>
          <h1 class="font-headline-md text-xl font-bold text-primary truncate">Phiếu Nhập Kho</h1>
        </div>
        <router-link
          to="/division"
          class="h-10 px-4 bg-primary hover:bg-primary-dark text-on-primary font-medium rounded-full flex items-center transition-colors"
        >
          DS bộ phận
        </router-link>
      </div>
    </header>

    <div v-if="isDataLoading" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] transition-all duration-300">
      <div class="bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center gap-6 border border-outline-variant">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-secondary/20 rounded-full"></div>
          <div class="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <p class="font-black text-secondary uppercase tracking-[0.2em] text-sm animate-pulse">
            Đang tải dữ liệu
          </p>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="max-w-[1200px] mx-auto px-4 mt-stack-md flex flex-col gap-stack-lg mt-6">
      <div class="bg-white rounded-xl paper-shadow p-stack-md flex flex-col gap-stack-lg border border-outline-variant p-6">
        
        <section class="grid grid-cols-1 gap-stack-md gap-4">
          <div class="grid grid-cols-2 gap-stack-md gap-4">
            <FormField label="NGÀY LẬP">
              <input
                v-model="formData.receipt_date"
                class="border border-outline-variant rounded-lg font-body-md p-2 focus:ring-1 focus:ring-secondary focus:border-secondary w-full"
                type="date"
                required
              />
            </FormField>
            <div class="grid grid-cols-2 gap-stack-md gap-4">
              <FormField label="NỢ">
                <input
                  v-model.number="formData.debit_amount"
                  class="border border-outline-variant rounded-lg font-body-md p-2 focus:ring-1 focus:ring-secondary focus:border-secondary w-full"
                  type="number"
                />
              </FormField>
              <FormField label="CÓ">
                <input
                  v-model.number="formData.credit_amount"
                  class="border border-outline-variant rounded-lg font-body-md p-2 focus:ring-1 focus:ring-secondary focus:border-secondary w-full"
                  type="number"
                />
              </FormField>
            </div>
          </div>

          <FormField label="ĐƠN VỊ">
            <select
              v-model="selectedUnitId"
              @change="formData.division_id = undefined"
              class="border border-outline-variant rounded-lg font-body-md p-2 focus:ring-1 focus:ring-secondary focus:border-secondary"
            >
              <option :value="null">Chọn đơn vị...</option>
              <option v-for="unit in units" :key="unit.id" :value="unit.id">
                {{ unit.name }}
              </option>
            </select>
          </FormField>

          <FormField v-if="selectedUnitId" label="BỘ PHẬN / PHÒNG BAN">
            <select
              v-model.number="formData.division_id"
              class="border border-outline-variant rounded-lg font-body-md p-2 focus:ring-1 focus:ring-secondary focus:border-secondary"
            >
              <option :value="undefined">Chọn bộ phận...</option>
              <option v-for="div in filteredDivisions" :key="div.id" :value="div.id">
                {{ div.name }}
              </option>
            </select>
          </FormField>
        </section>

        <hr class="border-outline-variant my-2" />

        <section class="flex flex-col gap-stack-md gap-4">
          <FormField label="HỌ TÊN NGƯỜI GIAO">
            <input
              v-model="formData.deliverer_name"
              class="border border-outline-variant rounded-lg font-body-md p-2 focus:ring-1 focus:ring-secondary focus:border-secondary"
              placeholder="Nhập tên người giao hàng..."
              type="text"
            />
          </FormField>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-stack-md gap-4">
            <FormField label="THEO">
              <input
                v-model="formData.ref_doc_type"
                class="border border-outline-variant rounded-lg font-body-md p-2 focus:ring-1 focus:ring-secondary focus:border-secondary w-full"
                placeholder="Loại chứng từ (HĐ, ĐH...)"
                type="text"
              />
            </FormField>
            <FormField label="SỐ">
              <input
                v-model="formData.ref_doc_number"
                class="border border-outline-variant rounded-lg font-body-md p-2 focus:ring-1 focus:ring-secondary focus:border-secondary w-full"
                placeholder="Số chứng từ..."
                type="text"
              />
            </FormField>
            <FormField label="NGÀY">
              <input
                v-model="formData.ref_doc_date"
                class="border border-outline-variant rounded-lg font-body-md p-2 focus:ring-1 focus:ring-secondary focus:border-secondary w-full"
                type="date"
              />
            </FormField>
            <FormField label="CỦA">
              <input
                v-model="formData.ref_doc_issuer"
                class="border border-outline-variant rounded-lg font-body-md p-2 focus:ring-1 focus:ring-secondary focus:border-secondary w-full"
                placeholder="Đơn vị phát hành..."
                type="text"
              />
            </FormField>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-stack-md gap-4 items-center">
            <FormField label="NHẬP TẠI KHO">
              <select
                v-model.number="formData.warehouse_id"
                class="border border-outline-variant rounded-lg font-body-md p-2 focus:ring-1 focus:ring-secondary focus:border-secondary w-full"
                required
              >
                <option :value="undefined">Chọn kho...</option>
                <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">
                  {{ wh.name }}
                </option>
              </select>
            </FormField>

            <div v-if="selectedWarehouse" class="flex gap-4 mt-6">
              <div v-if="selectedWarehouse.location" class="flex flex-col">
                <span class="text-outline text-[10px] uppercase font-bold">Địa điểm</span>
                <span class="font-bold text-primary">{{ selectedWarehouse.location }}</span>
              </div>
              <div v-if="selectedWarehouse.address" class="flex flex-col">
                <span class="text-outline text-[10px] uppercase font-bold">Địa chỉ</span>
                <span class="font-bold text-primary">{{ selectedWarehouse.address }}</span>
              </div>
            </div>
          </div>
        </section>

        <hr class="border-outline-variant my-2" />

        <section class="flex flex-col gap-stack-md gap-4">
          <div class="flex justify-between items-center">
            <h2 class="font-bold text-lg text-primary uppercase">Danh mục vật tư</h2>
            <button
              type="button"
              @click="addProduct"
              class="flex items-center gap-1 text-secondary font-bold text-sm hover:opacity-80 transition-opacity"
            >
              <span class="material-symbols-outlined text-[18px]">add_circle</span>
              <span>THÊM</span>
            </button>
          </div>

          <div class="flex flex-col gap-4">
            <div v-for="(p, index) in products" :key="p.id" class="border border-outline-variant rounded-lg p-4 bg-white relative">
              <button
                type="button"
                @click="removeProduct(index)"
                class="absolute top-2 right-2 text-error hover:opacity-80 transition-opacity"
              >
                <span class="material-symbols-outlined">delete</span>
              </button>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField label="VẬT TƯ">
                  <select
                    v-model.number="p.product_id"
                    class="border border-outline-variant rounded-lg font-body-md p-2 focus:ring-1 focus:ring-secondary focus:border-secondary w-full"
                    required
                  >
                    <option :value="0">Chọn vật tư...</option>
                    <option
                      v-for="prod in productsList"
                      :key="prod.id"
                      :value="prod.id"
                      :disabled="products.some(pd => pd.product_id === prod.id && pd.id !== p.id)"
                    >
                      {{ prod.name }}
                    </option>
                  </select>
                </FormField>
                
                <div v-if="p.product_id" class="flex gap-4 items-end pb-2">
                  <div class="flex flex-col">
                    <span class="text-outline text-[10px] uppercase font-bold">Mã số</span>
                    <span class="font-bold text-primary">
                      {{ productsList.find(pl => pl.id === p.product_id)?.code }}
                    </span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-outline text-[10px] uppercase font-bold">ĐVT</span>
                    <span class="font-bold text-primary">
                      {{ productsList.find(pl => pl.id === p.product_id)?.calculation_unit || 'N/A' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4 bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                <div class="flex flex-col">
                  <span class="text-outline text-[10px] uppercase font-bold">Theo chứng từ</span>
                  <input
                    v-model.number="p.qty_document"
                    class="border border-outline-variant rounded p-1 focus:ring-1 focus:ring-secondary"
                    type="number"
                    step="0.001"
                  />
                </div>
                <div class="flex flex-col">
                  <span class="text-outline text-[10px] uppercase font-bold">Thực nhập</span>
                  <input
                    v-model.number="p.qty_actual"
                    class="border border-outline-variant rounded p-1 focus:ring-1 focus:ring-secondary"
                    type="number"
                    step="0.001"
                  />
                </div>
                <div class="flex flex-col">
                  <span class="text-outline text-[10px] uppercase font-bold">Đơn giá</span>
                  <input
                    v-model.number="p.unit_price"
                    class="border border-outline-variant rounded p-1 focus:ring-1 focus:ring-secondary"
                    type="number"
                  />
                </div>
              </div>
              <div class="text-right mt-3">
                <span class="text-outline text-[10px] uppercase font-bold mr-2">Thành tiền:</span>
                <span class="font-bold text-secondary text-lg">
                  {{ (p.qty_actual * p.unit_price).toLocaleString('vi-VN') }} VNĐ
                </span>
              </div>
            </div>
          </div>
        </section>

        <AccountingSection
          :total="totalAmount"
          :totalInWords="numberToWords(totalAmount)"
          v-model:sourceDocs="sourceDocuments"
        />

        <SignatureSection
          v-model:preparer="preparerName"
          v-model:deliverer="delivererName"
          v-model:storekeeper="storekeeperName"
          v-model:accountant="accountantName"
        />
      </div>

      <div class="flex flex-col gap-4 mb-8 mt-2">
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary text-on-primary font-bold py-4 rounded-xl shadow-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Đang lưu...' : 'Lưu phiếu' }}
        </button>
        <button
          type="button"
          @click="router.back()"
          class="w-full bg-transparent text-on-surface-variant border border-outline-variant font-bold py-4 rounded-xl hover:bg-surface-container transition-colors"
        >
          Hủy bỏ
        </button>
      </div>
    </form>
  </div>
</template>
