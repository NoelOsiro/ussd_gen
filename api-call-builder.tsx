import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from 'lucide-react'
import { ApiCall } from './types'

interface ApiCallBuilderProps {
  apiCalls: ApiCall[]
  setApiCalls: React.Dispatch<React.SetStateAction<ApiCall[]>>
}

export function ApiCallBuilder({ apiCalls, setApiCalls }: ApiCallBuilderProps) {
  const addApiCall = () => {
    setApiCalls([...apiCalls, { name: '', url: '', method: 'GET', headers: [], params: [] }])
  }

  const removeApiCall = (index: number) => {
    const newApiCalls = [...apiCalls]
    newApiCalls.splice(index, 1)
    setApiCalls(newApiCalls)
  }

  const updateApiCall = (index: number, field: keyof ApiCall, value: string) => {
    const newApiCalls = [...apiCalls]
    newApiCalls[index] = { ...newApiCalls[index], [field]: value }
    setApiCalls(newApiCalls)
  }

  const addHeader = (apiCallIndex: number) => {
    const newApiCalls = [...apiCalls]
    newApiCalls[apiCallIndex].headers.push({ key: '', value: '' })
    setApiCalls(newApiCalls)
  }

  const updateHeader = (apiCallIndex: number, headerIndex: number, field: 'key' | 'value', value: string) => {
    const newApiCalls = [...apiCalls]
    newApiCalls[apiCallIndex].headers[headerIndex][field] = value
    setApiCalls(newApiCalls)
  }

  const removeHeader = (apiCallIndex: number, headerIndex: number) => {
    const newApiCalls = [...apiCalls]
    newApiCalls[apiCallIndex].headers.splice(headerIndex, 1)
    setApiCalls(newApiCalls)
  }

  const addParam = (apiCallIndex: number) => {
    const newApiCalls = [...apiCalls]
    newApiCalls[apiCallIndex].params.push({ key: '', value: '', type: 'static' })
    setApiCalls(newApiCalls)
  }

  const updateParam = (apiCallIndex: number, paramIndex: number, field: 'key' | 'value' | 'type', value: string) => {
    const newApiCalls = [...apiCalls]
    newApiCalls[apiCallIndex].params[paramIndex][field] = value
    setApiCalls(newApiCalls)
  }

  const removeParam = (apiCallIndex: number, paramIndex: number) => {
    const newApiCalls = [...apiCalls]
    newApiCalls[apiCallIndex].params.splice(paramIndex, 1)
    setApiCalls(newApiCalls)
  }

  return (
    <div>
      {apiCalls.map((apiCall, index) => (
        <div key={index} className="mb-6 p-4 border rounded-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">API Call {index + 1}</h3>
            <Button variant="destructive" size="icon" onClick={() => removeApiCall(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`apiName${index}`}>Name</Label>
              <Input
                id={`apiName${index}`}
                value={apiCall.name}
                onChange={(e) => updateApiCall(index, 'name', e.target.value)}
                placeholder="API call name"
              />
            </div>
            <div>
              <Label htmlFor={`apiUrl${index}`}>URL</Label>
              <Input
                id={`apiUrl${index}`}
                value={apiCall.url}
                onChange={(e) => updateApiCall(index, 'url', e.target.value)}
                placeholder="https://api.example.com/endpoint"
              />
            </div>
          </div>
          <div className="mt-2">
            <Label htmlFor={`apiMethod${index}`}>Method</Label>
            <Select
              value={apiCall.method}
              onValueChange={(value) => updateApiCall(index, 'method', value as 'GET' | 'POST' | 'PUT' | 'DELETE')}
            >
              <SelectTrigger id={`apiMethod${index}`}>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Headers</h4>
            {apiCall.headers.map((header, headerIndex) => (
              <div key={headerIndex} className="flex items-center gap-2 mb-2">
                <Input
                  value={header.key}
                  onChange={(e) => updateHeader(index, headerIndex, 'key', e.target.value)}
                  placeholder="Header Key"
                />
                <Input
                  value={header.value}
                  onChange={(e) => updateHeader(index, headerIndex, 'value', e.target.value)}
                  placeholder="Header Value"
                />
                <Button variant="destructive" size="icon" onClick={() => removeHeader(index, headerIndex)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addHeader(index)}>
              Add Header
            </Button>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Parameters</h4>
            {apiCall.params.map((param, paramIndex) => (
              <div key={paramIndex} className="flex items-center gap-2 mb-2">
                <Input
                  value={param.key}
                  onChange={(e) => updateParam(index, paramIndex, 'key', e.target.value)}
                  placeholder="Param Key"
                />
                <Input
                  value={param.value}
                  onChange={(e) => updateParam(index, paramIndex, 'value', e.target.value)}
                  placeholder="Param Value"
                />
                <Select
                  value={param.type}
                  onValueChange={(value) => updateParam(index, paramIndex, 'type', value as 'static' | 'dynamic')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static">Static</SelectItem>
                    <SelectItem value="dynamic">Dynamic</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="destructive" size="icon" onClick={() => removeParam(index, paramIndex)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addParam(index)}>
              Add Parameter
            </Button>
          </div>
        </div>
      ))}
      <Button onClick={addApiCall}>Add API Call</Button>
    </div>
  )
}

