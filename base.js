
var currentRow

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
    let key = event.target.dataset.key
}

function rowPressed(event) {
    console.log(event.target)
    if (currentRow) {
        currentRow.classList.remove("row-clicked")
    }
    currentRow = event.target
    currentRow.classList.add("row-clicked")
}


$(function() {
    createGrid(5, 7, 7)
    $(".key").on("click", keyPressed)
    $(".grid-rows").on("click", rowPressed)
})

