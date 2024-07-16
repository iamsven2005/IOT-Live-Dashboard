'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface TiptapProps {
  content: string;
  editable?: boolean;
}

const Tiptap = ({ content, editable = true }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content,
    editable,
  })

  return (
    <EditorContent editor={editor} />
  )
}

export default Tiptap

