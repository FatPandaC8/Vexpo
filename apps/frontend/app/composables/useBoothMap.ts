// composables/booth/useBoothMap.ts
// Responsibility: map position selection + occupied cells loading

import type { Cell, OccupiedCell } from "~/components/BoothMapPicker.vue";

export function useBoothMap(
  api: any,
  getExpoId: () => string | number | undefined,
) {
  const mapPosition = ref<Cell | null>(null)
  const occupiedCells = ref<OccupiedCell[]>([])

  function initPosition(booth: any) {
    mapPosition.value =
      booth?.mapRow != null && booth?.mapCol != null
        ? { row: booth.mapRow, col: booth.mapCol }
        : null
  }

  async function loadOccupied() {
    const expoId = getExpoId()
    if (!expoId) return
    try {
      const booths = await api.get<any[]>(`/expos/${expoId}/booths`)
      occupiedCells.value = (booths as any[])
        .filter((b: any) => b.mapRow != null && b.mapCol != null)
        .map((b: any) => ({ row: b.mapRow, col: b.mapCol, name: b.name }))
    } catch {
      occupiedCells.value = []
    }
  }

  return { mapPosition, occupiedCells, initPosition, loadOccupied }
}