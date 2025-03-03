import { useState } from 'react'
import './App.css'
import EmailsTable from './components/EmailsTable'
import TExtArea from './components/TextArea'
import FileInp from './components/FileInp'
import axios from 'axios'

function App() {
  const [isLoading, setisLoading] = useState()
  const [file, setfile] = useState()

  const [mails, setmails] = useState([])




  const handleUpload = async (email) => {
    if (!file) {
      alert("Please select an Excel file!");
      return;
    }
    if (!email) {
      alert("Please add an email!");
      return;
    }

    const formData = new FormData();
    formData.append("excelFile", file);
    formData.append("email", email);

    try {
      setisLoading(true)
      const response = await axios.post("http://localhost:8000/api/send-req", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setisLoading(false)

      setmails(response.data.Tmails)
      console.log(response);
    } catch (error) {
      console.error("Error uploading file:", error);
      // alert("Failed to upload file.");
    }
  };

  const handlefile = (filee) => {
    setfile(filee);
  };

  return (
    <div className=''>

      {isLoading && <div className=' fixed left-0 right-0 bottom-0 top-0 bg-gray-950/50 z-50 backdrop-blur-sm flex items-center justify-center'>

        <div className="mx-auto w-[500px] bg-gray-950 rounded-xl overflow-hidden drop-shadow-xl">
          <div className="bg-[#333] flex items-center p-[5px] text-whitec relative">
            <div className="flex absolute left-3">
              <span className="h-3.5 w-3.5 bg-[#ff605c] rounded-xl mr-2" />
              <span className="h-3.5 w-3.5 bg-[#ffbd44] rounded-xl mr-2" />
              <span className="h-3.5 w-3.5 bg-[#00ca4e] rounded-xl" />
            </div>
            <div className="flex-1 text-center text-white">status</div>
          </div>
          <div className="p-2.5 text-[#0f0]">
            <div>
              <span className="mr-2">Extracting data and sending emails in progress</span>
              <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">.</span>
              <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">.</span>
              <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">.</span>
            </div>
          </div>
        </div>



      </div>}

      <div className=' w-full p-20 dark:bg-gray-900  bg-gray-300' >




        <FileInp handlefile={handlefile} />

        <TExtArea submit={handleUpload} />






        {mails.length >0&& <div className="relative overflow-x-auto shadow-md sm:rounded-lg border-2 border-blue-800 bg-blue-800">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-white">
                  State
                </th>
              </tr>
            </thead>
            <tbody>
              {mails?.map(e => <tr  key={Math.random()} className="border-b border-gray-200 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                  {e.email}
                </th>
                <td className="px-6 py-4  text-white">
                  {e.state?'SENT':'FAILED'}
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>}





      </div>
    </div>
  )
}

export default App
