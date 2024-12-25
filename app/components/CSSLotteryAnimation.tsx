import { useState, useEffect, useRef } from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Input } from '../../components/ui/input'
import '../styles/slot-machine.css'
import {MenuItem} from "@mui/material";

interface Prize {
  name: string
  image: string
  count: number
}

interface CSSLotteryAnimationProps {
  people: string[]
  prizes: Prize[]
  winners: { name: string; prize: string }[]
  onLotteryComplete: (newWinners: { name: string; prize: string }[]) => void
  setPrizes: (prizes: Prize[]) => void
}

export default function CSSLotteryAnimation({
  people,
  prizes,
  winners,
  onLotteryComplete,
  setPrizes
}: CSSLotteryAnimationProps) {
  const [isRolling, setIsRolling] = useState(false)
  const [currentPrize, setCurrentPrize] = useState<string>('')
  const [currentCount, setCurrentCount] = useState<number>(1)
  const [displayNames, setDisplayNames] = useState<string[]>(Array(5).fill(''))
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startLottery = () => {
    if (isRolling) {
      stopLottery()
      return
    }

    const selectedPrize = prizes.find(p => p.name === currentPrize)
    if (!selectedPrize || currentCount > selectedPrize.count) {
      //toast({
      //  title: "奖品数量不足",
      //  description: `当前奖品 "${currentPrize}" 剩余数量为 ${selectedPrize?.count || 0}，无法抽取 ${currentCount} 个。`,
      //  variant: "destructive",
      //})
      return
    }

    const availablePeople = people.filter(person => !winners.some(winner => winner.name === person))
    if (availablePeople.length < currentCount) {
      //toast({
      //  title: "参与人数不足",
      //  description: `当前可参与抽奖的人数为 ${availablePeople.length}，无法抽取 ${currentCount} 个中奖者。`,
      //  variant: "destructive",
      //})
      return
    }

    setIsRolling(true)

    const rollNames = () => {
      const newDisplayNames = Array(currentCount).fill('').map(() => 
        availablePeople[Math.floor(Math.random() * availablePeople.length)]
      )
      setDisplayNames(newDisplayNames)
      timeoutRef.current = setTimeout(rollNames, 50)
    }

    rollNames()
  }

  const stopLottery = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setIsRolling(false)

    const availablePeople = people.filter(person => !winners.some(winner => winner.name === person))
    const newWinners = []

    for (let i = 0; i < currentCount; i++) {
      if (availablePeople.length > 0) {
        const winnerIndex = Math.floor(Math.random() * availablePeople.length)
        const winner = availablePeople.splice(winnerIndex, 1)[0]
        newWinners.push({ name: winner, prize: currentPrize })
      }
    }

    onLotteryComplete(newWinners)

    const updatedPrizes = prizes.map(prize => 
      prize.name === currentPrize ? { ...prize, count: prize.count - newWinners.length } : prize
    )
    setPrizes(updatedPrizes)

    setDisplayNames(newWinners.map(w => w.name))
  }

  const availablePrizes = prizes.filter(prize => prize.count > 0)
  const menuItems = availablePrizes.map((prize, index) => (
      <MenuItem value={index}>{prize.name} (剩余 {prize.count})</MenuItem>
  ))

  return (
    <div className="lottery-container">
      <div className="lottery-content">
        <div className="header">
          <h1 className="title">抽奖系统</h1>
          <div className="controls">
            <Select label="奖品" onChange={event => setCurrentPrize(event.target.name)}>
              {menuItems}
            </Select>
            <Input
              type="number"
              value={currentCount}
              onChange={(e) => setCurrentCount(Math.min(parseInt(e.target.value) || 1, 5))}
              placeholder="抽奖数量"
              min="1"
              max={Math.min(prizes.find(p => p.name === currentPrize)?.count || 1, 5)}
              className="w-32"
            />
          </div>
        </div>

        {currentPrize && (
          <div className="prize-display">
            <p className="text-xl mb-2 text-white">当前奖品：{currentPrize}</p>
            <img 
              src={prizes.find(p => p.name === currentPrize)?.image} 
              alt={currentPrize} 
            />
          </div>
        )}

        {isRolling || displayNames.some(name => name !== '') ? (
          <div className="winner-names">
            {displayNames.map((name, index) => (
              <div key={index} className="winner-column flex items-center justify-center">{name}</div>
            ))}
          </div>
        ) : null}

        <button 
          className="start-button"
          onClick={startLottery}
          disabled={!currentPrize}
        >
          {isRolling ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  )
}
