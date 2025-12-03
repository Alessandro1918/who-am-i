// import ReactJson from 'react-json-view'    //V1
// import { JSONTree } from 'react-json-tree'   //V2
// import { ObjectView } from 'react-object-view'   //V3
import { JsonViewer as TextAreaJsonViewer } from '@textea/json-viewer'  //V4

//Gets a JSON object as input, and outputs a React component with pretty-json (with spaces and colors)
export default function JsonViewer(data: any) {

  // Theme.js files: https://github.com/reduxjs/redux-devtools/tree/75322b15ee7ba03fddf10ac3399881e302848874/src/react/themes
  // Themes I liked: bright, colors, google, isotope. Last checked: isotope
  const theme = {
    scheme: 'isotope',
    author: 'jan t. sott',
    base00: '#000000',
    base01: '#404040',
    base02: '#606060',
    base03: '#808080',
    base04: '#c0c0c0',
    base05: '#d0d0d0',  //undefined
    base06: '#e0e0e0',
    base07: '#ffffff',  //key
    base08: '#ff0000',  //null
    base09: '#ff9900',  //string
    base0A: '#ff0099',
    base0B: '#33ff00',  //float
    base0C: '#00ffff',
    base0D: '#3300ff',
    base0E: '#cc00ff',  //boolean
    base0F: '#0066ff'   //integer
  }

  return (
    <>
      {/* <pre><code>{JSON.stringify(data, null, '\t')}</code></pre>  */}

      <TextAreaJsonViewer 
        value={data.data}
        rootName={false}
        displayDataTypes={false}
        displaySize={false}
        theme={theme}
      />
    </>
  )
}
