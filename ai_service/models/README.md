# Model weights go here

This folder is intentionally empty in the delivered project — model
weight files are large binaries and are not something that should be
generated or guessed.

Place these two files here before starting the Flask service:

1. **`best.pt`** — your custom-trained weapon detection model (knife,
   pistol, gun, etc.). This is the model referenced in the prototype
   requirements; train it with Ultralytics YOLOv8 on your own weapon
   dataset, or supply an existing one you've already trained.

2. **`yolov8n.pt`** *(optional)* — the stock COCO-pretrained person
   detector. You can leave this out entirely: by default
   `PERSON_MODEL_PATH` in `.env` is set to the bare filename `yolov8n.pt`,
   which Ultralytics will download automatically the first time the
   service starts (requires internet once; it's cached after that).

If you'd rather keep both files local and offline-friendly, download
`yolov8n.pt` yourself and set `PERSON_MODEL_PATH=models/yolov8n.pt` in
`.env`.
