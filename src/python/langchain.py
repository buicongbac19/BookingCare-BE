import requests

API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base"
headers = {"Authorization": "Bearer hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}


def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()


output = query(
    {
        "inputs": "The answer to the universe is",
    }
)
