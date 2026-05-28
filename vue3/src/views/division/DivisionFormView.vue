<script setup lang="ts">
import { ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import * as z from 'zod'
import { toast } from 'vue3-toastify'
import FormField from '../../components/FormField.vue'
import { useRouter } from 'vue-router'
import { api } from '../../services/api'

const router = useRouter()

const formSchema = z.object({
  code: z.string().min(5, "Mã bộ phận ít nhất 5 ký tự").max(32, "Mã bộ phận tối đa 32 ký tự"),
  name: z.string().min(20, "Tên bộ phận ít nhất 20 ký tự").max(100, "Tên bộ phận tối đa 100 ký tự"),
  unit_id: z.number().min(1, "Vui lòng chọn đơn vị trực thuộc"),
})

const formData = ref({
  code: '',
  name: '',
  unit_id: 0
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

const { data: units = [], isLoading: isDataLoading } = useQuery({
  queryKey: ['units'],
  queryFn: api.getUnits,
})

const validate = () => {
  try {
    formSchema.parse(formData.value)
    errors.value = {}
    return true
  } catch (e) {
    if (e instanceof z.ZodError) {
      const newErrors: Record<string, string> = {}
      e.issues.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message
        }
      })
      errors.value = newErrors
    }
    return false
  }
}

const handleSubmit = async () => {
  if (!validate()) return

  isSubmitting.value = true
  try {
    const payload = { ...formData.value, unit_id: Number(formData.value.unit_id) }
    await api.createDivision(payload)

    toast.success('Thêm bộ phận thành công!')
    formData.value = { code: '', name: '', unit_id: 0 }
    router.push('/division')
  } catch (error: any) {
    toast.error(error.message || 'Có lỗi xảy ra khi thêm bộ phận')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen p-8 bg-surface-container-lowest">
    <div class="max-w-xl mx-auto mt-8 p-6 bg-surface rounded-xl border border-outline-variant shadow-sm">
      <h2 class="text-2xl font-display font-semibold mb-6 text-on-surface">
        Thêm Bộ phận / Phòng ban
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <FormField label="Mã bộ phận *">
          <input
            type="text"
            v-model="formData.code"
            @blur="validate"
            class="w-full h-12 px-4 bg-surface-container-highest rounded-lg focus:ring-2 focus:ring-primary text-on-surface outline-none transition-all"
            placeholder="VD: DIV-01"
          />
          <span v-if="errors.code" class="text-error text-sm mt-1">{{ errors.code }}</span>
        </FormField>

        <FormField label="Tên bộ phận *">
          <input
            type="text"
            v-model="formData.name"
            @blur="validate"
            class="w-full h-12 px-4 bg-surface-container-highest rounded-lg focus:ring-2 focus:ring-primary text-on-surface outline-none transition-all"
            placeholder="VD: Phòng Vật tư"
          />
          <span v-if="errors.name" class="text-error text-sm mt-1">{{ errors.name }}</span>
        </FormField>

        <FormField label="Đơn vị trực thuộc *">
          <select
            v-model.number="formData.unit_id"
            @blur="validate"
            class="w-full h-12 px-4 bg-surface-container-highest rounded-lg focus:ring-2 focus:ring-primary text-on-surface outline-none transition-all"
          >
            <option :value="0" disabled>
              {{ isDataLoading ? 'Đang tải...' : '-- Chọn đơn vị --' }}
            </option>
            <option v-for="unit in units" :key="unit.id" :value="unit.id">
              {{ unit.code }} - {{ unit.name }}
            </option>
          </select>
          <span v-if="errors.unit_id" class="text-error text-sm mt-1">{{ errors.unit_id }}</span>
        </FormField>

        <div class="pt-4 flex gap-4">
          <button
            type="button"
            @click="router.back()"
            class="w-full h-12 bg-transparent text-on-surface-variant border border-outline-variant font-medium rounded-full hover:bg-surface-container transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full h-12 bg-primary hover:bg-primary-dark text-on-primary font-medium rounded-full transition-colors disabled:opacity-50"
          >
            {{ isSubmitting ? 'Đang lưu...' : 'Lưu bộ phận' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
