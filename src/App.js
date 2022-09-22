import React, {useState, useEffect} from 'react'
import { SheetJSFT } from './types';
import exportFromJSON from 'export-from-json'
const xlsx = require("xlsx");

function App() {
  const [fileData, setFileData] = useState(null);

  const getExtension = (filename) => {
    return filename.split('.').pop()
  }

  const onFileChange = (event) => {
    if(event.target.files.length !== 0) {
      setFileData(event.target.files[0]);
    }
    // console.log(fileData, getExtension(event.target.files[0].name).toLowerCase());
  };
  const convertExcelToJSON = () => {
    const reader = new FileReader();
     const rABS = !!reader.readAsBinaryString;

    reader.onload = (file) => {
      //  xlsx.read(file.target.result, { type: rABS ? 'binary' : 'array', bookVBA : true });
      // xlsx.read(file.target.result, { type: "array" });
      const workbook = xlsx.read(file.target.result, { type: rABS ? 'binary' : 'array', bookVBA : true });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // const colValues = [];
      // const cells = Object.keys(worksheet);
      // for (var i = 0; i < Object.keys(cells).length; i++) {
      //     if( cells[i].indexOf('1') > -1)
      //     {
      //         colValues.push(worksheet[cells[i]].v); //Contails all column names
      //     }
      // }

      const json = xlsx.utils.sheet_to_json(worksheet, {defval:'No Value Found', blankrows: true, raw: true, rawNumbers: true });
      console.log(json);

      // convert JSON to XML and Download XML file 
      const fileName = fileData.name.split('.')[0];
      const exportType =  exportFromJSON.types.xml;
      exportFromJSON({data: json, fileName, exportType});
    };

    if (rABS) {
      reader.readAsBinaryString(fileData);
    } else {
      reader.readAsArrayBuffer(fileData);
    };
    // reader.readAsArrayBuffer(fileData);
  }
  return (
    <div className="App">
      <input type ="file" onChange={onFileChange} accept={SheetJSFT} />
      <button onClick={convertExcelToJSON}>covert Excel to JSON</button>
    </div>
  );
}

export default App;
