# CompanyWisePrep 🚀

**CompanyWisePrep** is a next-generation, AI-powered platform designed to help software engineers prepare for company-specific Online Assessments (OAs). Instead of generic practice questions, we offer highly realistic mock assessments tailored to the exact patterns, difficulty, and question formats used by top tech companies like Amazon, Google, Microsoft, and more.

![CompanyWisePrep Dashboard Preview](public/sc.png)

## 🌟 Key Features

*   **🏢 Company-Specific OAs:** Unlock and practice assessments modeled after real online assessments from top tech companies.
*   **💻 Built-in Code Editor & Execution:** Write and run your DSA solutions in multiple languages (Python, JavaScript, Java, C++) directly in the browser via Wandbox API integration.
*   **🎨 UI Build Assessments:** Complete Front-End engineering challenges with a live-preview Monaco editor environment for HTML, CSS, and JS.
*   **🤖 AI-Powered Evaluation:** Receive deep, actionable feedback and scoring on your code performance, edge cases, and time complexity powered by advanced LLMs (Groq & OpenAI).
*   **💳 Credit System & Payments:** Seamlessly purchase credits to unlock premium assessments via Razorpay integration.
*   **🔐 Secure Authentication:** Quick and easy Google OAuth login via NextAuth.
*   **⚡ Blazing Fast UI:** Built on the Next.js App Router with smooth page transitions, dynamic skeletons, and a highly polished UI.

## 🛠️ Tech Stack

*   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Google Provider)
*   **Code Execution:** [Wandbox API](https://github.com/melpon/wandbox/tree/master/kennel2)
*   **AI Integration:** [Groq](https://groq.com/) API / OpenAI (for code analysis and UI evaluation)
*   **Payments:** [Razorpay](https://razorpay.com/)
*   **Analytics:** [Firebase Analytics](https://firebase.google.com/)

## 🚀 Getting Started

### Prerequisites
*   Node.js 18.x or later
*   A PostgreSQL Database (e.g., Supabase, Neon, or local)
*   API Keys for Google OAuth, Groq, Razorpay, and Firebase.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/gouravsahax/companywiseprep.git
    cd companywiseprep
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add your keys:
    ```env
    # Database
    DATABASE_URL="postgresql://user:password@host:port/db?schema=public"
    
    # NextAuth
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your_nextauth_secret"
    GOOGLE_CLIENT_ID="your_google_client_id"
    GOOGLE_CLIENT_SECRET="your_google_client_secret"
    
    # API Keys
    GROQ_API_KEY="your_groq_api_key"
    
    # Razorpay
    NEXT_PUBLIC_RAZORPAY_KEY_ID="your_razorpay_key"
    RAZORPAY_KEY_SECRET="your_razorpay_secret"
    
    # Firebase Analytics (Client-side)
    NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
    NEXT_PUBLIC_FIREBASE_APP_ID="..."
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="..."
    ```

4.  **Database Setup:**
    Push the Prisma schema to your database and seed the initial mock data:
    ```bash
    npx prisma db push
    # To run local seed scripts if necessary
    ```

5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/gouravsahax/companywiseprep/issues).

## 📄 License
This project is licensed under the MIT License.
