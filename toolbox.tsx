import React from 'react'
import { useDrag } from 'react-dnd'
import { Button } from "@/components/ui/button"
import { FileInputIcon as Input, Menu, PiIcon as Api, GitBranch } from 'lucide-react'

const tools = [
  { type: 'input', icon: Input, label: 'Input' },
  { type: 'menu', icon: Menu, label: 'Menu' },
  { type: 'api', icon: Api, label: 'API Call' },
  { type: 'condition', icon: GitBranch, label: 'Condition' },
]

export function Toolbox() {
  return (
    <div className="w-48 bg-gray-100 p-4 rounded-md mr-4">
      <h2 className="text-lg font-semibold mb-4">Toolbox</h2>
      <div className="space-y-2">
        {tools.map((tool) => (
          <ToolboxItem key={tool.type} type={tool.type} icon={tool.icon} label={tool.label} />
        ))}
      </div>
    </div>
  )
}

function ToolboxItem({ type, icon: Icon, label }: { type: string; icon: React.ElementType; label: string }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'journey-step',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Button variant="outline" className="w-full justify-start">
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </div>
  )
}

