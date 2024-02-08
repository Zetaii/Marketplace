"use client"
import React, { useRef, useState, useEffect } from "react"

// Define interfaces for mouse and circle objects
interface Mouse {
  x: number
  y: number
}

interface Circle {
  x: number
  y: number
}

const CursorAnimation: React.FC = () => {
  const circleElementRef = useRef<HTMLDivElement>(null) // Reference to circle element
  const [mouse, setMouse] = useState<Mouse>({ x: 0, y: 0 }) // Track current mouse position
  const [previousMouse, setPreviousMouse] = useState<Mouse>({ x: 0, y: 0 }) // Store the previous mouse position
  const [circle, setCircle] = useState<Circle>({ x: 0, y: 0 }) // Track the circle position
  const [currentScale, setCurrentScale] = useState<number>(0) // Track current scale value
  const [currentAngle, setCurrentAngle] = useState<number>(0) // Track current angle value

  // Update mouse position on mousemove event
  const handleMouseMove = (e: MouseEvent) => {
    setMouse({ x: e.pageX, y: e.pageY })
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Animation loop
  const tick = () => {
    // MOVE
    // Calculate circle movement based on mouse position
    setCircle({
      x: circle.x + (mouse.x - circle.x) * 0.17,
      y: circle.y + (mouse.y - circle.y) * 0.17,
    })

    // SQUEEZE
    const deltaMouseX = mouse.x - previousMouse.x
    const deltaMouseY = mouse.y - previousMouse.y
    setPreviousMouse({ x: mouse.x, y: mouse.y })

    const mouseVelocity = Math.min(
      Math.sqrt(deltaMouseX ** 2 + deltaMouseY ** 2) * 20,
      150
    )
    const scaleValue = (mouseVelocity / 150) * 0.5
    setCurrentScale(currentScale + (scaleValue - currentScale) * 0.17)

    // ROTATE
    const angle = (Math.atan2(deltaMouseY, deltaMouseX) * 180) / Math.PI
    if (mouseVelocity > 0) {
      setCurrentAngle(angle)
    }

    // Apply transformations
    if (circleElementRef.current) {
      circleElementRef.current.style.transform = `translate(${circle.x}px, ${
        circle.y
      }px) rotate(${currentAngle}deg) scale(${1 + currentScale}, ${
        1 - currentScale
      })`
    }

    // Request the next frame
    requestAnimationFrame(tick)
  }

  useEffect(() => {
    let animationFrameId: number
    // Start animation loop
    animationFrameId = requestAnimationFrame(tick)

    // Clean up
    return () => {
      // Stop animation loop
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div
      ref={circleElementRef}
      className="circle"
      style={{ position: "absolute" }}
    >
      {/* Your circle element */}
    </div>
  )
}

export default CursorAnimation
