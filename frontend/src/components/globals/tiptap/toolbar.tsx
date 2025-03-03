"use client"
import { Editor } from "@tiptap/react"
import { Icons } from "@/lib/icons"
import { Toggle } from "@/components/ui/toggle"

type Props = {
    editor: Editor | null
}
export default function ToolBar({ editor }: Props) {
    if (!editor) return null

    return (
        <div className="border-b-2
        border-b-gray-300 border-input bg-transparent">
            <Toggle
                size={"sm"}
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
                <Icons.Bold className={`${editor.isActive("bold") ? "text-primary-purple" : ""}`} />
            </Toggle>
            <Toggle
                size={"sm"}
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            >
                <Icons.Italic className={`${editor.isActive("italic") ? "text-primary-purple" : ""}`} />
            </Toggle>
            <Toggle
                size={"sm"}
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            >
                <Icons.Strikethrough className={`${editor.isActive("strike") ? "text-primary-purple" : ""}`} />
            </Toggle>
            <Toggle
                size={"sm"}
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                
            >
                <Icons.List className={`${editor.isActive("bulletList") ? "text-primary-purple" : ""}`} />
            </Toggle>
            <Toggle
                size={"sm"}
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <Icons.ListOrdered className={`${editor.isActive("orderedList") ? "text-primary-purple" : ""}`} />
            </Toggle>

        </div>
    );
}
