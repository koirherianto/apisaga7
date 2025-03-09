import { writable } from 'svelte/store'
import type { Topbar } from '~/types/topbar'

export const topbarStore = writable<Topbar[]>([])

export const currentTobarStore = writable<Topbar>()
