<script setup lang="ts">
// Visitor: view details of a booth they visited

const props = defineProps<{ booth: any }>()
</script>

<template>
  <div>
    <div class="flex items-start gap-4 mb-8">
      <div class="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
        <UIcon name="i-lucide-store" class="w-7 h-7 text-blue-600" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">{{ booth.name ?? 'Booth #' + booth.id }}</h2>
        <p class="text-sm text-gray-400 mt-1">{{ booth.expo?.title ?? 'Expo —' }}</p>
      </div>
    </div>

    <div class="space-y-4">
      <div v-if="booth.description" class="p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-600 leading-relaxed">
        {{ booth.description }}
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="p-4 rounded-xl border border-gray-100 bg-white">
          <p class="text-xs text-gray-400 mb-1">Status</p>
          <span
            class="text-sm font-semibold"
            :class="booth.status === 'approved' ? 'text-emerald-600' : 'text-amber-600'"
          >
            {{ booth.status ?? 'pending' }}
          </span>
        </div>
        <div v-if="booth.expo" class="p-4 rounded-xl border border-gray-100 bg-white">
          <p class="text-xs text-gray-400 mb-1">Expo</p>
          <p class="text-sm font-semibold text-gray-800 truncate">{{ booth.expo.title }}</p>
        </div>
      </div>

      <div v-if="booth.content" class="p-4 rounded-xl border border-gray-100 bg-white">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Booth Content</p>
        <pre class="text-xs text-gray-600 whitespace-pre-wrap">{{ JSON.stringify(booth.content, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>