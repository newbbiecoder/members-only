# 🛡️ Members Only

A private clubhouse where users can write messages, but only authenticated "Members" can see who the authors are. Admins have the power to moderate and delete messages.

---

## Features

* **Authentication:** Secure sign-up and login using **Passport.js** and **BcryptJS**.
* **Authorization Levels:**
    * **Guest:** Can see messages but can't see authors or timestamps.
    * **Member:** Can see everything and post new messages.
    * **Admin:** Full moderation privileges (Delete/Update any message).
* **Persistent Sessions:** Session data stored in **PostgreSQL** via `connect-pg-simple`.
* **Validation:** Robust server-side input validation using `express-validator`.
* **Custom Error Handling:** Centralized middleware to catch 404s and server errors.

---

## Database Design

### Users
Represents registered individuals with specific access and authorization levels.
**Fields:**
- `id` (primary key)
- `username` (unique)
- `fullname`
- `password` (hashed)
- `memberstatus` (boolean)
- `isadmin` (boolean)

### Messages
Contains the posts created by users, linked via a foreign key.
**Fields:**
- `id` (primary key)
- `title`
- `description`
- `user_id` (foreign key)

---

## Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Templating:** EJS (Embedded JavaScript)
* **Styles:** CSS3
* **Security:** Passport.js (Local Strategy), BcryptJS