import Button from '@mui/material/Button'
import Fireworks from './Fireworks'

export default function ResultDisplay({ 
  winners, 
  setShowResult 
}: { 
  winners: { name: string; prize: string }[], 
  setShowResult: (show: boolean) => void 
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden">
      <Fireworks />
      <h2 className="text-2xl font-bold mb-4">中奖结果</h2>
      <ul className="space-y-2">
        {winners.map((winner, index) => (
          <li key={index} className="flex justify-between items-center border-b pb-2">
            <span className="font-bold">{winner.name}</span>
            <span className="text-green-600">{winner.prize}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-center">
        <Button onClick={() => setShowResult(false)}>返回抽奖</Button>
      </div>
    </div>
  )
}

