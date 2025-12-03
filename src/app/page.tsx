"use client"
import { useState, useEffect } from "react"
import JsonViewer from "./components/JsonViewer"
import platform from "platform"

export default function Home() {

  const [ ipv4, setIpv4 ] = useState<String | undefined>("-")
  const [ ipv6, setIpv6 ] = useState<String | undefined>("-")
  const [ browserName, setBrowserName ] = useState<String | undefined>("-")
  const [ browserVersion, setBrowserVersion ] = useState<String | undefined>("-")
  const [ networkType, setNetworkType ] = useState<String | undefined>("-")
  const [ networkQuality, setNetworkQuality ] = useState<String | undefined>("-")
  const [ deviceType, setDeviceType ] = useState("-")
  const [ deviceScreen, setDeviceScreen ] = useState("-")
  const [ deviceModel, setDeviceModel ] = useState<String | undefined>("-")
  const [ deviceManufacturer, setDeviceManufacturer ] = useState<String | undefined>("-")
  const [ osName, setOSName ] = useState<String | undefined>("-")
  const [ osVersion, setOSVersion ] = useState<String | undefined>("-")
  const [ geolocationSource, setGeolocationSource ] = useState("-")
  const [ geolocationLatitude, setGeolocationLatitude ] = useState(0)
  const [ geolocationLongitude, setGeolocationLongitude ] = useState(0)
  const [ geolocationAccuracy, setGeolocationAccuracy ] = useState(0)       //https://iplogger.org/ip-tracker/
  const [ geolocationCity, setGeolocationCity ] = useState("-")
  const [ geolocationCountry, setGeolocationCountry ] = useState("-")

  useEffect(() => {

    //Get IP:
    (async () => {
      //IP V4:
      try {
        // const response = await fetch("https://api.ipify.org?format=json")
        const response = await fetch("https://ipinfo.io/json")
        if (response.status !== 200) { throw new Error("IP error: IPV4 API error") }
        const json = await response.json()
        setIpv4(json.ip)

        //Get rough Geolocation details, before ask user to grant GPS access:
        if (geolocationSource !== "gps") {
          setGeolocationSource("ip")
          setGeolocationLatitude(Number(json.loc.split(",")[0]))
          setGeolocationLongitude(Number(json.loc.split(",")[1]))
          setGeolocationCity(json.city)
          setGeolocationCountry(json.country)
        }
      } catch (err) {
        setIpv4(undefined)
        console.log(err)
      }

      //IP V6:
      try {
        // const response = await fetch("https://freeipapi.com/api/json")
        const response = await fetch("https://api.iplocation.net/?cmd=get-ip")
        if (response.status !== 200) { throw new Error("IP error: IPV6 API error") }
        const json = await response.json()
        if (json.ip_version == 6) {
          setIpv6(json.ip)
        } else {
          setIpv6(undefined)
        }
      } catch (err) {
        setIpv6(undefined)
        console.log(err)
      }
    })()

    //Get Browser details:
    setBrowserName(platform.name)
    setBrowserVersion(platform.version)

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
    } else {
      setNetworkType(undefined)
      setNetworkQuality(undefined)
      console.log("Network error: NetworkInformation API not supported by this browser")
    }

    //Get Device details:
    // setDeviceType((window.matchMedia("(pointer: coarse)").matches) || ("ontouchstart" in window) || (navigator.maxTouchPoints > 0) ? "mobile" : "desktop")  // check type by checking for touchscreen
    setDeviceType(screen.width > 768 ? "desktop" : "mobile")   // check type by checking for screen size
    setDeviceScreen(`${screen.width} x ${screen.height}`)
    //OBS: device detection by UA string, and not all of them have this info
    // console.log(platform)
    setDeviceModel(platform.product ? platform.product : undefined)
    setDeviceManufacturer(platform.manufacturer ? platform.manufacturer : undefined)
    setOSName(platform.os ? platform.os.family : undefined)
    setOSVersion(platform.os ? platform.os.version : undefined)

    //Get Geolocation details, after user grant GPS access:
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
          console.log("Geolocation error: User denied the request for Geolocation.")
          break;
        case error.POSITION_UNAVAILABLE:
          console.log("Geolocation error: Location information is unavailable.")
          break;
        case error.TIMEOUT:
          console.log("Geolocation error: The request to get user location timed out.")
          break;
        case error.UNKNOWN_ERROR:
          console.log("Geolocation error: An unknown error occurred.")
          break;
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getGeolocationPosition, getGeolocationError)
    }
    else {
      console.log("Geolocation error: Geolocation is not supported by this browser.")
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
          browser: {
            name: browserName,
            version: browserVersion
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
            os_name: osName,
            os_version: osVersion,
          },
          geolocation: {
            source: geolocationSource,
            latitude: geolocationLatitude,
            longitude: geolocationLongitude,
            accuracy: geolocationAccuracy,
            city: geolocationCity,
            country: geolocationCountry,
          }
        }}
      />
    </main>
  )
}
