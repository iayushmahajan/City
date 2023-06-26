document.addEventListener("DOMContentLoaded", function() {
  const cityInput = document.getElementById("cityInput");
  const cityDropdown = document.getElementById("cityDropdown");
  const getInfoButton = document.getElementById("getInfoButton");
  const cityRank = document.getElementById("cityRank");
  const cityPopulation2011 = document.getElementById("cityPopulation2011");
  const cityPopulation2001 = document.getElementById("cityPopulation2001");
  const cityState = document.getElementById("cityState");

  cityInput.addEventListener("input", function() {
    const input = cityInput.value.trim().toLowerCase();
    clearCityDropdown();
    if (input.length > 0) {
      fetchCityData(input);
    }
  });

  getInfoButton.addEventListener("click", function() {
    const selectedCity = cityDropdown.value;
    if (selectedCity) {
      fetchCityDetails(selectedCity);
    }
  });

  function clearCityDropdown() {
    cityDropdown.innerHTML = "";
    getInfoButton.disabled = true;
  }

  function fetchCityData(input) {
  const url = `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${input}&limit=5`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const cities = data[1];
      clearCityDropdown(); // Clear previous dropdown options
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

      cityRank.textContent = rank;
      cityPopulation2011.textContent = population2011;
      cityPopulation2001.textContent = population2001;
      cityState.textContent = state;
    } else {
      cityRank.textContent = "City information not found";
      cityPopulation2011.textContent = "";
      cityPopulation2001.textContent = "";
      cityState.textContent = "";
    }
  }
});
