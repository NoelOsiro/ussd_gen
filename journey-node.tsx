import React, { useState, memo } from 'react'
import { Handle, Position } from 'reactflow'
import { JourneyStep, ApiCall } from './types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit2, Check } from 'lucide-react'

interface JourneyNodeProps {
  data: {
    step: JourneyStep
    updateStep: (step: JourneyStep) => void
    deleteStep: (stepId: string) => void
    apiCalls: ApiCall[]
  }
}

export const JourneyNode = memo(({ data }: JourneyNodeProps) => {
  const { step, updateStep, deleteStep, apiCalls } = data
  const [isEditing, setIsEditing] = useState(false)
  const [editedStep, setEditedStep] = useState(step)

  const handleSave = () => {
    updateStep(editedStep)
    setIsEditing(false)
  }

  return (
    <div className="bg-white p-4 rounded-md shadow-md w-64">
      <Handle type="target" position={Position.Top} />
      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={editedStep.title}
            onChange={(e) => setEditedStep({ ...editedStep, title: e.target.value })}
            placeholder="Step Title"
          />
          <Input
            value={editedStep.content}
            onChange={(e) => setEditedStep({ ...editedStep, content: e.target.value })}
            placeholder="Step Content"
          />
          {step.type === 'input' && (
            <>
              <Select
                value={editedStep.inputType}
                onValueChange={(value) => setEditedStep({ ...editedStep, inputType: value as 'text' | 'pin' | 'number' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Input Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="pin">PIN</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={editedStep.inputVariable || ''}
                onChange={(e) => setEditedStep({ ...editedStep, inputVariable: e.target.value })}
                placeholder="Input Variable Name"
              />
            </>
          )}
          {step.type === 'api' && (
            <Select
              value={editedStep.apiCall}
              onValueChange={(value) => setEditedStep({ ...editedStep, apiCall: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select API Call" />
              </SelectTrigger>
              <SelectContent>
                {apiCalls.map((apiCall) => (
                  <SelectItem key={apiCall.name} value={apiCall.name}>
                    {apiCall.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {step.type === 'condition' && (
            <div className="space-y-2">
              <Input
                value={editedStep.condition?.variable || ''}
                onChange={(e) =>
                  setEditedStep({
                    ...editedStep,
                    condition: { ...editedStep.condition, variable: e.target.value },
                  })
                }
                placeholder="Variable"
              />
              <Select
                value={editedStep.condition?.operator || '=='}
                onValueChange={(value) =>
                  setEditedStep({
                    ...editedStep,
                    condition: { ...editedStep.condition, operator: value as any },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="==">==</SelectItem>
                  <SelectItem value="!=">!=</SelectItem>
                  <SelectItem value=">">{'>'}</SelectItem>
                  <SelectItem value="<">{'<'}</SelectItem>
                  <SelectItem value=">=">{'>'}</SelectItem>
                  <SelectItem value="<=">{'<='}</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={editedStep.condition?.value || ''}
                onChange={(e) =>
                  setEditedStep({
                    ...editedStep,
                    condition: { ...editedStep.condition, value: e.target.value },
                  })
                }
                placeholder="Value"
              />
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}><Check className="h-4 w-4" /></Button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="font-semibold mb-2">{step.title}</h3>
          <p className="text-sm mb-2">{step.content}</p>
          {step.type === 'input' && (
            <p className="text-xs text-gray-500">
              Input Type: {step.inputType}, Variable: {step.inputVariable}
            </p>
          )}
          {step.type === 'api' && <p className="text-xs text-gray-500">API: {step.apiCall}</p>}
          {step.type === 'condition' && (
            <p className="text-xs text-gray-500">
              Condition: {step.condition?.variable} {step.condition?.operator} {step.condition?.value}
            </p>
          )}
          <div className="flex justify-end space-x-2">
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}><Edit2 className="h-4 w-4" /></Button>
            <Button size="sm" variant="destructive" onClick={() => deleteStep(step.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
})

JourneyNode.displayName = 'JourneyNode'

