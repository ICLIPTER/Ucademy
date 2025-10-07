import { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    ListOrdered,
    AlignLeft,
    AlignRight,
    AlignCenter,
    Undo,
    Redo
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface iAppProps {
    editor: Editor | null;
}

export function Menubar({ editor }: iAppProps) {
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isStrike, setIsStrike] = useState(false);
    const [isHeadingOne, setIsHeadingOne] = useState(false);
    const [isHeadingTwo, setIsHeadingTwo] = useState(false);
    const [isHeadingThree, setIsHeadingThree] = useState(false);
    const [isBulletList, setIsBulletList] = useState(false);
    const [isOrderedList, setIsOrderedList] = useState(false);
    const [isAlignLeft, setIsAlignLeft] = useState(false);
    const [isAlignCenter, setIsAlignCenter] = useState(false);
    const [isAlignRight, setIsAlignRight] = useState(false);

    useEffect(() => {
        if (!editor) return;

        const update = () => {
            setIsBold(editor.isActive('bold'));
            setIsItalic(editor.isActive('italic'));
            setIsStrike(editor.isActive('strike'));
            setIsHeadingOne(editor.isActive('heading', { level: 1 }));
            setIsHeadingTwo(editor.isActive('heading', { level: 2 }));
            setIsHeadingThree(editor.isActive('heading', { level: 3 }));
            setIsBulletList(editor.isActive('bulletList'));
            setIsOrderedList(editor.isActive('orderedList'));
            setIsAlignLeft(editor.isActive({ textAlign: 'left' }));
            setIsAlignCenter(editor.isActive({ textAlign: 'center' }));
            setIsAlignRight(editor.isActive({ textAlign: 'right' }));
        };

        editor.on('update', update);
        editor.on('selectionUpdate', update);

        update();

        return () => {
            editor.off('update', update);
            editor.off('selectionUpdate', update);
        };
    }, [editor]);

    if (!editor) return null;

    const handleToggle = (action: () => void) => {
        action();
        setIsBold(editor.isActive('bold'));
        setIsItalic(editor.isActive('italic'));
        setIsStrike(editor.isActive('strike'));
        setIsHeadingOne(editor.isActive('heading', { level: 1 }));
        setIsHeadingTwo(editor.isActive('heading', { level: 2 }));
        setIsHeadingThree(editor.isActive('heading', { level: 3 }));
        setIsBulletList(editor.isActive('bulletList'));
        setIsOrderedList(editor.isActive('orderedList'));
        setIsAlignLeft(editor.isActive({ textAlign: 'left' }));
        setIsAlignCenter(editor.isActive({ textAlign: 'center' }));
        setIsAlignRight(editor.isActive({ textAlign: 'right' }));
    };

    return (
        <div className="border border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center"> 
            <TooltipProvider>
                <div className="flex flex-wrap gap-1">
                    {/* Bold */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isBold}
                                onPressedChange={() => handleToggle(() => editor.chain().focus().toggleBold().run())}
                                className={cn(isBold && 'bg-muted text-muted-foreground')}
                            >
                                <Bold />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bold</TooltipContent>
                    </Tooltip>

                    {/* Italic */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isItalic}
                                onPressedChange={() => handleToggle(() => editor.chain().focus().toggleItalic().run())}
                                className={cn(isItalic && 'bg-muted text-muted-foreground')}
                            >
                                <Italic />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Italic</TooltipContent>
                    </Tooltip>

                    {/* Strikethrough */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isStrike}
                                onPressedChange={() => handleToggle(() => editor.chain().focus().toggleStrike().run())}
                                className={cn(isStrike && 'bg-muted text-muted-foreground')}
                            >
                                <Strikethrough />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Strike</TooltipContent>
                    </Tooltip>

                    {/* Heading 1 */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isHeadingOne}
                                onPressedChange={() => handleToggle(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}
                                className={cn(isHeadingOne && 'bg-muted text-muted-foreground')}
                            >
                                <Heading1Icon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 1</TooltipContent>
                    </Tooltip>

                    {/* Heading 2 */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isHeadingTwo}
                                onPressedChange={() => handleToggle(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
                                className={cn(isHeadingTwo && 'bg-muted text-muted-foreground')}
                            >
                                <Heading2Icon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 2</TooltipContent>
                    </Tooltip>

                    {/* Heading 3 */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isHeadingThree}
                                onPressedChange={() => handleToggle(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}
                                className={cn(isHeadingThree && 'bg-muted text-muted-foreground')}
                            >
                                <Heading3Icon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Heading 3</TooltipContent>
                    </Tooltip>

                    {/* Bullet List */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isBulletList}
                                onPressedChange={() => handleToggle(() => editor.chain().focus().toggleBulletList().run())}
                                className={cn(isBulletList && 'bg-muted text-muted-foreground')}
                            >
                                <List />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>

                    {/* Ordered List */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isOrderedList}
                                onPressedChange={() => handleToggle(() => editor.chain().focus().toggleOrderedList().run())}
                                className={cn(isOrderedList && 'bg-muted text-muted-foreground')}
                            >
                                <ListOrdered />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Ordered List</TooltipContent>
                    </Tooltip>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-border mx-2" />

                {/* Text Align */}
                <div className="flex flex-wrap gap-2">
                    {/* Align Left */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isAlignLeft}
                                onPressedChange={() => handleToggle(() => editor.chain().focus().setTextAlign('left').run())}
                                className={cn(isAlignLeft && 'bg-muted text-muted-foreground')}
                            >
                                <AlignLeft />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Text Align Left</TooltipContent>
                    </Tooltip>

                    {/* Align Center */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isAlignCenter}
                                onPressedChange={() => handleToggle(() => editor.chain().focus().setTextAlign('center').run())}
                                className={cn(isAlignCenter && 'bg-muted text-muted-foreground')}
                            >
                                <AlignCenter />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Text Align Center</TooltipContent>
                    </Tooltip>

                    {/* Align Right */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle
                                size="sm"
                                pressed={isAlignRight}
                                onPressedChange={() => handleToggle(() => editor.chain().focus().setTextAlign('right').run())}
                                className={cn(isAlignRight && 'bg-muted text-muted-foreground')}
                            >
                                <AlignRight />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Text Align Right</TooltipContent>
                    </Tooltip>
                </div>

                <div className="w-px h-6 bg-border mx-2"></div>
                    <div className="flex flex-wrap gap-2">

                    {/* Undo */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="sm" variant="ghost" type="button" onClick={() => 
                                editor.chain().focus().undo().run()
                            }
                            disabled={!editor.can().undo()}
                            >
                                <Undo />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo</TooltipContent>
                    </Tooltip>   

                    {/* Redo */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="sm" variant="ghost" type="button" onClick={() => 
                                editor.chain().focus().redo().run()
                            }
                            disabled={!editor.can().redo()}
                            >
                                <Redo />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo</TooltipContent>
                    </Tooltip>           
                </div>
            </TooltipProvider>
        </div>
    );
}
