import os
import json
import time
from abc import ABC, abstractmethod
from typing import Generator, List, Dict
import httpx

class AIProvider(ABC):
    @abstractmethod
    def generate_stream(self, system_prompt: str, messages: List[Dict[str, str]]) -> Generator[str, None, None]:
        """Generate a streaming text token response."""
        pass

class OllamaProvider(AIProvider):
    """
    Local Ollama API chat completion provider.
    Defaults to http://localhost:11434/api/chat.
    """
    def __init__(self, model: str = "llama3.1:8b", host: str = "http://localhost:11434"):
        self.model = model
        self.host = host

    def generate_stream(self, system_prompt: str, messages: List[Dict[str, str]]) -> Generator[str, None, None]:
        # Formulate full message history including system instructions
        formatted_messages = [{"role": "system", "content": system_prompt}]
        formatted_messages.extend(messages)

        url = f"{self.host}/api/chat"
        data = {
            "model": self.model,
            "messages": formatted_messages,
            "stream": True
        }

        try:
            with httpx.stream("POST", url, json=data, timeout=5.0) as r:
                if r.status_code != 200:
                    raise RuntimeError(f"Ollama returned status code {r.status_code}")
                for line in r.iter_lines():
                    if line:
                        chunk = json.loads(line)
                        content = chunk.get("message", {}).get("content", "")
                        if content:
                            yield content
        except Exception as e:
            raise RuntimeError(f"Local Ollama connection failed: {str(e)}")

class OpenAIProvider(AIProvider):
    """
    Cloud OpenAI chat completion provider.
    """
    def __init__(self, api_key: str = None, model: str = "gpt-4o-mini"):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.model = model

    def generate_stream(self, system_prompt: str, messages: List[Dict[str, str]]) -> Generator[str, None, None]:
        if not self.api_key:
            yield "Error: OpenAI API Key is missing. Please set it in Settings."
            return

        from openai import OpenAI
        try:
            client = OpenAI(api_key=self.api_key)
            formatted_messages = [{"role": "system", "content": system_prompt}]
            formatted_messages.extend(messages)

            stream = client.chat.completions.create(
                model=self.model,
                messages=formatted_messages, # type: ignore
                stream=True
            )

            for chunk in stream:
                content = chunk.choices[0].delta.content or ""
                if content:
                    yield content
        except Exception as e:
            yield f"Error executing OpenAI API stream: {str(e)}"

class MockProvider(AIProvider):
    """
    Offline local mock rules-engine provider.
    Outputs streaming tokens with delays to simulate actual LLM response times.
    """
    def generate_stream(self, system_prompt: str, messages: List[Dict[str, str]]) -> Generator[str, None, None]:
        last_message = messages[-1]["content"].lower() if messages else ""
        
        response_text = ""
        # Match keywords for realistic assistant simulations
        if "notepad" in last_message:
            response_text = (
                "Formulating execution plan to launch Notepad. "
                "Step 1: Check environment paths. Step 2: Spawn notepad.exe subprocess context. "
                "Please note: actual local tool execution is scheduled for implementation in Phase 5. "
                "Currently, local command execution is disabled in Phase 3."
            )
        elif "vs code" in last_message or "visual studio code" in last_message or "project" in last_message:
            response_text = (
                "Opening Visual Studio Code. I will locate your project workspace, inspect the file structure, "
                "and check for build status. Environment parameters look stable. No files will be modified."
            )
        elif "status" in last_message or "check" in last_message or "diagnostics" in last_message:
            response_text = (
                "Diagnostic run complete. CPU utilization is stable. "
                "GPU is active at 34%. RAM usage is 5.2 GB. Connection status is secure."
            )
        elif "stop" in last_message or "kill" in last_message:
            response_text = "🚨 EMERGENCY SHUTDOWN: Terminated all running agent processes and freed audio channels."
        elif "hello" in last_message or "hi" in last_message or "hey" in last_message:
            response_text = "Hello! I am JARVIS. I am active and ready to assist you. How can I control your PC today?"
        else:
            response_text = (
                "I am JARVIS, your private local AI computer assistant. "
                "I am standing by to run system commands, search files, or launch desktop programs safely."
            )
            
        # Yield word-by-word with a tiny delay to simulate network latency / generation
        words = response_text.split(" ")
        for i, word in enumerate(words):
            yield word + (" " if i < len(words) - 1 else "")
            time.sleep(0.06)

def get_llm_provider(provider_type: str = "mock", api_key: str = None, model: str = "llama3.1:8b") -> AIProvider:
    if provider_type == "openai":
        return OpenAIProvider(api_key=api_key, model=model)
    elif provider_type == "ollama":
        return OllamaProvider(model=model)
    else:
        return MockProvider()
