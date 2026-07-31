# Ollama Integration Guide

This document outlines the setup, configuration, and integration of the Ollama local inference server for the CommuniAble AI platform. Using Ollama ensures data privacy by keeping all processing local and reduces reliance on external API calls for core semantic analysis.

## 1. Hardware Requirements

To ensure acceptable latency for near real-time feedback, the following hardware specifications are required for the inference server:

*   **Minimum Requirements (for Qwen 1.5B / Llama 3.2 1B):**
    *   RAM: 8GB System RAM
    *   GPU: None required (CPU inference possible, but slow)
    *   Storage: 10GB SSD space
*   **Recommended Requirements (for Llama 3.2 3B/8B - Quantized):**
    *   RAM: 16GB System RAM
    *   GPU: Nvidia GPU with at least 8GB VRAM (e.g., RTX 3060, 4060) or Apple Silicon (M1/M2/M3 with 16GB Unified Memory)
    *   Storage: 20GB NVMe SSD space

## 2. Setup Guide

1.  **Install Ollama:**
    Follow the official instructions at [ollama.com](https://ollama.com/) for your target operating system (Windows/macOS/Linux).
2.  **Pull Base Models:**
    ```bash
    ollama pull llama3.2
    ollama pull qwen2.5:1.5b
    ```

## 3. Modelfiles & Customization

We utilize custom Modelfiles to pre-bake the system prompts and quantization settings, optimizing the models specifically for the CommuniAble AI architecture.

### CommuniAble-Llama-Coach
This model handles deep semantic analysis and email coaching.

```dockerfile
# Modelfile: communiable-llama-coach
FROM llama3.2

# Set parameters for more deterministic output
PARAMETER temperature 0.2
PARAMETER top_p 0.9

# System prompt for corporate coaching
SYSTEM """
You are a professional corporate communications coach. Your goal is to evaluate text for clarity, professional tone, and workplace appropriateness. Always respond in strict JSON format. Do not include conversational filler.
"""
```
**Build command:** `ollama create communiable-llama-coach -f ./Modelfile`

## 4. Quantization Settings

To run Llama 3.2 8B efficiently on consumer hardware (8GB VRAM), we utilize 4-bit quantization (Q4_K_M). This offers the best balance between speed, memory footprint, and semantic retention. Ollama handles this automatically when pulling the standard models, but it is a critical architectural decision for deployment scaling.

## 5. FastAPI Integration Routes

The Python backend interacts with the Ollama server via FastAPI, providing a clean abstraction layer for the frontend.

```python
from fastapi import FastAPI, HTTPException
import httpx

app = FastAPI()
OLLAMA_URL = "http://localhost:11434/api/generate"

@app.post("/api/v1/analyze/email")
async def analyze_email(draft: dict):
    payload = {
        "model": "communiable-llama-coach",
        "prompt": f"Objective: {draft['objective']}\nBody: {draft['body']}",
        "stream": False,
        "format": "json"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(OLLAMA_URL, json=payload, timeout=30.0)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
```
