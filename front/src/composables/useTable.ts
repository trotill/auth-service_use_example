import { computed, ref, watch, ComputedRef, Ref } from 'vue'
import { QTableProps } from 'quasar'

export function useTable ({
  sortByDef,
  rowsPerPageDef,
  descendingDef,
  totalCount
}: {
  sortByDef: string;
  rowsPerPageDef: number;
  descendingDef: boolean;
  totalCount: Ref<number>
}) {
  const tablePagination = ref<QTableProps['pagination']>({
    page: 1,
    rowsPerPage: rowsPerPageDef,
    sortBy: sortByDef,
    descending: descendingDef
  })
  const limit = computed(() => tablePagination.value?.rowsPerPage ?? rowsPerPageDef)

  const offset = computed(() => {
    if (tablePagination.value?.page && tablePagination.value?.rowsPerPage) {
      return (tablePagination.value.page - 1) * tablePagination.value.rowsPerPage
    }
    return 0
  })

  watch(totalCount, (total) => {
    if (tablePagination.value) {
      tablePagination.value.rowsNumber = total
    }
  })
  return {
    tablePagination,
    limit,
    offset
  }
}
