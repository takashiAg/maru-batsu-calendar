import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment, { Moment } from 'moment'
import { FaRegCircle } from 'react-icons/fa'
import { BsTriangle } from 'react-icons/bs'
import { MdClose } from 'react-icons/md'
const Container = styled.div`
    position: relative;
    display: flex;
    justify-content: left;
    flex-direction: row;
    flex-wrap: wrap;
    border-left: 1px solid #ccc;
    border-top: 1px solid #ccc;
`
const DayContainer = styled.div`
    display: flex;
    height: 100px;
    flex-basis: 14.28%;
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    flex-direction: column;
`
const DayLabel = styled.div<{ disable?: boolean }>`
    color: ${({ disable = false }) => (disable ? '#cccccc' : 'black')};
    text-align: center;
    border-bottom: 1px solid #ccc;
    flex-basis: 20px;
`
const DayContent = styled.div<{ disable?: boolean }>`
    color: ${({ disable = false }) => (disable ? '#cccccc' : 'black')};
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    & > * {
        height: 50px;
        width: 50px;
    }
`
interface DayProps {
    disable?: boolean
    date: Moment
}

const Day: React.FC<DayProps> = (props) => {
    const { disable = false, date } = props
    const [value, setValue] = useState<number>(0)
    const handleClick = () => setValue((v) => (v > 1 ? 0 : v + 1))
    return (
        <DayContainer>
            <DayLabel disable={disable}>{date.date() === 1 ? date.format('M/D') : date.format('D')}</DayLabel>

            <DayContent onClick={handleClick}>
                {!disable && value === 0 && <MdClose />}
                {!disable && value === 1 && <BsTriangle />}
                {!disable && value === 2 && <FaRegCircle />}
            </DayContent>
        </DayContainer>
    )
}

const HomePage: React.FC = () => {
    const Today = new Date()
    const OneWeekLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    const [startDate, setStartDate] = React.useState<Date>(Today)
    const [endDate, setEndDate] = React.useState<Date>(OneWeekLater)
    const [dates, setDates] = React.useState<Moment[]>([])

    useEffect(() => {
        const s = moment(startDate)
        const e = moment(endDate)
        const diff = e.diff(s, 'days') || 0
        const days = Array(diff + 2 + 6 + 7)
            .fill(0)
            .map((_, i) => s.clone().add(i - 6, 'days'))
            .filter((d, i) => i >= 6 || d.weekday() - i < 0)
            .filter((d) => d.isSameOrBefore(e, 'day') || (d.diff(e, 'days') <= 6 && d.weekday() >= e.weekday()))

        setDates(days)

        return () => {}
    }, [startDate, endDate])

    return (
        <>
            <DatePicker
                dateFormat="yyyy/MM/dd"
                selected={startDate}
                onChange={(selectedDate) => {
                    setStartDate(selectedDate || Today)
                }}
            />
            <DatePicker
                dateFormat="yyyy/MM/dd"
                selected={endDate}
                onChange={(selectedDate) => {
                    setEndDate(selectedDate || Today)
                }}
            />
            <Container>
                {dates.map((date, index) => {
                    const disable = date.isBefore(startDate, 'day') || date.isAfter(endDate, 'day')
                    return <Day key={index} disable={disable} date={date} />
                })}
            </Container>
        </>
    )
}

export default HomePage
