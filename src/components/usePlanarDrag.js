import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { Plane, Raycaster, Vector2, Vector3 } from 'three'

// Native captured pointer events keep a drag alive outside the mesh/canvas.
// A single ray and XY plane are reused for the duration of each gesture.
export function usePlanarDrag({ position, onSelect, onMove, onDragChange }) {
  const get = useThree((state) => state.get)
  const finishRef = useRef(null)
  useEffect(() => () => finishRef.current?.(), [])

  return (event) => {
    if (event.button !== 0 || finishRef.current) return
    event.stopPropagation()
    const { gl, camera, controls } = get()
    if (controls && !controls.enabled) return
    const canvas = gl.domElement
    const plane = new Plane(new Vector3(0, 0, 1), 0)
    const intersection = new Vector3()
    if (!event.ray.intersectPlane(plane, intersection)) return
    const offset = new Vector3(...position).sub(intersection)
    const pointer = new Vector2()
    const raycaster = new Raycaster()
    const pointerId = event.pointerId
    const controlsWereEnabled = controls?.enabled
    if (controls) controls.enabled = false
    onSelect?.()
    onDragChange(true)
    canvas.style.cursor = 'grabbing'

    function move(nativeEvent) {
      if (nativeEvent.pointerId !== pointerId) return
      const rect = canvas.getBoundingClientRect()
      pointer.set((nativeEvent.clientX - rect.left) / rect.width * 2 - 1,
        -(nativeEvent.clientY - rect.top) / rect.height * 2 + 1)
      raycaster.setFromCamera(pointer, camera)
      if (raycaster.ray.intersectPlane(plane, intersection)) {
        intersection.add(offset)
        onMove([intersection.x, intersection.y, 0])
      }
    }

    function finish(nativeEvent) {
      if (nativeEvent?.pointerId !== undefined && nativeEvent.pointerId !== pointerId) return
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', finish)
      window.removeEventListener('pointercancel', finish)
      window.removeEventListener('blur', finish)
      canvas.removeEventListener('lostpointercapture', finish)
      if (canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId)
      if (controls) controls.enabled = controlsWereEnabled
      canvas.style.cursor = ''
      finishRef.current = null
      onDragChange(false)
    }

    finishRef.current = finish
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', finish)
    window.addEventListener('pointercancel', finish)
    window.addEventListener('blur', finish)
    canvas.addEventListener('lostpointercapture', finish)
    canvas.setPointerCapture(pointerId)
  }
}
