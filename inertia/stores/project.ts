import { writable } from 'svelte/store'
import type { Project } from '~/types/projects'

export const currentProjectStore = writable<Project>()
