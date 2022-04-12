## Getting started

Please, use your `API Key` in every API call you make. Our platform only processes the API requests with an API key included. The API key linked to your account is used to take count of the calls you make to FunFacts platform. We reset the count every day at midnight.

if you try to call the api without an API key you'll get the following error.

`{ "message": "API token authentication failed..." }`

### Filter   

Get all facts or query for a specific topic and/or language.

### Parameters
lang optional	
You can use the lang parameter to get the output in your language.

Category	optional	
You can use the category parameter to get the facts about that topic.

##### API call example
https://funfactsapi.herokuapp.com/api/all?category=boat&apiToken={your_api_key}

### Parameters

To get a specific fact you can use the `id` parameter.

API call example

https://funfactsapi.herokuapp.com/api/fact?factId=60d79724fab161223c6dabcf&apiToken={your_api_key}
