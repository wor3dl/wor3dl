
// May want to change this from constant
const WORD_LENGTH = 5
const FLIP_ANIMATION_DURATION = 300

const offsetFromDate = new Date(2022, 0, 1)
const msOffset = Date.now() - offsetFromDate
const dayOffset = Math.floor(msOffset / 1000 / 60 / 60 / 24)

var interfereWords = {"rows":[], "grids":[]}

var currentRow
var hoveredRow


const hash = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
  };
  
  function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }

function generateInterfereWords(seed, rows, grids) {

    var interfereWords = {"rows":[], "grids":[]}
    let tempTargets = targetWords

    for (let x = 0; x < rows; x++) {
        let index = Math.floor(mulberry32(parseInt(String(seed)+"1111"+String(x)))()*(2315-x))
        interfereWords.rows.push(tempTargets[index])
        tempTargets.splice(index, 1)
    }

    for (let y = 0; y < rows; y++) {
        let index = Math.floor(mulberry32(parseInt(String(seed)+"1111"+String(y+rows)))()*(2315-(y+rows)))
        interfereWords.grids.push(tempTargets[index])
        tempTargets.splice(index, 1)
    } 

    return interfereWords

}

function createDOM(text) {
    let t = document.createElement("template")
    t.innerHTML = text.trim()
    return t.content.firstChild
}

function createGrid(word, width, height) {
    for (let x = 0; x < width+1; x++) {
        let rows = createDOM(rowsHTML)
        for (let y = 0; y < height+1; y++) {
            if (y == height+1){
            }
            let row = createDOM(rowHTML)
            for (let t = 0; t < word; t++) {
                let tile = createDOM(tileHTML)
                row.appendChild(tile)
            }
            row.id = x + "r" + y
            if (y == height) {
                if (x == width) {
                    rows.id = "ans"
                    break
                }
                $(row).addClass("cans")
            }
            rows.appendChild(row)
        }
        let grid = createDOM(gridHTML)
        let title = createDOM(gridTitleHTML)
        title.textContent = String(((x == width) ? "A" : x+1))
        grid.appendChild(title)
        grid.appendChild(rows)
        $("#grid-container").append(grid)
    }
    for (let val = 0; val < height; val++) {
        $(("#"+width+"r"+val)).addClass("rans")
        console.log(("#"+width+"r"+val))
    }
}

function keyPressed(event) {
    if (!currentRow) { 
        //Display Error
        console.log("Select a Row!!!")
        return
    }

    if ("entered" in currentRow.dataset) {
        //Display Error
        console.log("Already Entered Word")
        return
    }

    let key = event.target.dataset.key
    if (!key) {
        if ("enter" in event.target.dataset) {
            enterRow(currentRow)
        } else if ("delete" in event.target.dataset) {
            removeLetter(currentRow)
        }
    } else {
        addLetter(key, currentRow)
    }
}

function enterRow(row) {
    if (!row) return

    let word = getRowWord(row)

    if (word.length < WORD_LENGTH) {
        //Display Error
        console.log("Not Enough Letters!!")
        return
    }

    if (!dictionary.includes(word.toLowerCase())) {
        //Display Error
        console.log("Not In Dictionary")
        return
    }

    // for (let interfereKey of Object.keys(interfereWords)) {

    //     let interferes = interfereWords[interfereKey]
    //     console.log(interferes)
    //     if (interferes.includes(word.toLowerCase())) {
    //         for (let letter of word) {
    //             addLetter(letter, $("#"+row.id.split("r")[0]+"r"+interferes.length).get(0))
    //         }
    //     }

    // }

    if (interfereWords.grids.includes(word.toLowerCase())) {

        let interferes = interfereWords.grids
        if (interferes.includes(word.toLowerCase())) {

            let answerRow = $("#"+row.id.split("r")[0]+"r"+interferes.length).get(0)

            for (let letter of word) {
                addLetter(letter, answerRow)
            }

            for (let t = 0; t < answerRow.children.length; t++) {
                flipTile(answerRow.children[t], t, "correct")
            }

        }            

    }

    if (interfereWords.rows.includes(word.toLowerCase())) {
        let interferes = interfereWords.rows
        if (interferes.includes(word.toLowerCase())) {

            let answerRow = $("#"+interferes.length+"r"+row.id.split("r")[1]).get(0)

            for (let letter of word) {
                addLetter(letter, answerRow)
            }

            for (let t = 0; t < answerRow.children.length; t++) {
                flipTile(answerRow.children[t], t, "correct")
            }

        }            

    }

    // if (interfereWords["grids"].includes(word.toLowerCase())) {
    //     console.log($(row).attr("id").split("r")[0])
    //     console.log(interfereWords["grids"][interfereWords["grids"].indexOf(word.toLowerCase())])
    //     if ($(row).attr("id").split("r")[0] == interfereWords["grids"].indexOf(word.toLowerCase())) {
    //         for (let val = 0; val < word.length; val++) {
    //             addLetter(word[val], $("#"+$(row).attr("id").split("r")[0]+("r"+(interfereWords["grids"].length))).get(0))
    //         }
    //     }
    // }

    // if (interfereWords["rows"].includes(word.toLowerCase())) {
    //     console.log($(row).attr("id").split("r")[1])
    //     console.log(interfereWords["rows"][interfereWords["rows"].indexOf(word.toLowerCase())])
    //     if ($(row).attr("id").split("r")[1] == interfereWords["rows"].indexOf(word.toLowerCase())) {
    //         for (let val = 0; val < word.length; val++) {
    //             addLetter(word[val], $("#"+(interfereWords["grids"].length)+"r"+$(row).attr("id").split("r")[1]).get(0))
    //         }
    //     }
    // }

    row.dataset.entered = ""

    //Colouring Shit
    let colouredWord = symbolColourWord(word.toLowerCase(), [interfereWords.rows[row.id.split("r")[1]], interfereWords.grids[row.id.split("r")[0]]])

    for (let t = 0; t < row.children.length; t++) {

        let colour

        switch(colouredWord[t]) {
            case "@":
                colour = "correct";
            break;
            case "/":
                colour = "wrong-location";
            break;
            default:
                colour = "wrong";
        }

        flipTile(row.children[t], t, colour)
    
    }

}


function getRowWord(row) {

    if (!row) return null

    let word = ""

    for (tile of row.children) {
        word += $(tile).text()
    }

    return word

}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
  }

const correctSymbol = "@"
const misplacedSymbol = "/"
const incorrectSymbol = "-"

//all words should be lowercase
function symbolColourWord(word, interferes=[]) {

    let cWord = word

    for (let interfereWord of interferes) {

        let misplacedBuffer = interfereWord

        for (let char = 0; char < word.length; char++) {

            if (cWord[char] === correctSymbol) continue

            if (word[char] === interfereWord[char]) {
                cWord = setCharAt(cWord, char, correctSymbol)
                misplacedBuffer = setCharAt(misplacedBuffer, misplacedBuffer.indexOf(word[char]), "~")
            } else if (misplacedBuffer.includes(word[char])) {
                cWord = setCharAt(cWord, char, misplacedSymbol)
                misplacedBuffer = setCharAt(misplacedBuffer, misplacedBuffer.indexOf(word[char]), "~")
            }

        }

    }

    //Replace remaining letters with incorrectSymbol
    for (let char = 0; char < cWord.length; char++) {
        if (!(cWord[char] === correctSymbol || cWord[char] === misplacedSymbol)) {
            cWord = setCharAt(cWord, char, incorrectSymbol)
        }
    }

    return cWord

}

function flipTile(tile, index, state="correct") {
    tile.dataset.state = "flipping"
    setTimeout(() => {
      tile.classList.add("flip")
    }, (index * FLIP_ANIMATION_DURATION) / 2)
  
    tile.addEventListener("transitionend", ()=>{
      tile.classList.remove("flip")
      tile.style.color = "white"
      tile.dataset.state = state
      }
    )
  }

function removeLetter(row) {
    if (!row) return

    let tile = undefined

    for (child of row.children) {
        if (!($(child).text() === " " || $(child).text() === "")) {
            tile = child
        }
    }

    if (tile) {
        $(tile).text(" ")
    } else {
        //Display error - no letters to delete
        console.log("Nothing to delete")
    }
}

function addLetter(letter, row) {
    if (!row) return

    let tile = undefined

    for (child of row.children) {
        if ($(child).text() === " " || $(child).text() === "") {
            tile = child
            break
        }
    }

    if (tile) {
        $(tile).text(letter)
    } else {
        //Display Error
        console.log("Out of space")
    }

}

function rowPressed(event) {
    if ($(event.target).hasClass("cans") || $(event.target).hasClass("rans")){
        return
    }
    if (currentRow) {
        currentRow.classList.remove("row-selected")
    }
    if (!(currentRow == event.target)) {
        currentRow = event.target
        event.target.classList.add("row-selected")
    } else {
        currentRow = null
    }
}

function rowHoverIn(event) {
    hoveredRow = event.target
    hoveredRow.classList.add("row-hovered")

}

function rowHoverOut(event) {
    hoveredRow = event.target
    hoveredRow.classList.remove("row-hovered")
}

function physicalKeyPressed(event) {

    if (!currentRow) {
        //Display Error
        console.log("Select A Row!!!")
        return
    } else if ("entered" in currentRow.dataset) {
        //Display Error
        console.log("Already entered word")
        return
    }

    if (event.key === "Enter") {
        enterRow(currentRow)
        return
      }
    
      if (event.key === "Backspace" || event.key === "Delete") {
        removeLetter(currentRow)
        return
      }


    if (event.key.match(/^[a-z]$/) || event.key.match(/^[A-Z]$/)) {
        addLetter(event.key.toUpperCase(), currentRow)
        return
      }
}


$(function() {
    interfereWords = generateInterfereWords(dayOffset, 6, 6)
    createGrid(WORD_LENGTH, 6, 6)
    $(".key").on("click", keyPressed)
    $(".row").on("mouseover", rowHoverIn)
    $(".row").on("mouseleave", rowHoverOut)
    $(".row").on("click", rowPressed)
    $(document).on("keydown", physicalKeyPressed)
})

