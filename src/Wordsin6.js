import wordle6 from './wordle6.txt'

export const boardDefault = [
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
  ];

  export const generateWordSet = async()=>{
    let wordSet;
    let todaysWord;
    await fetch(wordle6)
      .then((response) => response.text())
      .then((result) => {
        // console.log(result.split(/\n/)[0]) //the first word :aback
        const wordArr = result.split("\n");
        todaysWord = wordArr[Math.floor(Math.random() * wordArr.length)];
        localStorage.setItem('localAnswer',todaysWord)
        console.log(todaysWord)
        wordSet = new Set(wordArr);  //copy a new array
      });
    return { wordSet, todaysWord };
  }

  export const generateSavedAnswer = async()=>{
    let wordSet;
    // let todaysWord;
    await fetch(wordle6)
      .then((response) => response.text())
      .then((result) => {
        const wordArr = result.split("\n");
        // todaysWord = wordArr[Math.floor(Math.random() * wordArr.length)];
        // localStorage.setItem('localAnswer',todaysWord)
        // console.log(todaysWord)
        wordSet = new Set(wordArr);  //copy a new array
      });
    return { wordSet };
  }