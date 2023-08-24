import React from 'react'
import ReactQuill from 'react-quill'

export default function NewReactQuill(props) {

    const modules = {

        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
          ['link', 'image'],
          ['clean']
        ],
    
      };
    
      const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
      ];
    
      const editorStyle = {
        backgroundColor: 'white',
        borderRadius: '5px',
      };

  return (
    <ReactQuill
        ref={props.quillRef}
        name="message"
        theme="snow"
        modules={modules}
        formats={formats}
        style={editorStyle}
        onChange={(e) => { props.handleNewTicketDataChange(e, "~~~~") }}
        value={props.newTicketFormData.message}
    />
  )
}
