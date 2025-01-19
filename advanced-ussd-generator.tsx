'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateJSON, generatePythonCode } from './utils'
import { MenuBuilder } from './menu-builder'
import { ApiCallBuilder } from './api-call-builder'

export default function AdvancedUSSDGenerator() {
  const [menuStructure, setMenuStructure] = useState<any>({ title: '', options: [] })
  const [apiCalls, setApiCalls] = useState<any[]>([])
  const [generatedJSON, setGeneratedJSON] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')

  const handleGenerate = () => {
    const json = generateJSON(menuStructure, apiCalls)
    setGeneratedJSON(JSON.stringify(json, null, 2))
    setGeneratedCode(generatePythonCode(json))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Advanced USSD Generator</h1>
      <Tabs defaultValue="menu">
        <TabsList>
          <TabsTrigger value="menu">Menu Structure</TabsTrigger>
          <TabsTrigger value="api">API Calls</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
        </TabsList>
        <TabsContent value="menu">
          <Card>
            <CardHeader>
              <CardTitle>Menu Structure</CardTitle>
              <CardDescription>Build your USSD menu structure</CardDescription>
            </CardHeader>
            <CardContent>
              <MenuBuilder
                menuStructure={menuStructure}
                setMenuStructure={setMenuStructure}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Calls</CardTitle>
              <CardDescription>Define API calls for your USSD service</CardDescription>
            </CardHeader>
            <CardContent>
              <ApiCallBuilder
                apiCalls={apiCalls}
                setApiCalls={setApiCalls}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="output">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Generated JSON</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                  <code>{generatedJSON}</code>
                </pre>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Generated Python Code</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                  <code>{generatedCode}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      <div className="mt-4">
        <Button onClick={handleGenerate}>Generate USSD Application</Button>
      </div>
    </div>
  )
}

