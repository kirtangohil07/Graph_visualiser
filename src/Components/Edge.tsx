import React from "react";
import { Vertex } from "../Data-Structures/VertexClass";
import { Edge } from "../Data-Structures/EdgeClass";
interface EdgeProps {
  edge: Edge<string>;

  index: number;
  vertices: Map<string, { x: number; y: number }>;
  objectRemovalEvent: boolean;
  edgeRemovalCallback: (edge: Edge<string>) => void;
}

function EdgeVisualisation({
  edge,
  index,
  vertices,
  objectRemovalEvent,
  edgeRemovalCallback,
}: EdgeProps) {
  const vertHeight =
    (document.getElementById(edge.vertex1.value)?.offsetHeight as number) / 2;
  const vertWidth =
    (document.getElementById(edge.vertex1.value)?.offsetWidth as number) / 2;
  return (
    <>
      {edge.vertex1 !== edge.vertex2 ? (
        <>
          <line
            onClick={() => {
              objectRemovalEvent ? edgeRemovalCallback(edge) : undefined;
            }}
            id={`edge-${edge.vertex1.value}-${edge.vertex2.value}`}
            x1={
              (vertices.get(edge.vertex1.value)?.x as number) +
              (document.getElementById(edge.vertex1.value)
                ?.offsetWidth as number) /
                2
            }
            y1={
              (vertices.get(edge.vertex1.value)?.y as number) +
              (document.getElementById(edge.vertex1.value)
                ?.offsetHeight as number) /
                2
            }
            x2={
              (vertices.get(edge.vertex2.value)?.x as number) +
              (document.getElementById(edge.vertex1.value)
                ?.offsetWidth as number) /
                2
            }
            y2={
              (vertices.get(edge.vertex2.value)?.y as number) +
              (document.getElementById(edge.vertex1.value)
                ?.offsetHeight as number) /
                2
            }
            className={`stroke-[10] stroke-white ${
              objectRemovalEvent ? "hover:stroke-red-300" : ""
            }`}
          />
          <foreignObject
            x={
              ((vertices.get(edge.vertex1.value)?.x as number) +
                (vertices.get(edge.vertex2.value)?.x as number)) /
              2
            }
            y={
              ((vertices.get(edge.vertex1.value)?.y as number) +
                (vertices.get(edge.vertex2.value)?.y as number)) /
                2 +
              5
            }
            width={40}
            height={40}
          >
            <div className="bg-white h-[30px]  text-zinc-900 font-bold flex justify-center rounded-lg items-center">
              {edge.weight}
            </div>
          </foreignObject>
          
        
        </>
      ) : (
        <>
          <circle
            cx={(vertices.get(edge.vertex1.value)?.x as number) - vertWidth / 2}
            cy={vertices.get(edge.vertex1.value)?.y as number}
            id={`edge-${edge.vertex1.value}-${edge.vertex2.value}`}
            onClick={() => {
              objectRemovalEvent ? edgeRemovalCallback(edge) : undefined;
            }}
            r={vertHeight * 2}
            className={`stroke-[10] stroke-white fill-transparent ${
              objectRemovalEvent ? "hover:stroke-red-300" : ""
            }`}
          />
          <foreignObject
          x={(vertices.get(edge.vertex1.value)?.x as number) - vertWidth * 3.35}
          y={vertices.get(edge.vertex1.value)?.y as number - vertHeight}
          width={40}
          height={40}>
            <div className="h-[30px] bg-white text-zinc-900 flex justify-center items-center font-bold rounded-lg ">
                {edge.weight}
            </div>
          </foreignObject>
        </>
      )}
    </>
  );
}

export default EdgeVisualisation;
