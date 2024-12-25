import { useState } from 'react'
import Button from '@mui/material/Button'
import { Input } from '../../components/ui/input'
import { Trash2, Edit } from 'lucide-react'

export default function PeopleInput({ people, setPeople }: { people: string[], setPeople: (people: string[]) => void }) {
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
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入姓名"
          className="flex-grow"
        />
        <Button type="submit">{editIndex !== null ? '更新' : '添加'}</Button>
      </form>
      <div className="mt-4">
        <h3 className="font-bold mb-2">已添加人员：</h3>
        <ul className="space-y-2">
          {people.map((person, index) => (
            <li key={index} className="flex items-center justify-between">
              <span>{person}</span>
              <div>
                <Button variant="outlined" size="small" onClick={() => handleEdit(index)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outlined" size="small" onClick={() => handleDelete(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

