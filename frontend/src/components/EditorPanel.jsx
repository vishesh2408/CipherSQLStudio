import Editor from '@monaco-editor/react';

const EditorPanel = ({ value, onChange }) => {
    return (
        <div className="editor-container">
            <Editor
                height="100%"
                defaultLanguage="sql"
                theme="vs-dark"
                value={value}
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                }}
            />
        </div>
    );
};

export default EditorPanel;
