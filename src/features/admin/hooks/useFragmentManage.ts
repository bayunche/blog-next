/**
 * Thin wrappers for fragment hooks used in admin console
 */

import {
  useCreateFragment,
  useDeleteFragment,
  useFragmentDetail,
  useFragmentList,
  useUpdateFragment,
} from '@features/fragment'

export const useFragmentListQuery = useFragmentList
export const useFragmentDetailQuery = useFragmentDetail
export const useCreateFragmentMutation = useCreateFragment
export const useUpdateFragmentMutation = useUpdateFragment
export const useDeleteFragmentMutation = useDeleteFragment
