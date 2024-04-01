import React, { useEffect } from "react";
import { Vertex } from "../Data-Structures/VertexClass";
import { useState, useRef } from "react";
interface VertexProps<T> {
  vertex: Vertex<T>;
  onMove: (vertex: Vertex<T>, posX: number, posY: number) => void;
  edgeSelection: boolean;
  objectRemovalEvent: boolean;
  vertexRemovalCallback: (vertex: Vertex<string>) => void;
}

function VertexVisualisation<T>({
  vertex,
  onMove,
  edgeSelection,
  objectRemovalEvent,
  vertexRemovalCallback,
  
}: VertexProps<T>) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: vertex.x, y: vertex.y });

  function handleDragStart(event: React.DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData("text/plain", vertex.value);
    event.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
    setDragOffset({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  }

  function handleDrag(event: React.DragEvent<HTMLDivElement>) {
    if (!isDragging) {
      return;
    }

    const x = event.clientX - dragOffset.x;
    const y = event.clientY - dragOffset.y;
    const parent = event.currentTarget.parentNode as HTMLDivElement;
    const parentRect = parent.getBoundingClientRect();
    const minX = 0;
    const maxX = parentRect.width - event.currentTarget.offsetWidth;
    const minY = 0;
    const maxY = parentRect.height - event.currentTarget.offsetHeight;
    const newX = x < minX ? position.x : x > maxX ? maxX : x;
    const newY = y < minY ? position.y : y > maxY ? maxY : y;
    setPosition({ x: newX, y: newY });
    onMove(vertex, newX, newY);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => {
        objectRemovalEvent ? vertexRemovalCallback(vertex) : undefined;
      }}
      className={`w-10 h-10 rounded-full bg-green-400 absolute  flex justify-center items-center text-zinc-900 font-bold ${
        edgeSelection ? `cursor-pointer` : `cursor-move`
      }
      ${objectRemovalEvent ? "hover:bg-red-300" : ""}
      `}
      id={vertex.value}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        position: "absolute",
      }}
    >
      {vertex.value}
    </div>
  );
}

export default VertexVisualisation;
