import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import React, { useEffect, useState } from 'react';

function CustomEditor() {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
      return EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)));
    }
    return EditorState.createEmpty();
  });

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    localStorage.setItem('editorContent', JSON.stringify(convertToRaw(contentState)));
  }, [editorState]);

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleBeforeInput = (char, editorState) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const blockKey = selectionState.getStartKey();
    const block = contentState.getBlockForKey(blockKey);
    const text = block.getText();

    if (char === '#') {
      if (text === '') {
        const newContentState = contentState.mergeEntityData(block.getEntityAt(0), { type: 'header' });
        const newEditorState = EditorState.push(editorState, newContentState, 'change-block-data');
        setEditorState(newEditorState);
        return 'handled';
      }
    }

    if (char === '*') {
      const selection = selectionState.set('anchorOffset', 0).set('focusOffset', 1);
      const newEditorState = EditorState.forceSelection(editorState, selection);
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, 'BOLD'));
      return 'handled';
    }

    return 'not-handled';
  };

  return (
    <div   className="editor-container">
      <Editor
        editorState={editorState}
        onChange={handleChange}
        handleKeyCommand={handleKeyCommand}
        handleBeforeInput={handleBeforeInput}
      />
    </div>
  );
}

export default CustomEditor;
