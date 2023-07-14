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
  const [ platformDescription, setPlatformDescription ] = useState("-")

  useEffect(() => {

    //Get IP:
    fetch("https://api.ipify.org?format=json").then(response => {
      response.json().then(json => {
        setIpv4(json.ip)
      })
    })
    fetch("https://freeipapi.com/api/json").then(response => {
      response.json().then(json => {
        setIpv6(json.ipAddress)
      })
    })

    //Set Platform details
    setPlatformBrowserName(platform.name)
    setPlatformBrowserVersion(platform.version)
    setPlatformOSName(platform.os.family)
    setPlatformOSVersion(platform.os.version)
    setPlatformDescription(platform.description)
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
            description: platformDescription
          }
        }} 
      />
    </main>
  )
}
