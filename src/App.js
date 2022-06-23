import './App.css';
import React, {useState, useEffect} from 'react'
import Die from './components/Die'
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'

export default function App() {
	
	const [dice,setDice] = useState(allDice())
	const [tenzies, setTenzies] = useState(false)
	const [formOn, setFormOn] = useState(true)
	
	let counter = 0;
	let rollCounter = 0;


	useEffect( ()=> {
		const allHeldDice = dice.every(die=>die.isHeld)
		const sameValue = dice[0].value
		const allSameValue = dice.every(die=>die.value === sameValue)

		if(allHeldDice && allSameValue){
			setTenzies(true)	
			}

	},[dice])
	
	function generateNewDie(){
		return{
			id: nanoid(),
			value: Math.ceil(Math.random()*6),
			isHeld: false
		}
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
		console.log("rollcounter++")
		rollCounter=rollCounter+1
		if(!tenzies){
			setDice(oldDice=>oldDice.map(die=>{
				return die.isHeld ?
				die :
				generateNewDie()
				
			}))
		}else{
			setTenzies(false)
			setFormOn(true)
			rollCounter=0
		}
		return rollCounter
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
		console.log(counter)
		return counter
	}
	function handleSubmit(){
		handleNewDice()
		setFormOn(!formOn)

	}
	function handleNewDice(){
		let playerChosenDice = []
		for(let i=0;i<counter;i++){
			playerChosenDice.push(generateNewDie())
		}
		setDice(playerChosenDice)
		return playerChosenDice
	}
	const diceElement = dice.map(die=> (
		<Die 
		value={die.value}
		key={die.id}
		isHeld={die.isHeld}
		hold={()=>{hold(die.id)}}
		/>))
		//if form is true, ask a question for how many dice you want to play with
		//after input submitted, setForm to false and proceed the game
		

	const isFormOn =
		<form onSubmit={handleSubmit}>
		<input 
		type="number" 
		placeholder='Number of dices'
		onChange={handleChange}
		/>
		<button>Submit</button>
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
		<p1 className="roll-counter">Roll Counter:{rollCounter}</p1>
		<h2>Tenzies</h2>
		<p1>Roll until all dice are the same. Click each die to hold its value between rolls.</p1>

		{formOn && isFormOn}

    	<div className="dice-grid">
		{!formOn && diceElement }
    </div>
		{!formOn && rrButton}
		
			
			
	</main>
  );
}


