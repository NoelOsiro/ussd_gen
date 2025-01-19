import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2 } from 'lucide-react'

interface MenuOption {
  text: string
  subMenu?: {
    title: string
    options: MenuOption[]
  }
}

interface MenuBuilderProps {
  menuStructure: {
    title: string
    options: MenuOption[]
  }
  setMenuStructure: React.Dispatch<React.SetStateAction<{
    title: string
    options: MenuOption[]
  }>>
}

export function MenuBuilder({ menuStructure, setMenuStructure }: MenuBuilderProps) {
  const addOption = (parentOptions: MenuOption[]) => {
    parentOptions.push({ text: '' })
    setMenuStructure({ ...menuStructure })
  }

  const removeOption = (parentOptions: MenuOption[], index: number) => {
    parentOptions.splice(index, 1)
    setMenuStructure({ ...menuStructure })
  }

  const addSubMenu = (option: MenuOption) => {
    option.subMenu = { title: '', options: [] }
    setMenuStructure({ ...menuStructure })
  }

  const renderOptions = (options: MenuOption[], level = 0) => {
    return options.map((option, index) => (
      <div key={index} className={`ml-${level * 4} mt-2`}>
        <div className="flex items-center gap-2">
          <Input
            value={option.text}
            onChange={(e) => {
              option.text = e.target.value
              setMenuStructure({ ...menuStructure })
            }}
            placeholder={`Option ${index + 1}`}
          />
          <Button variant="outline" size="icon" onClick={() => removeOption(options, index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
          {!option.subMenu && (
            <Button variant="outline" size="icon" onClick={() => addSubMenu(option)}>
              <PlusCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
        {option.subMenu && (
          <div className="ml-4 mt-2">
            <Input
              value={option.subMenu.title}
              onChange={(e) => {
                option.subMenu!.title = e.target.value
                setMenuStructure({ ...menuStructure })
              }}
              placeholder="Sub-menu title"
            />
            {renderOptions(option.subMenu.options, level + 1)}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addOption(option.subMenu!.options)}
              className="mt-2"
            >
              Add Sub-option
            </Button>
          </div>
        )}
      </div>
    ))
  }

  return (
    <div>
      <div className="mb-4">
        <Label htmlFor="menuTitle">Main Menu Title</Label>
        <Input
          id="menuTitle"
          value={menuStructure.title}
          onChange={(e) => setMenuStructure({ ...menuStructure, title: e.target.value })}
          placeholder="Enter main menu title"
        />
      </div>
      {renderOptions(menuStructure.options)}
      <Button
        variant="outline"
        onClick={() => addOption(menuStructure.options)}
        className="mt-4"
      >
        Add Main Option
      </Button>
    </div>
  )
}

