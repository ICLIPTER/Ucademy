"use client";

import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import { type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import parse from "html-react-parser";


export function RenderDescription({json} : {json: JSONContent}) {
    const outPut = useMemo(() => {
        return generateHTML(json, [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] 

           }),
       ]);

    }, [json]);

    return (
        <div className="prose dark:prose-invert prose-li:marker:text-primary">
            {parse(outPut)}
        </div>
    )
}