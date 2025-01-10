export type Version = {
  id: string
  projectId: string
  name: string
  slug: string
  isDefault: boolean
  visibility: string
  submenu?: Version[]
}
