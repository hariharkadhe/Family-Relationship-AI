# How to Host your Family AI on Render (Step-by-Step)

Because this project uses **SWI-Prolog**, we need a special way to tell Render to install it. I have already created a **Dockerfile** in your folder to handle this automatically!

### Step 1: Push your code to GitHub
Make sure you have uploaded the latest files to your GitHub repository, including the new `Dockerfile` and `package.json`.

### Step 2: Create a New Web Service on Render
1.  Go to [dashboard.render.com](https://dashboard.render.com) and log in.
2.  Click the **"New +"** button and select **"Web Service"**.
3.  Connect your GitHub account and select your **`Family-Relationship-AI`** repository.

### Step 3: Configure the Service
Render will automatically detect the **Dockerfile**. 
1.  **Name**: Give it a name (e.g., `family-ai-system`).
2.  **Runtime**: Make sure it says **"Docker"** (Render should detect this automatically because of the file I added).
3.  **Plan**: Select the **"Free"** plan.

### Step 4: Deploy!
1.  Click **"Create Web Service"**.
2.  Render will now start "Building" your image. This might take 2-3 minutes because it's installing both Node.js and the SWI-Prolog engine.
3.  Once the logs say `"Server is running at http://localhost:3000"`, your site is LIVE!

### Step 5: Update your Frontend (Optional but Recommended)
Once Render gives you your live URL (e.g., `https://family-ai-system.onrender.com`), you should update the `fetch` URL in your `script.js` if you want it to point to the production server. But for now, the system is designed to work perfectly out of the box!

---
**Congratulations! Your AI is now ready for the cloud!** ☁️🧬✨
