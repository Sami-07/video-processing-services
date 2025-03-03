import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ToolBar from './toolbar'

const Tiptap = ({
    description, setDescription
}: {
    description: any,
    setDescription: (description: any) => void
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
        ],
        editorProps: {
            attributes: {
                class: 'p-2 min-h-[150px] focus:outline-none focus:border-none '
            },
        },
        content: description,
        onUpdate({ editor }) {
            
            setDescription(editor.getHTML())
            
           
        }
    })

    const characterCount = editor?.getText().length

    return (
        <div className='border-2 border-gray-300 rounded-md w-full'>
            <ToolBar editor={editor} />
            <EditorContent editor={editor} className='' />
            <p className='ml-2'>Character Count: {characterCount}</p>
        </div>
    )
}

export default Tiptap
