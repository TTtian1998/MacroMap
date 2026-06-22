import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { useHistoryStore } from '../store/historyStore'
import { RoleSelect } from '../components/RoleSelect'
import { PortfolioSelect } from '../components/PortfolioSelect'
import { MainGame } from '../components/MainGame'
import { Report } from '../components/Report'

export default function App() {
  const gameStatus = useGameStore((s) => s.gameStatus)
  const selectedRole = useGameStore((s) => s.selectedRole)
  const initHistory = useHistoryStore((s) => s.init)

  useEffect(() => {
    initHistory()
  }, [initHistory])

  if (gameStatus === 'finished') return <Report />
  if (gameStatus === 'playing') return <MainGame />
  if (!selectedRole) return <RoleSelect />
  return <PortfolioSelect />
}