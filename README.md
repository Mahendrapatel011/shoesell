# Scatch - The Premium Shoe Marketplace 👟

Welcome to Scatch, a full-stack e-commerce application designed for sneaker enthusiasts. This project provides a seamless shopping experience with a modern frontend and a robust backend API.

 
*(Yahan aap apne project ka ek accha sa screenshot laga sakte hain. Maine ek placeholder image link daal diya hai.)*

---

## ✨ Features

- **Modern UI:** A clean, responsive, and intuitive user interface built with React.
- **Product Catalog:** Browse products with filters and sorting options.
- **User Authentication:** Secure user registration and login with JWT.
- **Shopping Cart:** Add, update, and remove items from the cart.
- **Profile Management:** Users can view and update their profile information.
- **Full-Stack Architecture:** A complete monorepo setup with a separate client and server.

---

## 🛠️ Tech Stack

| Area      | Technology                                    |
|-----------|-----------------------------------------------|
| **Frontend**  | React.js, Axios, React Router, CSS        |
| **Backend**   | Node.js, Express.js                       |
| **Database**  | MongoDB with Mongoose                     |
| **Auth**      | JSON Web Tokens (JWT), bcrypt.js          |

---

## 📂 Project Structure

This project is a monorepo containing two primary folders:

- **`/scatch-frontend`**: The React client application that consumes the backend API.
- **`/scatch`**: The Node.js/Express.js server that provides the REST API.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (You can use a local instance or a free cloud instance from MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository to your local machine:**
    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```

2.  **Set up the Backend (`/scatch`):**

    *   Navigate to the backend directory:
        ```bash
        cd scatch
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `/scatch` directory. This file will store your environment variables.
        ```
        PORT=3001
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_super_secret_jwt_key
        CLIENT_URL=http://localhost:5173
        ```
    *   Start the backend server:
        ```bash
        npm run dev
        ```
    The server should now be running, typically on `http://localhost:3001`.

3.  **Set up the Frontend (`/scatch-frontend`):**

    *   Open a **new terminal window** and navigate to the frontend directory:
        ```bash
        cd scatch-frontend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Start the frontend development server:
        ```bash
        npm run dev
        ```
    The React application will open in your browser, usually at `http://localhost:5173`.

---

### 🎉 You're All Set!

The application should now be fully functional on your local machine. The frontend will make requests to your local backend server.

Happy coding!