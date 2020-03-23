
import json, os
from datetime import datetime
from helpers import get_todays_date
from download import download_dataset

def parse_data():
    """Parsing data from dataset to fit the frontend. 
    If dataset is 'out of date' (on hour old) it downloads new data. 
    The parsed data is then saved as a .json file.
    If dataset is NOT 'out of date' it will return immediately.
    
    Returns the filename of the parsed data
    """

    filename = "data/api/" + get_todays_date() + "-external.json"
    if os.path.exists(filename):
        file_time = datetime.fromtimestamp(os.path.getmtime(filename))
        now = datetime.now()
        file_lifetime = now - file_time
        if (file_lifetime.total_seconds() / 60) / 60 < 1:
            return filename

    data = download_dataset()
    if data == None:
        with open("data/external/latest.json", "r") as f:
            data = json.load(f)

    stats = {
        "confirmed": data['latest']['confirmed'],
        "deaths": data['latest']['deaths'],
        "recovered": data['latest']['recovered'],
        "countries": len(list(set([country['country'] for country in data['confirmed']['locations']]))),
        "updated": data['confirmed']['last_updated'].split("T")[0]
    }

    cities = []
    for c, d, r in zip(data['confirmed']['locations'], data['deaths']['locations'], data['recovered']['locations']):
        if c['country'] == d['country'] == r['country']:
            if not (c['latest'] == d['latest'] == r['latest'] == 0):
                parsed_city = {
                    "type": "Feature",
                    "properties": {
                        "city": c['country'],
                        "count": c['latest'],
                        "deaths": d['latest'],
                        "recovered": r['latest'],
                        "icon": "theatre"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [float(c['coordinates']['long']), float(c['coordinates']['lat'])]
                    }
                }
                cities.append(parsed_city)

    with open(filename, "+w") as json_file:
        json.dump({"cities": cities, "stats": stats}, json_file, sort_keys=True, indent=2, separators=(",", ":"))

    return filename


if __name__ == "__main__":
    parse_data()