
const url = "http://127.0.0.1:5000"

async function getExternalData(){
    let data = await fetch(url + "/get/data", {
        method: "GET",
        mode: "cors"
    }).then(res => {
        return res.json()
    }).catch(e => { 
      console.log(e)
      console.warn("Could not connect to database. Loading old data...")
      return getEmergencyData()
    })

    return [data.data, data.stats]
}
