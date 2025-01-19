import { JourneyStep, ApiCall, Connection } from './types'

export function generateJSON(journey: JourneyStep[], connections: Connection[], apiCalls: ApiCall[]): any {
  return {
    journey,
    connections,
    apiCalls
  }
}

export function generatePythonCode(json: any): string {
  const { journey, connections, apiCalls } = json
  
  const codeTemplate = `
import json
import redis
import requests
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

# Initialize Redis connection
redis_client = redis.Redis(host='localhost', port=6379, db=0)

# Journey structure
JOURNEY = ${JSON.stringify(journey, null, 2)}

# Connections
CONNECTIONS = ${JSON.stringify(connections, null, 2)}

# API calls
API_CALLS = ${JSON.stringify(apiCalls, null, 2)}

def get_step(step_id):
    return next((step for step in JOURNEY if step['id'] == step_id), None)

def get_next_step(current_step_id, condition_result=None):
    connections = [conn for conn in CONNECTIONS if conn['source'] == current_step_id]
    if len(connections) == 1:
        return connections[0]['target']
    elif len(connections) == 2 and condition_result is not None:
        return connections[0]['target'] if condition_result else connections[1]['target']
    return None

def make_api_call(api_call, session_data):
    url = api_call['url']
    method = api_call['method']
    headers = {header['key']: header['value'] for header in api_call['headers']}
    params = {}
    
    for param in api_call['params']:
        if param['type'] == 'static':
            params[param['key']] = param['value']
        else:
            params[param['key']] = session_data.get(param['value'], '')
    
    # Replace placeholders in URL, headers, and params with session data
    for key, value in session_data.items():
        url = url.replace(f"{{{key}}}", str(value))
        headers = {k: v.replace(f"{{{key}}}", str(value)) for k, v in headers.items()}
        params = {k: v.replace(f"{{{key}}}", str(value)) if isinstance(v, str) else v for k, v in params.items()}
    
    if method == 'GET':
        response = requests.get(url, headers=headers, params=params)
    elif method == 'POST':
        response = requests.post(url, headers=headers, json=params)
    elif method == 'PUT':
        response = requests.put(url, headers=headers, json=params)
    elif method == 'DELETE':
        response = requests.delete(url, headers=headers, json=params)
    else:
        raise ValueError(f"Unsupported HTTP method: {method}")
    
    return response.json()

def evaluate_condition(condition, session_data):
    variable = session_data.get(condition['variable'])
    operator = condition['operator']
    value = condition['value']
    
    if operator == '==':
        return variable == value
    elif operator == '!=':
        return variable != value
    elif operator == '>':
        return variable > float(value)
    elif operator == '<':
        return variable < float(value)
    elif operator == '>=':
        return variable >= float(value)
    elif operator == '<=':
        return variable <= float(value)
    else:
        raise ValueError(f"Unsupported operator: {operator}")

@csrf_exempt
def ussd_callback(request):
    if request.method == 'POST':
        session_id = request.POST.get('sessionId')
        service_code = request.POST.get('serviceCode')
        phone_number = request.POST.get('phoneNumber')
        text = request.POST.get('text')

        # Get or initialize the user's current step
        current_step_id = redis_client.get(f"ussd:{session_id}:step")
        current_step_id = current_step_id.decode() if current_step_id else JOURNEY[0]['id']

        # Get or initialize the session data
        session_data = redis_client.get(f"ussd:{session_id}:data")
        session_data = json.loads(session_data) if session_data else {}

        current_step = get_step(current_step_id)
        
        if current_step['type'] == 'welcome' or current_step['type'] == 'menu':
            if text:
                try:
                    choice = int(text)
                    next_step_id = get_next_step(current_step_id)
                    if next_step_id:
                        current_step = get_step(next_step_id)
                    else:
                        response = "END Invalid option selected."
                        return HttpResponse(response, content_type='text/plain')
                except ValueError:
                    response = "END Please enter a valid number."
                    return HttpResponse(response, content_type='text/plain')
            else:
                response = f"CON {current_step['content']}"
                return HttpResponse(response, content_type='text/plain')
        elif current_step['type'] == 'input':
            if text:
                session_data[current_step['inputVariable']] = text
                redis_client.set(f"ussd:{session_id}:data", json.dumps(session_data))
                next_step_id = get_next_step(current_step_id)
                if next_step_id:
                    current_step = get_step(next_step_id)
                else:
                    response = "END Thank you for your input."
                    return HttpResponse(response, content_type='text/plain')
            else:
                response = f"CON {current_step['content']}"
                return HttpResponse(response, content_type='text/plain')
        elif current_step['type'] == 'api':
            api_call = next(api for api in API_CALLS if api['name'] == current_step['apiCall'])
            api_response = make_api_call(api_call, session_data)
            session_data.update(api_response)
            redis_client.set(f"ussd:{session_id}:data", json.dumps(session_data))
            next_step_id = get_next_step(current_step_id)
            if next_step_id:
                current_step = get_step(next_step_id)
            else:
                response = "END API call completed."
                return HttpResponse(response, content_type='text/plain')
        elif current_step['type'] == 'condition':
            condition_result = evaluate_condition(current_step['condition'], session_data)
            next_step_id = get_next_step(current_step_id, condition_result)
            if next_step_id:
                current_step = get_step(next_step_id)
            else:
                response = "END Condition evaluation completed."
                return HttpResponse(response, content_type='text/plain')
        
        redis_client.set(f"ussd:{session_id}:step", current_step['id'])
        
        if current_step['type'] in ['welcome', 'menu', 'input']:
            response = f"CON {current_step['content']}"
        else:
            response = f"END {current_step['content']}"
        
        return HttpResponse(response, content_type='text/plain')
    
    return HttpResponse("Method not allowed", status=405)
`

  return codeTemplate
}

