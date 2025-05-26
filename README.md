# AI Startup Mentor

An assessment app that uses AI to evaluate your startup ideas.

## Project Structure

```
GPT-IDEA-VALIDATOR/
│
├── server/   # Node.js/Express backend
├── client/   # React/Vite frontend
```

---

## Setup Instructions

### 1. Server Setup

```powershell
cd server
cp .env.example .env
# Edit .env and set your OpenAI API key
npm install
npm start
```

The server will run on `http://localhost:3000`.

---

### 2. Client Setup

Open a new terminal:

```powershell
cd client
npm install
npm run dev
```

The client will run on `http://localhost:5173` (default Vite port).

---

## Environment Variables

- In `server/.env`:
  - `OPENAI_API_KEY=your_openai_api_key_here`
  - `PORT=3000` (optional)

---

## Usage

1. Enter your startup idea in the text box.
2. Click "Submit".
3. View the AI mentor's verdict, explanation, and suggestion.

---

## Tech Stack

- **Backend:** Node.js, Express, OpenAI SDK
- **Frontend:** React, Vite

---

## License

MIT
