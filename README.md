# Calgary Solar Car

Welcome to the public-facing website for [calgarysolarcar.ca](https://calgarysolarcar.ca)! This project is built on the **T3 Stack** and is designed to deliver a seamless web experience for our team members.

> **Note:** This project uses **Yarn v4**. To enable Yarn v4 with Corepack, simply run:
>
> ```bash
> corepack enable yarn
> ```

### Revoking users the manual way

This should be a ticket and should be made a priority:

You can't invite users who have already been invited, so get all ids that have expired:

```bash
curl 'https://api.clerk.com/v1/invitations?status=expired&query=&order_by=-created_at&paginated=true&limit=10&offset=0' \
  --header 'Authorization: Bearer SECRET_KEY' | jq -r '.data[].id'
```

Then delete their expired invitation:

```bash
curl 'https://api.clerk.com/v1/invitations/{invitation ID}/revoke' \
  --request POST \
  --header 'Authorization: Bearer SECRET_KEY'
```

## 🚀 Overview

The Calgary Solar Car website leverages modern technologies to ensure a scalable and efficient experience:

- **Next.js App Router:** React framework for building scalable web applications 🖥️
- **Clerk:** Manages authentication and user sessions 🔒  
  _Webhooks are used to synchronize Clerk users with our Supabase dashboard._
- **Supabase:** Provides database services and image storage 🗄️
- **tRPC:** Enables type-safe APIs for seamless client-server communication 🔄
- **SCSS:** Advanced styling featuring nested rules, variables, and mixins 🎨
- **ESLint & Prettier:** Enforces consistent coding standards and style ⚙️

_For access to Clerk and Supabase, please contact the telemetry lead._ 🙋‍♂️

## ⚙️ Getting Started

Follow these steps to set up your local development environment:

1. **Clone the Repository:**

   ```bash
   git clone git@github.com:UCSolarCarTeam/Solar-Car-Website-Next.git
   cd Solar-Car-Website-Next
   ```

2. **Enable Yarn v4:**

   ```bash
   corepack enable yarn
   ```

3. **Install Dependencies:**

   ```bash
   yarn install
   ```

4. **Obtain the Environment Configuration:**

   Request the `.env` file from the telemetry lead.

5. **Generate the Database Client:**

   ```bash
   yarn db:generate
   ```

6. **Start the Development Server:**

   ```bash
   yarn dev
   ```

## 🌐 Using Webhooks Locally

To ensure that Clerk syncs with our Supabase database, follow these steps for the first time while signing up on /portal locally.

1. **Start the Server:**

   Ensure your development server is running:

   ```bash
   yarn dev
   ```

2. **Expose Your Localhost to the Internet:**

   Open a new terminal window and create a tunnel using SSH:

   ```bash
   ssh -p 443 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R0:0.0.0.0:3000 a.pinggy.io
   ```

   This command will provide you with a public URL in the format:

   ```
   https://rngwz-XXX-XXX-XXX-XXX.a.free.pinggy.link
   ```

3. **Configure Clerk Webhooks:**

   - Login to the Clerk Dashboard: Switch to the **development** instance.
   - Navigate to: **Configure** > **Webhooks**.
   - Edit the Webhook URL: Append `/api/webhooks` to your public URL.  
     **Example:**
     ```
     https://rngwz-XXX-XXX-XXX-XXX.a.free.pinggy.link/api/webhooks
     ```

4. **Register Yourself on the Team Page:**

   Make sure to register on the portal so Clerk sends a webhook event to write to the Supabase database with your user data.

5. **Access the Application:**

   - Visit `/portal` to sign up.
   - To verify your user role, update your metadata on the Clerk user management page or ask a teammate with the proper permissions. 👍

## 📚 Development Notes

- **Next.js (App Router):** Utilizes the latest routing features for improved performance and scalability.
- **SCSS vs. CSS:** SCSS offers enhanced styling capabilities like nested rules and variables. Please familiarize yourself with these differences if you're transitioning from CSS.
- **Authentication (Clerk):** Critical for secure user sessions and synced user data with Supabase.
- **Database & Image Storage (Supabase):** Manages both the database and secure image storage.
- **tRPC:** Provides end-to-end type safety between the client and the server.
- **ESLint & Prettier:** Ensures high-quality, consistent code throughout the project.

- **Framer Motion:** Used to animate images and carousels. Find the documentation here --> https://motion.dev/

## 🛠️ Code Quality

We enforce strict code quality standards using **ESLint** and **Prettier**. Always run your linter and address any issues before merging your work.

Rebase your branch from main before opening a merge request, and make sure your branch is up to date before merging changes into main.
