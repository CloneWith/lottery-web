import {useState} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField';
import {Edit, Trash2} from 'lucide-react'

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

export default function PrizeConfig({prizes, setPrizes}: {
    prizes: { name: string; image: string; count: number }[],
    setPrizes: (prizes: { name: string; image: string; count: number }[]) => void
}) {
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [count, setCount] = useState<number>(1)
    const [editIndex, setEditIndex] = useState<number | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            const newPrize = {
                name: name.trim(),
                image: image.trim() ?? "",
                count: count || 1
            }
            if (editIndex !== null) {
                const newPrizes = [...prizes]
                newPrizes[editIndex] = newPrize
                setPrizes(newPrizes)
                setEditIndex(null)
            } else {
                setPrizes([...prizes, newPrize])
            }
            setName('')
            setImage('')
            setCount(1)
        }
    }

    const handleDelete = (index: number) => {
        const newPrizes = prizes.filter((_, i) => i !== index)
        setPrizes(newPrizes)
    }

    const handleEdit = (index: number) => {
        const prize = prizes[index]
        setName(prize.name)
        setImage(prize.image)
        setCount(prize.count)
        setEditIndex(index)
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">奖品配置</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextField
                    required
                    id="gift-name-input"
                    label="奖品名称"
                    variant="standard"
                    type="text"
                    value={name}
                    className="w-full"
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    label="奖品图片 URL"
                    variant="standard"
                    type="text"
                    value={image}
                    className="w-full"
                    onChange={(e) => setImage(e.target.value)}
                />
                <TextField
                    required
                    label="奖品数量"
                    variant="standard"
                    type="number"
                    value={count}
                    error={count < 0}
                    helperText={count < 0 ? "数量须为非负整数" : ""}
                    className="w-full"
                    onChange={(e) => setCount(e.target.value ? parseInt(e.target.value, 10) : 0)}
                />
                <Button variant="outlined" startIcon={editIndex !== null ? <EditIcon/> : <AddIcon/>} type="submit"
                        className="w-full">
                    {editIndex !== null ? '更新奖品' : '添加奖品'}
                </Button>
            </form>
            <div className="mt-4">
                <h3 className="font-bold mb-2">已添加奖品：</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {prizes.map((prize, index) => (
                        <div key={index} className="border p-2 rounded">
                            <img src={prize.image} alt={prize.name} className="w-full h-32 object-cover mb-2"/>
                            <p className="font-bold">{prize.name}</p>
                            <p className={`${prize.count === 0 ? 'text-red-500' : ''}`}>
                                剩余数量：{prize.count}
                            </p>
                            <div className="mt-2 flex justify-end">
                                <Button variant="outlined" size="small" onClick={() => handleEdit(index)}>
                                    <Edit className="h-4 w-4"/>
                                </Button>
                                <Button variant="outlined" size="small" onClick={() => handleDelete(index)}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

