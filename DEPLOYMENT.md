# Deployment Guide for Task Manager Dashboard

This guide will help you deploy your Task Manager Dashboard application to production. We'll use Vercel for the frontend (React) and Render for the backend (Node.js/Express).

## 1. Preparing for Deployment

### Backend Preparation

1. Update your `.env` file to include production variables:

```
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
NODE_ENV=production
```

2. Create a `Procfile` in the server directory:

```
web: node server.js
```

3. Update your `package.json` in the server directory:

```json
{
  "engines": {
    "node": ">=14.0.0"
  }
}
```

### Frontend Preparation

1. Update your API configuration to use environment variables:

Create a `.env` file in the client directory:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

2. Update your `api.js` to use this environment variable:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

## 2. Deploying the Backend to Render

Render offers a free tier that's perfect for deploying Node.js applications.

1. Sign up at [render.com](https://render.com)

2. Click "New" and select "Web Service"

3. Connect your GitHub repository or upload your code directly

4. Configure your service:
   - **Name**: task-manager-api (or any name you prefer)
   - **Environment**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && node server.js`

5. Add your environment variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: production

6. Click "Create Web Service"

7. Wait for deployment to complete (this may take a few minutes)

8. Once deployed, Render will provide you with a URL for your API (e.g., `https://task-manager-api.onrender.com`)

## 3. Deploying the Frontend to Vercel

Vercel is optimized for React applications and offers a generous free tier.

1. Sign up at [vercel.com](https://vercel.com)

2. Install the Vercel CLI:
   ```
   npm i -g vercel
   ```

3. Navigate to your client directory:
   ```
   cd client
   ```

4. Run the Vercel deployment command:
   ```
   vercel
   ```

5. Follow the prompts to link your project to Vercel

6. Add your environment variables:
   - `REACT_APP_API_URL`: Your Render backend URL with `/api` at the end

7. Deploy your application:
   ```
   vercel --prod
   ```

8. Once deployed, Vercel will provide you with a URL for your frontend application

## 4. Alternative: Deploy Frontend to Netlify

1. Sign up at [netlify.com](https://netlify.com)

2. Install the Netlify CLI:
   ```
   npm install -g netlify-cli
   ```

3. Build your React app:
   ```
   cd client
   npm run build
   ```

4. Deploy to Netlify:
   ```
   netlify deploy
   ```

5. When prompted, select "Create & configure a new site"

6. Deploy the build folder:
   ```
   netlify deploy --prod -d build
   ```

## 5. Updating CORS Configuration

After deploying, update your backend CORS configuration to allow your frontend domain:

```javascript
// server.js
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 6. Post-Deployment Checks

1. **Test API Connectivity**: Make sure your frontend can connect to your backend API
2. **Test Database Operations**: Ensure CRUD operations work with your deployed MongoDB Atlas database
3. **Check Authentication**: If you've implemented authentication, verify it works in production
4. **Verify Environment Variables**: Ensure all environment variables are properly set
5. **Monitor Performance**: Use the Render and Vercel dashboards to monitor your application performance

## 7. Setting Up a Custom Domain (Optional)

### For Vercel:
1. Go to your project settings in the Vercel dashboard
2. Navigate to "Domains"
3. Add your custom domain and follow the instructions

### For Render:
1. Go to your service settings in the Render dashboard
2. Click on "Custom Domain"
3. Add your domain and configure DNS settings as instructed

## 8. Continuous Deployment

Both Render and Vercel support continuous deployment from GitHub. Connect your repository to automatically deploy when you push changes to your main branch.

## Troubleshooting

1. **API Connection Issues**:
   - Check CORS configuration
   - Verify environment variables are correctly set
   - Ensure your backend is running

2. **Database Connection Issues**:
   - Verify MongoDB Atlas IP whitelist includes Render's IPs
   - Check your connection string

3. **Build Failures**:
   - Review build logs in the respective platform
   - Ensure all dependencies are correctly installed
