import React, { useEffect, useRef, useState } from 'react';

const TinyMCEEditor = ({ value, onChange, onSave, theme }) => {
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const onSaveRef = useRef(onSave);

  // Sync refs to avoid stale closures in TinyMCE callbacks
  useEffect(() => {
    valueRef.current = value;
    onChangeRef.current = onChange;
    onSaveRef.current = onSave;
  }, [value, onChange, onSave]);

  useEffect(() => {
    if (window.tinymce) {
      window.tinymce.init({
        target: textareaRef.current,
        height: 380,
        menubar: false,
        statusbar: false,
        plugins: 'preview importcss searchreplace autolink  save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
        toolbar: 'bold  italic alignleft aligncenter alignright bullist numlist    advancedMore  customSave',
        toolbar_mode: 'wrap',
        toolbar_location: 'bottom',
        skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
        content_css: theme === 'dark' ? 'dark' : 'default',
        content_style: `
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          body { 
            font-family: Outfit, sans-serif; 
            font-size: 15px; 
            line-height: 1.5;
            padding: 5px 10px; 
            color: ${theme === 'dark' ? '#F9FAFB' : '#333'};
            background: ${theme === 'dark' ? '#111827' : '#fff'};
            margin: 0;
          }
        `,
        setup: (editor) => {
          editorRef.current = editor;
          
          editor.on('init', () => {
            setIsReady(true);
            if (valueRef.current) {
              editor.setContent(valueRef.current);
            }
          });
          
          editor.on('Change KeyUp input', () => {
            const content = editor.getContent();
            if (onChangeRef.current) {
              onChangeRef.current(content);
            }
          });
          
          // Custom Save Button
          editor.ui.registry.addButton('customSave', {
            text: 'Save',
            onAction: function () {
              const currentContent = editor.getContent();
              if (onChangeRef.current) onChangeRef.current(currentContent);
              if (onSaveRef.current) onSaveRef.current(currentContent);
            }
          });
        },
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
        setIsReady(false);
      }
    };
  }, [theme]);

  useEffect(() => {
    if (isReady && editorRef.current && value !== editorRef.current.getContent()) {
      editorRef.current.setContent(value || '');
    }
  }, [value, isReady]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <textarea ref={textareaRef} />
    </div>
  );
};


export default TinyMCEEditor;