"use client"

import { useEffect, useRef } from "react"

interface CalorieChartProps {
  breakfast: number
  lunch: number
  dinner: number
  snack: number
}

export function CalorieChart({ breakfast, lunch, dinner, snack }: CalorieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Make canvas responsive
    const resizeCanvas = () => {
      const container = canvasRef.current?.parentElement
      if (!container || !canvasRef.current) return

      // Set canvas dimensions based on container size
      const containerWidth = container.clientWidth
      const size = Math.min(containerWidth, 200) // Max size of 200px

      canvasRef.current.width = size
      canvasRef.current.height = size + 40 // Extra height for legend

      drawChart()
    }

    const drawChart = () => {
      if (!ctx || !canvasRef.current) return

      // Get dimensions
      const width = canvasRef.current.width
      const height = canvasRef.current.height
      const centerX = width / 2
      const centerY = (height - 40) / 2 // Adjust for legend space
      const radius = Math.min(centerX, centerY) * 0.8

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      const total = breakfast + lunch + dinner + snack
      if (total === 0) {
        // Draw empty state
        ctx.fillStyle = "#e5e7eb"
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        ctx.fill()

        ctx.fillStyle = "#6b7280"
        ctx.font = "14px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("No data available", centerX, centerY)
        return
      }

      // Data for the chart
      const data = [
        { value: breakfast, color: "#3b82f6", label: "Breakfast" },
        { value: lunch, color: "#8b5cf6", label: "Lunch" },
        { value: dinner, color: "#6366f1", label: "Dinner" },
        { value: snack, color: "#f97316", label: "Snack" },
      ]

      // Draw the pie chart
      let startAngle = 0

      data.forEach((item) => {
        if (item.value === 0) return

        const sliceAngle = (item.value / total) * 2 * Math.PI

        ctx.fillStyle = item.color
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
        ctx.closePath()
        ctx.fill()

        startAngle += sliceAngle
      })

      // Draw center circle (donut hole)
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
      ctx.fill()

      // Draw total in center
      ctx.fillStyle = "#111827"
      ctx.font = `bold ${Math.round(radius * 0.25)}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(total.toString(), centerX, centerY - radius * 0.05)
      ctx.font = `${Math.round(radius * 0.15)}px sans-serif`
      ctx.fillStyle = "#6b7280"
      ctx.fillText("calories", centerX, centerY + radius * 0.15)

      // Draw legend
      const legendY = height - 20
      const legendWidth = width / data.length

      data.forEach((item, index) => {
        if (item.value === 0) return

        const x = (index + 0.5) * legendWidth

        // Color box
        ctx.fillStyle = item.color
        ctx.fillRect(x - 20, legendY, 8, 8)

        // Label
        ctx.fillStyle = "#374151"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(item.label.substring(0, 3), x - 8, legendY + 8)
      })
    }

    // Initial draw
    resizeCanvas()

    // Add resize listener
    window.addEventListener("resize", resizeCanvas)

    // Clean up
    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [breakfast, lunch, dinner, snack])

  return (
    <div className="flex justify-center items-center h-full">
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  )
}
