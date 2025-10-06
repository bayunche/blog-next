/**
 * Fragment domain types
 */

export interface Fragment {
  id: number
  author?: string | null
  content: string
  createdAt: string
  updatedAt?: string
}

export interface FragmentListResponse {
  list: Fragment[]
  total: number
}

export interface FragmentPayload {
  author?: string
  content: string
}
