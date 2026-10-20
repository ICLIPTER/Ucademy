import { cn } from "@/lib/utils";
import {  CloudUploadIcon, ImageIcon, Loader2, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { StorageImage } from "../ui/storage-image";

export function RenderEmptyState({isDragActive}: {isDragActive : boolean}) {
    return (
        <div className="text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
                <CloudUploadIcon className={cn(
                    'size-6 text-muted-foreground',
                    isDragActive && 'text-primary'
                )}/>
            </div>
            <p className="text-base font-semibold text-foreground">Drop your files here or <span className="text-primary font-bold cursor-pointer">Click to upload</span></p>
            <Button type="button" className="mt-4">Select File</Button>
        </div>
    )
}


export function RenderErrorState() {
    return(
        <div className=" text-center">
            <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
                <ImageIcon className={cn(
                    'size-6 text-destructive')}/>
            </div>
                    <p className="text-base font-semibold ">Upload Failed</p>
                    <p className="text-xs mt-1 text-muted-foreground">Something went wrong</p>
                    <Button type="button" className="mt-4">Retry Upload</Button>
        </div>
    )
}

export function RenderUploadedState({ 
    previewUrl, 
    isDeleting, 
    handleRemoveFile,
    fileType,
} : {
    previewUrl : string;
    isDeleting : boolean;
    handleRemoveFile : () => void;
    fileType : "image" | "video";
}) {
    return (
        <div className="relative group w-full h-full flex items-center justify-center">
            {fileType === 'video' ? (
                <video src={previewUrl} controls className="rounded-md w-full h-full"/>
            ): (
                /*
                 * The preview can be one of three things:
                 *   - a `blob:` URL for a file that was just selected and has
                 *     not been uploaded yet — `next/image` cannot handle those,
                 *     so a plain <img> is used;
                 *   - a remote object-storage URL for an already uploaded
                 *     file — `StorageImage` keeps the optimiser and skips the
                 *     brittle browser-side hostname check;
                 *   - a local path.
                 */
                previewUrl.startsWith("blob:") ||
                previewUrl.startsWith("data:") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={previewUrl}
                        alt="Uploaded file preview"
                        className="absolute inset-0 h-full w-full object-contain p-2"
                    />
                ) : (
                    <StorageImage
                        src={previewUrl}
                        alt="Uploaded file preview"
                        fill
                        className="object-contain p-2"
                    />
                )
            )}
            <Button variant="destructive" size="icon" className={cn(
                'absolute top-4 right-4')}
                onClick={handleRemoveFile}
                disabled={isDeleting}
                >
                    {isDeleting ? (
                        <Loader2 className="size-4 animate-spin" /> 
                    ) : (
                    <XIcon className="size-4"/>
                    )}
                </Button>
        </div>
    )
}

export function RenderUploadingState({
    progress,
     file,
    } : {
        progress : number;
        file:   File;
    }) {
        return (
            <div className="text-center flex justify-center items-center flex-col">

                <p>{progress}%</p>
                <p className="mt-2 text-sm font-medium text-foreground">Uploading...</p>

                <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">{file.name}</p>
            </div>
        )
}
