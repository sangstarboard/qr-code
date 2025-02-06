"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import jsQR from "jsqr"

interface ImageScannerProps {
  onScan: (url: string) => void
}

export default function ImageScanner({ onScan }: ImageScannerProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        const image = new Image()
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
        image.src = event.target?.result as string
      }

      reader.readAsDataURL(file)
    },
    [onScan],
  )

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      <p>ここにQRコード画像をドラッグ＆ドロップするか、クリックしてファイルを選択してください</p>
    </div>
  )
}

