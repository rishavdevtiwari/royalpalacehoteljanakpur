
# Deploying to Render.com - Step by Step Guide

This guide explains how to deploy your Royal Palace Hotel static site to Render.com.

## Step 1: Create a Render.com Account

If you don't already have one, sign up for a Render account at [https://render.com](https://render.com).

## Step 2: Connect Your GitHub Repository

1. In your Render dashboard, click on "New" and select "Static Site"
2. Connect your GitHub account if you haven't already
3. Select the repository: `rishavdevtiwari/royalpalacehoteljanakpur`

## Step 3: Configure Your Static Site

Enter the following information as shown in the screenshot:

- **Name**: royalpalacehoteljanakpur (or your preferred name)
- **Branch**: main (or your deployment branch)
- **Root Directory**: Leave blank or specify `apps/frontend` if needed
- **Build Command**: `npm run build` or `cd apps/frontend && npm install && npm run build`
- **Publish Directory**: `build` (or `apps/frontend/dist` if deploying from root)

## Step 4: Environment Variables

Add the following environment variable:
- Key: `VITE_API_URL`
- Value: `https://api.rishavdevtiwari.com.np/api`

## Step 5: Advanced Options (Optional)

Click on "Advanced" to access additional configuration options:

- You can set up auto-deployment options
- Configure custom domains
- Set up redirect/rewrite rules

## Step 6: Create Static Site

Click the "Create Static Site" button at the bottom of the form. Render will start deploying your site.

## Step 7: Monitor Deployment

You can monitor the deployment process in the Render dashboard. Once completed, you'll see a success message and a URL for your deployed site.

## Step 8: Set Up Your Custom Domain (Optional)

1. In your Render dashboard, go to your static site settings
2. Click on "Custom Domain"
3. Add your domain and follow the instructions to set up DNS records in Cloudflare

## Cloudflare Configuration

If you're using Cloudflare for DNS management:

1. Add a CNAME record pointing to your Render URL:
   - Name: `www` or `@` (for root domain)
   - Target: Your Render domain (e.g., `royalpalacehoteljanakpur.onrender.com`)
   - Proxy status: Proxied

2. SSL/TLS settings:
   - Set encryption mode to "Full"
   - Enable "Always use HTTPS"

## Troubleshooting

If your deployment fails, check the following:

1. Verify the build command is correct
2. Check that the publish directory matches your actual build output
3. Ensure all dependencies are properly specified in package.json
4. Look at the build logs in Render for specific errors

## Updating Your Site

Any new commits to your main branch will automatically trigger a new deployment on Render.com.
