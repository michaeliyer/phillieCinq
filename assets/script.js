// Initialize IndexedDB
const dbRequest = indexedDB.open("phillieTroisDB", 1);

dbRequest.onupgradeneeded = (event) => {
  const db = event.target.result;

  if (!db.objectStoreNames.contains("trips")) {
    const store = db.createObjectStore("trips", { keyPath: "id" });
    store.createIndex("byStartDate", "startDate", { unique: false });
    store.createIndex("byEndDate", "endDate", { unique: false });
  }
};

dbRequest.onsuccess = () => {
  console.log("Database initialized.");
  displayAllTrips(); // Display trips on page load
};

dbRequest.onerror = (event) => {
  console.error("Database error:", event.target.error);
};

// Toggle Menu
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("menu").classList.toggle("hidden");
});

// Sections
const sections = {
  addTrip: document.getElementById("addTripSection"),
  viewTrips: document.getElementById("viewTripsSection"),
  tripDetails: document.getElementById("tripDetailsSection"),
};

function hideAllSections() {
  Object.values(sections).forEach((section) => section.classList.add("hidden"));
}

document.getElementById("addTripBtn").addEventListener("click", () => {
  hideAllSections();
  sections.addTrip.classList.remove("hidden");
});

document.getElementById("viewTripsBtn").addEventListener("click", () => {
  hideAllSections();
  sections.viewTrips.classList.remove("hidden");
  displayAllTrips();
});

// Add a Trip
// Add or Overwrite a Trip
document.getElementById("tripInputForm").addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Form submitted")
  // Retrieve input values
  const tripId = parseInt(document.getElementById("tripId").value);
  const location = document.getElementById("location").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const notes = document.getElementById("notes").value;
  const photoFiles = document.getElementById("photoUpload").files;

  // Convert photos to Base64
  const photoPromises = Array.from(photoFiles).map((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject("Error reading file");
      reader.readAsDataURL(file);
    });
  });

  Promise.all(photoPromises).then((photos) => {
    const newTrip = {
      id: tripId,
      location,
      startDate,
      endDate,
      notes,
      dailyNotes: {}, // Placeholder for now
      photos,
    };

    // Open IndexedDB
    const dbRequest = indexedDB.open("phillieTroisDB", 1);

    dbRequest.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction("trips", "readwrite");
      const store = transaction.objectStore("trips");

      // Check if trip ID already exists
      const getRequest = store.get(tripId);
      getRequest.onsuccess = function () {
        if (getRequest.result) {
          alert("Trip ID already exists! Please choose a different ID.");
        } else {
          // Add the new trip
          const addRequest = store.put(newTrip);
          addRequest.onsuccess = function () {
            alert("Trip added successfully!");
            document.getElementById("tripInputForm").reset(); // Clear the form
            displayAllTrips(); // Refresh the list of trips
          };
          addRequest.onerror = function () {
            console.error("Error adding trip:", addRequest.error);
            alert("Failed to add trip. Please try again.");
          };
        }
      };

      getRequest.onerror = function () {
        console.error("Error checking trip ID:", getRequest.error);
      };
    };

    dbRequest.onerror = function () {
      console.error("Error opening database:", dbRequest.error);
      alert("Failed to connect to the database.");
    };
  });
});

// Display All Trips
function displayAllTrips() {
  const dbRequest = indexedDB.open("phillieTroisDB", 1);

  dbRequest.onsuccess = (event) => {
    const db = event.target.result;
    const store = db.transaction("trips", "readonly").objectStore("trips");

    store.getAll().onsuccess = (e) => {
      const trips = e.target.result;
      const tripList = document.getElementById("tripList");
      tripList.innerHTML = trips
        .map(
          (trip) => `
        <li>
          Trip ${trip.id}: ${trip.location}
          <button onclick="displayTrip(${trip.id})">View Details</button>
        </li>
      `
        )
        .join("");
    };
  };
}

// Display Trip Details
function displayTrip(tripId) {
  const dbRequest = indexedDB.open("phillieTroisDB", 1);

  dbRequest.onsuccess = (event) => {
    const db = event.target.result;
    const store = db.transaction("trips", "readonly").objectStore("trips");

    store.get(tripId).onsuccess = (e) => {
      const trip = e.target.result;
      if (!trip) {
        alert("Trip not found.");
        return;
      }

      const photos = (trip.photos || [])
        .map(
          (photo, index) => `
          <img 
            src="${photo}" 
            alt="Photo ${index + 1}" 
            style="width: 100px; cursor: pointer;" 
            onclick="window.open('${photo}', '_blank')" />
        `
        )
        .join("");

      document.getElementById("tripDetails").innerHTML = `
        <h2>Trip ${trip.id}</h2>
        <p><strong>Location:</strong> ${trip.location}</p>
        <p><strong>Start Date:</strong> ${trip.startDate}</p>
        <p><strong>End Date:</strong> ${trip.endDate}</p>
        <p><strong>Notes:</strong> ${trip.notes}</p>
        <h3>Photos:</h3>
        <div>${photos || "<p>No photos available.</p>"}</div>
      `;

      hideAllSections();
      sections.tripDetails.classList.remove("hidden");
    };
  };
}

// Close Trip Details
document.querySelector(".closeBtn").addEventListener("click", () => {
  hideAllSections();
  sections.viewTrips.classList.remove("hidden");
});