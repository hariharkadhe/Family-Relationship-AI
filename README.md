# Family Relationship Query System 🧬🤖

A premium, modern web application that uses **AI Logic (Prolog)** and **Node.js** to deduce family relationships. Enter queries like `father(X, vivek)` and let the logical engine find the answer!

## ✨ Features
- **Logic Engine**: Uses SWI-Prolog for deep logical deduction.
- **Modern UI**: Premium dark-themed interface with Glassmorphism and smooth animations.
- **Indian Context**: Pre-configured with an Indian family tree (Harihar, Vivek, Amit, etc.).
- **Live Deducing**: Real-time feedback from the backend engine.
- **Docker Ready**: Includes a Dockerfile for easy cloud deployment.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **Backend**: Node.js & Express.js
- **Logic**: SWI-Prolog (Logical Programming Language)
- **Deployment**: Docker, Render

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [SWI-Prolog](https://www.swi-prolog.org/) installed and added to your system PATH.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Family-Relationship-AI.git
   cd Family-Relationship-AI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Open your browser at `http://localhost:3000`.

## 🧠 How It Works
1. **The Knowledge Base**: `family.pl` contains facts (gender, parents) and rules (grandfather, sibling, etc.).
2. **The Request**: The frontend sends your query (e.g., `grandfather(X, mehul)`) to the Node.js server.
3. **The Deduction**: The server spawns a Prolog process, runs the logic, and captures the result.
4. **The Interface**: The result is sent back and displayed beautifully on the dashboard.

## 📂 Project Structure
- `family.pl`: The Prolog logic and family database.
- `server.js`: The Express backend bridge.
- `index.html`: The premium dashboard layout.
- `style.css`: Modern UI styling.
- `script.js`: Frontend logic and API handling.
- `Dockerfile`: Deployment configuration for the cloud.

## 📝 Example Queries
- `father(X, vivek)` - *Who is Vivek's father?*
- `mother(X, mehul)` - *Who is Mehul's mother?*
- `grandfather(X, mehul)` - *Who is the grandfather of Mehul?*
- `sibling(vivek, X)` - *Who are the siblings of Vivek?*

---
**Created with ❤️ for logical AI exploration.**
