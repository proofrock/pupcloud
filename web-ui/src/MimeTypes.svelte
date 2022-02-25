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

  export function getIcon(mt: string): string {
    return mt == "directory"
      ? "file-manager"
      : isMimeTypeImage(mt)
      ? "image-x-generic"
      : isMimeTypeVideo(mt)
      ? "video-x-generic"
      : isMimeTypeAudio(mt)
      ? "audio-x-generic"
      : isMimeTypeText(mt)
      ? "text-x-generic"
      : isMimeTypePDF(mt)
      ? "application-pdf"
      : "application-octet-stream";
  }
</script>
