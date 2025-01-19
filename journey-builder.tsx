'use client'

import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { JourneyCanvas } from './journey-canvas'
import { Toolbox } from './toolbox'
import { ApiCallBuilder } from './api-call-builder'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateJSON, generatePythonCode } from './utils'
import { JourneyStep, ApiCall, Connection } from './types'

export default function JourneyBuilder() {
  const [journey, setJourney] = useState<JourneyStep[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([])
  const [generatedCode, setGeneratedCode] = useState('')

  const handleGenerate = () => {
    const json = generateJSON(journey, connections, apiCalls)
    const code = generatePythonCode(json)
    setGeneratedCode(code)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Advanced USSD Journey Builder</h1>
        <Tabs defaultValue="journey">
          <TabsList>
            <TabsTrigger value="journey">Journey</TabsTrigger>
            <TabsTrigger value="api">API Calls</TabsTrigger>
            <TabsTrigger value="output">Generated Code</TabsTrigger>
          </TabsList>
          <TabsContent value="journey">
            <div className="flex">
              <Toolbox />
              <JourneyCanvas
                journey={journey}
                setJourney={setJourney}
                connections={connections}
                setConnections={setConnections}
                apiCalls={apiCalls}
              />
            </div>
          </TabsContent>
          <TabsContent value="api">
            <ApiCallBuilder apiCalls={apiCalls} setApiCalls={setApiCalls} />
          </TabsContent>
          <TabsContent value="output">
            <div className="mt-4">
              <Button onClick={handleGenerate}>Generate Python Code</Button>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto mt-4 max-h-96">
                <code>{generatedCode}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DndProvider>
  )
}

