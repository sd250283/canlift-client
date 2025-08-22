// DataTable types for the BasicDataTable component
export interface DataTableColumn {
  key: string
  header: string
  sortable?: boolean
  filterable?: boolean
  type?: 'text' | 'boolean' // Column type for different filter types
  render?: any // Vue component for custom rendering
  width?: string
  responsiveClasses?: string
}

export interface DataTableProps {
  data: Record<string, any>[]
  columns: DataTableColumn[]
  className?: string
  searchable?: boolean
  searchPlaceholder?: string
  itemsPerPage?: number
  showPagination?: boolean
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  compact?: boolean
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: Record<string, any>, index: number) => void
  // Server-side pagination props
  serverSide?: boolean
  totalItems?: number
  currentPage?: number
  // Buffered server-side props
  bufferedServerSide?: boolean
  cacheData?: Record<string, any>[]
  apiItemsPerPage?: number
}
