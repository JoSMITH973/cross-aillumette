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
            sentence:[],
            result:''
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
                    Line : <input type="number" value={this.state.stateLine} onChange={event => this.setState({stateLine:event.target.value})}></input>
                    <br/>
                    Match : <input type="number" value={this.state.stateMatch} onChange={event => this.setState({stateMatch:event.target.value})}></input>
                    <br/>
                    <button type="submit" onClick={this.handleSubmit}> Confirmer </button>
                </form>
                <button onClick={this.ResetParty}> Recommencer </button>
                {/* <h1> {this.state.result} </h1> */}
            </div>
        )
    }


whoPlayed() {
    // this.state.sentence = 'No sentence'
    if(this.state.player[0] !== undefined ) {
        this.state.sentence[0] = `${this.state.player[0]} removed ${this.state.player[2]} match(es) from ${this.state.player[1]}`
    }
    if (this.state.ia[0] !== undefined ) {
        this.state.sentence[1] = ` ${this.state.ia[0]} removed ${this.state.ia[2]} match(es) from ${this.state.ia[1]}`
    }
    else {
        // this.setState({sentence:''})
        this.state.sentence = []
    }
    return (
        <div>
            <p>
                {this.state.sentence[0]}
            </p>
            <p>
                {this.state.sentence[1]}
            </p>
        </div>
        )
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
    this.state.sentence=''
    this.state.result=''
    this.setState({countAiError:0})
}

updateArena() {
    if(this.state.result=='player') {
        return (
            <div>
                <h1>
                    You Win !
                </h1>
            </div>
        )
    }
    else if(this.state.result=='ia') {
        return (
            <div>
                <h1>
                    I win ! You loose ! Haha !
                </h1>
            </div>
        )
    }
    else {
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
}

replaceAt(index, replacement,sentence) {
    sentence = sentence.substr(0, index) + replacement + sentence.substr(index + replacement.length);
    return sentence
}


Player (numLine,numMatch) {
    numLine = this.userLine
    numMatch = this.userMatch
    arena = this.state.arena
    // console.log('arena test : ',arena[numLine])
    
    // console.log('Your turn :')
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
        // console.log(`Player removed ${numMatch} match(es) from line ${numLine}`)
        for(let i=0;i<numMatch;i++) {
            let line = arena[numLine]
            line = this.replaceAt(line.lastIndexOf('|'),' ',line)
            this.state.arena[numLine] = line
            this.state.matchLefts--
        }
        this.setState({player:['player',numLine,numMatch]})
        // console.log('matchsleft : ',this.state.matchLefts)

        if(this.state.matchLefts==0) {
            this.setState({result:'ia'})
        }
        else {
            return this.AI()
        }
        this.updateArena()
    }
}

randomRange(array) {
    return array[Math.floor(Math.random() * array.length)]
}

AI() {
    if(this.state.matchLefts==0) {
        // console.log('You Loose ! Try Again')
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
        // console.log('\nAI\'s turn...')
        // console.log(`AI removed ${numMatch} match(es) from line ${numLine}`)
        for(let i=0;i<numMatch;i++) {
            let line = this.state.arena[numLine]
            line = this.replaceAt(line.lastIndexOf('|'),' ',line)
            arena[numLine] = line
            this.state.matchLefts--
        }
        this.setState({ia:['IA',numLine,numMatch]})
        // console.log('matchsleft : ',this.state.matchLefts)
        if(this.state.matchLefts == 0) {
            this.setState({result:'player'})
        }
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
            this.state.rangeLine.splice(this.state.rangeLine.indexOf(err[2]),1)
        }
        this.AI()
    }
}
    
LaunchParty() {
    this.InitModelArena()
}

}

export default App;
