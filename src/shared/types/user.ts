export interface User {
    /** User ID */
    id: number
    /** Username */
    username: string
    /** Email */
    email?: string
    /** Avatar URL */
    avatar?: string
    /** Role (1=Admin, 0=User) */
    role: number
    /** GitHub Username */
    github?: string
    /** Notification Enabled */
    notice?: boolean
    /** Disable Comments */
    disabledDiscuss?: boolean
    /** Created At */
    createdAt?: string
    /** Updated At */
    updatedAt?: string
}
