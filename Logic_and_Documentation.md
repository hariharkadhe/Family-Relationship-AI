# Family Relationship Query System - Logic & Documentation

This document provides a comprehensive explanation of the architecture, logic, and implementation of the **Family AI** system.

## 1. System Architecture

The project follows a classic **Three-Tier Architecture**:
1.  **Frontend (UI)**: Built with HTML5, Vanilla CSS, and JavaScript. It provides a premium interface for users to enter queries.
2.  **Backend (Server)**: A Node.js Express server that acts as a bridge between the web and the Prolog engine.
3.  **Knowledge Base (Logic Engine)**: SWI-Prolog handles the core logical deductions using a set of facts and rules.

---

## 2. Prolog Logic (The AI Core)

The file `family.pl` contains the "brain" of the system.

### Facts
Facts are the basic building blocks of our knowledge. We define gender and direct parent relationships:
```prolog
male(harihar).
female(savita).
parent(harihar, vivek).
```

### Logical Rules
Rules define how to deduce new information from facts. 
-   **Father/Mother**: A father is a male parent.
    ```prolog
    father(X, Y) :- male(X), parent(X, Y).
    ```
-   **Grandparent**: If X is a parent of Z, and Z is a parent of Y, then X is a grandparent of Y.
    ```prolog
    grandparent(X, Y) :- parent(X, Z), parent(Z, Y).
    ```
-   **Uncle/Aunt**: X is an uncle of Y if X is male and X is a sibling of Y's parent Z.

### The Query Helper
To make the AI work with the web, we use a specialized helper `run_ai_query/2`. It uses `read_term_from_atom` to convert the web input into a Prolog term, preserves variables (like `X`), and prints the result bindings (e.g., `X = john`).

---

## 3. Backend Logic (Node.js & Express)

The `server.js` file manages the communication.

-   **Query Handling**: When you click "Execute", the frontend sends a POST request to `/query`.
-   **Process Spawning**: The server uses `child_process.spawn` to run the `swipl` (SWI-Prolog) command.
-   **Isolation**: Each query is executed in a fresh Prolog instance for safety.
-   **Output Capture**: The server listens to the "stdout" (standard output) of the Prolog engine to get the deduced answer and sends it back to your browser.

---

## 4. Frontend Logic (Interactive UI)

-   **Premium Styling**: Uses **Glassmorphism** (semi-transparent backgrounds with blur) and **CSS Gradients** to create a modern, futuristic feel.
-   **Dynamic Updates**: JavaScript handles the button clicks, shows the "Deducing..." state, and updates the "Engine Result" card without reloading the page.
-   **Example Chips**: Pre-configured queries that help users learn the Prolog syntax instantly.

---

## 5. Directory Structure

-   `index.html`: The structure of the web page.
-   `style.css`: All the premium design and animations.
-   `script.js`: Logic to talk to the server.
-   `server.js`: The bridge between the web and Prolog.
-   `family.pl`: The logical database and rules.

---

## How to convert this to PDF
To save this as a PDF:
1.  Open the file `Logic_and_Documentation.md` in any Markdown viewer (like VS Code or Obsidian).
2.  Press **Ctrl + P** (Print) and select **"Save as PDF"**.
3.  Alternatively, use an online Markdown-to-PDF converter.

---
**Created by AI Family Relationship Query System**
