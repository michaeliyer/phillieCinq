// // IndexedDB Setup
// const dbRequest = indexedDB.open("phillieDeuxDB", 2);

// dbRequest.onupgradeneeded = function (event) {
//   const db = event.target.result;

//   if (!db.objectStoreNames.contains("trips")) {
//     const store = db.createObjectStore("trips", { keyPath: "id" });
//     store.createIndex("byStartDate", "startDate", { unique: false });
//     store.createIndex("byEndDate", "endDate", { unique: false });
//   }
// };

// dbRequest.onsuccess = function () {
//   console.log("IndexedDB version 2 is ready.");
// };

// dbRequest.onerror = function () {
//   console.error("Error opening IndexedDB:", dbRequest.error);
// };

// // Add a New Trip (No Overwriting Allowed)
// document.getElementById("tripInputForm").addEventListener("submit", function (e) {
//   e.preventDefault();

//   const tripId = parseInt(document.getElementById("tripId").value);
//   const location = document.getElementById("location").value;
//   const startDate = document.getElementById("startDate").value;
//   const endDate = document.getElementById("endDate").value;
//   const notes = document.getElementById("notes").value;
//   const photoFiles = document.getElementById("photoUpload").files;

//   // Convert photos to Base64
//   const photoPromises = Array.from(photoFiles).map((file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (e) => resolve(e.target.result);
//       reader.onerror = () => reject("Error reading file");
//       reader.readAsDataURL(file);
//     });
//   });

//   Promise.all(photoPromises).then((photos) => {
//     const newTrip = {
//       id: tripId,
//       location,
//       startDate,
//       endDate,
//       notes,
//       dailyNotes: {},
//       photos,
//     };

//     const dbRequest = indexedDB.open("phillieDeuxDB", 2);

//     dbRequest.onsuccess = function (event) {
//       const db = event.target.result;
//       const transaction = db.transaction("trips", "readwrite");
//       const store = transaction.objectStore("trips");

//       // Check if trip ID already exists
//       const checkRequest = store.get(tripId);

//       checkRequest.onsuccess = function () {
//         if (checkRequest.result) {
//           // Trip ID exists, show alert and stop further processing
//           alert(
//             `Oh là là ! Ce numéro de voyage (${tripId}) est déjà pris. Choisissez-en un autre, s'il vous plaît !`
//           );
//         } else {
//           // Trip ID does not exist, proceed to add the trip
//           store.put(newTrip);
//           document.getElementById("tripInputForm").reset();
//           displayAllTrips(); // Refresh the list of all trips
//         }
//       };

//       checkRequest.onerror = function () {
//         console.error("Error checking trip ID:", checkRequest.error);
//       };
//     };

//     dbRequest.onerror = function () {
//       console.error("Error opening database:", dbRequest.error);
//     };
//   });
// });




// // Fetch and Display a Trip by ID
// document.getElementById("tripForm").addEventListener("submit", function (e) {
//   e.preventDefault();

//   const tripNumber = parseInt(document.getElementById("tripNumber").value);
//   const dbRequest = indexedDB.open("phillieDeuxDB", 2);

//   dbRequest.onsuccess = function (event) {
//     const db = event.target.result;
//     const transaction = db.transaction("trips", "readonly");
//     const store = transaction.objectStore("trips");

//     const request = store.get(tripNumber);
//     request.onsuccess = function () {
//       const trip = request.result;
//       if (trip) {
//         displayTrip(trip);
//       } else {
//         alert("Trip not found.");
//       }
//     };
//   };
// });




// // Display Trip Details with Delete Button
// function displayTrip(trip) {
//   const detailsContainer = document.getElementById("tripDetails");

//   const dailyNotes = Object.entries(trip.dailyNotes || {})
//     .map(([date, note]) => `<li>${date}: ${note}</li>`)
//     .join("");

//   const photos = (trip.photos || [])
//     .map(
//       (photo) =>
//         `<img src="${photo}" alt="Thumbnail" style="width: 50px; margin-right: 10px;" onclick="openFullImage('${photo}')" />`
//     )
//     .join("");

//   detailsContainer.innerHTML = `
//     <h2>Trip ${trip.id}</h2>
//     <p><strong>Location:</strong> ${trip.location}</p>
//     <p><strong>Start Date:</strong> ${trip.startDate}</p>
//     <p><strong>End Date:</strong> ${trip.endDate}</p>
//     <p><strong>Notes:</strong> ${trip.notes}</p>
//     <h3>Daily Notes:</h3>
//     <ul>${dailyNotes || "<p>No daily notes available.</p>"}</ul>
//     <h3>Photos:</h3>
//     <div>${photos || "<p>No photos available.</p>"}</div>
//     <button onclick="deleteTrip(${trip.id})" style="margin-top: 10px;">Delete Trip</button>
//   `;
// }



// // Delete a Trip
// function deleteTrip(tripId) {
//   if (confirm(`Are you sure you want to delete Trip ${tripId}?`)) {
//     const dbRequest = indexedDB.open("phillieDeuxDB", 2);

//     dbRequest.onsuccess = function (event) {
//       const db = event.target.result;
//       const transaction = db.transaction("trips", "readwrite");
//       const store = transaction.objectStore("trips");

//       const deleteRequest = store.delete(tripId);
//       deleteRequest.onsuccess = function () {
//         document.getElementById("tripDetails").innerHTML = ""; // Clear trip details
//         displayAllTrips(); // Refresh trip list
//       };

//       deleteRequest.onerror = function () {
//         console.error("Error deleting trip:", deleteRequest.error);
//       };
//     };

//     dbRequest.onerror = function () {
//       console.error("Error opening database:", dbRequest.error);
//     };
//   }
// }






// // Edit a Trip
// function editTrip(tripId) {
//   const dbRequest = indexedDB.open("phillieDeuxDB", 2);

//   dbRequest.onsuccess = function (event) {
//     const db = event.target.result;
//     const transaction = db.transaction("trips", "readonly");
//     const store = transaction.objectStore("trips");

//     const request = store.get(tripId);

//     request.onsuccess = function () {
//       const trip = request.result;
//       if (trip) {
//         // Populate form fields with trip data for editing
//         document.getElementById("tripId").value = trip.id;
//         document.getElementById("location").value = trip.location;
//         document.getElementById("startDate").value = trip.startDate;
//         document.getElementById("endDate").value = trip.endDate;
//         document.getElementById("notes").value = trip.notes;
//         alert("Edit the trip details and click 'Save Changes' to update the trip.");
//       } else {
//         alert("Trip not found for editing.");
//       }
//     };

//     request.onerror = function () {
//       console.error("Error fetching trip for editing:", request.error);
//     };
//   };

//   dbRequest.onerror = function () {
//     console.error("Error opening database:", dbRequest.error);
//   };
// }



// // Save Edited Trip
// document.getElementById("tripInputForm").addEventListener("submit", function (e) {
//   e.preventDefault();

//   const tripId = parseInt(document.getElementById("tripId").value);
//   const location = document.getElementById("location").value;
//   const startDate = document.getElementById("startDate").value;
//   const endDate = document.getElementById("endDate").value;
//   const notes = document.getElementById("notes").value;
//   const photoFiles = document.getElementById("photoUpload").files;

//   // Convert photos to Base64
//   const photoPromises = Array.from(photoFiles).map((file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (e) => resolve(e.target.result);
//       reader.onerror = () => reject("Error reading file");
//       reader.readAsDataURL(file);
//     });
//   });

//   Promise.all(photoPromises).then((photos) => {
//     const updatedTrip = {
//       id: tripId,
//       location,
//       startDate,
//       endDate,
//       notes,
//       dailyNotes: {}, // Keeping this for now; update logic can be added later
//       photos,
//     };

//     const dbRequest = indexedDB.open("phillieDeuxDB", 2);

//     dbRequest.onsuccess = function (event) {
//       const db = event.target.result;
//       const transaction = db.transaction("trips", "readwrite");
//       const store = transaction.objectStore("trips");

//       // Ensure trip ID exists before saving changes
//       const checkRequest = store.get(tripId);

//       checkRequest.onsuccess = function () {
//         if (checkRequest.result) {
//           // Trip ID exists, proceed to update the trip
//           store.put(updatedTrip);
//           document.getElementById("tripInputForm").reset();
//           displayAllTrips(); // Refresh the list of all trips
//         } else {
//           // Trip ID does not exist, show error
//           alert("Error: Trip ID does not exist. Cannot save changes.");
//         }
//       };

//       checkRequest.onerror = function () {
//         console.error("Error checking trip ID:", checkRequest.error);
//       };
//     };

//     dbRequest.onerror = function () {
//       console.error("Error opening database:", dbRequest.error);
//     };
//   });
// });

// // Display Trip Details with Edit Button
// function displayTrip(trip) {
//   const detailsContainer = document.getElementById("tripDetails");

//   const dailyNotes = Object.entries(trip.dailyNotes || {})
//     .map(([date, note]) => `<li>${date}: ${note}</li>`)
//     .join("");

//   const photos = (trip.photos || [])
//     .map(
//       (photo) =>
//         `<img src="${photo}" alt="Thumbnail" style="width: 50px; margin-right: 10px;" onclick="openFullImage('${photo}')" />`
//     )
//     .join("");

//   detailsContainer.innerHTML = `
//     <h2>Trip ${trip.id}</h2>
//     <p><strong>Location:</strong> ${trip.location}</p>
//     <p><strong>Start Date:</strong> ${trip.startDate}</p>
//     <p><strong>End Date:</strong> ${trip.endDate}</p>
//     <p><strong>Notes:</strong> ${trip.notes}</p>
//     <h3>Daily Notes:</h3>
//     <ul>${dailyNotes || "<p>No daily notes available.</p>"}</ul>
//     <h3>Photos:</h3>
//     <div>${photos || "<p>No photos available.</p>"}</div>
//     <button onclick="deleteTrip(${trip.id})" style="margin-top: 10px;">Delete Trip</button>
//     <button onclick="editTrip(${trip.id})" style="margin-top: 10px; margin-left: 10px;">Edit Trip</button>
//   `;
// }












// // Display All Trips
// function displayAllTrips() {
//   const dbRequest = indexedDB.open("phillieDeuxDB", 2);

//   dbRequest.onsuccess = function (event) {
//     const db = event.target.result;
//     const transaction = db.transaction("trips", "readonly");
//     const store = transaction.objectStore("trips");

//     const getAllRequest = store.getAll();
//     getAllRequest.onsuccess = function () {
//       const trips = getAllRequest.result;
//       const tripList = document.getElementById("tripList");

//       tripList.innerHTML = "";

//       trips.forEach((trip) => {
//         const listItem = document.createElement("li");
//         listItem.textContent = `Trip ${trip.id}: ${trip.location}`;
//         listItem.style.cursor = "pointer";
//         listItem.addEventListener("click", () => displayTrip(trip));
//         tripList.appendChild(listItem);
//       });
//     };
//   };
// }

// // Utility: Open Full Image in a New Tab
// function openFullImage(base64Image) {
//   const newTab = window.open();
//   newTab.document.body.innerHTML = `<img src="${base64Image}" style="width: 30%;" />`;
// }

// // Initial Display of All Trips
// displayAllTrips();





// Global flag to track if editing mode is active
let isEditing = false;

// IndexedDB Setup
const dbRequest = indexedDB.open("phillieDeuxDB", 2);

dbRequest.onupgradeneeded = function (event) {
  const db = event.target.result;

  if (!db.objectStoreNames.contains("trips")) {
    const store = db.createObjectStore("trips", { keyPath: "id" });
    store.createIndex("byStartDate", "startDate", { unique: false });
    store.createIndex("byEndDate", "endDate", { unique: false });
  }
};

dbRequest.onsuccess = function () {
  console.log("IndexedDB version 2 is ready.");
};

dbRequest.onerror = function () {
  console.error("Error opening IndexedDB:", dbRequest.error);
};




// // Fetch and Display a Trip by ID
document.getElementById("tripForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const tripNumber = parseInt(document.getElementById("tripNumber").value);
  const dbRequest = indexedDB.open("phillieDeuxDB", 2);

  dbRequest.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("trips", "readonly");
    const store = transaction.objectStore("trips");

    const request = store.get(tripNumber);
    request.onsuccess = function () {
      const trip = request.result;
      if (trip) {
        displayTrip(trip);
      } else {
        alert("Trip not found.");
      }
    };
  };
});








// Add or Edit Trip
document.getElementById("tripInputForm").addEventListener("submit", function (e) {
  e.preventDefault();

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
    const tripData = {
      id: tripId,
      location,
      startDate,
      endDate,
      notes,
      dailyNotes: {}, // Can expand later
      photos,
    };

    const dbRequest = indexedDB.open("phillieDeuxDB", 2);

    dbRequest.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction("trips", "readwrite");
      const store = transaction.objectStore("trips");

      // Check if trip ID exists
      const checkRequest = store.get(tripId);

      checkRequest.onsuccess = function () {
        if (isEditing) {
          // Editing Mode: Update the existing trip
          if (checkRequest.result) {
            store.put(tripData);
            isEditing = false; // Reset edit mode
            document.getElementById("tripInputForm").reset();
            displayAllTrips();
          } else {
            alert("Error: Trip ID does not exist for editing.");
          }
        } else {
          // Adding Mode: Prevent overwriting
          if (checkRequest.result) {
            alert(
              `Oh là là ! Ce numéro de voyage (${tripId}) est déjà pris. Choisissez-en un autre, s'il vous plaît !`
            );
          } else {
            store.put(tripData);
            document.getElementById("tripInputForm").reset();
            displayAllTrips();
          }
        }
      };

      checkRequest.onerror = function () {
        console.error("Error checking trip ID:", checkRequest.error);
      };
    };

    dbRequest.onerror = function () {
      console.error("Error opening database:", dbRequest.error);
    };
  });
});


// Delete a Trip
function deleteTrip(tripId) {
  if (confirm(`Are you sure you want to delete Trip ${tripId}?`)) {
    const dbRequest = indexedDB.open("phillieDeuxDB", 2);

    dbRequest.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction("trips", "readwrite");
      const store = transaction.objectStore("trips");

      const deleteRequest = store.delete(tripId);
      deleteRequest.onsuccess = function () {
        document.getElementById("tripDetails").innerHTML = ""; // Clear trip details
        displayAllTrips(); // Refresh trip list
      };

      deleteRequest.onerror = function () {
        console.error("Error deleting trip:", deleteRequest.error);
      };
    };

    dbRequest.onerror = function () {
      console.error("Error opening database:", dbRequest.error);
    };
  }
}






// Edit a Trip
function editTrip(tripId) {
  const dbRequest = indexedDB.open("phillieDeuxDB", 2);

  dbRequest.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("trips", "readonly");
    const store = transaction.objectStore("trips");

    const request = store.get(tripId);

    request.onsuccess = function () {
      const trip = request.result;
      if (trip) {
        document.getElementById("tripId").value = trip.id;
        document.getElementById("location").value = trip.location;
        document.getElementById("startDate").value = trip.startDate;
        document.getElementById("endDate").value = trip.endDate;
        document.getElementById("notes").value = trip.notes;

        isEditing = true; // Enable edit mode
      } else {
        alert("Trip not found for editing.");
      }
    };

    request.onerror = function () {
      console.error("Error fetching trip for editing:", request.error);
    };
  };

  dbRequest.onerror = function () {
    console.error("Error opening database:", dbRequest.error);
  };
}

// Display Trip Details
function displayTrip(trip) {
  const detailsContainer = document.getElementById("tripDetails");

  const dailyNotes = Object.entries(trip.dailyNotes || {})
    .map(([date, note]) => `<li>${date}: ${note}</li>`)
    .join("");

  const photos = (trip.photos || [])
    .map(
      (photo) =>
        `<img src="${photo}" alt="Thumbnail" style="width: 50px; margin-right: 10px;" onclick="openFullImage('${photo}')" />`
    )
    .join("");

  detailsContainer.innerHTML = `
    <h2>Trip ${trip.id}</h2>
    <p><strong>Location:</strong> ${trip.location}</p>
    <p><strong>Start Date:</strong> ${trip.startDate}</p>
    <p><strong>End Date:</strong> ${trip.endDate}</p>
    <p><strong>Notes:</strong> ${trip.notes}</p>
    <h3>Daily Notes:</h3>
    <ul>${dailyNotes || "<p>No daily notes available.</p>"}</ul>
    <h3>Photos:</h3>
    <div>${photos || "<p>No photos available.</p>"}</div>
    <button onclick="deleteTrip(${trip.id})" style="margin-top: 10px;">Delete Trip</button>
    <button onclick="editTrip(${trip.id})" style="margin-top: 10px; margin-left: 10px;">Edit Trip</button>
  `;
}

// Display All Trips
function displayAllTrips() {
  const dbRequest = indexedDB.open("phillieDeuxDB", 2);

  dbRequest.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("trips", "readonly");
    const store = transaction.objectStore("trips");

    const getAllRequest = store.getAll();
    getAllRequest.onsuccess = function () {
      const trips = getAllRequest.result;
      const tripList = document.getElementById("tripList");

      tripList.innerHTML = "";

      trips.forEach((trip) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Trip ${trip.id}: ${trip.location}`;
        listItem.style.cursor = "pointer";
        listItem.addEventListener("click", () => displayTrip(trip));
        tripList.appendChild(listItem);
      });
    };
  };
}

// Utility: Open Full Image in a New Tab
function openFullImage(base64Image) {
  const newTab = window.open();
  newTab.document.body.innerHTML = `<img src="${base64Image}" style="width: 30%;" />`;
}

// Initial Display
displayAllTrips();