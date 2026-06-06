import { useEffect, useState } from 'react'

// Battery Status API types
interface BatteryManager extends EventTarget {
  level: number
  charging: boolean
  chargingTime: number
  dischargingTime: number
}

interface Navigator {
  getBattery?: () => Promise<BatteryManager>
  connection?: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

interface NetworkInformation extends EventTarget {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g'
  type?: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown'
  downlink?: number
  rtt?: number
}

export interface BatteryInfo {
  supported: boolean
  level: number        // 0-100
  charging: boolean
}

export interface NetworkInfo {
  online: boolean
  type: string       // 'wifi', 'ethernet', 'cellular', '4g', '3g', etc.
  downlink?: number | undefined  // Mbps
}

export function useBattery(): BatteryInfo {
  const [info, setInfo] = useState<BatteryInfo>({ supported: false, level: 100, charging: true })

  useEffect(() => {
    const nav = navigator as Navigator
    if (!nav.getBattery) return

    let battery: BatteryManager | null = null

    const update = () => {
      if (!battery) return
      setInfo({
        supported: true,
        level: Math.round(battery.level * 100),
        charging: battery.charging,
      })
    }

    nav.getBattery().then((b) => {
      battery = b
      update()
      b.addEventListener('levelchange', update)
      b.addEventListener('chargingchange', update)
    })

    return () => {
      if (battery) {
        battery.removeEventListener('levelchange', update)
        battery.removeEventListener('chargingchange', update)
      }
    }
  }, [])

  return info
}

export function useNetwork(): NetworkInfo {
  const nav = navigator as Navigator

  const getInfo = (): NetworkInfo => {
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection
    const type = conn?.type ?? (conn?.effectiveType ?? 'wifi')
    return {
      online: navigator.onLine,
      type,
      downlink: conn?.downlink,
    }
  }

  const [info, setInfo] = useState<NetworkInfo>(getInfo)

  useEffect(() => {
    const conn = (navigator as Navigator).connection
    const update = () => setInfo(getInfo())

    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    conn?.addEventListener('change', update)

    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
      conn?.removeEventListener('change', update)
    }
  }, [])

  return info
}
