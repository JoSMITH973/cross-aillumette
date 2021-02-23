const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

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

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

let lineArray =     "*********"
let firstLine, secondLine, thirdLine ,fourthLine, matchLefts, rangeLine, rangeMatch, countAiError

let arena = [lineArray,firstLine,secondLine,thirdLine,fourthLine,lineArray]

function InitModelArena() {
    countAiError=0
    matchLefts = 16
    rangeLine = [1,2,3,4]
    rangeMatch = [1,2,3,4,5,6]
    arena[1] = "*   |   *"
    arena[2] = "*  |||  *"
    arena[3] = "* ||||| *"
    arena[4] = "*|||||||*"
    return console.log(concatLine(arena))
}

function randomRange(array) {
    return array[Math.floor(Math.random() * array.length)]
}

async function Player() {
    if(matchLefts==0) {
        console.log('You WIN ! I will win the next time !')
        return EndGame()
    }
    console.log('Your turn :')
    rl.question('Line : ', async(numLine) => {
        if (numLine < 0 || numLine == 0 || numLine > 4 || numLine == undefined || isNaN(numLine)) {
            let err=['player','line',numLine]
            errFunc(err)
        }
        rl.question('Matches : ', async(numMatch) => {
            if(arena[numLine].match(/\|/gm) == null) {
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
                for(i=0;i<numMatch;i++) {
                    let line = arena[numLine]
                    line = line.replaceAt(line.lastIndexOf('|'),' ')
                    arena[numLine] = line
                    matchLefts--
                }
                console.log(concatLine(arena))
                return AI()
            }
        })
    })
}

async function AI() {
    if(matchLefts==0) {
        console.log('You Loose ! Try Again')
        return EndGame()
    }

    numLine = randomRange(rangeLine)
    numMatch = randomRange(rangeMatch)
    
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
        for(i=0;i<numMatch;i++) {
            let line = arena[numLine]
            line = line.replaceAt(line.lastIndexOf('|'),' ')
            arena[numLine] = line
            matchLefts--
        }
        console.log(concatLine(arena))
        return Player()
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

function EndGame() {
    rl.question('Do you want to play again ?(y,n)',answer => {
        answer = answer.toLowerCase()
        if(answer=='y' || answer=='yes') {
            console.log('Good to see you again ! Let\s play')
            return Main()
        }
        if(answer=='n' || answer =='no') {
            process.exit()
        }
        else {
            return EndGame()
        }
    })
}
    
function Main() {
    InitModelArena()
    Player()
}

Main()