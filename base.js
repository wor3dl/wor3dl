
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
    if (!currentRow) return
    let key = event.target.dataset.key
    if (!key) {
        if ("enter" in event.target.dataset) {
            console.log("Enter")
        } else if ("delete" in event.target.dataset) {
            console.log("Delete")
        }
    } else {
        addLetter(key)
    }
}

function addLetter(letter, row) {
    if (!currentRow) return
}

function rowPressed(event) {
    if (currentRow) {
        currentRow.classList.remove("row-selected")
    }
    if (!(currentRow == event.target)) {
        currentRow = event.target
        event.target.classList.add("row-selected")
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


$(function() {
    createGrid(5, 2, 6)
    $(".key").on("click", keyPressed)
    $(".row").on("mouseover", rowHoverIn)
    $(".row").on("mouseleave", rowHoverOut)
    $(".row").on("click", rowPressed)
})

