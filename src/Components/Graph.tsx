import React, { useEffect, useState } from "react";
import { Edge } from "../Data-Structures/EdgeClass";
import { Graph } from "../Data-Structures/GraphClass";
import { Vertex } from "../Data-Structures/VertexClass";
import EdgeVisualisation from "./Edge";
import AddEdge from "./SubComponents.tsx/AddEdge";
import { createRoot } from "react-dom/client";
import VertexVisualisation from "./Vertex";

type graphEvent =
  | "addEdgeEvent"
  | "addVertexEvent"
  | "none"
  | "runBFSEvent"
  | "runDFSEvent"
  | "runDijkstrasEvent"
  | "runPrimsEvent";

type algorithmMap = {
  [key: string]: () => void;
};

function GraphVisualisation() {
  const [graph, setGraph] = useState(new Graph());
  const [vertexCount, setVertexCount] = useState<number>(1);

  const [edgeCount, setEdgeCount] = useState<number>(0);
  const [graphAnimationRunning, setGraphAnimationRunning] =
    useState<boolean>(false);
  const [vertices, setVertices] = useState<
    Map<string, { x: number; y: number }>
  >(new Map());
  const [message, setMessage] = useState<string>(
    "Press the 'Add Vertex' button to start adding vertices to the graph "
  );
  const [currentEvent, setCurrentEvent] = useState<graphEvent>("none");
  const [addEdgeMode, setAddEdgeMode] = useState<boolean>(false);
  const [removeObjectMode, setRemoveObjectMode] = useState<boolean>(false);
  // const [algorithmMode, setAlgorithmMode] = useState<algorithms | null>(null)

  const [edgeVertexSelect, setEdgeVertexSelect] = useState<{
    firstVertex: Vertex<string> | undefined;
    secondVertex: Vertex<string> | undefined;
  }>({ firstVertex: undefined, secondVertex: undefined });
  const [edgeValueMode, setEdgeValueMode] = useState<boolean>();
  const [dijkstrasSelected, setDijkstrasSelected] = useState<{
    vertex1: Vertex<string> | undefined;
    vertex2: Vertex<string> | undefined;
  }>({ vertex1: undefined, vertex2: undefined });
  const algorithms: algorithmMap = {
    "Breadth First Search": () => {
      refreshSetActions();
      setCurrentEvent("runBFSEvent");
      setMessage("Select starting vertex");
    },
    "Depth First Search": () => {
      refreshSetActions();
      setCurrentEvent("runDFSEvent");
      setMessage("Select starting vertex");
    },
    Dijkstras: () => {
      refreshSetActions();
      setCurrentEvent("runDijkstrasEvent");
      setMessage("Select starting vertex");
    },
    "Minimum Spanning Tree": () => {
      refreshSetActions();
      setCurrentEvent("runPrimsEvent");
      setMessage('Select the starting vertex')
    },
  };

  useEffect(() => {
    if (edgeVertexSelect.secondVertex) {
      if (
        !graph.doesEdgeExist(
          edgeVertexSelect.firstVertex as Vertex<string>,
          edgeVertexSelect.secondVertex
        )
      ) {
        setEdgeValueMode(true);
      } else {
        setMessage("Edge already exists");
        refreshSelected();
      }
    }
  });

  const clickBehaviors = {
    addEdgeEvent: (event: React.MouseEvent<HTMLDivElement>) => {
      const clickedDiv = event.target as HTMLDivElement;
      const clickedDivId = clickedDiv.id;

      if (
        [...graph.adjacencyList.keys()]
          .map((vertex) => {
            return vertex.value;
          })
          .includes(clickedDivId)
      ) {
        if (!edgeVertexSelect.firstVertex) {
          (document.getElementById(clickedDivId) as HTMLElement).classList.add(
            "bg-yellow-300"
          );
          setEdgeVertexSelect((prev) => {
            return { ...prev, firstVertex: graph.getVertexById(clickedDivId) };
          });
          setMessage("Select the second vertex");
        } else {
          setEdgeVertexSelect((prev) => {
            return { ...prev, secondVertex: graph.getVertexById(clickedDivId) };
          });
        }
      }
    },
    addVertexEvent: (event: React.MouseEvent<HTMLDivElement>) => {
      const parentdiv = document.getElementById(
        "graph-container"
      ) as HTMLElement;
      const newVertex = new Vertex(
        vertexCount.toString(),
        event.clientX - parentdiv.offsetLeft * 1.1,
        event.clientY - parentdiv.offsetTop * 1.1
      );
      graph.addVertex(newVertex);
      setVertices((vertices) => {
        const newVertices = new Map(vertices);
        newVertices.set(newVertex.value, { x: newVertex.x, y: newVertex.y });
        return newVertices;
      });
      setVertexCount((prev) => {
        return prev + 1;
      });
    },
    // add more click behaviors here
    runBFSEvent: (event: React.MouseEvent<HTMLDivElement>) => {
      runGraphTraversal(event, "BFS");
    },

    runDFSEvent: (event: React.MouseEvent<HTMLDivElement>) => {
      runGraphTraversal(event, "DFS");
    },

    runPrimsEvent: (event: React.MouseEvent<HTMLDivElement>) => {
      runPrimsTraversal(event)
    },
    runDijkstrasEvent: (event: React.MouseEvent<HTMLDivElement>) => {
      runDijkstrasTraversal(event);
    },
    none: undefined,
  };

  const refreshSelected = () => {
    setEdgeVertexSelect({
      firstVertex: undefined,
      secondVertex: undefined,
    });
    setDijkstrasSelected({
      vertex1: undefined,
      vertex2: undefined,
    });
    clearAllStyling();
  };

  const refreshSetActions = () => {
    setCurrentEvent("none");
    setRemoveObjectMode(false);
    clearAllStyling();

    setMessage("");
  };

  function handleVertexMove(vertex: Vertex<string>, x: number, y: number) {
    setVertices((vertices) => {
      const newVertices = new Map(vertices);
      newVertices.set(vertex.value, { x, y });
      return newVertices;
    });
  }

  const clearAllStyling = () => {
    const visitedVertexDiv = document.querySelectorAll(".bg-blue-400");
    visitedVertexDiv.forEach((vertex) => {
      vertex.classList.add("bg-green-400");
      vertex.classList.remove("bg-blue-400");
    });

    const edgeSelectedVertex = document.querySelectorAll(".bg-yellow-300");
    edgeSelectedVertex.forEach((vertex) => {
      vertex.classList.add("bg-green-400");
      vertex.classList.remove("bg-yellow-300");
    });
    const visitedEdgeDiv = document.querySelectorAll(".stroke-orange-300");
    visitedEdgeDiv.forEach((edge) => {
      edge.classList.add("stroke-white");
      edge.classList.remove("stroke-orange-300");
    });
  };

  const applyStylingToVisited = (
    visitedEdges: Edge<string>[],
    visitedVertices: Vertex<string>[]
  ) => {
    type VertexOrEdge = Vertex<string> | Edge<string>;
    const combinedArrays: VertexOrEdge[] = [];
    const maxLength = Math.max(visitedEdges.length, visitedVertices.length);
    console.log('Applying Styling to Visited Vertices and Edges')
    for (let i = 0; i < maxLength; i++) {
      if (i < visitedVertices.length) {
        combinedArrays.push(visitedVertices[i]);
      }
      if (i < visitedEdges.length) {
        combinedArrays.push(visitedEdges[i]);
      }
    }
    console.log(combinedArrays)
    setGraphAnimationRunning(true);

    combinedArrays.forEach((item: VertexOrEdge, index: number) => {
      setTimeout(() => {
        if (currentEvent === "runBFSEvent" || currentEvent === "runDFSEvent" || currentEvent === "runDijkstrasEvent") {
          if (item instanceof Vertex) {
            document.getElementById(item.value)?.classList.add("bg-blue-400");
            document
              .getElementById(item.value)
              ?.classList.remove("bg-green-400");
          } else {
            if (!item.directed) {
              document
                .getElementById(
                  `edge-${item.vertex1.value}-${item.vertex2.value}`
                )
                ?.classList.remove("stroke-white");
              document
                .getElementById(
                  `edge-${item.vertex1.value}-${item.vertex2.value}`
                )
                ?.classList.add("stroke-orange-300");
              document
                .getElementById(
                  `edge-${item.vertex2.value}-${item.vertex1.value}`
                )
                ?.classList.remove("stroke-white");
              document
                .getElementById(
                  `edge-${item.vertex2.value}-${item.vertex1.value}`
                )
                ?.classList.add("stroke-orange-300");
            }
          }
        }
      }, 350 * index);

      setTimeout(() => {
        clearAllStyling();
        setGraphAnimationRunning(false);
      }, 350 * combinedArrays.length + 1000)
    });
  };

  const handleClearAll = () => {
    graph.clearAll();
    setVertexCount(1);
    setVertices(new Map());
    refreshSetActions();
  };

  const runPrimsTraversal = (event: React.MouseEvent<HTMLDivElement>) => {
      const clickedDiv = event.target as HTMLDivElement;
      const clickDivID = clickedDiv.id;
      //check to see if graph contains any directed Edges, 
      const selected = graph.getVertexById(clickDivID);
      if (!selected) return 

      const primsResponse = graph.primsMST(selected);
      console.log(primsResponse.getAdjacencyList())
      
  }

  const runDijkstrasTraversal = (event: React.MouseEvent<HTMLDivElement>) => {
    const clickedDiv = event.target as HTMLDivElement;
    const clickedDivId = clickedDiv.id;

    if (
      [...graph.adjacencyList.keys()]
        .map((vertex) => {
          return vertex.value;
        })
        .includes(clickedDivId)
    ) {
      
      if (!dijkstrasSelected.vertex1) {
        setDijkstrasSelected((prev) => {
          return {
            ...prev,
            vertex1: graph.getVertexById(clickedDivId) as Vertex<string>,
          };
        });
        setMessage("Select the end vertex");
      } else {
        let vertex2 = graph.getVertexById(clickedDivId) as Vertex<string>;

        const dijkstrasResponse = graph.dijkstra(
          dijkstrasSelected.vertex1,
          vertex2
        );
        console.log(dijkstrasResponse);
        refreshSelected();
        if (!dijkstrasResponse) {
          return;
        }
        const { distances, path, edges } = dijkstrasResponse;

        if(distances.get(vertex2) === Infinity){
          setMessage(`There is no path from Vertex ${dijkstrasSelected.vertex1.value} to Vertex ${vertex2.value}`);
          return;
        }

        setMessage(
          `The shortest path from Vertex ${
            dijkstrasSelected.vertex1.value
          } to Vertex ${vertex2.value} is: ${path
            .map((vertex) => {
              return vertex.value;
            })
            .join(" -> ")} with a distance of ${distances.get(vertex2)}`
        );
        applyStylingToVisited(edges, path);
        setDijkstrasSelected({ vertex1: undefined, vertex2: undefined });
      }

    }
  };

  const runGraphTraversal = (
    event: React.MouseEvent<HTMLDivElement>,
    traversalType: "BFS" | "DFS"
  ) => {
    const clickDiv = event.target as HTMLDivElement;
    const clickedDivId = clickDiv.id;
    const visitedVertices: Vertex<string>[] = [];
    const visitedEdges: Edge<string>[] = [];
    if (
      [...graph.adjacencyList.keys()]
        .map((vertex) => {
          return vertex.value;
        })
        .includes(clickedDivId)
    ) {
      visitedVertices.push(graph.getVertexById(clickedDivId) as Vertex<string>);
      if (traversalType === "BFS") {
        setMessage(`Breadth First Search Path: ${clickedDivId}`);
        graph.bfs(
          graph.getVertexById(clickedDivId) as Vertex<string>,
          (vertex, edge) => {
            visitedVertices.push(vertex);
            if (edge) {
              visitedEdges.push(edge);
            }
            setMessage((prev) => {
              return prev.concat(` -> ${vertex.value} `);
            });
          }
        );
      } else if (traversalType === "DFS") {
        setMessage(`Depth First Search Path: ${clickedDivId}`);
        graph.dfs(
          graph.getVertexById(clickedDivId) as Vertex<string>,
          (vertex, edge) => {
            visitedVertices.push(vertex);
            visitedEdges.push(edge);
            setMessage((prev) => {
              return prev.concat(` -> ${vertex.value}`);
            });
          }
        );
      }

      applyStylingToVisited(visitedEdges, visitedVertices);
    }
  };

  const handleEdgeRemovalEvent = (edge: Edge<string>) => {
    if (edge.directed) {
      graph.removeEdge(edge.vertex1, edge.vertex2);
    } else {
      graph.removeEdge(edge.vertex1, edge.vertex2);
      graph.removeEdge(edge.vertex2, edge.vertex1);
    }

    setEdgeCount(graph.getEdges().length);
  };

  const handleVertexRemovalEvent = (vertex: Vertex<string>) => {
    graph.removeVertex(vertex);
    setVertices((vertices) => {
      const newVertices = new Map(vertices);
      newVertices.delete(vertex.value);
      return newVertices;
    });
  };

  const handleCreateEdge = (weight: number, direction: boolean) => {
    graph.addEdge(
      edgeVertexSelect.firstVertex as Vertex<string>,
      edgeVertexSelect.secondVertex as Vertex<string>,
      weight,
      direction,
      `edge-${edgeVertexSelect.firstVertex?.value}-${edgeVertexSelect.secondVertex?.value}`
    );
    const selectedDiv = document.querySelectorAll(".bg-yellow-300");
    selectedDiv.forEach((value) => {
      value.classList.remove("bg-yellow-300");
    });
    refreshSelected();
    setMessage("Select the first vertex");
    setEdgeValueMode(false);
    setEdgeCount((prev) => {
      return prev + 1;
    });
  };

  return (
    <div className="w-screen h-full">
      <div className="flex justify-center pt-2">
        <div className=" w-[110rem] flex items-center">
          {currentEvent === "addVertexEvent" ? (
            <button
              className="button bg-red-300"
              onClick={() => {
                // setAddVertexMode(false);
                setCurrentEvent("none");
                setMessage("");
              }}
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => {
                if (!graphAnimationRunning) {
                  refreshSetActions();
                  // setAddVertexMode(true);
                  setCurrentEvent("addVertexEvent");
                  setMessage("Click on the workspace to create a new Vertex");
                }
              }}
              className="button"
            >
              Add Vertex
            </button>
          )}
          {currentEvent === "addEdgeEvent" ? (
            <button
              className="button bg-red-300"
              onClick={() => {
                setCurrentEvent("none");
                setMessage("");
              }}
            >
              Cancel
            </button>
          ) : (
            <button
              className="button"
              onClick={() => {
                if (!graphAnimationRunning) {
                  refreshSetActions();
                  refreshSelected();
                  setCurrentEvent("addEdgeEvent");
                  setMessage("Select the first vertex");
                }
              }}
            >
              Add Edge
            </button>
          )}
          {removeObjectMode ? (
            <button
              className="button bg-red-300"
              onClick={() => {
                setRemoveObjectMode(false);
                setMessage("");
              }}
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => {
                if (!graphAnimationRunning) {
                  refreshSetActions();
                  setRemoveObjectMode(true);
                  setMessage("Select the objects to be deleted");
                }
              }}
              className="button"
            >
              Remove Object
            </button>
          )}
          <div className="group">
            <button onClick={() => {}} className="button relative">
              Run an Algorithm
            </button>
            <div className="scale-0 group-hover:scale-100 origin-top transition-all duration-100 absolute left-auto z-10 py-4 mx-0 -translate-x-[2rem] ">
              <ul className="w-[15rem] bg-zinc-700 text-center cursor-pointer font-bold space-y-3 p-4 rounded-lg">
                {Object.keys(algorithms).map((algorithm: string) => {
                  return (
                    <li
                      key={algorithm}
                      onClick={() => {
                        algorithms[algorithm]();
                      }}
                      className="bg-inherit hover:bg-zinc-800 rounded-lg p-2"
                    >
                      {algorithm}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <button className="button" onClick={handleClearAll}>
            Clear
          </button>
        </div>
      </div>
      <div className="flex justify-center ">
        <div className="h-[4rem] w-[110rem] px-2 bg-zinc-200 bg-opacity-[0.55] rounded-lg border-2 border-zinc-900 m-2  text-zinc-900 font-bold flex items-center justify-center">
          {message}
        </div>
      </div>
      <section className="flex justify-center">
        <div
          className="w-[110rem] h-[40rem] bg-zinc-600 bg-opacity-40 relative mx-5 my-3 rounded-lg border-2 border-zinc-900"
          onClick={clickBehaviors[currentEvent]}
          id="graph-container"
        >
          {[...graph.adjacencyList.keys()].map((vertex) => {
            return (
              <VertexVisualisation
                vertex={vertex}
                key={vertex.value}
                onMove={handleVertexMove}
                edgeSelection={addEdgeMode}
                objectRemovalEvent={removeObjectMode}
                vertexRemovalCallback={handleVertexRemovalEvent}
              />
            );
          })}
          <svg width={"100%"} height={"100%"}>
            {graph.getEdges().map((edge: Edge<string>, index: number) => {
              return (
                <EdgeVisualisation
                  edge={edge}
                  key={`edge${index}`}
                  index={index}
                  vertices={vertices}
                  objectRemovalEvent={removeObjectMode}
                  edgeRemovalCallback={handleEdgeRemovalEvent}
                />
              );
            })}
          </svg>
        </div>
      </section>
      {edgeValueMode ? (
        <AddEdge
          vertex1={edgeVertexSelect.firstVertex}
          vertex2={edgeVertexSelect.secondVertex}
          callback={handleCreateEdge}
        />
      ) : null}
    </div>
  );
}

export default GraphVisualisation;
