export interface JourneyStep {
  id: string
  type: 'welcome' | 'input' | 'menu' | 'api' | 'condition'
  title: string
  content: string
  nextSteps: string[]
  apiCall?: string
  condition?: {
    variable: string
    operator: '==' | '!=' | '>' | '<' | '>=' | '<='
    value: string
  }
  inputType?: 'text' | 'pin' | 'number'
  inputVariable?: string
}

export interface ApiCall {
  name: string
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers: { key: string; value: string }[]
  params: { key: string; value: string; type: 'static' | 'dynamic' }[]
}

export interface Connection {
  source: string
  target: string
  label?: string
}

