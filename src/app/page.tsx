"use client"
import { useState, useEffect } from "react"
import JsonViewer from "./components/JsonViewer"
const platform = require("platform")

export default function Home() {

  const [ ipv4, setIpv4 ] = useState("-")
  const [ ipv6, setIpv6 ] = useState("-")
  const [ platformBrowserName, setPlatformBrowserName ] = useState("-")
  const [ platformBrowserVersion, setPlatformBrowserVersion ] = useState("-")
  const [ platformOSName, setPlatformOSName ] = useState("-")
  const [ platformOSVersion, setPlatformOSVersion ] = useState("-")
  // const [ platformDescription, setPlatformDescription ] = useState("-")
  const [ networkType, setNetworkType ] = useState("-")
  const [ networkQuality, setNetworkQuality ] = useState("-")
  const [ deviceType, setDeviceType ] = useState("-")
  const [ deviceScreen, setDeviceScreen ] = useState("-")
  const [ deviceModel, setDeviceModel ] = useState("-")
  const [ deviceManufacturer, setDeviceManufacturer ] = useState("-")
  const [ geolocationSource, setGeolocationSource ] = useState("-")
  const [ geolocationLatitude, setGeolocationLatitude ] = useState(0)
  const [ geolocationLongitude, setGeolocationLongitude ] = useState(0)
  const [ geolocationAccuracy, setGeolocationAccuracy ] = useState(0)       //https://iplogger.org/ip-tracker/
  const [ geolocationCity, setGeolocationCity ] = useState("-")
  const [ geolocationCountry, setGeolocationCountry ] = useState("-")
  const [ geolocationMessage, setGeolocationMessage ] = useState("-")

  useEffect(() => {

    //Get IP:
    (async () => {
      //IP V4:
      try {
        // const response = await fetch("https://api.ipify.org?format=json")
        const response = await fetch("https://ipinfo.io/json")
        if (response.status !== 200) { throw new Error("IPV4 API error") }
        const json = await response.json()
        setIpv4(json.ip)

        //Get Position details, before user grant GPS access:
        if (geolocationSource !== "gps") {
          setGeolocationSource("ip")
          setGeolocationLatitude(Number(json.loc.split(",")[0]))
          setGeolocationLongitude(Number(json.loc.split(",")[1]))
          setGeolocationCity(json.city)
          setGeolocationCountry(json.country)
        }
      } catch (err) {
        console.log(err)
        setIpv4("X")
      }

      //IP V6:
      try {
        // const response = await fetch("https://freeipapi.com/api/json")
        const response = await fetch("https://api.iplocation.net/?cmd=get-ip")
        if (response.status !== 200) { throw new Error("IPV6 API error") }
        const json = await response.json()
        if (json.ip_version == 6) {
          setIpv6(json.ip)
        }
      } catch (err) {
        console.log(err)
        setIpv6("X")
      }
    })()

    //Get Platform details:
    setPlatformBrowserName(platform.name)
    setPlatformBrowserVersion(platform.version)
    setPlatformOSName(platform.os.family)
    setPlatformOSVersion(platform.os.version)
    // setPlatformDescription(platform.description)

    //Get Network details:
    //https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
    //OBS: API does not support Firefox or Safari
    if ("connection" in navigator) {
      const connection:any = navigator["connection"]
      // console.log(connection)
      const type = connection.type
      const quality = connection.effectiveType 
      setNetworkType(type)
      setNetworkQuality(quality)
    }

    //Get Device details:
    //OBS: device detection by UA string, and not all of them have this info
    setDeviceType(screen.width > 768 ? "desktop" : "cellphone")
    setDeviceScreen(`${screen.width} x ${screen.height}`)
    if (platform.manufacturer) {
      setDeviceModel(platform.product)
      setDeviceManufacturer(platform.manufacturer)
    }

    //Get Position details, after user grant GPS access:
    //https://www.w3schools.com/html/html5_geolocation.asp
    //OBS: Mobile browsers, once location permission is denied, won't ever ask user for permission again. Enable location usage manually by clicking on the locker icon beside the URL.
    //OBS: Mobile browsers won't distinguish between GPS "on" or "off", even after location permission is granted.
    function getGeolocationPosition(position: any) {
      setGeolocationSource("gps")
      // console.log(position)
      setGeolocationLatitude(position.coords.latitude)
      setGeolocationLongitude(position.coords.longitude)
      setGeolocationAccuracy(position.coords.accuracy)
    }

    function getGeolocationError(error: any) {
      switch(error.code) {
        case error.PERMISSION_DENIED:
          setGeolocationMessage("User denied the request for Geolocation.")
          break;
        case error.POSITION_UNAVAILABLE:
          setGeolocationMessage("Location information is unavailable.")
          break;
        case error.TIMEOUT:
          setGeolocationMessage("The request to get user location timed out.")
          break;
        case error.UNKNOWN_ERROR:
          setGeolocationMessage("An unknown error occurred.")
          break;
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getGeolocationPosition, getGeolocationError)
    }
    else {
      setGeolocationMessage("Geolocation is not supported by this browser.")
    }
  }, [])

  //Logs server-side platform data on VSCode terminal when parent component renders the page server-side,
  //and logs client-side platform data on browser's console when useEffect runs client-side
  // console.log(platform.toString())    

  return (
    
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    
      {/* <h2>{`IPv4: ${ipv4}`}</h2>
      <h2>{`IPv6: ${ipv6}`}</h2>
      <h2>{`platform client-side: ${userPlatform}`}</h2> */}

      <JsonViewer
        data={{
          ip: {
            ipv4, ipv6
          }, 
          platform: {
            browser_name: platformBrowserName,
            browser_version: platformBrowserVersion,
            os_name: platformOSName,
            os_version: platformOSVersion,
            // description: platformDescription
          },
          network: {
            type: networkType,
            quality: networkQuality
          },
          device: {
            type: deviceType,
            screen: deviceScreen,
            model: deviceModel,
            manufacturer: deviceManufacturer,
          },
          geolocation: {
            source: geolocationSource,
            latitude: geolocationLatitude,
            longitude: geolocationLongitude,
            accuracy: geolocationAccuracy,
            city: geolocationCity,
            country: geolocationCountry,
            message: geolocationMessage,
          }
        }} 
      />
    </main>
  )
}
