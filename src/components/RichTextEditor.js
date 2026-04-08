'use client';

import dynamic from 'next/dynamic';
import { useMemo, useRef } from 'react';

// Dynamically import Jodit-React to prevent SSR issues
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export default function RichTextEditor({ value, onChange }) {
  const editor = useRef(null);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Start writing your article...',
    height: 500,
    theme: 'dark',
    // Paste settings
    defaultActionOnPaste: 'insert_clear_html',
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    // Image upload settings
    uploader: {
      insertImageAsBase64URI: false,
      url: '/api/admin/articles/upload-image',
      format: 'json',
      method: 'POST',
      filesVariableName: function() { return 'file'; },
      withCredentials: false,
      isSuccess: function (resp) {
        return resp.success;
      },
      getMessage: function (resp) {
        return resp.message || '';
      },
      process: function (resp) {
        return {
          files: resp.url ? [resp.url] : [],
          path: '',
          baseurl: '',
          error: resp.success ? 0 : 1,
          msg: resp.message || ''
        };
      },
      defaultHandlerSuccess: function (data) {
        const j = this;
        if (data.files && data.files.length) {
          data.files.forEach(function (fileUrl) {
            j.s.insertImage(fileUrl, null, 250);
          });
        }
      },
      error: function (e) {
        console.error('Jodit upload error:', e);
      }
    },
    // Force dark styling for the editor content area
    style: {
      background: '#0d0e12',
      color: '#f8f9fa'
    }
  }), []);

  return (
    <div className="rich-text-editor-container" style={{ borderRadius: '8px', overflow: 'hidden' }}>
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        tabIndex={1}
        onBlur={newContent => onChange(newContent)}
        onChange={() => {}}
      />
    </div>
  );
}
