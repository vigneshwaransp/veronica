import os
import tempfile
import asyncio
from abc import ABC, abstractmethod

class TTSProvider(ABC):
    @abstractmethod
    def speak(self, text: str) -> bytes:
        """Synthesize text to speech audio bytes (mp3 or wav)."""
        pass

class WindowsTTSProvider(TTSProvider):
    """
    Offline local Windows TTS using SAPI5 via pyttsx3.
    Requires no internet connection.
    """
    def speak(self, text: str) -> bytes:
        # We import pyttsx3 here to avoid loading comtypes on initialization if unused
        import pyttsx3
        
        # Create a temporary file path
        fd, temp_path = tempfile.mkstemp(suffix=".wav")
        os.close(fd)
        
        try:
            # SAPI5 requires single-threaded COM initialization.
            # pyttsx3 handles this, but saving to file must be run and block.
            engine = pyttsx3.init()
            engine.save_to_file(text, temp_path)
            engine.runAndWait()
            
            # Read the temporary file back
            with open(temp_path, "rb") as f:
                audio_bytes = f.read()
                
            return audio_bytes
        finally:
            # Clean up the temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)

class EdgeTTSProvider(TTSProvider):
    """
    Local neural TTS using Microsoft Edge Translation endpoint.
    Free, requires internet access, and generates highly realistic voices.
    """
    def __init__(self, voice: str = "en-US-GuyNeural"):
        self.voice = voice

    def speak(self, text: str) -> bytes:
        import edge_tts
        
        # edge-tts is asynchronous, so we must run it in an event loop
        async def generate():
            communicate = edge_tts.Communicate(text, self.voice)
            fd, temp_path = tempfile.mkstemp(suffix=".mp3")
            os.close(fd)
            try:
                await communicate.save(temp_path)
                with open(temp_path, "rb") as f:
                    return f.read()
            finally:
                if os.path.exists(temp_path):
                    os.remove(temp_path)
        
        # Run async function in sync wrapper
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
        if loop.is_running():
            # If the current thread already has a running event loop (e.g. under uvicorn),
            # we can run the coroutine using asyncio.run_coroutine_threadsafe or nest it.
            # edge-tts provides its own async communicate loops.
            # Let's run it using a clean thread pool or an event loop wrapper.
            # To avoid nested loop exceptions, we can run it in a separate thread.
            from concurrent.futures import ThreadPoolExecutor
            with ThreadPoolExecutor() as executor:
                future = executor.submit(lambda: asyncio.run(generate()))
                return future.result()
        else:
            return loop.run_until_complete(generate())

class OpenAITTSProvider(TTSProvider):
    """
    Cloud TTS using OpenAI's Audio API.
    """
    def __init__(self, api_key: str = None, voice: str = "alloy"):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.voice = voice

    def speak(self, text: str) -> bytes:
        if not self.api_key:
            raise ValueError("OpenAI API Key is required for OpenAI TTS.")
            
        import requests
        
        url = "https://api.openai.com/v1/audio/speech"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        data = {
            "model": "tts-1",
            "input": text,
            "voice": self.voice
        }
        
        response = requests.post(url, headers=headers, json=data)
        if response.status_code != 200:
            raise RuntimeError(f"OpenAI TTS synthesis failed: {response.text}")
            
        return response.content

def get_tts_provider(provider_type: str = "edge", api_key: str = None, voice: str = "en-US-GuyNeural") -> TTSProvider:
    if provider_type == "openai":
        return OpenAITTSProvider(api_key=api_key, voice=voice)
    elif provider_type == "windows":
        return WindowsTTSProvider()
    else:
        return EdgeTTSProvider(voice=voice)
