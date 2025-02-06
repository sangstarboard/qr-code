"use client"

import { useRef, useCallback } from "react"
import Webcam from "react-webcam"
import jsQR from "jsqr"

interface CameraScannerProps {
  onScan: (url: string) => void
}

export default function CameraScanner({ onScan }: CameraScannerProps) {
  const webcamRef = useRef<Webcam>(null)

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      const image = new Image()
      image.src = imageSrc
      image.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = image.width
        canvas.height = image.height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(image, 0, 0, image.width, image.height)
        const imageData = ctx?.getImageData(0, 0, image.width, image.height)
        if (imageData) {
          const code = jsQR(imageData.data, imageData.width, imageData.height)
          if (code) {
            onScan(code.data)
          }
        }
      }
    }
  }, [onScan])

  return (
    <div className="space-y-2">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "environment" }}
        className="w-full"
      />
      <button onClick={capture} className="w-full bg-blue-500 text-white py-2 rounded">
        スキャン
      </button>
    </div>
  )
}

