"""
Vision service — the only place in the AI service that touches the YOLO
models. Both models are loaded once when this module is instantiated
(from app.py, at process startup) and reused for every request, which is
what makes per-frame inference fast enough for a low-end CPU.

Two separate models are used on purpose:
  - weapon_model: your custom-trained `best.pt` (knife, pistol, gun, ...)
  - person_model: stock `yolov8n.pt` (COCO), filtered to class 0 ("person")

Running two small models is lighter on a Celeron-class CPU than one large
multi-class model, and keeps your custom weapon weights independent of
the general-purpose person detector.
"""

from ultralytics import YOLO


class VisionService:
    def __init__(
        self,
        weapon_model_path: str,
        person_model_path: str,
        weapon_conf: float = 0.35,
        person_conf: float = 0.40,
    ):
        print(f"[VisionService] Loading weapon model from '{weapon_model_path}'...")
        self.weapon_model = YOLO(weapon_model_path)

        print(f"[VisionService] Loading person model from '{person_model_path}'...")
        self.person_model = YOLO(person_model_path)

        self.weapon_conf = weapon_conf
        self.person_conf = person_conf
        print("[VisionService] Both models loaded and ready.")

    def detect(self, image_bgr) -> dict:
        """
        Runs both models on a single decoded frame and returns raw,
        unopinionated detection data. No risk scoring happens here —
        that's the Express backend's job.
        """
        weapons = []
        weapon_results = self.weapon_model.predict(
            image_bgr, conf=self.weapon_conf, verbose=False
        )
        for result in weapon_results:
            names = result.names
            for box in result.boxes:
                cls_id = int(box.cls[0])
                confidence = float(box.conf[0]) * 100
                weapons.append(
                    {
                        "label": names.get(cls_id, f"class_{cls_id}"),
                        "confidence": round(confidence, 1),
                    }
                )

        person_confidences = []
        person_results = self.person_model.predict(
            image_bgr, conf=self.person_conf, classes=[0], verbose=False
        )
        for result in person_results:
            for box in result.boxes:
                confidence = float(box.conf[0]) * 100
                person_confidences.append(round(confidence, 1))

        return {
            "weapons": weapons,
            "persons": {
                "count": len(person_confidences),
                "confidences": person_confidences,
            },
        }
