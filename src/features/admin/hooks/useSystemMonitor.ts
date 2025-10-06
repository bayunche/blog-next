/**
 * 系统监控 Hook - Socket.io 集成
 */

import { useEffect, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import { usePerformanceStore } from '@shared/stores/performanceStore'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:1234'

export function useSystemMonitor() {
  const [isConnected, setIsConnected] = useState(false)
  const addSystemPerformance = usePerformanceStore((state) => state.addSystemPerformance)

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 3,
      timeout: 5000,
    })

    socket.on('connect', () => {
      setIsConnected(true)
      console.log('🔌 Socket.io connected')
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      console.log('🔌 Socket.io disconnected')
    })

    socket.on('systemUpdate', (data: { cpuUsage: string; MemUsage: string }) => {
      const cpuUsage = parseFloat(data.cpuUsage)
      const memoryUsage = parseFloat(data.MemUsage)

      addSystemPerformance({
        cpuUsage,
        memoryUsage,
        timestamp: Date.now(),
      })
    })

    // 启动监控
    fetch('/api/monitor/start').catch(() => console.log('Monitor endpoint not available'))

    return () => {
      socket.disconnect()
    }
  }, [addSystemPerformance])

  return { isConnected }
}
