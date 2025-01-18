import { writable } from 'svelte/store'
import type { Version } from '~/types/version'

export const versionStore = writable<Version[]>([])

export const currentVersionStore = writable<Version>()
