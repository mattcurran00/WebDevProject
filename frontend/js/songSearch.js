const searchInput = document.getElementById("song-search");
const resultsBox = document.getElementById("search-results");

let debounceTimer = null;

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
        if (query.length === 0) {
            resultsBox.innerHTML = "";
            return;
        }

        const res = await fetch(`/api/songs/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        displayResults(data.results);
    }, 250);
});

function displayResults(results) {
    if (results.length === 0) {
        resultsBox.innerHTML = "<p>No matches found</p>";
        return;
    }

    resultsBox.innerHTML = results
        .map(song => `
            <div class="search-item" data-title="${song.title}" data-artist="${song.artist}">
                <strong>${song.title}</strong> — ${song.artist}
            </div>
        `)
        .join("");

    // Allow clicking to fill the input fields
    document.querySelectorAll(".search-item").forEach(item => {
        item.addEventListener("click", () => {
            document.getElementById("new-title").value = item.dataset.title;
            document.getElementById("new-artist").value = item.dataset.artist;
            resultsBox.innerHTML = ""; // hide list
        });
    });
}
