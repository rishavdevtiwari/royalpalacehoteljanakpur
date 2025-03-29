
# Deploying to GitHub Pages - Step by Step Guide

This guide explains how to deploy your Royal Palace Hotel static site to GitHub Pages.

## Step 1: Configure Your Repository for GitHub Pages

1. Ensure your repository is public or you have GitHub Pro for private repositories
2. The GitHub Actions workflow file is properly configured in `.github/workflows/deploy.yml`

## Step 2: Push Your Code to GitHub

1. Commit and push your changes to the main branch
2. The GitHub Actions workflow will automatically trigger

## Step 3: Monitor the Deployment

1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. You should see the workflow running or completed
4. If successful, your site will be deployed to GitHub Pages

## Step 4: Access Your Site

Your site will be available at: `https://rishavdevtiwari.github.io/royalpalacehotel/`

## Step 5: Configure Custom Domain (Optional)

1. Go to your repository's Settings > Pages
2. Under "Custom domain," enter your domain name (e.g., rishavdevtiwari.com.np)
3. Save the changes
4. Configure your DNS records as follows:

### DNS Configuration with Cloudflare:

1. **For the root domain (@)**:
   - Type: CNAME
   - Name: @
   - Target: rishavdevtiwari.github.io
   - Proxy status: Proxied (orange cloud ON)
   - TTL: Auto

2. **For the www subdomain**:
   - Type: CNAME
   - Name: www
   - Target: rishavdevtiwari.github.io
   - Proxy status: Proxied (orange cloud ON)
   - TTL: Auto

3. **SSL/TLS settings**:
   - Go to SSL/TLS section in Cloudflare
   - Set encryption mode to "Full" or "Full (strict)"
   - Enable "Always Use HTTPS" option

## Troubleshooting

If your deployment fails:

1. Check the GitHub Actions workflow logs for errors
2. Verify that the `base` in vite.config.ts is set to `/royalpalacehotel/`
3. Ensure all dependencies are properly specified in package.json
4. If using a custom domain, make sure the DNS settings are correct

## Updating Your Site

Any new commits to your main branch will automatically trigger a new deployment on GitHub Pages.
