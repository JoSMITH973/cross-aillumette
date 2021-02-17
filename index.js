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


function numRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomRange(array) {
    return array[Math.floor(Math.random() * array.length)]
}


async function Player() {
    if(matchLefts<=1) {
        console.log('You Loose ! Try Again')
        return EndGame()
    }
    console.log('It\'s your turn !')
    rl.question('Which line do you want to select ?\n', async(numLine) => {
        rl.question('How many match do you want to remove ?\n', async(numMatch) => {
            if(arena[numLine].match(/\|/gm) == null) {
                matchsLeftOnLine = 0
            }
            else {
                matchsLeftOnLine = (arena[numLine].match(/\|/gm)).length
            }
            if (numMatch > matchsLeftOnLine || numMatch == 0) {
                let err=['player',numMatch]
                errFunc(err)
            }
            else {
                for(i=0;i<numMatch;i++) {
                    let line = arena[numLine]
                    line = line.replaceAt(line.lastIndexOf('|'),' ')
                    arena[numLine] = line
                    matchLefts--
                }
                console.log(concatLine(arena))
                console.log('reste :',matchLefts)
                return AI()
            }
        })
    })
}

async function AI() {
    if(matchLefts<=1) {
        console.log('You WIN ! I will win the next time !')
        return EndGame()
    }

    console.log('\nAI\'s turn !')
    numLine = randomRange(rangeLine)
    console.log('Line : ',numLine)
    numMatch = randomRange(rangeMatch)
    console.log('Match : ',numMatch)

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
        for(i=0;i<numMatch;i++) {
            let line = arena[numLine]
            line = line.replaceAt(line.lastIndexOf('|'),' ')
            arena[numLine] = line
            matchLefts--
        }
        console.log(concatLine(arena))
        console.log('reste :',matchLefts)
        return Player()
    }
}

function errFunc(err) {
    if (err[0]=='player') {
        if(err[1]>0) {
            console.log('Error: not enough matches on this line')
        }
        if(err[1]==0 || err[1]==undefined) {
            console.log('Error: You have to pick a number else than 0 or nothing !')
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
    rl.question('Do you want to play again ?(y,n)',anwser => {
        if(anwser=='y') {
            console.log('Good to see you again ! Let\s play')
            return Main()
        }
        if(anwser=='n') {
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