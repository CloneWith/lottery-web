import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete';

import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {IconButton} from "@mui/material";

interface Prize {
    name: string
    image: string
    count: number
}

export default function WinnersList({
                                        winners,
                                        setWinners,
                                        setShowWinners,
                                        prizes,
                                        setPrizes
                                    }: {
    winners: { name: string; prize: string }[]
    setWinners: (winners: { name: string; prize: string }[]) => void
    setShowWinners: (show: boolean) => void
    prizes: Prize[]
    setPrizes: (prizes: Prize[]) => void
}) {
    const handleDelete = (index: number) => {
        const deletedWinner = winners[index]
        const newWinners = winners.filter((_, i) => i !== index)
        setWinners(newWinners)

        // 更新奖品数量
        const updatedPrizes = prizes.map(prize =>
            prize.name === deletedWinner.prize
                ? {...prize, count: prize.count + 1}
                : prize
        )
        setPrizes(updatedPrizes)
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8">
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-4"><PersonIcon/>中奖名单</h2>
                <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 text-left">姓名</th>
                            <th className="p-2 text-left">奖品</th>
                            <th className="p-2 text-center">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {winners.map((winner, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                <td className="p-2">{winner.name}</td>
                                <td className="p-2">{winner.prize}</td>
                                <td className="p-2 text-center">
                                    <IconButton onClick={() => handleDelete(index)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 text-center">
                    <Button startIcon={<ArrowBackIcon/>} className="w-full"
                            onClick={() => setShowWinners(false)}>返回抽奖</Button>
                </div>
            </div>
        </div>
    )
}

