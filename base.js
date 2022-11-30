
// May want to change this from constant
const WORD_LENGTH = 5
const FLIP_ANIMATION_DURATION = 300

var currentRow
var hoveredRow

function createDOM(text) {
    let t = document.createElement("template")
    t.innerHTML = text.trim()
    return t.content.firstChild
}

function createGrid(word, width, height) {
    for (let x = 0; x < width; x++) {
        let rows = createDOM(rowsHTML)
        for (let y = 0; y < height; y++) {
            let row = createDOM(rowHTML)
            for (let t = 0; t < word; t++) {
                let tile = createDOM(tileHTML)
                row.appendChild(tile)
            }
            row.id = x + "row" + y
            rows.appendChild(row)
        }
        let grid = createDOM(gridHTML)
        let title = createDOM(gridTitleHTML)
        title.textContent = String(x+1)
        grid.appendChild(title)
        grid.appendChild(rows)
        $("#grid-container").append(grid)
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

    let word = ""

    for (tile of row.children) {
        word += $(tile).text()
    }

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

    row.dataset.entered = ""

    //Colouring Shit
    console.log(symbolColourWord(word.toLowerCase(), ["hello"]))

    for (let t = 0; t < row.children.length; t++) {
        flipTile(row.children[t], t)
    }

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
            } else if (misplacedBuffer.includes(word[char])) {
                cWord = setCharAt(cWord, char, misplacedSymbol)
                misplacedBuffer = setCharAt(misplacedBuffer, char, " ")
            }

        }

    }

    console.log(cWord)

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
    createGrid(WORD_LENGTH, 2, 6)
    $(".key").on("click", keyPressed)
    $(".row").on("mouseover", rowHoverIn)
    $(".row").on("mouseleave", rowHoverOut)
    $(".row").on("click", rowPressed)
    $(document).on("keydown", physicalKeyPressed)
})

