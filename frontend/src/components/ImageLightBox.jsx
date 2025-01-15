import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export default function ImageLightBox({
  slides = [],
  open = false,
  setOpen,
  initialIndex = 0,
}) {
  return (
    <Lightbox
      slides={slides}
      open={open}
      index={initialIndex}
      close={() => setOpen(false)}
      plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
    />
  );
}
