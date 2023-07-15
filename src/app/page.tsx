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
  const [ deviceScreen, setdeviceScreen ] = useState("-")
  const [ deviceModel, setDeviceModel ] = useState("-")
  const [ deviceManufacturer, setDeviceManufacturer ] = useState("-")

  useEffect(() => {

    //Get IP:
    fetch("https://api.ipify.org?format=json").then(response => {
      response.json().then(json => {
        setIpv4(json.ip)
      })
    })
    fetch("https://freeipapi.com/api/json").then(response => {
      response.json().then(json => {
        if (json.ipVersion === 6) {
          setIpv6(json.ipAddress)
        }
      })
    })

    //Set Platform details
    setPlatformBrowserName(platform.name)
    setPlatformBrowserVersion(platform.version)
    setPlatformOSName(platform.os.family)
    setPlatformOSVersion(platform.os.version)
    // setPlatformDescription(platform.description)

    //Set Network details - https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
    //OBS: API does not support Firefox or Safari
    if ("connection" in navigator) {
      const connection:any = navigator["connection"]
      const type = connection.type
      const quality = connection.effectiveType 
      setNetworkType(type)
      setNetworkQuality(quality)
    }

    //Set Device details
    //OBS: device detection by UA string, and not all of them have this info
    setDeviceType(screen.width > 768 ? "desktop" : "cellphone")
    setdeviceScreen(`${screen.width} x ${screen.height}`)
    if (platform.manufacturer) {
      setDeviceModel(platform.product)
      setDeviceManufacturer(platform.manufacturer)
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
          connection: {
            type: networkType,
            quality: networkQuality
          },
          device: {
            type: deviceType,
            screen: deviceScreen,
            model: deviceModel,
            manufacturer: deviceManufacturer,
          }
        }} 
      />
    </main>
  )
}
