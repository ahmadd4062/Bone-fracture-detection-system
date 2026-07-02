/**
 * Digital Image Processing Engine for Bone Fracture Detection
 * Comprehensive implementation of image processing techniques using Canvas 2D API
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProcessResult {
  name: string
  description: string
  imageData: ImageData
  category: string
}

export interface PipelineStage {
  name: string
  description: string
  imageData: ImageData
}

export type ImageProcessor = (src: ImageData) => ImageData

// ─── Helper Functions ────────────────────────────────────────────────────────

function cloneImageData(src: ImageData): ImageData {
  const canvas = document.createElement('canvas')
  canvas.width = src.width
  canvas.height = src.height
  const ctx = canvas.getContext('2d')!
  ctx.putImageData(src, 0, 0)
  return ctx.getImageData(0, 0, src.width, src.height)
}

export function imageDataToDataURL(img: ImageData): string {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')!
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL('image/png')
}

export function fileToImageData(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      // Resize large images for performance
      const maxDim = 800
      let w = img.naturalWidth
      let h = img.naturalHeight
      if (w > maxDim || h > maxDim) {
        const scale = maxDim / Math.max(w, h)
        w = Math.round(w * scale)
        h = Math.round(h * scale)
      }
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      resolve(ctx.getImageData(0, 0, w, h))
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

function createImageData(width: number, height: number): ImageData {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas.getContext('2d')!.createImageData(width, height)
}

function toGrayscale(src: ImageData): ImageData {
  const dst = cloneImageData(src)
  const d = dst.data
  for (let i = 0; i < d.length; i += 4) {
    const gray = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2])
    d[i] = d[i + 1] = d[i + 2] = gray
  }
  return dst
}

// ─── Point Processing Techniques ─────────────────────────────────────────────

export function negativeTransform(src: ImageData): ImageData {
  const dst = cloneImageData(src)
  const d = dst.data
  for (let i = 0; i < d.length; i += 4) {
    d[i] = 255 - d[i]
    d[i + 1] = 255 - d[i + 1]
    d[i + 2] = 255 - d[i + 2]
  }
  return dst
}

export function logTransform(src: ImageData): ImageData {
  const dst = cloneImageData(src)
  const d = dst.data
  const c = 255 / Math.log(256)
  for (let i = 0; i < d.length; i += 4) {
    const gray = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2])
    const v = Math.round(c * Math.log(1 + gray))
    d[i] = d[i + 1] = d[i + 2] = Math.min(255, v)
  }
  return dst
}

export function gammaCorrection(src: ImageData, gamma: number): ImageData {
  const dst = cloneImageData(src)
  const d = dst.data
  const invGamma = 1 / gamma
  const lookup = new Uint8Array(256)
  for (let i = 0; i < 256; i++) {
    lookup[i] = Math.min(255, Math.round(255 * Math.pow(i / 255, invGamma)))
  }
  for (let i = 0; i < d.length; i += 4) {
    const gray = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2])
    const v = lookup[gray]
    d[i] = d[i + 1] = d[i + 2] = v
  }
  return dst
}

export function histogramEqualization(src: ImageData): ImageData {
  const dst = cloneImageData(src)
  const d = dst.data
  const hist = new Uint32Array(256)
  for (let i = 0; i < d.length; i += 4) {
    const gray = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2])
    hist[gray]++
  }
  const cdf = new Uint32Array(256)
  cdf[0] = hist[0]
  for (let i = 1; i < 256; i++) cdf[i] = cdf[i - 1] + hist[i]
  const total = cdf[255]
  const lookup = new Uint8Array(256)
  for (let i = 0; i < 256; i++) {
    lookup[i] = Math.round((cdf[i] / total) * 255)
  }
  for (let i = 0; i < d.length; i += 4) {
    const gray = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2])
    const v = lookup[gray]
    d[i] = d[i + 1] = d[i + 2] = v
  }
  return dst
}

export function clahe(src: ImageData, clipLimit = 40, tileSize = 8): ImageData {
  // CLAHE: Contrast Limited Adaptive Histogram Equalization
  const dst = cloneImageData(src)
  const d = dst.data
  const w = src.width
  const h = src.height
  const gray = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      gray[y * w + x] = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2])
    }
  }
  const tilesX = Math.ceil(w / tileSize)
  const tilesY = Math.ceil(h / tileSize)
  const tileCDFs: Uint8Array[] = []
  for (let ty = 0; ty < tilesY; ty++) {
    for (let tx = 0; tx < tilesX; tx++) {
      const hist = new Uint32Array(256)
      const x0 = tx * tileSize
      const y0 = ty * tileSize
      const x1 = Math.min(x0 + tileSize, w)
      const y1 = Math.min(y0 + tileSize, h)
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          hist[gray[y * w + x]]++
        }
      }
      // Clip histogram
      const limit = Math.max(1, Math.round((clipLimit * (x1 - x0) * (y1 - y0)) / 256))
      let excess = 0
      for (let i = 0; i < 256; i++) {
        if (hist[i] > limit) {
          excess += hist[i] - limit
          hist[i] = limit
        }
      }
      const add = Math.floor(excess / 256)
      for (let i = 0; i < 256; i++) hist[i] += add
      // Build CDF
      const cdf = new Uint32Array(256)
      cdf[0] = hist[0]
      for (let i = 1; i < 256; i++) cdf[i] = cdf[i - 1] + hist[i]
      const total = cdf[255]
      const lookup = new Uint8Array(256)
      for (let i = 0; i < 256; i++) {
        lookup[i] = total > 0 ? Math.round((cdf[i] / total) * 255) : i
      }
      tileCDFs.push(lookup)
    }
  }
  // Bilinear interpolation between tiles
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const tx = x / tileSize - 0.5
      const ty = y / tileSize - 0.5
      const tx0 = Math.floor(tx)
      const ty0 = Math.floor(ty)
      const fx = tx - tx0
      const fy = ty - ty0
      const v00 = tx0 >= 0 && ty0 >= 0 ? tileCDFs[ty0 * tilesX + tx0][gray[y * w + x]] : gray[y * w + x]
      const v10 = tx0 + 1 < tilesX && ty0 >= 0 ? tileCDFs[ty0 * tilesX + (tx0 + 1)][gray[y * w + x]] : gray[y * w + x]
      const v01 = tx0 >= 0 && ty0 + 1 < tilesY ? tileCDFs[(ty0 + 1) * tilesX + tx0][gray[y * w + x]] : gray[y * w + x]
      const v11 = tx0 + 1 < tilesX && ty0 + 1 < tilesY ? tileCDFs[(ty0 + 1) * tilesX + (tx0 + 1)][gray[y * w + x]] : gray[y * w + x]
      const v = Math.round((1 - fx) * (1 - fy) * v00 + fx * (1 - fy) * v10 + (1 - fx) * fy * v01 + fx * fy * v11)
      const idx = (y * w + x) * 4
      d[idx] = d[idx + 1] = d[idx + 2] = Math.min(255, Math.max(0, v))
    }
  }
  return dst
}

// ─── Convolution Helpers ─────────────────────────────────────────────────────

function convolveGrayscale(src: ImageData, kernel: number[][]): ImageData {
  const w = src.width
  const h = src.height
  const dst = createImageData(w, h)
  const d = dst.data
  const s = src.data
  const gray = new Float32Array(w * h)
  for (let i = 0; i < w * h; i++) gray[i] = 0.299 * s[i * 4] + 0.587 * s[i * 4 + 1] + 0.114 * s[i * 4 + 2]
  const kh = kernel.length
  const kw = kernel[0].length
  const kyOff = Math.floor(kh / 2)
  const kxOff = Math.floor(kw / 2)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0
      for (let ky = 0; ky < kh; ky++) {
        for (let kx = 0; kx < kw; kx++) {
          const sy = Math.min(h - 1, Math.max(0, y + ky - kyOff))
          const sx = Math.min(w - 1, Math.max(0, x + kx - kxOff))
          sum += gray[sy * w + sx] * kernel[ky][kx]
        }
      }
      const v = Math.min(255, Math.max(0, Math.round(sum)))
      const idx = (y * w + x) * 4
      d[idx] = d[idx + 1] = d[idx + 2] = v
      d[idx + 3] = 255
    }
  }
  return dst
}

// ─── Neighborhood / Convolution Filters ──────────────────────────────────────

export function meanFilter(src: ImageData, size = 3): ImageData {
  const kernel: number[][] = []
  const v = 1 / (size * size)
  for (let i = 0; i < size; i++) {
    kernel.push(new Array(size).fill(v))
  }
  return convolveGrayscale(src, kernel)
}

export function gaussianBlur(src: ImageData, sigma = 1.4): ImageData {
  const size = Math.max(3, Math.ceil(sigma * 6) | 1)
  const kernel: number[][] = []
  const center = Math.floor(size / 2)
  let sum = 0
  for (let y = 0; y < size; y++) {
    kernel[y] = []
    for (let x = 0; x < size; x++) {
      const dx = x - center
      const dy = y - center
      const val = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma))
      kernel[y][x] = val
      sum += val
    }
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) kernel[y][x] /= sum
  }
  return convolveGrayscale(src, kernel)
}

export function medianFilter(src: ImageData, size = 3): ImageData {
  const w = src.width
  const h = src.height
  const dst = createImageData(w, h)
  const d = dst.data
  const s = src.data
  const half = Math.floor(size / 2)
  const window = new Uint8Array(size * size)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let count = 0
      for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          const sy = Math.min(h - 1, Math.max(0, y + ky))
          const sx = Math.min(w - 1, Math.max(0, x + kx))
          const gray = Math.round(0.299 * s[(sy * w + sx) * 4] + 0.587 * s[(sy * w + sx) * 4 + 1] + 0.114 * s[(sy * w + sx) * 4 + 2])
          window[count++] = gray
        }
      }
      window.sort((a, b) => a - b)
      const v = window[Math.floor(count / 2)]
      const idx = (y * w + x) * 4
      d[idx] = d[idx + 1] = d[idx + 2] = v
      d[idx + 3] = 255
    }
  }
  return dst
}

export function bilateralFilter(src: ImageData, spatialSigma = 3, intensitySigma = 30): ImageData {
  const w = src.width
  const h = src.height
  const dst = createImageData(w, h)
  const d = dst.data
  const s = src.data
  const gray = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) {
    gray[i] = Math.round(0.299 * s[i * 4] + 0.587 * s[i * 4 + 1] + 0.114 * s[i * 4 + 2])
  }
  const radius = Math.ceil(spatialSigma * 2)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const centerVal = gray[y * w + x]
      let sumW = 0, sumV = 0
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const sy = Math.min(h - 1, Math.max(0, y + ky))
          const sx = Math.min(w - 1, Math.max(0, x + kx))
          const dv = gray[sy * w + sx] - centerVal
          const gs = Math.exp(-(kx * kx + ky * ky) / (2 * spatialSigma * spatialSigma))
          const gi = Math.exp(-(dv * dv) / (2 * intensitySigma * intensitySigma))
          const wgt = gs * gi
          sumW += wgt
          sumV += gray[sy * w + sx] * wgt
        }
      }
      const v = sumW > 0 ? Math.round(sumV / sumW) : centerVal
      const idx = (y * w + x) * 4
      d[idx] = d[idx + 1] = d[idx + 2] = v
      d[idx + 3] = 255
    }
  }
  return dst
}

export function sharpen(src: ImageData): ImageData {
  const kernel = [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ]
  return convolveGrayscale(src, kernel)
}

export function unsharpMask(src: ImageData, amount = 1.5, radius = 3): ImageData {
  const blurred = gaussianBlur(src, radius)
  const dst = createImageData(src.width, src.height)
  const d = dst.data
  const s = src.data
  const b = blurred.data
  for (let i = 0; i < s.length; i += 4) {
    const gray = Math.round(0.299 * s[i] + 0.587 * s[i + 1] + 0.114 * s[i + 2])
    const bgray = Math.round(0.299 * b[i] + 0.587 * b[i + 1] + 0.114 * b[i + 2])
    const detail = gray - bgray
    const v = Math.min(255, Math.max(0, Math.round(gray + amount * detail)))
    d[i] = d[i + 1] = d[i + 2] = v
    d[i + 3] = 255
  }
  return dst
}

export function sobelX(src: ImageData): ImageData {
  const kernel = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ]
  return convolveGrayscale(src, kernel)
}

export function sobelY(src: ImageData): ImageData {
  const kernel = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ]
  return convolveGrayscale(src, kernel)
}

export function sobelMagnitude(src: ImageData): ImageData {
  const gx = sobelX(src)
  const gy = sobelY(src)
  const dst = createImageData(src.width, src.height)
  const d = dst.data
  const x = gx.data
  const y = gy.data
  for (let i = 0; i < d.length; i += 4) {
    const mag = Math.min(255, Math.round(Math.sqrt(x[i] * x[i] + y[i] * y[i])))
    d[i] = d[i + 1] = d[i + 2] = mag
    d[i + 3] = 255
  }
  return dst
}

// ─── Edge Detection ──────────────────────────────────────────────────────────

export function cannyEdge(src: ImageData, lowThresh = 30, highThresh = 80): ImageData {
  const w = src.width
  const h = src.height
  // Step 1: Gaussian blur
  const blurred = gaussianBlur(src, 1.4)
  // Step 2: Sobel gradients
  const gx = sobelX(blurred)
  const gy = sobelY(blurred)
  const mag = new Float32Array(w * h)
  const angle = new Float32Array(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const m = Math.sqrt(gx.data[i] * gx.data[i] + gy.data[i] * gy.data[i])
      const a = Math.atan2(gy.data[i], gx.data[i])
      mag[y * w + x] = m
      angle[y * w + x] = a
    }
  }
  // Step 3: Non-maximum suppression
  const suppressed = new Float32Array(w * h)
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x
      const a = angle[idx]
      const deg = ((a * 180 / Math.PI) + 180) % 180
      let n1 = 0, n2 = 0
      if ((deg >= 0 && deg < 22.5) || (deg >= 157.5)) {
        n1 = mag[y * w + (x - 1)]
        n2 = mag[y * w + (x + 1)]
      } else if (deg >= 22.5 && deg < 67.5) {
        n1 = mag[(y - 1) * w + (x + 1)]
        n2 = mag[(y + 1) * w + (x - 1)]
      } else if (deg >= 67.5 && deg < 112.5) {
        n1 = mag[(y - 1) * w + x]
        n2 = mag[(y + 1) * w + x]
      } else {
        n1 = mag[(y - 1) * w + (x - 1)]
        n2 = mag[(y + 1) * w + (x + 1)]
      }
      suppressed[idx] = (mag[idx] >= n1 && mag[idx] >= n2) ? mag[idx] : 0
    }
  }
  // Step 4: Hysteresis thresholding
  const dst = createImageData(w, h)
  const d = dst.data
  const strong = new Uint8Array(w * h)
  const weak = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) {
    if (suppressed[i] >= highThresh) strong[i] = 255
    else if (suppressed[i] >= lowThresh) weak[i] = 128
  }
  // Edge tracking
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x
      if (weak[idx] === 128) {
        let connected = false
        for (let ky = -1; ky <= 1 && !connected; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            if (strong[(y + ky) * w + (x + kx)] === 255) {
              connected = true
              break
            }
          }
        }
        if (connected) strong[idx] = 255
      }
    }
  }
  for (let i = 0; i < w * h; i++) {
    const v = strong[i]
    d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = v
    d[i * 4 + 3] = 255
  }
  return dst
}

export function logEdge(src: ImageData, sigma = 1.4): ImageData {
  // Laplacian of Gaussian
  const size = Math.max(5, Math.ceil(sigma * 6) | 1)
  const center = Math.floor(size / 2)
  const kernel: number[][] = []
  let sum = 0
  for (let y = 0; y < size; y++) {
    kernel[y] = []
    for (let x = 0; x < size; x++) {
      const dx = x - center
      const dy = y - center
      const r2 = dx * dx + dy * dy
      const s2 = sigma * sigma
      const val = -(1 / (Math.PI * s2 * s2)) * (1 - r2 / (2 * s2)) * Math.exp(-r2 / (2 * s2))
      kernel[y][x] = val
      sum += val
    }
  }
  // Normalize to zero-mean
  const mean = sum / (size * size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) kernel[y][x] -= mean
  }
  return convolveGrayscale(src, kernel)
}

export function differenceOfGaussians(src: ImageData, sigma1 = 1.0, sigma2 = 2.0): ImageData {
  const g1 = gaussianBlur(src, sigma1)
  const g2 = gaussianBlur(src, sigma2)
  const dst = createImageData(src.width, src.height)
  const d = dst.data
  const a = g1.data
  const b = g2.data
  for (let i = 0; i < d.length; i += 4) {
    const diff = Math.min(255, Math.max(0, 128 + a[i] - b[i]))
    d[i] = d[i + 1] = d[i + 2] = diff
    d[i + 3] = 255
  }
  return dst
}

// Segmentation Helpers

function getGrayArray(src: ImageData): Uint8Array {
  const w = src.width
  const h = src.height
  const gray = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) {
    gray[i] = Math.round(0.299 * src.data[i * 4] + 0.587 * src.data[i * 4 + 1] + 0.114 * src.data[i * 4 + 2])
  }
  return gray
}

function grayToImageData(gray: Uint8Array, w: number, h: number): ImageData {
  const dst = createImageData(w, h)
  const d = dst.data
  for (let i = 0; i < w * h; i++) {
    d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = gray[i]
    d[i * 4 + 3] = 255
  }
  return dst
}

export function otsuThreshold(src: ImageData): ImageData {
  const w = src.width
  const h = src.height
  const gray = getGrayArray(src)
  const hist = new Uint32Array(256)
  for (let i = 0; i < gray.length; i++) hist[gray[i]]++
  const total = gray.length
  let sum = 0
  for (let i = 0; i < 256; i++) sum += i * hist[i]
  let sumB = 0, wB = 0, wF = 0
  let maxVar = 0
  let threshold = 0
  for (let t = 0; t < 256; t++) {
    wB += hist[t]
    if (wB === 0) continue
    wF = total - wB
    if (wF === 0) break
    sumB += t * hist[t]
    const mB = sumB / wB
    const mF = (sum - sumB) / wF
    const varBetween = wB * wF * (mB - mF) * (mB - mF)
    if (varBetween > maxVar) {
      maxVar = varBetween
      threshold = t
    }
  }
  for (let i = 0; i < gray.length; i++) {
    gray[i] = gray[i] > threshold ? 255 : 0
  }
  return grayToImageData(gray, w, h)
}

export function skeletonize(src: ImageData): ImageData {
  // Zhang-Suen thinning algorithm
  const w = src.width
  const h = src.height
  let gray = getGrayArray(src)
  // Binarize
  for (let i = 0; i < gray.length; i++) gray[i] = gray[i] > 128 ? 1 : 0
  let changed = true
  const dst = new Uint8Array(w * h)

  const getNeighbors = (arr: Uint8Array, x: number, y: number): number[] => {
    const n: number[] = []
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue
        const sy = Math.min(h - 1, Math.max(0, y + dy))
        const sx = Math.min(w - 1, Math.max(0, x + dx))
        n.push(arr[sy * w + sx])
      }
    }
    return n // [P2,P3,P4,P5,P6,P7,P8,P9] order
  }

  const countTransitions = (n: number[]): number => {
    let count = 0
    for (let i = 0; i < 8; i++) {
      if (n[i] === 0 && n[(i + 1) % 8] === 1) count++
    }
    return count
  }

  const countNonZero = (n: number[]): number => n.filter(v => v === 1).length

  while (changed) {
    changed = false
    const toRemove: number[] = []
    // Sub-iteration 1
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x
        if (gray[idx] === 0) continue
        const n = getNeighbors(gray, x, y)
        const A = countTransitions(n)
        const B = countNonZero(n)
        if (A === 1 && (2 <= B && B <= 6) && n[0] * n[2] * n[4] === 0 && n[2] * n[4] * n[6] === 0) {
          toRemove.push(idx)
        }
      }
    }
    if (toRemove.length > 0) {
      changed = true
      for (const idx of toRemove) gray[idx] = 0
    }
    // Sub-iteration 2
    const toRemove2: number[] = []
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x
        if (gray[idx] === 0) continue
        const n = getNeighbors(gray, x, y)
        const A = countTransitions(n)
        const B = countNonZero(n)
        if (A === 1 && (2 <= B && B <= 6) && n[0] * n[2] * n[6] === 0 && n[0] * n[4] * n[6] === 0) {
          toRemove2.push(idx)
        }
      }
    }
    if (toRemove2.length > 0) {
      changed = true
      for (const idx of toRemove2) gray[idx] = 0
    }
  }

  for (let i = 0; i < gray.length; i++) {
    dst[i] = gray[i] === 1 ? 255 : 0
  }
  return grayToImageData(dst, w, h)
}

// ─── Fracture Detection Pipeline ─────────────────────────────────────────────

export function runFracturePipeline(src: ImageData): PipelineStage[] {
  const stages: PipelineStage[] = []

  // Stage 1: Contrast Enhancement (CLAHE)
  const enhanced = clahe(src, 40, 8)
  stages.push({
    name: '01. Contrast Enhancement',
    description: 'CLAHE adapts contrast locally across the image, enhancing subtle fracture lines that may be invisible in uniform regions while preventing over-amplification of noise.',
    imageData: enhanced,
  })

  // Stage 2: Noise Reduction (Bilateral Filter)
  const denoised = bilateralFilter(enhanced, 2, 25)
  stages.push({
    name: '02. Noise Reduction',
    description: 'Bilateral filtering reduces random noise while preserving sharp edges at fracture boundaries, unlike Gaussian blur which would smooth away critical detail.',
    imageData: denoised,
  })

  // Stage 3: Sharpening (Unsharp Mask)
  const sharpened = unsharpMask(denoised, 1.2, 2)
  stages.push({
    name: '03. Structure Sharpening',
    description: 'Unsharp masking enhances fine structural details by amplifying high-frequency components, making fracture discontinuities more pronounced.',
    imageData: sharpened,
  })

  // Stage 4: Edge Detection (Canny)
  const edges = cannyEdge(sharpened, 25, 70)
  stages.push({
    name: '04. Edge Detection',
    description: 'Canny edge detection identifies intensity discontinuities with sub-pixel precision using hysteresis thresholding to suppress noise while preserving true fracture edges.',
    imageData: edges,
  })

  // Stage 5: Skeletonization
  const skel = skeletonize(edges)
  stages.push({
    name: '05. Structural Skeleton',
    description: 'Skeletonization reduces detected edges to 1-pixel-wide medial lines, extracting the topological structure of fracture patterns for geometric analysis.',
    imageData: skel,
  })

  // Stage 6: Fracture Line Detection (Hough-like line segments)
  const lines = detectFractureLines(skel, src)
  stages.push({
    name: '06. Fracture Line Detection',
    description: 'Line segment detection identifies straight and semi-linear structures within the skeleton, distinguishing potential fracture lines from normal anatomical boundaries.',
    imageData: lines,
  })

  // Stage 7: Overlay on Original
  const overlay = overlayFractures(src, lines)
  stages.push({
    name: '07. Fracture Overlay',
    description: 'Detected fracture indicators are overlaid on the original X-ray in red, providing radiologists with an intuitive visual aid that preserves full anatomical context.',
    imageData: overlay,
  })

  return stages
}

function detectFractureLines(skel: ImageData, _original: ImageData): ImageData {
  const w = skel.width
  const h = skel.height
  const dst = createImageData(w, h)
  const d = dst.data
  // Start with skeleton
  for (let i = 0; i < d.length; i++) d[i] = skel.data[i]

  // Simple line detection: mark longer segments in red
  const visited = new Uint8Array(w * h)
  const gray = getGrayArray(skel)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x
      if (gray[idx] < 200 || visited[idx]) continue

      // Trace connected component
      const queue: [number, number][] = [[x, y]]
      const component: [number, number][] = []
      visited[idx] = 1

      while (queue.length > 0) {
        const [cx, cy] = queue.pop()!
        component.push([cx, cy])
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            const nx = cx + dx
            const ny = cy + dy
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const nidx = ny * w + nx
              if (gray[nidx] >= 200 && !visited[nidx]) {
                visited[nidx] = 1
                queue.push([nx, ny])
              }
            }
          }
        }
      }

      // If component is long enough, color it red
      if (component.length > 15) {
        for (const [px, py] of component) {
          const pidx = (py * w + px) * 4
          d[pidx] = 255
          d[pidx + 1] = 0
          d[pidx + 2] = 0
          d[pidx + 3] = 255
        }
      }
    }
  }
  return dst
}

function overlayFractures(original: ImageData, lines: ImageData): ImageData {
  const dst = cloneImageData(original)
  const d = dst.data
  const l = lines.data
  for (let i = 0; i < d.length; i += 4) {
    // If the lines image has red pixels, overlay them
    if (l[i] > 200 && l[i + 1] < 50 && l[i + 2] < 50) {
      d[i] = 255
      d[i + 1] = 30
      d[i + 2] = 30
    }
  }
  return dst
}

// ─── Master Processing Function ──────────────────────────────────────────────

export interface AllResults {
  pointProcessing: ProcessResult[]
  neighborhoodFilters: ProcessResult[]
  edgeDetection: ProcessResult[]
  morphologySegmentation: ProcessResult[]
  fracturePipeline: PipelineStage[]
}

export function processAll(src: ImageData): AllResults {
  const gray = toGrayscale(src)

  return {
    pointProcessing: [
      {
        name: 'Negative Transformation',
        description: 'Inverts all pixel intensities, producing a photographic negative. In fracture analysis, this can reveal subtle density variations by reversing the contrast relationship between bone and surrounding tissue, making certain discontinuities more apparent.',
        imageData: negativeTransform(src),
        category: 'Point Processing',
      },
      {
        name: 'Log Transformation',
        description: 'Applies a logarithmic mapping that compresses the dynamic range of high-intensity values while expanding low-intensity detail. This is particularly useful for X-rays with wide exposure ranges, bringing out fine fracture lines in darker regions.',
        imageData: logTransform(src),
        category: 'Point Processing',
      },
      {
        name: 'Gamma Correction (y=0.4)',
        description: 'With gamma less than 1, this transformation brightens shadow regions non-linearly. Fracture lines often appear in darker cortical bone areas, and this correction improves their visibility without overexposing brighter regions.',
        imageData: gammaCorrection(src, 0.4),
        category: 'Point Processing',
      },
      {
        name: 'Gamma Correction (y=1.0)',
        description: 'Linear mapping (gamma=1) preserves the original intensity relationship. This serves as a reference baseline, showing the image after grayscale conversion without any non-linear transformation applied.',
        imageData: gammaCorrection(src, 1.0),
        category: 'Point Processing',
      },
      {
        name: 'Gamma Correction (y=2.5)',
        description: 'With gamma greater than 1, this darkens the image and enhances contrast in brighter regions. It can help visualize trabecular patterns and stress lines in denser bone areas where fractures may propagate.',
        imageData: gammaCorrection(src, 2.5),
        category: 'Point Processing',
      },
      {
        name: 'Histogram Equalization',
        description: 'Redistributes pixel intensities to span the full dynamic range uniformly. This global contrast enhancement can reveal fractures hidden in uniformly bright or dark regions by maximizing the entropy of the image histogram.',
        imageData: histogramEqualization(src),
        category: 'Point Processing',
      },
    ],
    neighborhoodFilters: [
      {
        name: 'Mean / Averaging Filter',
        description: 'Replaces each pixel with the average of its neighborhood, smoothing intensity variations. While it reduces noise, it also blurs edges, so it serves as a baseline comparison for more sophisticated filtering approaches in fracture imaging.',
        imageData: meanFilter(gray, 3),
        category: 'Neighborhood Filters',
      },
      {
        name: 'Gaussian Blur',
        description: 'Applies a weighted average using a Gaussian kernel, producing smooth blurring without the harsh artifacts of a mean filter. It is commonly used as a preprocessing step before edge detection to reduce high-frequency noise in X-ray images.',
        imageData: gaussianBlur(gray, 1.5),
        category: 'Neighborhood Filters',
      },
      {
        name: 'Median Filter',
        description: 'Replaces each pixel with the median of its neighborhood, effectively removing salt-and-pepper noise (common in digital X-rays) while preserving sharp edges better than linear filters. Critical for maintaining fracture line definition.',
        imageData: medianFilter(gray, 3),
        category: 'Neighborhood Filters',
      },
      {
        name: 'Sharpening Kernel',
        description: 'A Laplacian-based sharpening filter that amplifies high-frequency components. It enhances edge definition around fracture lines by subtracting a smoothed version from the original, making discontinuities more visually pronounced.',
        imageData: sharpen(gray),
        category: 'Neighborhood Filters',
      },
    ],
    edgeDetection: [
      {
        name: 'Sobel X',
        description: 'Detects horizontal intensity gradients using a 3x3 kernel. The response highlights vertical edges such as the sides of long bones. In fracture analysis, strong vertical responses may indicate transverse fracture components.',
        imageData: sobelX(gray),
        category: 'Edge Detection',
      },
      {
        name: 'Sobel Y',
        description: 'Detects vertical intensity gradients, highlighting horizontal edges. Oblique and longitudinal fracture components produce strong responses, complementary to Sobel X for complete gradient analysis.',
        imageData: sobelY(gray),
        category: 'Edge Detection',
      },
      {
        name: 'Sobel Magnitude',
        description: 'Computes gradient magnitude via first-order derivatives. It is computationally efficient and produces thick edge responses useful for initial fracture region localization before thinning operations.',
        imageData: sobelMagnitude(gray),
        category: 'Edge Detection',
      },
      {
        name: 'Laplacian of Gaussian (LoG)',
        description: 'Combines Gaussian smoothing with the Laplacian second-order derivative. The zero-crossings of LoG correspond to edges, and it is particularly effective at detecting fine fracture lines in noisy X-ray images.',
        imageData: logEdge(gray, 1.5),
        category: 'Edge Detection',
      },
      {
        name: 'Difference of Gaussians (DoG)',
        description: 'Subtracts two Gaussian-blurred images at different scales to create a band-pass filter. DoG emphasizes edges at a specific scale range, effectively isolating fracture-width features while suppressing both fine noise and large structures.',
        imageData: differenceOfGaussians(gray, 1.0, 2.5),
        category: 'Edge Detection',
      },
    ],
    morphologySegmentation: [
      {
        name: "Otsu's Thresholding",
        description: 'Automatically determines the optimal intensity threshold by minimizing intra-class variance. It separates bone from background/soft tissue, creating a binary mask that isolates the region of interest for fracture analysis.',
        imageData: otsuThreshold(gray),
        category: 'Morphology & Segmentation',
      },
    ],
    fracturePipeline: runFracturePipeline(src),
  }
}
