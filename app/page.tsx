'use client'

import {useEffect, useState} from 'react'
import LotteryDisplay from './components/LotteryDisplay'
import WinnersList from './components/WinnersList'
import Button from '@mui/material/Button'
import SettingsIcon from '@mui/icons-material/Settings'
import ChecklistIcon from '@mui/icons-material/Checklist';
import Link from 'next/link'

interface Prize {
  name: string
  image: string
  count: number
}

export default function Home() {
  const [people, setPeople] = useState<string[]>([])
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [winners, setWinners] = useState<{ name: string; prize: string }[]>([])
  const [showWinners, setShowWinners] = useState(false)

  useEffect(() => {
    const storedPeople = localStorage.getItem('people')
    const storedPrizes = localStorage.getItem('prizes')
    const storedWinners = localStorage.getItem('winners')

    if (storedPeople) setPeople(JSON.parse(storedPeople))
    if (storedPrizes) setPrizes(JSON.parse(storedPrizes))
    if (storedWinners) setWinners(JSON.parse(storedWinners))
  }, [])

  useEffect(() => {
    localStorage.setItem('prizes', JSON.stringify(prizes))
    localStorage.setItem('winners', JSON.stringify(winners))
  }, [prizes, winners])

  const handleLotteryComplete = (newWinners: { name: string; prize: string }[]) => {
    setWinners([...winners, ...newWinners])
  }

  return (
    <div className="min-h-screen">
      {!showWinners ? (
        <>
          <LotteryDisplay
            people={people} 
            prizes={prizes} 
            winners={winners} 
            onLotteryComplete={handleLotteryComplete}
            setPrizes={setPrizes}
          />
          <div className="fixed bottom-4 right-4 flex p-4 justify-center gap-4 flex-auto bg-white rounded-lg shadow-lg">
            <Button variant="outlined" startIcon={<ChecklistIcon />} onClick={() => setShowWinners(true)}>查看中奖名单</Button>
            <Link href="/admin">
              <Button variant="contained" startIcon={<SettingsIcon />}>管理人员和奖品</Button>
            </Link>
          </div>
        </>
      ) : (
        <WinnersList 
          winners={winners} 
          setWinners={setWinners}
          setShowWinners={setShowWinners}
          prizes={prizes}
          setPrizes={setPrizes}
        />
      )}
    </div>
  )
}

