
# Deployment Guide for Royal Palace Hotel

This guide explains how to deploy the Royal Palace Hotel website using Render.com and Cloudflare.

## Deployment Options

### Option 1: Render.com for Both Frontend and Backend (Recommended)

This is the simplest and most reliable approach:

1. **Fork/Clone the repository** to your GitHub account
2. **Connect your GitHub repository to Render.com**
3. **Use the `render.yaml` file** for automatic Blueprint deployment
   - This will create both the frontend and backend services
   - It will also provision the PostgreSQL database

#### Benefits of this approach:
- Single platform for all components
- Automatic HTTPS
- Custom domain support
- Simplified deployment process
- Continuous deployment from GitHub

### Option 2: GitHub Pages + Render.com

If you prefer to use GitHub Pages for the frontend:

1. **Setup GitHub Pages**:
   - Update vite.config.ts `base` parameter to match your repo name: `base: '/royalpalacehotel/'`
   - Add a GitHub workflow file in `.github/workflows/deploy.yml`
   - Configure GitHub Pages in repository settings

2. **Deploy Backend to Render.com**:
   - Follow the same steps for backend deployment
   - Update CORS settings in backend to allow GitHub Pages domain

#### Considerations for GitHub Pages:
- Requires additional configuration
- Need to ensure correct base paths in the application
- May require more CORS configuration

## Domain Configuration with Cloudflare

1. **Register your domain** with a registrar if you haven't already
2. **Add domain to Cloudflare**:
   - Create Cloudflare account
   - Add your domain to Cloudflare
   - Update nameservers with your registrar to point to Cloudflare

3. **Configure DNS records**:
   - Create A or CNAME record for main domain pointing to Render frontend
   - Create A or CNAME record for api subdomain pointing to Render backend

4. **SSL/TLS Configuration**:
   - Set SSL/TLS encryption mode to Full or Full (strict)
   - Enable Always Use HTTPS option

## Environment Variables

The following environment variables are needed for the backend:
- `DATABASE_URL`: PostgreSQL connection string (provided by Render)
- `JWT_SECRET`: Secret for JWT token generation
- `FRONTEND_URL`: URL of the frontend application
- `HOTEL_EMAIL`: Email for notifications
- `EMAIL_PASSWORD`: Email password for sending notifications

## Recommendation

For simplicity and better integration, I recommend using **Render.com for both frontend and backend** as configured in the render.yaml file. This provides a more streamlined deployment experience without the need to configure multiple platforms.
