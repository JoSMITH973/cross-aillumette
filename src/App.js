import './App.css';
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

let lineArray =     "*******"
let firstLine, secondLine, thirdLine ,fourthLine, matchLefts, rangeLine, rangeMatch, countAiError, userLine, userMatch, iaLine, iaMatch
let arena = [lineArray,firstLine,secondLine,thirdLine,fourthLine,lineArray]
arena[1] = "*   |   *"
arena[2] = "*  |||  *"
arena[3] = "* ||||| *"
arena[4] = "*|||||||*"
countAiError=0
matchLefts = 16
rangeLine = [1,2,3,4]
rangeMatch = [1,2,3,4,5,6]

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateLine:'',
            stateMatch:'',
            arena:arena,
            matchLefts: 16,
            rangeLine: [1,2,3,4],
            rangeMatch: [1,2,3,4,5,6],
            player:'',
            ia:'',
            sentence:''
        }
    }
    
    handleSubmit = (e) => {
        e.preventDefault()
        this.userLine = parseInt(this.state.stateLine)
        this.userMatch = parseInt(this.state.stateMatch)
        this.Player()
    }
    
    ResetParty = (e) => {
        e.preventDefault()
        this.InitModelArena()
    }

    
    
    render() {
        return (
            <div id ="Main">
                <div id="whoPlayed">
                    {this.whoPlayed()}
                </div>
                {this.updateArena()}
                <form onSubmit={this.handleSubmit}>
                    Line : <input value={this.state.stateLine} onChange={event => this.setState({stateLine:event.target.value})}></input>
                    <br/>
                    Match : <input value={this.state.stateMatch} onChange={event => this.setState({stateMatch:event.target.value})}></input>
                    <br/>
                    <button type="submit" onClick={this.handleSubmit}> Confirmer </button>
                </form>
                <button onClick={this.ResetParty}> Recommencer </button>
            </div>
        )
    }


whoPlayed() {
    // this.state.sentence = 'No sentence'
    if(this.state.player[0] !== undefined ) {
        this.state.sentence = `${this.state.player[0]} removed ${this.state.player[1]} match(es) from ${this.state.player[2]}`
    }
    else {
        // this.setState({sentence:''})
        this.state.sentence = ''
    }
    return (
        <p>
            {this.state.sentence}
        </p>
        )
}

concatLine(tab) {
    let string = ""
    for(let i = 0; i < tab.length; i++){
        string = string + tab[i]
        if(i != tab.length - 1){
            string = string + "\n"
        }
    }
    return string
}

InitModelArena() {
    this.state.matchLefts = 16
    this.state.rangeLine = [1,2,3,4]
    this.state.rangeMatch = [1,2,3,4,5,6]
    this.state.arena[1] = "*   |   *"
    this.state.arena[2] = "*  |||  *"
    this.state.arena[3] = "* ||||| *"
    this.state.arena[4] = "*|||||||*"
    this.state.player = ''
    this.state.ia = ''
    this.setState({countAiError:0})
}

updateArena() {
    return (
        <div id="Arena">
            {this.state.arena.map((lineByLine) => (
                <p id="Line">
                    {lineByLine.replace(/ /g, "\u00a0")}
                </p>
            ))}
        </div>
    )
}

// String.prototype.replaceAt = function(index, replacement) {
replaceAt(index, replacement,sentence) {
    sentence = sentence.substr(0, index) + replacement + sentence.substr(index + replacement.length);
    return sentence
}


// async function Player(numLine,numMatch) {
Player (numLine,numMatch) {
    numLine = this.userLine
    numMatch = this.userMatch
    arena = this.state.arena
    console.log('arena test : ',arena[numLine])
    if(matchLefts==0) {
        console.log('You WIN ! I will win the next time !')
        this.EndGame()
    }
    console.log('Your turn :')
    if (numLine < 0 || numLine == 0 || numLine > 4 || numLine == undefined || isNaN(numLine)) {
        let err=['player','line',numLine]
        this.errFunc(err)
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
        this.errFunc(err)
    }
    else {
        console.log(`Player removed ${numMatch} match(es) from line ${numLine}`)
        for(let i=0;i<numMatch;i++) {
            let line = arena[numLine]
            line = this.replaceAt(line.lastIndexOf('|'),' ',line)
            this.state.arena[numLine] = line
            this.state.matchLefts--
        }
        // console.log(concatLine(arena))
        // return App()
        this.setState({player:['player',numLine,numMatch]})
        this.whoPlayed()
        // this.updateArena()
        return this.AI()
    }
}

randomRange(array) {
    return array[Math.floor(Math.random() * array.length)]
}

AI() {
    if(matchLefts==0) {
        console.log('You Loose ! Try Again')
        this.EndGame()
    }

    let numLine = this.randomRange(rangeLine)
    let numMatch = this.randomRange(rangeMatch)
    
    let matchsLeftOnLine
    if(arena[numLine].match(/\|/gm) == null) {
        matchsLeftOnLine = 0
    }
    else {
        matchsLeftOnLine = (arena[numLine].match(/\|/gm)).length
    }
    
    if (numMatch > matchsLeftOnLine) {
        let err=['AI',matchsLeftOnLine,numLine]
        this.errFunc(err)
    }
    else {
        console.log('\nAI\'s turn...')
        console.log(`AI removed ${numMatch} match(es) from line ${numLine}`)
        for(let i=0;i<numMatch;i++) {
            let line = this.state.arena[numLine]
            line = this.replaceAt(line.lastIndexOf('|'),' ',line)
            arena[numLine] = line
            matchLefts--
        }
        this.setState({player:['IA',numLine,numMatch]})
        this.whoPlayed()
        this.updateArena()
    }
}

errFunc(err) {
    if (err[0]=='player') {
        if(err[1]=='line') {
            if(err[2]==undefined || err[2]>4) {
                alert('Error: This line is out of range !')
            }
            if(err[2]<0 || err[2]==0 || isNaN(err[2])) {
                alert('Error: You have to pick a positive number !')
            }
        }
        if(err[1]=='match') {
            if(err[2]>0) {
                alert('Error: not enough matches on this line')
            }
            if(err[2]==0 || err[2]==undefined || err[2]<0 || isNaN(err[2])) {
                alert('Error: You have to pick a positive number !')
            }
        }
        // this.Player()
    }
    if(err[0]=='AI') {
        countAiError++
        if(err[1]==0) {
            this.state.rangeLine.splice(rangeLine.indexOf(err[2]),1)
        }
        this.AI()
    }
}
    
LaunchParty() {
    this.InitModelArena()
}

}

export default App;
