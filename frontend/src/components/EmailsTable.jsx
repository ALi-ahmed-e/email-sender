import React from 'react'

const EmailsTable = () => {













  return (
    <div className=' my-5'>
  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="p-4">
            <div className="flex items-center">
              <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
            </div>
          </th>
          <th scope="col" className="px-6 py-3">
            EMAIL
          </th>
          <th scope="col" className="px-6 py-3">
            NAME
          </th>
          <th scope="col" className="px-6 py-3">
            ACTION
          </th>
         
         
        </tr>
      </thead>
      <tbody>

      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
          <td className="w-4 p-4">
            <div className="flex items-center">
              <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
            </div>
          </td>
          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            Apple MacBook Pro 17"
          </th>
          <td className="px-6 py-4">
            Silver
          </td>
          <td className="px-6 py-4 hover:text-red-400 hover:underline cursor-pointer">
            Delete
          </td>
          
        </tr>

        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
          <td className="w-4 p-4">
            <div className="flex items-center">
              <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
            </div>
          </td>
          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            Apple MacBook Pro 17"
          </th>
          <td className="px-6 py-4">
            Silver
          </td>
          <td className="px-6 py-4 hover:text-red-400 hover:underline cursor-pointer">
            Delete
          </td>
          
        </tr>
        
        
        
        
      </tbody>
    </table>
  </div>
</div>

  )
}

export default EmailsTable