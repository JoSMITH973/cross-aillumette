import './App.css';
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

// let lineArray =     "*********"
let lineArray =     "*******"
let firstLine, secondLine, thirdLine ,fourthLine, matchLefts, rangeLine, rangeMatch, countAiError
let arena = [lineArray,firstLine,secondLine,thirdLine,fourthLine,lineArray]
arena[1] = "*   |   *"
arena[2] = "*  |||  *"
arena[3] = "* ||||| *"
arena[4] = "*|||||||*"
countAiError=0
matchLefts = 16
rangeLine = [1,2,3,4]
rangeMatch = [1,2,3,4,5,6]

function App() {
    const [line, setLine] = useState();
    const [match, setMatch] = useState();
    const [showArena, setArena] = useState([])
    
    const handleSubmit = async e => {
        e.preventDefault();
        console.log('line '+ line+' , match '+match)
        LaunchParty(line,match);
    }
    const handleSubmit2 = async e => {
        e.preventDefault();
        console.log('line '+ line+' , match '+match)
        Player(line,match)
        // updateArena(line,match);
    }
    useEffect(() => {
        async function getArena() {
            setArena(arena)
        }
        // const getArena = setInterval(() => {
        // },1000)
        // return () => clearInterval(getArena)
        getArena()
    },[])
    console.log(showArena)
    
    // if (showArena[1] !==undefined) {
    //     console.log('been here')
        return (
            <div id="Main">
                
                <div id="Arena">
                    {showArena.map((lineByLine) => (
                        <p id="Line">
                            {lineByLine.replace(/ /g, "\u00a0")}
                        </p>
                    ))}
                </div>
                <div>
                    <form onSubmit={handleSubmit2}>
                        Line : <input onChange={e => setLine(e.target.value)}></input>
                        <br/>
                        Match : <input onChange={e => setMatch(e.target.value)}></input>
                        <br/>
                        <button type="submit"> Confirmer </button>
                    </form>
                </div>
            </div>
        )
    // }
    // else {
    //     return (
    //         <div id="Main">
    //         <div id="Arena">
                
    //             <p id="LineBreak">*******</p>
    //             <p id="Line1">*&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;*</p>
    //             <p id="Line2">*&nbsp;&nbsp;|||&nbsp;&nbsp;*</p>
    //             <p id="Line3">*&nbsp;|||||&nbsp;*</p>
    //             <p id="Line4">*|||||||*</p>
    //         <p id="LineBreak">*******</p>
    //             <br/>
    //         </div>
    //             <form onSubmit={handleSubmit}>
    //                 Line : <input onChange={e => setLine(e.target.value)}></input>
    //                 <br/>
    //                 Match : <input onChange={e => setMatch(e.target.value)}></input>
    //                 <br/>
    //                 <button type="submit"> Confirmer </button>
    //             </form>
    //     </div>
    // );
    // }
}

function concatLine(tab) {
    let string = ""
    for(let i = 0; i < tab.length; i++){
        string = string + tab[i]
        if(i != tab.length - 1){
            string = string + "\n"
        }
    }
    return string
}

function InitModelArena() {
    countAiError=0
    matchLefts = 16
    rangeLine = [1,2,3,4]
    rangeMatch = [1,2,3,4,5,6]
    // arena[1] = ['*&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;*','Line1']
    // arena[2] = ['*&nbsp;&nbsp;|||&nbsp;&nbsp;*','Line2']
    // arena[3] = ['*&nbsp;|||||&nbsp;*','Line3']
    // arena[4] = ['*|||||||*','Line4']
    arena[1] = "*   |   *"
    arena[2] = "*  |||  *"
    arena[3] = "* ||||| *"
    arena[4] = "*|||||||*"
    console.log(concatLine(arena))
    // return console.log(concatLine(arena))
    // return App()
}

function updateArena(line, match) {
    let Line = arena[line]
    let MatchesToRemove = Line.replaceAt(Line.lastIndexOf())
    console.log(concatLine(arena))
    // return console.log(concatLine(arena))
    // return App()
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

async function Player(numLine,numMatch) {
    console.log('arena test : ',arena[numLine])
    if(matchLefts==0) {
        console.log('You WIN ! I will win the next time !')
        return EndGame()
    }
    console.log('Your turn :')
    if (numLine < 0 || numLine == 0 || numLine > 4 || numLine == undefined || isNaN(numLine)) {
        let err=['player','line',numLine]
        errFunc(err)
    }
    let matchsLeftOnLine
    if(arena[numLine].match(/\|/gm) == undefined) {
        matchsLeftOnLine = 0
    }
    else {
        matchsLeftOnLine = (arena[numLine].match(/\|/gm)).length
    }

    if (numMatch > matchsLeftOnLine || numMatch == 0 || isNaN(numMatch)) {
        let err=['player','match',numMatch,numLine]
        errFunc(err)
    }
    else {
        console.log(`Player removed ${numMatch} match(es) from line ${numLine}`)
        for(let i=0;i<numMatch;i++) {
            let line = arena[numLine]
            line = line.replaceAt(line.lastIndexOf('|'),' ')
            arena[numLine] = line
            matchLefts--
        }
        console.log(concatLine(arena))
        // return App()
        return AI()
    }
}

function randomRange(array) {
    return array[Math.floor(Math.random() * array.length)]
}

async function AI() {
    if(matchLefts==0) {
        console.log('You Loose ! Try Again')
        return EndGame()
    }

    let numLine = randomRange(rangeLine)
    let numMatch = randomRange(rangeMatch)
    
    let matchsLeftOnLine
    if(arena[numLine].match(/\|/gm) == null) {
        matchsLeftOnLine = 0
    }
    else {
        matchsLeftOnLine = (arena[numLine].match(/\|/gm)).length
    }
    
    if (numMatch > matchsLeftOnLine) {
        let err=['AI',matchsLeftOnLine,numLine]
        errFunc(err)
    }
    else {
        console.log('\nAI\'s turn...')
        console.log(`AI removed ${numMatch} match(es) from line ${numLine}`)
        for(let i=0;i<numMatch;i++) {
            let line = arena[numLine]
            line = line.replaceAt(line.lastIndexOf('|'),' ')
            arena[numLine] = line
            matchLefts--
        }
        console.log(concatLine(arena))
        return (
            <div>
                ${concatLine(arena)}
            </div>
            )
        return App()
    }
}

function errFunc(err) {
    if (err[0]=='player') {
        if(err[1]=='line') {
            if(err[2]==undefined || err[2]>4) {
                console.log('Error: This line is out of range !')
            }
            if(err[2]<0 || err[2]==0 || isNaN(err[2])) {
                console.log('Error: You have to pick a positive number !')
            }
        }
        if(err[1]=='match') {
            if(err[2]>0) {
                console.log('Error: not enough matches on this line')
            }
            if(err[2]==0 || err[2]==undefined || err[2]<0 || isNaN(err[2])) {
                console.log('Error: You have to pick a positive number !')
            }
        }
        return Player()
    }
    if(err[0]=='AI') {
        countAiError++
        if(err[1]==0) {
            rangeLine.splice(rangeLine.indexOf(err[2]),1)
        }
        return AI()
    }
}

function EndGame(choix) {
    let answer = choix.toLowerCase()
    if(answer=='y' || answer=='yes') {
        console.log('Good to see you again ! Let\s play')
        return LaunchParty()
    }
    if(answer=='n' || answer =='no') {
        process.exit()
    }
    else {
        return EndGame()
    }
}
    
function LaunchParty(numLine,numMatch) {
    InitModelArena()
    Player(numLine,numMatch)
}

export default App;
