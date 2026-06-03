'use client'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'

export function useWizardState() {
  return useQueryStates(
    {
      context: parseAsString,
      season: parseAsString,
      date: parseAsString,
      style: parseAsString,
      location: parseAsString,
      duration: parseAsString,
      team: parseAsString,
      delivery: parseAsString,
      extras: parseAsArrayOf(parseAsString).withDefault([]),
    },
    { history: 'push' },
  )
}

export type WizardStateValues = ReturnType<typeof useWizardState>[0]
