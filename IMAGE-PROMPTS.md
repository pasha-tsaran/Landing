# Generated photo prompts

Tool: built-in image_gen. Four independent illustrations; no collage. Original files: `assets/originals/`. Web assets: `assets/*.webp`. First three generated on 2026-10-08; maintenance-parts generated on 2026-10-13. These illustrate services and are not photographs of the actual company.

car-on-lift

Use case: photorealistic-natural. Asset type: landscape hero photograph for a premium automotive repair service website. Primary request: A realistic dark graphite modern sports sedan elevated about 70 cm on a real red two-post hydraulic lift in a meticulously clean but believable automotive workshop, front three-quarter view, entire car visible, front toward camera-left. Wide cinematic 3:2 horizontal single photograph, subject sharp. Bright natural daylight from tall workshop windows, white industrial walls, restrained gray concrete floors, orderly tool storage, red lift posts. High-end automotive editorial photography, realistic paint reflections, natural details, subtle tire dust, accurate functional lift support points and automotive anatomy. Wide composition with car occupying most of frame and some architecture. No people needed. No text, no lettering, no logos, no watermarks, no collage, no split panels, no exaggerated lens flare. One realistic photograph.

---

mechanic-working

Use case: photorealistic-natural. Asset type: landscape workshop team photograph for an automotive repair service website. Primary request: A skilled male auto mechanic about 38 years old, short brown hair, natural friendly focused face clearly visible, graphite work uniform and protective gloves, working carefully with a ratchet at the open engine bay of a modern gray car. A second male mechanic around 30, short darker hair, also in plain graphite uniform, visible further to the right examining a part at an organized workbench, face visible but natural. Bright clean modern auto workshop with white walls, gray floors and orderly red tool cabinets, high quality soft daylight, believable used tools, natural skin texture, documentary professional photography. Single 3:2 horizontal photograph, mechanic in foreground camera left, face upper left-center, secondary mechanic on right in focus enough to see. Not posed with folded arms. No text, no logos, no watermarks, no collage, no split screen. Accurate hands and realistic automotive components.

---

computer-diagnostics

Use case: photorealistic-natural. Asset type: landscape equipment photograph for an automotive repair service website. Primary request: realistic professional computer diagnostics of a modern gray car in a clean bright automotive workshop. Close medium view of an open laptop with a non-readable generic diagnostic interface containing simple blue and green chart lines and no legible text, on a professional red rolling cart next to open driver door; OBD diagnostic cable genuinely connected into car under dashboard; gloved mechanic's hand operating the laptop touchpad. Workshop with white and gray surfaces, soft daylight, neatly stored equipment, restrained red accent. Accurate real-world laptop proportions, believable practical cable, professional editorial photography, shallow but natural depth of field. Single horizontal 3:2 photograph. No readable text anywhere, no logos, no watermark, no collage, no split panels. Clean, detailed, natural.

---

maintenance-parts

Use case: photorealistic-natural. Asset type: automotive service landing page photograph, landscape 3:2. Primary request: close up editorial photograph of maintenance supplies on a real grey mechanic workbench: a clean pleated automotive air filter, a metal spin-on oil filter, ratchet and socket wrench, protective work gloves, with an out of focus dark graphite car and workshop in background. Natural workshop window light. Restrained black grey and a small warm yellow accent on a tool handle, realistic materials and practical proportions. Documentary detail, premium automotive editorial photography, subtle wear on workbench. No people, no lettering, no labels, no logos, no watermark, no collage, no borders. One coherent photograph, useful as a crop for oil change promotional section.

Original: assets/originals/maintenance-parts.png. Web asset: assets/maintenance-parts.webp (1536 x 1024, 174704 bytes). Generation: built-in image_gen. Conversion to WebP preserves the composition; the page uses the original colours and a small scroll-linked displacement in CSS.

---

User-supplied background assets, edited with built-in image_gen on 2026-10-13.

car-front-cutout / car-rear-cutout

Input: user's photographs 3 and 4, top-down yellow Mercedes, front-facing and rear-facing views. Prompt: background-extraction; remove only the yellow ground and cast shadow; isolate the exact car including mirrors and tyres on transparent RGBA; preserve photographic details, orientation, paint and proportions; no ground, rectangle, outline or replacement vehicle. Front view points headlights toward the bottom; rear view points tail lights toward the bottom. Outputs: assets/originals/car-front-cutout.png and assets/originals/car-rear-cutout.png. Web assets preserve alpha with lossless WebP: assets/car-front-cutout.webp and assets/car-rear-cutout.webp.

road-wavy

Input: user's straight asphalt road with yellow outer lines and a white dashed centre line. Prompt: precise-object-edit; turn the road into a broad, constant-width S ribbon on a transparent portrait canvas; retain granular black asphalt, continuous yellow edges and dashed white centre line; no scenery, cars, perspective or ground outside the ribbon. Output: assets/originals/road-wavy.png. Web asset: assets/road-wavy.webp, 887 x 1774, lossless RGBA. The HTML displays this image as a background road; the movement path follows its curve.


Lift animation · 2026-10-13

User-supplied raised-off and raised-on photographs are converted without visual editing to assets/lift/raised-off.webp and assets/lift/raised-on.webp, both 1448 x 1086. The original GIF supplies the flash timing (390 ms on, 470 ms off, three flashes).

Clean background plate: assets/lift/garage.webp. Built-in image_gen edit of the supplied raised-off photograph. Final prompt: "Edit target: this exact garage photo. Produce a clean background plate for compositing: remove ONLY the entire grey BMW car (including wheels and all shadow it casts) and the horizontal red lift arms under it. Reconstruct the empty garage behind those removed objects. Strict invariants: keep the same framing, 4:3 aspect ratio, perspective, windows, ceiling, tool cabinets, both fixed vertical red lift posts and their floor bases in their exact original positions. Do not move any garage feature. No car, no moving lift arms, no text. Photorealistic, same natural light. The source car will be composited back separately."

The moving layer uses a canvas clip of the supplied original photograph, preserving its exact car details. The lift moves it by 190 px within a fixed 1448 x 1086 canvas; the right post is painted in front. A generated transparent car cutout was inspected but discarded because it changed the car scale and alignment.

Correction: the raised-on photograph is no longer used for flashing because its vehicle geometry differs slightly. Headlights are now drawn as canvas light effects over the identical raised-off frame; no image swaps occur during flashes. Tyres use curved clipping paths, lift arms a separate path. The garage plate blends back to the supplied photograph only once, before flashing, without moving the vehicle.
