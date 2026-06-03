import { Suspense } from 'react'
import { ConfigureLayoutInner } from './configure-layout-inner'

export default function ConfigureLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <ConfigureLayoutInner>{children}</ConfigureLayoutInner>
    </Suspense>
  )
}
