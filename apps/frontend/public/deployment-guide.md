
# Deployment Guide for the Hotel Website

## Option 1: GitHub Pages Deployment (Static Frontend Only)

GitHub Pages can only host the static frontend portion of this website. For the dynamic features (booking, user accounts), you'll need a separate backend service.

### Step 1: Setup GitHub Pages

1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Set the source to the branch you want to deploy (typically `main` or `gh-pages`)
4. Click Save

### Step 2: Configure for GitHub Pages

1. Add a `homepage` field to your `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/your-repo-name"
   ```

2. Add deployment scripts to your `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Install the `gh-pages` package:
   ```bash
   npm install --save-dev gh-pages
   ```

4. Run the deploy command:
   ```bash
   npm run deploy
   ```

## Option 2: Full Stack Deployment

For a complete solution with database functionality, consider these options:

### Netlify + Backend Service

1. **Frontend**: Deploy to Netlify
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Backend**: Create a separate service with:
   - Render: https://render.com (Node.js API)
   - Railway: https://railway.app (supports various backends)

3. **Database**: Use a database service
   - Railway MySQL: https://railway.app
   - PlanetScale: https://planetscale.com
   - Use your existing MySQL database with:
     - Host: sql110.infinityfree.com
     - Port: 3306
     - Username: if0_38602606
     - Password: TNSCnG7Hr-fNLf
     - Database: if0_38602606_XXX

### Traditional Hosting (PHP + MySQL)

For a traditional solution with PHP and MySQL:

1. **Hostinger/Bluehost/InfinityFree**:
   - Upload files via FTP
   - Import database using phpMyAdmin
   - Configure database connection in PHP files

2. **Setup steps**:
   - Create a PHP API for the backend (stored in `/api` folder)
   - Connect to database using the provided credentials
   - Deploy the entire project to your hosting provider

## Setting Up Backend API (For Full Stack Options)

Create a simple PHP API to handle database operations:

```php
<?php
// api/config.php
$host = "sql110.infinityfree.com";
$port = 3306;
$username = "if0_38602606";
$password = "TNSCnG7Hr-fNLf";
$database = "if0_38602606_XXX";

$conn = new mysqli($host, $username, $password, $database, $port);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>
```

```php
<?php
// api/rooms.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include_once "./config.php";

$query = "SELECT * FROM rooms";
$result = $conn->query($query);

$rooms = array();
while($row = $result->fetch_assoc()) {
  array_push($rooms, $row);
}

echo json_encode($rooms);
?>
```

## Database Setup

The database should have tables for:
- Users
- Rooms
- Bookings
- Contact Messages

You can use this SQL to create them:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  max_adults INT DEFAULT 2,
  max_children INT DEFAULT 1,
  single_rate DECIMAL(10,2) NOT NULL,
  double_rate DECIMAL(10,2),
  amenities TEXT
);

CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  room_id INT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  adults INT DEFAULT 1,
  children INT DEFAULT 0,
  extra_bed BOOLEAN DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
