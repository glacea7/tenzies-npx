import './App.css';
import React, {useState, useEffect, useRef} from 'react'
import Die from './components/Die'
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'

export default function App() {
	
	const [dice,setDice] = useState(allDice())
	const [tenzies, setTenzies] = useState(false)
	const [formOn, setFormOn] = useState(true)
	const [rollCount, setRollCount] = useState(0)
	const [minutes, setMinutes] = useState(0)
	const [seconds, setSeconds] = useState(0)

	let counter = 0;
	var idRef = useRef(null)

	useEffect( ()=> {
		const allHeldDice = dice.every(die=>die.isHeld)
		const sameValue = dice[0].value
		const allSameValue = dice.every(die=>die.value === sameValue)
		
		if(allHeldDice && allSameValue){
			setTenzies(true)
			clearInterval(idRef.current)
		}
		
	}, [dice])


	function generateNewDie(){
		return{
			id: nanoid(),
			value: Math.ceil(Math.random()*6),
			isHeld: false
		}
	}

	function timer(){
		
			setSeconds(prevSeconds=>prevSeconds+ 1)
			if(seconds%60===0 && seconds!==0){setMinutes(prevMinutes=>prevMinutes+1)}
		
	}


	function allDice(){
		let diceHolder = []
		
			for(let i=0;i<10;i++)
			{	
				diceHolder.push(generateNewDie())	
			}
		
			return diceHolder
		}

	function rerollDice(){
		
		if(!tenzies){
			setRollCount(prevCount=>prevCount+1)
			setDice(oldDice=>oldDice.map(die=>{
				return die.isHeld ?
				die :
				generateNewDie()
				
			}))
		}else{
			setTenzies(false)
			setFormOn(true)
			setRollCount(0)
			setMinutes(0)
			setSeconds(0)
		}
		}

	function hold(id){
			
		setDice(oldDice=>oldDice.map(die=>{
			return die.id === id ?
			 {...die, 
				isHeld: !die.isHeld} :
			 die
			
		}))
		}
	
	function handleChange(event){
		counter = (event.target.value)
		return counter
	}

	function handleSubmit(){
		handleNewDice()
		setFormOn(!formOn)
		const id = setInterval(timer,1000)
		idRef.current = id
	}

	function handleNewDice(){
		let playerChosenDice = []
		for(let i=0;i<counter;i++){
			playerChosenDice.push(generateNewDie())
		}
		setDice(playerChosenDice)
		return playerChosenDice
	}

	function displayTime(mins, secs){
		let showMinutes = mins
		let showSeconds = secs%60
		if(showMinutes < 10){
			showMinutes = "0" + showMinutes
		}
		if(showSeconds < 10){
			showSeconds = "0" + showSeconds
		}
		return showMinutes +" : "+showSeconds
	}

	const diceElement = dice.map(die=> (
		<Die 
		value={die.value}
		key={die.id}
		isHeld={die.isHeld}
		hold={()=>{hold(die.id)}}
		/>))

	const isFormOn =
		<form onSubmit={handleSubmit}>
		<input 
		type="number" 
		placeholder='Number of dices'
		onChange={handleChange}
		/>
		<button className="submit-button">Submit</button>
	</form>
	
	const rrButton = 
		<button className="reroll-button" onClick={rerollDice}>
		{tenzies && 
		<Confetti 
			width={1900}
			height={900}
			/>}
		{tenzies ? "New Game"  : "Roll"}
		</button>
	
  return (
	<main>
			<p1 className="roll-counter">Roll Counter: {rollCount}<br /><br /> {displayTime(minutes,seconds)}</p1>
			<h1>Tenzies</h1>
			<p1>Roll until all dice are the same. Click each die to hold its value between rolls.</p1>
			{formOn && isFormOn}
		<div className="dice-grid">
			{!formOn && diceElement }
		</div>
			{!formOn && rrButton}

	</main>
  );
}


