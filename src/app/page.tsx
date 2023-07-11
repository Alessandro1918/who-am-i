"use client"
import { useState, useEffect } from "react"
const platform = require("platform")

export default function Home() {

  const [ ipv4, setIpv4 ] = useState('')
  const [ ipv6, setIpv6 ] = useState('')
  const [ userPlatform, setUserPlatform ] = useState('')

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
    setUserPlatform(platform.toString())
  }, [])

  //Logs server-side platform data on VSCode terminal when parent component renders the page server-side,
  //and logs client-side platform data on browser's console when useEffect runs client-side
  // console.log(platform.toString())    

  return (
    
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    
      <h2>{`IPv4: ${ipv4}`}</h2>
      <h2>{`IPv6: ${ipv6}`}</h2>

      <h2>{`platform client-side: ${userPlatform}`}</h2>

    </main>
  )
}
