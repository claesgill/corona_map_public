# Corona Map  
This is a map of all the countries that are infected by the coronavirus. It fetches real-time data to visualize the status for each country - infected 😷, recovered 👍 and deaths 🌹. In addition, it shows the general status of the world.  

## Live version  
You can visit the live version at my website: [claesgill.com/coronamap/](http://www.claesgill.com/coronamap/)  

## Usage  
The frontend relies on making requests to the backend, otherwise it will load old outdated data. The backend is written in Python using Flask with Flask-CORS and requests.  

__Backend:__ Run `python3 backend/app.py`  
__Frontend:__ Run `python3 -m http.server`. Go to [http://localhost:8000](http://localhost:8000).  

## Dataset  
Dataset is taken from [https://github.com/ExpDev07/coronavirus-tracker-api](https://github.com/ExpDev07/coronavirus-tracker-api)  
