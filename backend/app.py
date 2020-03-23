from flask import Flask
from flask_cors import CORS
import json, os

from parser import parse_data

app = Flask(__name__)
CORS(app)

@app.route("/get/data", methods=["GET"])
def get_data():
    filename = parse_data()
    with open(filename) as f: 
        data = json.load(f)
    return {"data": data['cities'], "stats": data['stats']}


if __name__ == "__main__":
    if os.environ['USER'] == "pi":
        app.run(host="0.0.0.0", port=7000)
    else:
        app.run()
