// Create a text field and a dropdown
const cityInput = document.getElementById("cityInput");
const cityDropdown = document.getElementById("cityDropdown");

// Fetch cities from the database
const cities = [
  {
    name: "Mumbai",
    rank: 1,
    population2011: 12.47 million,
    population2001: 11.91 million,
    state: "Maharashtra",
  },
  {
    name: "Delhi",
    rank: 2,
    population2011: 11.03 million,
    population2001: 10.78 million,
    state: "Delhi",
  },
  {
    name: "Bangalore",
    rank: 3,
    population2011: 10.43 million,
    population2001: 8.43 million,
    state: "Karnataka",
  },
  ...
];

// Listen for changes to the text field
cityInput.addEventListener("input", () => {
  // Get the city name from the text field
  const cityName = cityInput.value.toLowerCase();

  // Clear the dropdown
  cityDropdown.innerHTML = "";

  // Loop through the cities
  for (const city of cities) {
    // If the city name matches the text field, add it to the dropdown
    if (city.name.toLowerCase().includes(cityName)) {
      const option = document.createElement("option");
      option.value = city.name;
      option.innerHTML = city.name;
      cityDropdown.appendChild(option);
    }
  }
});

// When the user selects a city from the dropdown, display the city's data
cityDropdown.addEventListener("change", () => {
  // Get the selected city name
  const cityName = cityDropdown.value;

  // Loop through the cities
  for (const city of cities) {
    // If the selected city name matches the city name in the database, display the city's data
    if (city.name === cityName) {
      document.getElementById("rank").innerHTML = city.rank;
      document.getElementById("population2011").innerHTML = city.population2011;
      document.getElementById("population2001").innerHTML = city.population2001;
      document.getElementById("state").innerHTML = city.state;
    }
  }
});
