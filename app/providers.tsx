'use client'

import dynamic from 'next/dynamic'
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react'

const SubscribeButton = dynamic(() => import('@/ui/subscribe-modal'))

type SubscribeContextType = {
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
}
const SubscribeContext = createContext<SubscribeContextType>({} as SubscribeContextType)

export function useSubscribe() {
  const context = useContext(SubscribeContext)
  if (!context) {
    throw new Error('You forgot to add the provider')
  }
  return context
}

export default function Providers(props: PropsWithChildren<unknown>) {
  const [visible, setVisible] = useState(false)
  return (
    <SubscribeContext.Provider value={{ visible, setVisible }}>
      {props.children}
      <SubscribeButton />
    </SubscribeContext.Provider>
  )
}