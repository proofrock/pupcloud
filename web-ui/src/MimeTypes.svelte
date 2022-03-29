<script lang="ts" context="module">
    /*
    // Is there a good source of *supported* formats? If not,
    // limiting to a partial list could be worse than just
    // allowing everything.
    const imgMimeTypes = new Set([
      "image/apng",
      "image/avif",
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/webp",
      "image/bmp",
      "image/x-icon",
      "image/tiff",
    ]);
    */

    import {File} from "./Struct.svelte";

    export function isMimeTypeImage(mt: string) {
        return mt.startsWith("image/");
    }

    export function isMimeTypeVideo(mt: string) {
        return mt.startsWith("video/");
    }

    export function isMimeTypeAudio(mt: string) {
        return mt.startsWith("audio/");
    }

    export function isMimeTypeText(mt: string) {
        return mt.startsWith("text/");
    }

    export function isMimeTypePDF(mt: string) {
        return mt == "application/pdf";
    }

    export function isMimeTypeSupported(mt: string) {
        return (
            isMimeTypeImage(mt) ||
            isMimeTypeVideo(mt) ||
            isMimeTypeAudio(mt) ||
            isMimeTypePDF(mt) ||
            isMimeTypeText(mt)
        );
    }

    export function getIcon(f: File): string[] {
        const icon: string =
            f.mimeType == "#directory" ? "file-manager"
                : isMimeTypeImage(f.mimeType) ? "image-x-generic"
                    : isMimeTypeVideo(f.mimeType) ? "video-x-generic"
                        : isMimeTypeAudio(f.mimeType) ? "audio-x-generic"
                            : isMimeTypeText(f.mimeType) ? "text-x-generic"
                                : isMimeTypePDF(f.mimeType) ? "application-pdf"
                                    : "application-octet-stream"; // this is also for links
        return f.mimeType == "#unresolved" ? [icon, "invalidLink", "🔗 "]
            : f.isLink ? [icon, "link", "🔗 "]
                : [icon, null, ""];
    }
</script>
