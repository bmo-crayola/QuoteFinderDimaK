document.querySelector("#searchByKeywordForm").addEventListener("submit", validateKeyword);

function validateKeyword() {
    let keyword = document.querySelector("input[name=keyword]").value;
    if (keyword.length < 3) {
        document.querySelector("#keywordError").style.display = "block";
        document.querySelector("#keywordError").textContent = "Keyword must be longer than 2 characters.";
        event.preventDefault(); //prevent form submission
    }
}