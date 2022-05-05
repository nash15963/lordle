import React,{ useCallback, useEffect ,useContext } from 'react'
import { AppContex } from '../App'
import Key from './Key'

function KeyBoard() {
  const keys1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const keys2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const keys3 = ["Z", "X", "C", "V", "B", "N", "M"];
  const {onSelectLetter,onDelete,onEnter ,disabledLetters} = useContext(AppContex)

  const handleKeyboard =useCallback((event)=>{
    if(event.key === 'Enter'){
      onEnter()
    }else if(event.key === 'Backspace'){
      onDelete()
    }else{
      keys1.forEach((key)=>{
        if(event.key.toLowerCase() === key.toLowerCase()){
          onSelectLetter(key)
        }
      })
      keys2.forEach((key)=>{
        // console.log(event.key)
        //console.log(key)  //every elements in keys2
        if(event.key.toLowerCase() === key.toLowerCase()){
          onSelectLetter(key)
        }
      })
      keys3.forEach((key)=>{
        if(event.key.toLowerCase() === key.toLowerCase()){
          onSelectLetter(key)
        }
      })
    }
  })

  useEffect(()=>{
    // console.log('i type sth')
    document.addEventListener("keydown",handleKeyboard)
    return()=>{
      // console.log('clear sth')
      document.removeEventListener("keydown",handleKeyboard)
    }
  },[handleKeyboard])
  // id attribute form Key.js 

  return (
    <div className='keyboard' onKeyDown={handleKeyboard}>
      <div className="line1">
        {keys1.map((key)=> {return <Key keyVal={key} disabled ={disabledLetters.includes(key)}/>})}
      </div>
      <div className="line2">
        {keys2.map((key)=> {return <Key keyVal={key} disabled ={disabledLetters.includes(key)}/> })}
      </div>
      <div className="line3">
      <Key keyVal={"ENTER"} bigKey/>
        {keys3.map((key)=> {return <Key keyVal={key} disabled ={disabledLetters.includes(key)}/> })}
      <Key keyVal={"DELETE"} bigKey/>
      </div>
    </div>
  )
}

export default KeyBoard