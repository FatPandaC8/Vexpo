import type { Booth } from "@vexpo/schema";
import type { Cell, OccupiedCell } from "~/components/BoothMapPicker.vue";

export function useBoothMap(
  api: Api,
  getExpoId: () => string | number | undefined,
) {
  const mapPosition = ref<Cell | null>(null)
  const occupiedCells = ref<OccupiedCell[]>([])

  function initPosition(booth: Booth | undefined) {
    mapPosition.value =
      booth?.mapRow != null && booth?.mapCol != null
        ? { row: booth.mapRow, col: booth.mapCol }
        : null
  }

  async function loadOccupied() {
    const expoId = getExpoId()
    if (!expoId) return
    try {
      const booths = await api.get<Booth[]>(`/expos/${expoId}/booths`)
      occupiedCells.value = booths
        .filter((b: Booth) => b.mapRow != null && b.mapCol != null)
        .map((b: Booth) => ({ row: b.mapRow, col: b.mapCol, name: b.name }))
    } catch {
      occupiedCells.value = []
    }
  }

  return { mapPosition, occupiedCells, initPosition, loadOccupied }
}