import { useState, useEffect, useRef } from 'react'
import Button from '@mui/material/Button'
import { Input } from '../../components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import Select from "@mui/material/Select";
import {MenuItem} from "@mui/material";

const perspectiveClass = "perspective-1000"
const transform3dClass = "transform-3d"

export default function LotteryDisplay({ 
  people, 
  prizes, 
  winners, 
  setWinners, 
  currentPrize, 
  setCurrentPrize, 
  currentCount, 
  setCurrentCount,
  setShowResult,
  setPrizes
}: { 
  people: string[], 
  prizes: { name: string; image: string; count: number }[], 
  winners: { name: string; prize: string }[],
  setWinners: (winners: { name: string; prize: string }[]) => void,
  currentPrize: string,
  setCurrentPrize: (prize: string) => void,
  currentCount: number,
  setCurrentCount: (count: number) => void,
  setShowResult: (show: boolean) => void,
  setPrizes: (prizes: { name: string; image: string; count: number }[]) => void,
}) {
  const [isRolling, setIsRolling] = useState(false)
  const [displayNames, setDisplayNames] = useState<string[]>([])
  const slotMachineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .${perspectiveClass} { perspective: 1000px; }
      .${transform3dClass} { transform-style: preserve-3d; }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    if (isRolling) {
      const interval = setInterval(() => {
        const newNames = people
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
        setDisplayNames(newNames)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isRolling, people])

  const startLottery = () => {
    const selectedPrize = prizes.find(p => p.name === currentPrize)
    if (!selectedPrize || currentCount > selectedPrize.count) {
      //toast({
      //  title: "奖品数量不足",
      //  description: `当前奖品 "${currentPrize}" 剩余数量为 ${selectedPrize?.count || 0}，无法抽取 ${currentCount} 个。`,
      //  variant: "destructive",
      //})
      return
    }

    setIsRolling(true)
    setTimeout(() => {
      setIsRolling(false)
      const availablePeople = people.filter(person => !winners.some(winner => winner.name === person))
      const newWinners = []
      for (let i = 0; i < currentCount; i++) {
        if (availablePeople.length > 0) {
          const randomIndex = Math.floor(Math.random() * availablePeople.length)
          const winner = availablePeople.splice(randomIndex, 1)[0]
          newWinners.push({ name: winner, prize: currentPrize })
        }
      }
      setWinners([...winners, ...newWinners])
      
      // 更新奖品数量
      const updatedPrizes = prizes.map(prize => 
        prize.name === currentPrize ? { ...prize, count: prize.count - currentCount } : prize
      )
      setPrizes(updatedPrizes)
      
      setShowResult(true)
    }, 5000) // 强制5秒滚动时间
  }

  const availablePrizes = prizes.filter(prize => prize.count > 0)

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-4">抽奖</h2>
      <div className="flex gap-4 mb-4">
        <Select label="选择奖品" onChange={value => setCurrentPrize(value.target.name)}>
            {availablePrizes.map((prize, index) => (
              <MenuItem key={index} value={prize.name}>{prize.name} (剩余 {prize.count})</MenuItem>
            ))}
        </Select>
        <Input
          type="number"
          value={currentCount}
          onChange={(e) => setCurrentCount(parseInt(e.target.value))}
          placeholder="抽奖数量"
          min="1"
          max={prizes.find(p => p.name === currentPrize)?.count || 1}
        />
        <Button onClick={startLottery} disabled={isRolling || !currentPrize}>开始抽奖</Button>
      </div>
      <div 
        ref={slotMachineRef} 
        className={`relative h-64 overflow-hidden bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border-4 border-yellow-400 shadow-inner ${perspectiveClass}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-20 bg-white opacity-20 shadow-lg"></div>
        </div>
        <div className="flex justify-around h-full">
          {[0, 1, 2].map((column) => (
            <div key={column} className="flex-1 overflow-hidden">
              <AnimatePresence>
                {displayNames.map((name, index) => (
                  <motion.div
                    key={`${name}-${index}-${column}`}
                    className="absolute w-full text-center"
                    initial={{ y: "100%", rotateX: -90 }}
                    animate={{ y: `${(index - 1) * 33.33}%`, rotateX: 0 }}
                    exit={{ y: "-100%", rotateX: 90 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <span 
                      className={`inline-block font-bold ${transform3dClass}`}
                      style={{
                        fontSize: `${Math.random() * 1.5 + 1.5}rem`,
                        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      {name}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
      {currentPrize && (
        <div className="text-center mt-4">
          <p className="text-xl mb-2">当前奖品：{currentPrize}</p>
          <img 
            src={prizes.find(p => p.name === currentPrize)?.image} 
            alt={currentPrize} 
            className="w-32 h-32 object-cover mx-auto rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  )
}

