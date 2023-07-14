// ReferenceError: document is not defined
// But from here I got: Interactive demo: https://mac-s-g.github.io/react-json-view/demo/dist/
// import ReactJson from 'react-json-view'

// No docs to auto expand 
// But from here I got: several theme.js files: https://github.com/reduxjs/redux-devtools/tree/75322b15ee7ba03fddf10ac3399881e302848874/src/react/themes
// import { JSONTree } from 'react-json-tree'

// No docs to auto expand or customize
// import { ObjectView } from 'react-object-view'

import { JsonViewer as TextAreaJsonViewer } from '@textea/json-viewer'

//Gets a JSON object as input, and outputs a React component with pretty-json (with spaces and colors)
export default function JsonViewer(data: any) {

  //Themes I liked: bright, colors, google, isotope. Last checked: isotope
  const theme = {
    scheme: 'isotope',
    author: 'jan t. sott',
    base00: '#000000',
    base01: '#404040',
    base02: '#606060',
    base03: '#808080',
    base04: '#c0c0c0',
    base05: '#d0d0d0',
    base06: '#e0e0e0',
    base07: '#ffffff',
    base08: '#ff0000',
    base09: '#ff9900',
    base0A: '#ff0099',
    base0B: '#33ff00',
    base0C: '#00ffff',
    base0D: '#0066ff',
    base0E: '#cc00ff',
    base0F: '#3300ff'
  }

  return (
    <>
      {/* <pre><code>{JSON.stringify(data, null, '\t')}</code></pre>  */}

      {/* <ReactJson 
        src={data} 
        name={false}
        theme={"bright"}
        displayObjectSize={false}
        displayDataTypes={false}
      /> */}

      {/* <JSONTree 
        data={data}
        theme={theme}
      /> */}

      {/* <ObjectView
        data={data}
        options={{}}
        styles={{}}
        palette={{}}
      /> */}

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