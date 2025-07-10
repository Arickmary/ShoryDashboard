
# Vercel Deployment Guide

This guide will walk you through deploying your Insurance Product Dashboard application to Vercel.

### Prerequisites
1.  **A GitHub Account:** Vercel works best when linked to a Git repository.
2.  **A Vercel Account:** You can sign up for free with your GitHub account.
3.  **Git installed** on your computer.

---

### Step 1: Push Your Project to GitHub

First, you need to get your project code into a GitHub repository.

1.  **Create a `.gitignore` file:** Before you do anything else, make sure the `.gitignore` file exists in your project's root directory. This file is crucial as it prevents your secret keys in the `.env` file from being uploaded to GitHub.

2.  **Initialize Git and Create a Repository:**
    *   Open your terminal in the project's root directory.
    *   Run `git init` to initialize a new Git repository.
    *   Go to [GitHub](https://github.com/new) and create a new repository (e.g., `insurance-dashboard`). Do **not** initialize it with a README or .gitignore, as you already have them.

3.  **Commit and Push Your Code:**
    *   In your terminal, add all your files to Git (the `.gitignore` will automatically exclude the `.env` file):
        ```bash
        git add .
        git commit -m "Initial commit"
        ```
    *   Link your local repository to the one on GitHub and push your code. Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with your details.
        ```bash
        git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
        git branch -M main
        git push -u origin main
        ```

---

### Step 2: Import and Deploy Project on Vercel

1.  **Log in to Vercel:** Go to [vercel.com](https://vercel.com) and log in.

2.  **Import Project:**
    *   From your Vercel dashboard, click **"Add New..."** -> **"Project"**.
    *   The "Import Git Repository" screen will appear. If you've connected your GitHub account, you should see your new repository in the list.
    *   Click the **"Import"** button next to your repository name.

3.  **Configure Project:**
    *   Vercel is smart and will likely detect that you have a simple static project. You should not need to change any Build & Output Settings. The Root Directory should remain as is.
    *   This is the most important step: **Set Environment Variables**. Vercel does not use your `.env` file. You must add your keys to the Vercel project settings.
        *   Expand the **"Environment Variables"** section.
        *   Add the following three variables, one by one, copying the values from your local `.env` file:
            *   `API_KEY`
            *   `SUPABASE_URL`
            *   `SUPABASE_KEY`
        *   For each one, paste the corresponding secret value.
        *   Click **Add** after entering each variable.

4.  **Deploy:**
    *   Once the environment variables are set, click the **"Deploy"** button.
    *   Vercel will start the deployment process. It's usually very fast.

5.  **Congratulations!**
    *   Once deployment is complete, Vercel will present you with a confirmation screen and a URL where your live application can be accessed.

Your application is now live on the internet!
