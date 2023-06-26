document.addEventListener("DOMContentLoaded", function() {
  const cityInput = document.getElementById("cityInput");
  const getInfoButton = document.getElementById("getInfoButton");
  const cityRank = document.getElementById("cityRank");
  const cityPopulation2011 = document.getElementById("cityPopulation2011");
  const cityPopulation2001 = document.getElementById("cityPopulation2001");
  const cityState = document.getElementById("cityState");

  let cities = []; // Array to store city options
  let awesomplete;

  cityInput.addEventListener("input", function() {
    const input = cityInput.value.trim().toLowerCase();
    filterCities(input);
  });

  getInfoButton.addEventListener("click", function() {
    const selectedCity = cityInput.value.trim();
    if (selectedCity) {
      fetchCityDetails(selectedCity);
    }
  });

  function filterCities(input) {
    const filteredCities = cities.filter(city => city.toLowerCase().includes(input));
    awesomplete.list = filteredCities;
    if (filteredCities.length > 0) {
      getInfoButton.disabled = false;
    } else {
      getInfoButton.disabled = true;
    }
  }

  function fetchCityData() {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&titles=List_of_cities_in_India_by_population&rvprop=content&formatversion=2`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const pageContent = data.query.pages[0].revisions[0].content;
        cities = extractCitiesFromPageContent(pageContent);
        initializeAwesomplete();
      })
      .catch(error => {
        console.log("Error fetching city data:", error);
      });
  }

  function extractCitiesFromPageContent(pageContent) {
    const startMarker = '{{City-state-header|' + new Date().getFullYear();
    const endMarker = '}}';
    const startIndex = pageContent.indexOf(startMarker);
    const endIndex = pageContent.indexOf(endMarker, startIndex);

    const tableContent = pageContent.substring(startIndex, endIndex);
    const regex = /\|\s*city\s*=\s*(.*?)\s*(\||\n)/g;
    const matches = [...tableContent.matchAll(regex)];
    return matches.map(match => match[1]);
  }

  function initializeAwesomplete() {
    awesomplete = new Awesomplete(cityInput, {
      list: cities,
      minChars: 1,
      maxItems: 10,
      autoFirst: true
    });
  }

  function fetchCityDetails(city) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&titles=${city}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const pageId = Object.keys(data.query.pages)[0];
        const cityInfo = data.query.pages[pageId].extract;
        displayCityInformation(cityInfo);
      })
      .catch(error => {
        console.log("Error fetching city details:", error);
      });
  }

  function displayCityInformation(cityInfo) {
    const regex = /Rank:\s(\d+).*Population \(2011\):\s([\d,]+).*Population \(2001\):\s([\d,]+).*State or union territory:\s(.+)/;
    const matches = cityInfo.match(regex);

    if (matches) {
      const rank = matches[1];
      const population2011 = matches[2];
      const population2001 = matches[3];
      const state = matches[4];

      cityRank.textContent = `Rank: ${rank}`;
      cityPopulation2011.textContent = `Population (2011): ${population2011}`;
      cityPopulation2001.textContent = `Population (2001): ${population2001}`;
      cityState.textContent = `State or union territory: ${state}`;
    } else {
      cityRank.textContent = "City information not found";
      cityPopulation2011.textContent = "";
      cityPopulation2001.textContent = "";
      cityState.textContent = "";
    }
  }

  // Fetch city data and initialize Awesomplete
  fetchCityData();
});
