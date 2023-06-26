// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {
    // Get references to HTML elements
    const cityInput = document.getElementById("cityInput");
    const cityDropdown = document.getElementById("cityDropdown");
    const cityRank = document.getElementById("cityRank");
    const cityPopulation2011 = document.getElementById("cityPopulation2011");
    const cityPopulation2001 = document.getElementById("cityPopulation2001");
    const cityState = document.getElementById("cityState");

    // Add event listener for input changes
    cityInput.addEventListener("input", function() {
        // Clear previous dropdown options
        cityDropdown.innerHTML = "";

        // Get the input value
        const input = cityInput.value.trim().toLowerCase();

        // Fetch data from the database
        fetchCityData(input);
    });

    // Function to fetch city data from the database
    function fetchCityData(input) {
        // Make an AJAX request to the Wikipedia API
        const url = `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${input}&limit=5`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Extract city names from the response
                const cities = data[1];

                // Create dropdown options for each city
                cities.forEach(city => {
                    const option = document.createElement("option");
                    option.textContent = city;
                    cityDropdown.appendChild(option);
                });
            })
            .catch(error => {
                console.log("Error fetching city data:", error);
            });
    }

    // Add event listener for dropdown selection
    cityDropdown.addEventListener("change", function() {
        // Get the selected city
        const selectedCity = cityDropdown.value;

        // Fetch detailed information about the selected city
        fetchCityDetails(selectedCity);
    });

    // Function to fetch detailed city information
    function fetchCityDetails(city) {
        // Make another AJAX request to fetch city details from the database
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&titles=${city}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Extract relevant information from the response
                const pageId = Object.keys(data.query.pages)[0];
                const cityInfo = data.query.pages[pageId].extract;

                // Parse and display the city information
                displayCityInformation(cityInfo);
            })
            .catch(error => {
                console.log("Error fetching city details:", error);
            });
    }

    // Function to display city information on the webpage
    function displayCityInformation(cityInfo) {
        // Clear previous city information
        cityRank.textContent = "";
        cityPopulation2011.textContent = "";
        cityPopulation2001.textContent = "";
        cityState.textContent = "";

        // Extract required information from the cityInfo string
        const regex = /Rank:\s(\d+).*Population \(2011\):\s([\d,]+).*Population \(2001\):\s([\d,]+).*State or union territory:\s(.+)/;
        const matches = cityInfo.match(regex);

        if (matches) {
            // Display the extracted information
            const rank = matches[1];
            const population2011 = matches[2];
            const population2001 = matches[3];
            const state = matches[4];

            cityRank.textContent = `Rank: ${rank}`;
            cityPopulation2011.textContent = `Population (2011): ${population2011}`;
            cityPopulation2001.textContent = `Population (2001): ${population2001}`;
            cityState.textContent = `State or union territory: ${state}`;
        } else {
            // Display an error message if the information couldn't be extracted
            cityRank.textContent = "City information not found";
        }
    }
});
