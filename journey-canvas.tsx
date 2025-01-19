import React, { useCallback } from 'react'
import { useDrop } from 'react-dnd'
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  Controls,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { JourneyNode } from './journey-node'
import { JourneyStep, ApiCall, Connection } from './types'
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'

interface JourneyCanvasProps {
  journey: JourneyStep[]
  setJourney: React.Dispatch<React.SetStateAction<JourneyStep[]>>
  connections: Connection[]
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>
  apiCalls: ApiCall[]
}

const nodeTypes = {
  journeyNode: JourneyNode,
}

export function JourneyCanvas({
  journey,
  setJourney,
  connections,
  setConnections,
  apiCalls,
}: JourneyCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      const position = { x: event.clientX, y: event.clientY }

      const newStep: JourneyStep = {
        id: `step-${Date.now()}`,
        type: type as JourneyStep['type'],
        title: `New ${type}`,
        content: '',
        nextSteps: [],
      }

      setJourney((prev) => [...prev, newStep])
      setNodes((nds) => [
        ...nds,
        {
          id: newStep.id,
          type: 'journeyNode',
          position,
          data: { step: newStep, updateStep, deleteStep, apiCalls },
        },
      ])
    },
    [setJourney, setNodes]
  )

  const updateStep = (updatedStep: JourneyStep) => {
    setJourney((prev) =>
      prev.map((step) => (step.id === updatedStep.id ? updatedStep : step))
    )
    setNodes((nds) =>
      nds.map((node) =>
        node.id === updatedStep.id
          ? { ...node, data: { ...node.data, step: updatedStep } }
          : node
      )
    )
  }

  const deleteStep = (stepId: string) => {
    setJourney((prev) => prev.filter((step) => step.id !== stepId))
    setNodes((nds) => nds.filter((node) => node.id !== stepId))
    setEdges((eds) => eds.filter((edge) => edge.source !== stepId && edge.target !== stepId))
  }

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  return (
    <div className="flex-1 h-[600px]">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}

