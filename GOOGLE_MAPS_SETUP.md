# Setting Up Google Maps API for Address Autocomplete and Distance Calculation

This application uses the Google Maps API for address autocomplete and distance calculation between pickup and delivery locations. Follow these steps to set up your Google Maps API key:

## Steps to Get a Google Maps API Key

1. **Create a Google Cloud Platform Account**
   - Go to [Google Cloud Platform](https://cloud.google.com/)
   - Sign in with your Google account or create a new one

2. **Create a New Project**
   - In the Google Cloud Console, click on the project dropdown at the top of the page
   - Click "New Project"
   - Enter a name for your project and click "Create"

3. **Enable Required APIs**
   - In your project, navigate to "APIs & Services" > "Library"
   - Search for and enable the following APIs:
     - Places API
     - Distance Matrix API
     - Maps JavaScript API

4. **Create API Key**
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Your new API key will be displayed

5. **Restrict Your API Key (Recommended)**
   - In the credentials page, find your API key and click "Edit"
   - Under "Application restrictions", choose "HTTP referrers" and add your domains
   - Under "API restrictions", restrict the key to only the APIs you enabled
   - Click "Save"

## Adding the API Key to Your Application

1. Create a `.env.local` file in the root of your project (if it doesn't exist already)
2. Add your API key to the file:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```
3. Restart your development server for the changes to take effect

## Features Implemented

With the Google Maps API integration, your booking application now has:

1. **Address Autocomplete**
   - Customers can start typing an address and get suggestions
   - UK addresses are prioritized in the results
   - Postcodes are automatically extracted when available

2. **Distance Calculation**
   - Automatic calculation of distance between collection and delivery addresses
   - Estimated travel time displayed to help customers choose appropriate service duration
   - Distance information is stored with the booking for pricing calculations

## Troubleshooting

- If autocomplete doesn't work, check your browser console for API errors
- Ensure your API key has the correct permissions and restrictions
- Check that the `.env.local` file is correctly formatted with no spaces around the equals sign
