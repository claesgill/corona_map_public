
import requests, os, json
from helpers import get_todays_date

def download_dataset():
    """Fetch data from source and save as .json
    
    Returns the response as json
    """
    # url = "https://coronavirus-tracker-api.herokuapp.com/all" OLD URL
    url = "https://coronavirus-tracker-api.herokuapp.com/v2/locations"
    respons = requests.get(url)
    if respons.status_code == 200:
        data = respons.json()
        with open("data/external/latest.json", "+w") as f:
            json.dump(data, f)
        return data
    return None

if __name__ == "__main__":
    download_dataset()
