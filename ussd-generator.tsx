'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateJSON, generatePythonCode } from './utils'

export default function USSDGenerator() {
  const [menuTitle, setMenuTitle] = useState('')
  const [menuOptions, setMenuOptions] = useState('')
  const [generatedJSON, setGeneratedJSON] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')

  const handleGenerate = () => {
    const json = generateJSON(menuTitle, menuOptions)
    setGeneratedJSON(JSON.stringify(json, null, 2))
    setGeneratedCode(generatePythonCode(json))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">USSD Generator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Enter USSD menu details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="menuTitle">Menu Title</Label>
                <Input
                  id="menuTitle"
                  value={menuTitle}
                  onChange={(e) => setMenuTitle(e.target.value)}
                  placeholder="Enter menu title"
                />
              </div>
              <div>
                <Label htmlFor="menuOptions">Menu Options (one per line)</Label>
                <Textarea
                  id="menuOptions"
                  value={menuOptions}
                  onChange={(e) => setMenuOptions(e.target.value)}
                  placeholder="Enter menu options"
                  rows={5}
                />
              </div>
              <Button onClick={handleGenerate}>Generate</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Generated JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              <code>{generatedJSON}</code>
            </pre>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Generated Python Code</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              <code>{generatedCode}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

