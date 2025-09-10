import axios from "axios";
import React, { useState } from "react"
import i3 from "../assets/images/i3.jpg"


function Weather() {
    const [city, setcity] = useState("")
    const [report, setreport] = useState("")
    const [weather, setweather] = useState("")
    const [temperature, settemperature] = useState("")
    const [description, setdescription] = useState("")

    function handlecity(evt) {
        setcity(evt.target.value)
    }

    function handlereport() {
        const weatherdata = axios(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f72d75df661736388b450da79da69a0e`)

        weatherdata.then(function (sucess) {
            console.log(sucess.data)
            setweather(sucess.data.weather[0].main)
            settemperature(sucess.data.main.temp)
            setdescription(sucess.data.weather[0].description)
        })
    }


    return (
        <div className="h-screen w-screen  bg-cover  flex justify-center items-center " style={{backgroundImage: `url(${i3})` }}>
            <div className=" p-8 rounded-xl shadow-xl w-full max-w-md backdrop-blur-md text-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md hover:scale-105 transition-transform duration-200 ">

                <div>
                    <h1 className="text-3xl bold font-semibold">Weather Report⛅</h1>
                    <p>I can give you a weather report about your city:)</p>
                    <input type="text" placeholder="Enter your city name" className="p-1 mt-8 border-black rounded-md border  w-80" onChange={handlecity}></input><br></br>
                  <button className="  border p-2 rounded-md mt-2 bg-black text-white w-80" onClick={handlereport}>Report</button>
             </div>

             <div className="mt-5">
                <h1><b>weather:</b>{weather}</h1>
                   <h1><b>temperature:</b>{temperature}</h1>
                    <h1><b>description:</b>{description}</h1>
              </div>
        </div>
      </div>
    )

}

export default Weather
