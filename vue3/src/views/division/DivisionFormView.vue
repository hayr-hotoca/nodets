<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
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

const { data: units = [], isLoading: isDataLoading } = useQuery({
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
        Thêm Bộ phận / Phòng ban
      </h2>
      <form @submit.prevent="form.handleSubmit" class="space-y-5">
        <form.Field name="code">
          <template #default="{ field }">
            <FormField label="Mã bộ phận *">
              <input
                type="text"
                :value="field.state.value"
                @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                class="w-full h-12 px-4 bg-surface-container-highest rounded-lg focus:ring-2 focus:ring-primary text-on-surface outline-none transition-all"
                placeholder="VD: DIV-01"
              />
              <span v-if="field.state.meta.errors.length" class="text-error text-sm mt-1">
                {{ field.state.meta.errors[0]?.message }}
              </span>
            </FormField>
          </template>
        </form.Field>

        <form.Field name="name">
          <template #default="{ field }">
            <FormField label="Tên bộ phận *">
              <input
                type="text"
                :value="field.state.value"
                @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
                class="w-full h-12 px-4 bg-surface-container-highest rounded-lg focus:ring-2 focus:ring-primary text-on-surface outline-none transition-all"
                placeholder="VD: Phòng Vật tư"
              />
              <span v-if="field.state.meta.errors.length" class="text-error text-sm mt-1">
                {{ field.state.meta.errors[0]?.message }}
              </span>
            </FormField>
          </template>
        </form.Field>

        <form.Field name="unit_id">
          <template #default="{ field }">
            <FormField label="Đơn vị trực thuộc *">
              <select
                :value="field.state.value"
                @change="(e) => field.handleChange(Number((e.target as HTMLSelectElement).value))"
                class="w-full h-12 px-4 bg-surface-container-highest rounded-lg focus:ring-2 focus:ring-primary text-on-surface outline-none transition-all"
              >
                <option :value="0" disabled>
                  {{ isDataLoading ? 'Đang tải...' : '-- Chọn đơn vị --' }}
                </option>
                <option v-for="unit in units" :key="unit.id" :value="unit.id">
                  {{ unit.code }} - {{ unit.name }}
                </option>
              </select>
              <span v-if="field.state.meta.errors.length" class="text-error text-sm mt-1">
                {{ field.state.meta.errors[0]?.message }}
              </span>
            </FormField>
          </template>
        </form.Field>

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
            :disabled="form.state.isSubmitting"
            class="w-full h-12 bg-primary hover:bg-primary-dark text-on-primary font-medium rounded-full transition-colors disabled:opacity-50"
          >
            {{ form.state.isSubmitting ? 'Đang lưu...' : 'Lưu bộ phận' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
