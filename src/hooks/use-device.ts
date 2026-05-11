import { useEffect, useState } from 'react'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

const TABLET_BREAKPOINT = 768
const DESKTOP_BREAKPOINT = 1280

function getDeviceType(width: number): DeviceType {
  if (width < TABLET_BREAKPOINT) {
    return 'mobile'
  }

  if (width < DESKTOP_BREAKPOINT) {
    return 'tablet'
  }

  return 'desktop'
}

export function useDevice() {
  const [device, setDevice] = useState<DeviceType>(() =>
    typeof window !== 'undefined' ? getDeviceType(window.innerWidth) : 'desktop',
  )

  useEffect(() => {
    const update = (): void => {
      setDevice(getDeviceType(window.innerWidth))
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return {
    device,
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
  }
}
