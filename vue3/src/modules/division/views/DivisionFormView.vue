<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { useQuery } from '@tanstack/vue-query'
import * as z from 'zod'
import { toast } from 'vue3-toastify'
import FormField from '../../../shared/components/FormField.vue'
import { useRouter } from 'vue-router'
import { api } from '../../../services/api'
import type { Unit } from '../../../shared/types/api'

const router = useRouter()

const formSchema = z.object({
  code: z.string().min(5, "Mã bộ phận ít nhất 5 ký tự").max(32, "Mã bộ phận tối đa 32 ký tự"),
  name: z.string().min(20, "Tên bộ phận ít nhất 20 ký tự").max(100, "Tên bộ phận tối đa 100 ký tự"),
  unit_id: z.number().min(1, "Vui lòng chọn đơn vị trực thuộc"),
})

const { data: units = [], isLoading: isDataLoading } = useQuery<Unit[]>({
  queryKey: ['units'],
  queryFn: api.getUnits,
})

const form = useForm({
  defaultValues: {
    code: '',
    name: '',
    unit_id: 0,
  },
  validators: {
    onSubmit: formSchema,
  },
  onSubmit: async ({ value }) => {
    try {
      const payload = { ...value, unit_id: Number(value.unit_id) }
      await api.createDivision(payload)

      toast.success('Thêm bộ phận thành công!')
      form.reset()
      router.push('/division')
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi thêm bộ phận')
    }
  },
})
</script>

<template>
  <div class="min-h-screen p-8 bg-surface-container-lowest">
    <div class="max-w-xl mx-auto mt-8 p-6 bg-surface rounded-xl border border-outline-variant shadow-sm">
      <h2 class="text-2xl font-display font-semibold mb-6 text-on-surface">
        Thêm Bộ phận Mới
      </h2>

      <div v-if="isDataLoading" class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span class="ml-3 text-on-surface-variant font-medium">Đang tải dữ liệu...</span>
      </div>

      <form v-else @submit.prevent="form.handleSubmit()">
        <div class="space-y-6">
          <FormField label="Mã Bộ phận">
            <input
              v-model="form.state.values.code"
              @blur="form.handleBlur('code')"
              type="text"
              class="w-full border border-outline-variant rounded-lg px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </FormField>

          <FormField label="Tên Bộ phận">
            <input
              v-model="form.state.values.name"
              @blur="form.handleBlur('name')"
              type="text"
              class="w-full border border-outline-variant rounded-lg px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </FormField>

          <FormField label="Đơn vị Trực thuộc">
            <select
              v-model="form.state.values.unit_id"
              @blur="form.handleBlur('unit_id')"
              class="w-full border border-outline-variant rounded-lg px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option disabled value="0">-- Chọn đơn vị --</option>
              <option
                v-for="unit in units"
                :key="unit.id"
                :value="unit.id"
              >
                {{ unit.code }} - {{ unit.name }}
              </option>
            </select>
          </FormField>
        </div>

        <div class="mt-8 flex gap-4">
          <button
            type="button"
            @click="router.back()"
            class="flex-1 px-4 py-2 text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container transition-colors"
          >
            Quay lại
          </button>
          <button
            type="submit"
            :disabled="form.state.isSubmitting"
            class="flex-1 px-4 py-2 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-colors"
          >
            {{ form.state.isSubmitting ? 'Đang lưu...' : 'Lưu Bộ phận' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
