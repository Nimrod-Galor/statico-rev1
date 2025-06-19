import './wysiwyg.css'

import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Slate, Editable, withReact, ReactEditor } from "slate-react"
import { createEditor, Transforms, Editor, Element as SlateElement } from "slate"
import { Controller, useFormContext, useWatch } from "react-hook-form"

import type {  BaseEditor, Descendant } from "slate"

// Define custom types
type CustomElement = { type: "paragraph" | "quote"; children: CustomText[] };
type CustomText = { text: string; bold?: boolean; italic?: boolean; [key: string]: any };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}


const emptyValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
]

function SlateEditor({ name }: { name: string }) {
    // const editor = useMemo(() => withReact(createEditor()), [])
    const [editor] = useState(() => withReact(createEditor()))
    //Access RHF context
    const { control, setValue } = useFormContext()

// // RHF watches body field
// const rhfValue = useWatch({ control, name })

// Slate internal state
// const [internalValue, setInternalValue] = useState<Descendant[]>(() =>
//   rhfValue && rhfValue.length > 0 ? rhfValue : emptyValue
// )

// // Sync RHF to Slate if it changes externally
// useEffect(() => {
//     console.log("useEffect")
//   const isDifferent = JSON.stringify(rhfValue) !== JSON.stringify(internalValue);
//   if (isDifferent) {
//       console.log("IN", rhfValue)
//       setInternalValue(rhfValue);
//   }
// }, [rhfValue])


// ✅ Sync RHF → Slate when value changes or becomes visible
  // useEffect(() => {
  //   if (Array.isArray(rhfValue)) {
  //     setInternalValue(rhfValue)
  //   }
  // }, [JSON.stringify(rhfValue)]) // force detection on deep object change

    const renderElement = useCallback((props: any) => <RenderElement {...props} />, [])
    const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])

    const toggleBlock = (format: "paragraph" | "quote") => {
        const isActive = isBlockActive(editor, format)
        Transforms.setNodes(
            editor,
            { type: isActive ? "paragraph" : format },
            { match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n) }
        )
    }

    const toggleMark = (format: string) => {
        const isActive = isMarkActive(editor, format)
        isActive ? Editor.removeMark(editor, format) : Editor.addMark(editor, format, true)
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange } }) => (
                <div className='h-full w-full'>
                    <Toolbar>
                      <div className="toolbar">
                        <button onMouseDown={e => { e.preventDefault(); toggleMark("bold"); }}>Bold</button>
                        <button onMouseDown={e => { e.preventDefault(); toggleMark("italic"); }}>Italic</button>
                        <button onMouseDown={e => { e.preventDefault(); toggleBlock("quote"); }}>Quote Block</button>
                      </div>
                    </Toolbar>
                    <Slate
                        editor={editor}
                        initialValue={value}
                        onChange={(val) => {onChange(val); // update RHF
                        }}
                    >
                        <Editable
                            renderElement={renderElement}
                            renderLeaf={renderLeaf}
                            spellCheck
                            autoFocus
                            placeholder={`Write ${name}...`}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && e.shiftKey) {
                                    e.preventDefault();
                                    editor.insertText("\n");
                                }
                            }}
                        />
                    </Slate>
                    <pre>
                    {JSON.stringify(value, null, 2)}
                    </pre>
                </div>
            )}
        />
    )
}

//  Custom rendering for blocks
const RenderElement = ({ attributes, children, element }: any) => {
  switch (element.type) {
    case "quote":
      return (
        <blockquote
          {...attributes}
          style={{
            borderLeft: "2px solid #ccc",
            paddingLeft: "1rem",
            color: "#666",
            fontStyle: "italic",
          }}
        >
          {renderWithLineBreaks(children)}
        </blockquote>
      )
    default:
      return <p {...attributes}>{renderWithLineBreaks(children)}</p>
  }
}

//  Render leaf formatting (bold, italic)
const Leaf = ({ attributes, children, leaf }: any) => {
    if (leaf.bold){
        children = <strong>{children}</strong>
    }
    if (leaf.italic){
        children = <em>{children}</em>
    }
    return <span {...attributes}>{children}</span>
}

//  Toolbar layout
const Toolbar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ marginBottom: "1rem", gap: "0.5rem", display: "flex" }}>{children}</div>
)

//  Check block active
function isBlockActive(editor: Editor, format: string) {
  const [match] = Array.from(
    Editor.nodes(editor, {
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n.type === format,
    })
  )
  return !!match
}

//  Check mark active
function isMarkActive(editor: Editor, format: string) {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

//  Utility: Convert \n to <br />
function renderWithLineBreaks(children: any) {
  return React.Children.map(children, child => {
    if (typeof child === "string") {
      const lines = child.split("\n")
      return lines.flatMap((line, i) => [
        line,
        i !== lines.length - 1 ? <br key={i} /> : null,
      ])
    }
    return child
  })
}

export default SlateEditor