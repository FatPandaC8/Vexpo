<script setup lang="ts">
/**
 * BoothMapPicker
 * A 5×6 interactive grid for picking / displaying a booth's floor-map position.
 * Props:
 *   modelValue  — { row, col } | null   (v-model)
 *   occupied    — array of { row, col, name } cells that are already taken
 *   readonly    — show-only mode (no clicking)
 */

export interface Cell {
  row: number;
  col: number;
}
export interface OccupiedCell extends Cell {
  name?: string;
}

const MAP_ROWS = 5;
const MAP_COLS = 6;

const props = withDefaults(
  defineProps<{
    modelValue: Cell | null;
    occupied?: OccupiedCell[];
    readonly?: boolean;
    label?: string;
  }>(),
  {
    occupied: () => [],
    readonly: false,
    label: "Floor Position",
  },
);

const emit = defineEmits<{ "update:modelValue": [v: Cell | null] }>();

const rows = Array.from({ length: MAP_ROWS }, (_, i) => i);
const cols = Array.from({ length: MAP_COLS }, (_, j) => j);

const COLUMN_LABELS = ["A", "B", "C", "D", "E", "F"];

function isSelected(r: number, c: number) {
  return props.modelValue?.row === r && props.modelValue?.col === c;
}

function occupiedInfo(r: number, c: number): OccupiedCell | undefined {
  return props.occupied.find((o) => o.row === r && o.col === c);
}

function isOccupied(r: number, c: number) {
  const info = occupiedInfo(r, c);
  if (!info) return false;
  if (isSelected(r, c)) return false;
  return true;
}

function handleClick(r: number, c: number) {
  if (props.readonly) return;
  if (isOccupied(r, c)) return;
  if (isSelected(r, c)) {
    emit("update:modelValue", null);
  } else {
    emit("update:modelValue", { row: r, col: c });
  }
}

function cellTitle(r: number, c: number) {
  if (isSelected(r, c)) return `Your booth — ${r + 1}${COLUMN_LABELS[c]}`;
  const info = occupiedInfo(r, c);
  if (info) return `Taken${info.name ? ": " + info.name : ""}`;
  return `${r + 1}${COLUMN_LABELS[c]}`;
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <label class="text-sm font-semibold text-gray-700">
        {{ label }}
      </label>
    </div>

    <!-- Grid -->
    <div class="bg-gray-50 border border-gray-400 rounded-2xl p-5 w-full">
      <!-- Column labels -->
      <div class="flex gap-3 mb-1 pl-8">
        <div
          v-for="c in cols"
          :key="c"
          class="w-10 text-center text-[14px] font-bold text-gray-400"
        >
          {{ COLUMN_LABELS[c] }}
        </div>
      </div>

      <!-- Rows -->
      <div v-for="r in rows" :key="r" class="flex items-center gap-3 mb-1.5">
        <!-- Row label -->
        <div class="w-5 text-[14px] font-bold text-gray-400 text-center">
          {{ r + 1 }}
        </div>

        <!-- Cells -->
        <button
          v-for="c in cols"
          :key="c"
          type="button"
          :title="cellTitle(r, c)"
          :disabled="readonly || isOccupied(r, c)"
          class="w-10 h-10 border transition-colors rounded-xl cursor-pointer"
          :class="{
            'bg-blue-300 border-2  border-[#3d52d5]': isSelected(r, c),
            'bg-gray-400 cursor-not-allowed': isOccupied(r, c),
            'hover:bg-gray-100 border-gray-400 bg-white':
              !isSelected(r, c) && !isOccupied(r, c),
          }"
          @click="handleClick(r, c)"
        ></button>
      </div>

      <!-- Legend -->
      <div class="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
        <span class="flex items-center gap-1.5 text-[11px] text-gray-500">
          <span
            class="w-3.5 h-3.5 rounded bg-[#3d52d5]/10 border-2 border-[#3d52d5] block"
          />
          Your booth
        </span>
        <span class="flex items-center gap-1.5 text-[11px] text-gray-500">
          <span
            class="w-3.5 h-3.5 rounded bg-gray-200 border border-gray-300 block"
          />
          Taken
        </span>
        <span class="flex items-center gap-1.5 text-[11px] text-gray-500">
          <span
            class="w-3.5 h-3.5 rounded bg-white border border-dashed border-gray-300 block"
          />
          Free
        </span>
        <span v-if="!readonly" class="ml-auto text-[11px] text-gray-400 italic">
          Click to select · Click again to deselect
        </span>
      </div>
    </div>
  </div>
</template>
