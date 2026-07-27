import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {
    Bold,
    Italic,
    Heading2,
    List,
    ListOrdered,
    Quote,
    LinkIcon,
    Undo,
    Redo,
} from 'lucide-react';

function ToolbarButton({ onClick, active, disabled, children, title }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`rounded-lg p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
            }`}
        >
            {children}
        </button>
    );
}

export default function RichTextEditor({ value, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false, autolink: true }),
        ],
        content: value || '',
        onUpdate: ({ editor: editorInstance }) => {
            onChange(editorInstance.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'min-h-[240px] px-4 py-3 text-sm text-white focus:outline-none [&_blockquote]:border-l-2 [&_blockquote]:border-blue-500 [&_blockquote]:pl-3 [&_blockquote]:italic [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5',
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '', { emitUpdate: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL tautan', previousUrl || 'https://');

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
    };

    return (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
            <div className="flex flex-wrap items-center gap-1 border-b border-slate-800 p-2">
                <ToolbarButton
                    title="Bold"
                    active={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Italic"
                    active={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Heading"
                    active={editor.isActive('heading', { level: 2 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                >
                    <Heading2 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Bullet List"
                    active={editor.isActive('bulletList')}
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Ordered List"
                    active={editor.isActive('orderedList')}
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Quote"
                    active={editor.isActive('blockquote')}
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                >
                    <Quote className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Link"
                    active={editor.isActive('link')}
                    onClick={setLink}
                >
                    <LinkIcon className="h-4 w-4" />
                </ToolbarButton>
                <div className="mx-1 h-5 w-px bg-slate-800" />
                <ToolbarButton
                    title="Undo"
                    disabled={!editor.can().undo()}
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Redo"
                    disabled={!editor.can().redo()}
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    <Redo className="h-4 w-4" />
                </ToolbarButton>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}
