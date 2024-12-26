'use client'

import {useEffect, useState} from 'react'
import PeopleInput from '../components/PeopleInput'
import PrizeConfig from '../components/PrizeConfig'
import Link from 'next/link'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AdminPage() {
    const [people, setPeople] = useState<string[]>([])
    const [prizes, setPrizes] = useState<{ name: string; image: string; count: number }[]>([])

    const storedPeople = localStorage.getItem('people')
    const storedPrizes = localStorage.getItem('prizes')

    useEffect(() => {
        if (storedPeople) setPeople(JSON.parse(storedPeople))
        if (storedPrizes) setPrizes(JSON.parse(storedPrizes))
    }, [])

    useEffect(() => {
        localStorage.setItem('people', JSON.stringify(people))
        localStorage.setItem('prizes', JSON.stringify(prizes))
    }, [people, prizes])

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8">
            <h1 className="text-4xl font-bold text-white text-center mb-8">管理页面</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PeopleInput people={people} setPeople={setPeople}/>
                <PrizeConfig prizes={prizes} setPrizes={setPrizes}/>
            </div>
            <div className="mt-8 text-center">
                    <Button variant="contained" href="/" startIcon={<ArrowBackIcon/>}>返回抽奖页面</Button>
            </div>
        </div>
    )
}

