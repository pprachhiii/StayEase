# StayEase - Rental Listing Platform(Airbnb Clone)

**StayEase** is a web application that allows users to browse, create, and manage listings for accommodations such as hotels or rental properties. Users can also leave reviews, filter listings, and search by location. The platform includes user authentication and provides an intuitive, responsive interface.

## 🔑 Current Features

- **User Registration & Login**: Users can register, log in, and log out securely.
- **User Listings**: Logged-in users can create, edit, and delete their own accommodation listings.
- **Listing Details**: Each listing includes key details and a map with approximate location coordinates (exact location is hidden).
- **Search by Location**: Search functionality allows users to find listings based on city or location keywords.
- **Category Filtering**: Listings can be filtered by predefined categories (e.g., hotel, apartment, cottage).
- **Reviews**: Users can post reviews on listings. Only the review author can delete their review.
- **Responsive UI**: Clean, mobile-friendly design using Bootstrap and custom CSS.

## 🛠 Technologies Used

- **Backend**:

  - Node.js with Express.js for server-side logic and routing
  - MongoDB for database, with Mongoose for schema modeling
  - Handlebars (or EJS) for server-side rendering

- **Frontend**:

  - Bootstrap 5 for layout and responsive design
  - Custom CSS for additional styling
  - FontAwesome for icons

- **Authentication**:

  - Session-based authentication with secure login and registration

## 🚀 Setup and Installation

### Prerequisites

- Node.js (v22.x or above)
- MongoDB Atlas (or local MongoDB instance)

### Run Locally

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/pprachhiii/StayEase.git
   ```

2. **Navigate to the Project**:

   ```bash
   cd StayEase
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

4. **Set Up Environment Variables**:
   Create a `.env` file using `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Update it with your MongoDB connection string and other config values.

5. **Start the Server**:

   ```bash
   nodemon app.js
   ```

   Visit `http://localhost:5000` in your browser.

## 🧭 Roadmap & Future Improvements

- **Booking System**: Let users book accommodations and manage their reservations.
- **Payment Integration**: Add Stripe or PayPal to process payments securely.
- **Admin Dashboard**: Admin tools to manage users, listings, and content.
- **Advanced Search**: Include price ranges, ratings, availability filters, etc.
- **Improved UX**: Add animations, form validation, loading indicators, and accessibility features.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository, create a branch, and open a pull request with your changes.

---

## 📌 Additional Notes

- Ensure MongoDB is properly set up (e.g., using MongoDB Atlas or a local MongoDB instance).
- The backend API must be running before the frontend is accessible for real-time messaging.
- Make sure that the `.env` file contains the correct values for the MongoDB URI and JWT secret.
