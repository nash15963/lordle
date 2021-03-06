import Board from './Board'
import Keyboard from './KeyBoard'
import Header from '../Header'

import GameOver from './GameOver'
import 'animate.css';
import { boardDefault ,generateWordSet ,generateSavedAnswer } from '../../Words'
import { createContext ,useEffect,useState } from 'react'
import { ToastProvider, useToasts } from "../hooks/toast-manager";

import { db } from "../../config";
import {
  updateDoc,
  doc,
  getDoc
} from "firebase/firestore";

export const AppContex = createContext()

// const KeyBoardArray = 'access'

function Game({member}) {
  const [memberTemp ,setMemberTemp] = useState(()=>{
    const memberTemp = localStorage.getItem("username")
    return memberTemp || ''
  })
  const [board, setBoard] = useState(()=>{

  const savedBoard = JSON.parse(localStorage.getItem("userAnswer"))
    return savedBoard || boardDefault }) 
  const [currAttempt , setCurrAttempt] = useState(()=>{
    const saveAttempt = JSON.parse(localStorage.getItem("localAttempt"))
    return saveAttempt || {attempt:0 ,letterPos :0} ;
  }) ;
  
  //get存取狀態 
  const [wordSet, setWordSet] = useState(new Set());
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [almostLetters, setAlmostLetters] = useState([]);
  
  const [todayAnswer, setTodayAnswer] = useState(()=>{
    const savedAnswer = localStorage.getItem("localAnswer");
    return savedAnswer || "";
  }) ;    //rerender*
  const [correctWord, setCorrectWord] = useState(todayAnswer);
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });

  const [outList, setOutList] = useState(false)
  const [gameDown , setgameDown] = useState('')

  const onplayedCount =()=>{
    const savedCount = localStorage.getItem('playedCount')
    return savedCount ? JSON.parse(savedCount) : 0
  }
  let playedCount =onplayedCount() //遊玩次數
  const onwinCount =()=>{
    const winCount = localStorage.getItem('winCount')
    return winCount ? JSON.parse(winCount) : 0
  }
  let winCount =onwinCount() //勝利次數
  
  const onCommercial = ()=>{
    const commercial = localStorage.getItem('commercial')
    return commercial ? JSON.parse(commercial) : false
  }
  let commercial = onCommercial()
  // const memberTemp = JSON.parse(localStorage.getItem("username"))
  // const member = useRef(memberTemp)
  useEffect(()=>{
    
    if(memberTemp === ''){
      setMemberTemp('')
      window.location.href ='./'
    }
    if(todayAnswer !== ""){
      console.log(todayAnswer)
      generateSavedAnswer()
      .then((words)=>{
        setWordSet(words.wordSet);
      })
    }
    else{
      generateWordSet()
      .then((words)=>{
        setWordSet(words.wordSet);
        setCorrectWord(words.todaysWord)
      })
    }
  },[todayAnswer])
//提示字框
  function Toastopen() {
    const { add } = useToasts();
    add("Not In Word List")
    setOutList(false)
    // return <button onClick={() => add("Click to dismiss!")}>Add toast</button>;
  }
  
  
  //從Key.js移動過來
  const onSelectLetter =(keyVal)=>{
    if(currAttempt.letterPos>4) return ;  
    const newBoard =[...board]
    newBoard[currAttempt.attempt][currAttempt.letterPos] = keyVal
    // console.log([currAttempt.attempt],[currAttempt.letterPos])
    // console.log(currAttempt)
    // console.log('hihi')
    setBoard(newBoard)
    setCurrAttempt({...currAttempt ,letterPos : currAttempt.letterPos+1})
    // localStorage.setItem('localAttempt',JSON.stringify(currAttempt));
    // console.log(currAttempt) //從App.js來
    // console.log(keyVal) //alphabet
    // console.log({attempt :currAttempt.attempt})
  }
  const onDelete =()=>{
    if(currAttempt.letterPos===0)return ;
    const newBoard =[...board] //newBoard可以用board替換(拷貝資料問題)
    newBoard[currAttempt.attempt][currAttempt.letterPos-1] = ''
    setBoard(newBoard)
    setCurrAttempt({...currAttempt ,letterPos : currAttempt.letterPos-1})
    // console.log(newBoard) //words.js做的matrix 
  }
  const onEnter =()=>{
    // console.log('ok') //form Key.js
    if(currAttempt.letterPos!==5) return ;
    let currWord = "";
    for (let i = 0; i < 5; i++) {
      currWord += (board[currAttempt.attempt][i]).toLowerCase();
    }
    currWord = currWord + '\r'  //換行後的字串
    // console.log(currWord)
    // console.log(wordSet)
    if (wordSet.has(currWord)) {
      // console.log(board)
      setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPos :0 });  //往下一行，letterPos為0   set增加attempt
      // console.log('hihi')
      localStorage.setItem('userAnswer',JSON.stringify(board));  //在local存取玩家作答
      localStorage.setItem('localAttempt',JSON.stringify({ attempt: currAttempt.attempt + 1, letterPos :0 }));

    } else { // failed the word , not in Dic
      // alert("Word not found");
      let row = document.querySelector(`.board .row:nth-child(${currAttempt.attempt+1})`)
      row.classList.toggle('foo')
      // add Toast Component 
      setOutList(true)
    }
    if(currWord === correctWord){
      setGameOver({ gameOver: true, guessedWord: true });
      // localStorage.clear()
      const updatePoints = async () => {
        console.log(String(memberTemp))
        let docRef = doc(db, "users",String(memberTemp));
        const docSnap = await getDoc(docRef);
        if (docSnap.data().points) {
          console.log(docSnap.data().points);
          const newFields = { points: docSnap.data().points + 1 ,total : docSnap.data().total+1};
          await updateDoc(docRef, newFields);
        } else {
          // doc.data() will be undefined in this case
          console.log('oops');
          const newFields = { points: 1 ,total:1 };
          await updateDoc(docRef, newFields);
        }
      };
      updatePoints()
      setgameDown(<GameOver />)
      const handleNumber =()=>{
        // setPlayedCount((curr)=>curr+1) 
        localStorage.setItem('playedCount' ,playedCount+1)
        localStorage.setItem('winCount' , winCount+1)
      }
      handleNumber()
      
      localStorage.removeItem('userAnswer')
      localStorage.removeItem('localAnswer')
      localStorage.removeItem('localAttempt')
      return ;
    }
    if (currAttempt.attempt === 5 && wordSet.has(currWord)) {
      setGameOver({ gameOver: true, guessedWord: false });
      const updatePoints = async () => {
        console.log(String(memberTemp))
        let docRef = doc(db, "users",String(memberTemp));
        const docSnap = await getDoc(docRef);
        if (docSnap.data().points) {
          console.log(docSnap.data().points);
          const newFields = { fail: docSnap.data().fail + 1 ,total : docSnap.data().total+1};
          await updateDoc(docRef, newFields);
        } else {
          // doc.data() will be undefined in this case
          console.log('oops');
          const newFields = { total: 1 ,fail:1};
          await updateDoc(docRef, newFields);
        }
      };
      updatePoints()
      setgameDown(<GameOver />)
      localStorage.setItem('playedCount' ,playedCount+1)
      // const handleNumber =()=>{
      //   localStorage.setItem('playedCount' ,playedCount+1)
      // }
      // handleNumber()
      localStorage.removeItem('userAnswer')
      localStorage.removeItem('localAnswer')
      localStorage.removeItem('localAttempt')
      return;
    }
  }
  
  const [theme, setTheme] = useState(()=>{
    const savednight = JSON.parse(localStorage.getItem("usernight"))
    return savednight || 'dark'})

  



  return (
    <div className="App" id={theme}>
      <Header theme={theme} setTheme={setTheme} member={member}></Header>
      
      <AppContex.Provider value={
        {board, setBoard ,currAttempt , setCurrAttempt,onSelectLetter,
          onDelete,onEnter,correctWord,disabledLetters, setDisabledLetters,
          correctLetters, setCorrectLetters ,almostLetters, setAlmostLetters ,
          gameOver, setGameOver ,playedCount,winCount}
      }>
      <div id ="game">
      <ToastProvider>
        {outList ?<Toastopen/> :''}
      </ToastProvider>
      <div id='board-container'><Board/></div>
      <Keyboard></Keyboard>
      {gameDown}
      {commercial ? <GameOver/> : ''}
      </div>
      </AppContex.Provider>
      
    </div>
  );
}

export default Game;

