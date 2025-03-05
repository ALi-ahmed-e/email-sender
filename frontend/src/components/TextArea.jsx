import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import EmailsTable from './EmailsTable';


export default function TExtArea({ submit }) {
    const editorRef = useRef(null);
    const subjRef = useRef(null);

    const log = (e) => {
        e.preventDefault()
        
        if (editorRef.current&&subjRef.current) {
            submit({email:editorRef.current.getContent(),subject:subjRef.current.value});
        }
    };



    return (
        <form onSubmit={log} className=' mx-auto'>
            <div className=' my-5'>
                <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subject</label>
                <input ref={subjRef}required type="text" id="small-input" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
            <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <Editor
                apiKey='jeawg3d83yrz9tc1y5it77k4yxq7lu9o7qefnj3n4318denb'
                onInit={(_evt, editor) => editorRef.current = editor}
                init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />


            <button type="submit" className=' mx-auto w-full bg-blue-700 hover:bg-blue-800 cursor-pointer m-10 p-3 text-white rounded-3xl'>
                Send Emails
            </button>
        </form>
    );
}