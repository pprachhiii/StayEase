# StayEase

> **Find a place that feels like your place.**

StayEase is a modern accommodation discovery and listing platform built for people who want the search to feel simple, visual, and actually enjoyable. Browse properties, filter by location or category, save the ones that match your vibe, and manage your own listings from one clean interface.

[**Explore StayEase →**](https://stayease-smsm.onrender.com/properties)

---

## Why StayEase feels different

StayEase keeps the experience focused: strong imagery, clear property details, useful discovery tools, and a UI that does not make you fight your way to the good stuff.

- **Clean, responsive UI** — A polished Bootstrap-based layout with custom styling, familiar icons, and a mobile-friendly experience.
- **Visual property discovery** — Browse accommodation listings with images, categories, locations, and essential details upfront.
- **Search by location** — Find properties using city or location keywords.
- **Category filters** — Narrow the feed by property type, including hotels, apartments, cottages, and more.
- **Property pages that give context** — View detailed listing information with map support and approximate location data, while keeping the exact location private.
- **Wishlist, but make it useful** — Save properties you want to revisit and view your personal wishlist in one place.
- **Reviews** — Share feedback on listings, with review controls that keep ownership clear.
- **Creator-friendly listings** — Authenticated users can add, edit, and delete their own properties.
- **Secure sessions** — Local authentication, protected routes, session storage, flash messaging, and password handling are built into the experience.
- **Cloud image uploads** — Listing images are handled through Cloudinary for reliable media storage.

## Tech stack

### Frontend

- EJS + EJS-Mate for server-rendered views and layouts
- HTML, CSS, and JavaScript
- Bootstrap 5 for responsive structure
- Font Awesome for interface icons
- Google Fonts / Poppins for typography

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- Passport and Passport Local for authentication
- Express Session with MongoDB-backed session storage
- Joi-based listing validation
- Method Override for REST-style update and delete actions
- Mapbox SDK for location and map functionality
- Cloudinary + Multer for image uploads

## Core flows

```text
Discover → Filter → Open a property → Save or review

Sign up → Create a listing → Upload images → Manage your property
```

## Run StayEase locally

### Prerequisites

- Node.js 18+ recommended
- MongoDB Atlas or a local MongoDB instance
- Cloudinary account for image uploads
- Mapbox credentials if map functionality is enabled in your environment

### 1. Clone the repository

```bash
git clone https://github.com/pprachhiii/StayEase.git
cd StayEase
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file from the included example:

```bash
cp .env.example .env
```

Then add your own values:

```env
MONGO_URI=your-mongodb-connection-string
PORT=5000
SESSION_SECRET_KEY=your-session-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
NODE_ENV=development
```

Never commit real secrets or API keys.

### 4. Start the app

```bash
node app.js
```

For development with automatic restarts:

```bash
npx nodemon app.js
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

## Project structure

```text
StayEase/
├── controllers/     # Request handling and application logic
├── middleware/      # Authentication, validation, and error middleware
├── models/          # Mongoose data models
├── public/          # CSS, JavaScript, icons, and static assets
├── routes/          # Application routes
├── utils/           # Reusable helpers and custom errors
├── views/           # EJS pages, layouts, and partials
├── app.js            # Express app configuration and server entry point
└── .env.example     # Environment variable template
```

## Roadmap

- Booking and reservation management
- Secure payment integration
- Admin dashboard and moderation tools
- More advanced filters for price, rating, and availability
- Richer accessibility and interaction states
- Additional polish for loading, validation, and empty states

## Contributing

Found a bug or have a feature idea? Open an issue, or fork the project and submit a pull request. Keep changes focused, explain the why, and make sure the interface stays as clean as the product experience.

## License

This project is available under the [MIT License](LICENSE).

---

Built with intention by [pprachhiii](https://github.com/pprachhiii).
