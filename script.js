/* Author: Prashant Agheda
   GitHub: https://github.com/prashant-agheda */


// Code to Disable Right Click on Webpage
document.addEventListener('contextmenu', event => event.preventDefault());


// Function that Runs when we press enter
async function handleSubmit(event) {
    event.preventDefault();
    const inputValue = document.querySelector(".search-input").value;
    const searchQuery = inputValue.trim();

    const searchResults = document.querySelector(".search-results");
    searchResults.innerHTML = "";

    const loader = document.querySelector(".js-spinner");
    loader.classList.remove("hidden");

    try {
        const results = await searchWikipedia(searchQuery);

        if(results.query.searchinfo.totalhits === 0) {
            alert("No Results Found. Try different keywords.");
            return;
        }

        displayResults(results);

    } catch(err) {
        console.log(err);
        alert("Failed to Search on Wikipedia.");

    } finally {
        loader.classList.add("hidden");

    }
}


// Function that Searches the query from wikipedia
async function searchWikipedia(searchQuery) {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
    const response = await fetch(endpoint);

    if(!response.ok) {
        throw Error(response.statusText);
    }

    const json = await response.json();
    return json;
}


// Function that Displays the results
async function displayResults(results) {
    const searchResults = document.querySelector(".search-results");

    results.query.search.forEach(result => {
        
        const url = `https://en.wikipedia.org/?curid=${result.pageid}`;

        searchResults.insertAdjacentHTML('beforeend',
            `<div class="result-item">
                <h3 class="result-title">
                    <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
                </h3>
                <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
                <span class="result-snippet">${result.snippet}</span><br>
            </div>`
        );
    });
}


// Adding the Submit Event Listener to the form
const form = document.querySelector(".search-form");
form.addEventListener("submit", handleSubmit);