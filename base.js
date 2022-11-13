
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
            rows.appendChild(row)
        }
        let grid = createDOM(gridHTML)
        let title = createDOM(gridTitleHTML)
        title.textContent = String(x)
        grid.appendChild(title)
        grid.appendChild(rows)
        $("#grid-container").append(grid)
    }
}

$(function() {
    createGrid(5, 3, 8)
})