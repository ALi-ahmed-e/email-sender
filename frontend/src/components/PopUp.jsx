import React, { useEffect, useState } from 'react'

const PopUp = ({ text, setshoppopup }) => {
    const [em, setem] = useState()

    useEffect(() => {
        setem(text)
    },[text])
    

    return (
        <div onClick={() => setshoppopup(false)} className='fixed inset-0 bg-gray-950/50 z-50 backdrop-blur-sm flex items-center justify-center'>
            <div className="bg-gray-100 rounded-xl drop-shadow-xl p-4 max-w-[90%] max-h-[80%] overflow-auto">
                <p className='text-center break-words whitespace-pre-wrap leading-loose'>
                    {em}
                </p>
            </div>
        </div>
    )
}

export default PopUp
