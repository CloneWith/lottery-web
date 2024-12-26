import React, {useRef, useState} from 'react'
import Select from '@mui/material/Select';
import '../styles/slot-machine.css'
import {FormControl, InputLabel, MenuItem} from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {PlayArrow, Stop} from "@mui/icons-material";
import {SnackbarProvider, useSnackbar, VariantType} from "notistack";

export interface Prize {
    name: string
    image: string
    count: number
}

interface LotteryProps {
    people: string[]
    prizes: Prize[]
    winners: { name: string; prize: string }[]
    onLotteryComplete: (newWinners: { name: string; prize: string }[]) => void
    setPrizes: (prizes: Prize[]) => void
}


export default function LotteryDisplay({
                                           people,
                                           prizes,
                                           winners,
                                           onLotteryComplete,
                                           setPrizes
                                       }: LotteryProps) {
    const [isRolling, setIsRolling] = useState(false)
    const [currentPrize, setCurrentPrize] = useState<string>('')
    const [currentCount, setCurrentCount] = useState<number>(1)
    const [displayNames, setDisplayNames] = useState<string[]>(Array(5).fill(''))
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const {enqueueSnackbar} = useSnackbar()
    const createSnackbar = (message: string, variant: VariantType) => () => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, {variant});
    };

    const startLottery = () => {
        if (isRolling) {
            stopLottery()
            return
        }

        const selectedPrize = prizes.find(p => p.name === currentPrize)
        if (!selectedPrize || currentCount > selectedPrize.count) {
            createSnackbar(
                `奖品数量不足\n当前奖品 "${currentPrize}" 剩余数量为 ${selectedPrize?.count || 0}，无法抽取 ${currentCount} 个。`,
                "error"
            )
            return
        }

        const availablePeople = people.filter(person => !winners.some(winner => winner.name === person))
        if (availablePeople.length < currentCount) {
            createSnackbar(
                `参与人数不足\n当前可参与抽奖的人数为 ${availablePeople.length}\n无法抽取 ${currentCount} 个中奖者。`,
                "error"
            )
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
                newWinners.push({name: winner, prize: currentPrize})
            }
        }

        onLotteryComplete(newWinners)

        const updatedPrizes = prizes.map(prize =>
            prize.name === currentPrize ? {...prize, count: prize.count - newWinners.length} : prize
        )
        setPrizes(updatedPrizes)

        setDisplayNames(newWinners.map(w => w.name))
    }

    const availablePrizes = prizes.filter(prize => prize.count > 0)

    return (
        <SnackbarProvider maxSnack={5}>
            <div className="lottery-container">
                <div className="lottery-content">
                    <div className="header">
                        <h1 className="title">抽奖系统</h1>
                        <div className="controls">
                            <FormControl variant="filled" sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="gift-label">奖品</InputLabel>
                                <Select required labelId="gift-label" variant="filled"
                                        onChange={value => setCurrentPrize(value.target.value as string)}>
                                    {availablePrizes.map((prize, index) => (
                                        <MenuItem key={index}
                                                  value={prize.name}>{prize.name} (剩余 {prize.count})</MenuItem>
                                    ))}
                                </Select>
                                <TextField
                                    required
                                    label="抽奖数量"
                                    variant="filled"
                                    type="number"
                                    value={currentCount}
                                    error={currentCount < 1 || currentCount > (prizes.find(p => p.name === currentPrize)?.count || 1)}
                                    helperText={currentCount < 1 || currentCount > (prizes.find(p => p.name === currentPrize)?.count || 1) ? "应在奖品数量范围内" : ""}
                                    onChange={(e) => setCurrentCount(parseInt(e.target.value))}
                                />
                            </FormControl>
                        </div>
                    </div>

                    {currentPrize && (
                        <div className="prize-display">
                            <p className="text-xl mb-2 text-white">当前奖品：{currentPrize}</p>
                            <img
                                src={prizes.find(p => p.name === currentPrize)?.image.trim()
                                    ? prizes.find(p => p.name === currentPrize)?.image.trim() : null}
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

                    <Button
                        variant="contained"
                        startIcon={isRolling ? <Stop/> : <PlayArrow/>}
                        className="start-button"
                        onClick={startLottery}
                        disabled={!currentPrize}
                    >{isRolling ? 'Stop' : 'Start'}</Button>
                </div>
            </div>
        </SnackbarProvider>
    )
}
