import React, {useEffect, useState} from 'react'
import Button from '@mui/material/Button'
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function PeopleInput({people, setPeople}: { people: string[], setPeople: (people: string[]) => void }) {
    const [name, setName] = useState('')
    const [editIndex, setEditIndex] = useState<number | null>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            if (editIndex !== null) {
                const newPeople = [...people]
                newPeople[editIndex] = name.trim()
                setPeople(newPeople)
                setEditIndex(null)
            } else if (!people.includes(name.trim())) {
                setPeople([...people, name.trim()])
            }
            setName('')
        }
    }

    const handleDelete = (index: number) => {
        const newPeople = people.filter((_, i) => i !== index)
        setPeople(newPeople)
    }

    const handleEdit = (index: number) => {
        setName(people[index])
        setEditIndex(index)
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">人员录入</h2>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                <TextField
                    required
                    label="姓名"
                    variant="standard"
                    type="text"
                    value={name}
                    className="flex-grow"
                    onChange={(e) => setName(e.target.value)}
                />
                <Button variant="outlined" startIcon={editIndex !== null ? <EditIcon/> : <AddIcon/>}
                        type="submit">{editIndex !== null ? '更新' : '添加'}</Button>
            </form>
            <div className="mt-4">
                <h3 className="font-bold mb-2">已添加人员：</h3>
                <ul className="space-y-2">
                    {people.map((person, index) => (
                        <li key={index} className="flex items-center justify-between">
                            <span>{person}</span>
                            <div>
                                <IconButton size="small" onClick={() => handleEdit(index)}>
                                    <EditIcon/>
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDelete(index)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

