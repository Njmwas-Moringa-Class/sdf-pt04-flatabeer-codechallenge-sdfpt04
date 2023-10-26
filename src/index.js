document.addEventListener("DOMContentLoaded", () => {
    // Fetch the list of beers and populate the navigation bar
    fetch("http://localhost:3000/beers")
      .then((response) => response.json())
      .then((data) => {
        const beerList = document.getElementById("beer-list");
        beerList.innerHTML = ""; // Clear the list
  
        data.forEach((beer) => {
          const listItem = document.createElement("li");
          listItem.textContent = beer.name;
          // Add a click event listener to load beer details when clicked
          listItem.addEventListener("click", () => loadBeerDetails(beer.id));
          beerList.appendChild(listItem);
        });
  
        // Initialize the app with details of the first beer
        loadBeerDetails(data[0].id);
      })
      .catch((error) => {
        console.error("Error fetching beer list:", error);
      });
  });
  
  // Function to load beer details
  function loadBeerDetails(beerId) {
    fetch(`http://localhost:3000/beers/${beerId}`)
      .then((response) => response.json())
      .then((beer) => {
        // Populate the beer details on the page
        const beerName = document.getElementById("beer-name");
        const beerImage = document.getElementById("beer-image");
        const beerDescription = document.getElementById("beer-description");
  
        beerName.textContent = beer.name;
        beerImage.src = beer.image_url;
        beerImage.alt = beer.name;
        beerDescription.textContent = beer.description;
  
        // Add the beer's reviews
        const reviewList = document.getElementById("review-list");
        reviewList.innerHTML = ""; // Clear the placeholder reviews
  
        beer.reviews.forEach((review) => {
          const listItem = document.createElement("li");
          listItem.textContent = review;
          reviewList.appendChild(listItem);
        });
  
        // Update the description form with the current beer's description
        const descriptionTextArea = document.getElementById("description");
        descriptionTextArea.value = beer.description;
  
        // Add event listener for updating the description
        const descriptionForm = document.getElementById("description-form");
        descriptionForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const newDescription = descriptionTextArea.value;
          updateBeerDescription(beerId, newDescription);
        });
  
        // Add event listener for adding a review
        const reviewForm = document.getElementById("review-form");
        reviewForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const newReview = document.getElementById("review").value;
          addBeerReview(beerId, newReview);
        });
      })
      .catch((error) => {
        console.error("Error fetching beer details:", error);
      });
  }
  
  // Function to update the beer's description
  function updateBeerDescription(beerId, newDescription) {
    fetch(`http://localhost:3000/beers/${beerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: newDescription }),
    })
      .then(() => {
        // Refresh the beer details with the updated description
        loadBeerDetails(beerId);
      })
      .catch((error) => {
        console.error("Error updating beer description:", error);
      });
  }
  
  // Function to add a review for the beer
  function addBeerReview(beerId, newReview) {
    fetch(`http://localhost:3000/beers/${beerId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviews: [newReview] }),
    })
      .then(() => {
        // Refresh the beer details to display the updated review list
        loadBeerDetails(beerId);
      })
      .catch((error) => {
        console.error("Error adding beer review:", error);
      });
  }
  