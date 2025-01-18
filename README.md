# PhillieDeux

**PhillieDeux** is a web-based trip logging application that allows users to:
- Add and store trip details (location, date, notes, etc.).
- Upload and manage trip photos with thumbnails.
- Organize notes by categories such as food, activities, and expenses.
- Search and filter notes by date or prefix.

## Features
- **Local Storage**: Trip data and photos are stored locally using IndexedDB.
- **User-Friendly Interface**: Clean and intuitive design for easy navigation.
- **Search and Categorization**: Quickly access trips and notes with powerful search features.

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/username/phillieDeux.git




   ## Development Tools
- **Reset Database**:
  - Use the following JavaScript function to reset the IndexedDB database:
    ```javascript
    indexedDB.deleteDatabase("phillieDeuxDB");
    ```
  - Alternatively, uncomment the `resetDatabase()` function in `dev-tools.js` to enable it in the app.

  - Create a button :   <button id="resetDatabase">Reset Database</button>