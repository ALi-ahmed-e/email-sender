import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import EmailsTable from './EmailsTable';


export default function TExtArea({ submit }) {
    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            submit(editorRef.current.getContent());
        }
    };



    return (
        <div className=' mx-auto'>
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


            <button className=' mx-auto w-full bg-blue-700 hover:bg-blue-800 cursor-pointer m-10 p-3 text-white rounded-3xl' onClick={log}>
                Send Emails
            </button>
        </div>
    );
}