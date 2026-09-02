import os
import io
from abc import ABC, abstractmethod
import speech_recognition as sr

class STTProvider(ABC):
    @abstractmethod
    def transcribe(self, audio_bytes: bytes) -> str:
        """Transcribe audio bytes to text string."""
        pass

class LocalGoogleSTTProvider(STTProvider):
    """
    Offline/free Speech-to-Text using python's speech_recognition.
    Under the hood it uses Google's web speech API protocol which does not require an API key.
    """
    def transcribe(self, audio_bytes: bytes) -> str:
        recognizer = sr.Recognizer()
        
        # Audio bytes are uploaded as standard WebM/WAV from browser.
        # We read them using io.BytesIO and load into speech_recognition AudioFile.
        audio_file = io.BytesIO(audio_bytes)
        try:
            with sr.AudioFile(audio_file) as source:
                audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            return text
        except sr.UnknownValueError:
            return ""
        except sr.RequestError as e:
            raise RuntimeError(f"Speech recognition service request error: {e}")
        except Exception as e:
            raise RuntimeError(f"Failed to process audio structure: {e}")

class OpenAISTTProvider(STTProvider):
    """
    Cloud Speech-to-Text using OpenAI Whisper API.
    """
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")

    def transcribe(self, audio_bytes: bytes) -> str:
        if not self.api_key:
            raise ValueError("OpenAI API Key is required for OpenAI Whisper STT.")
        
        # For OpenAI Whisper, we can use the requests library or the openai client library.
        # Since we want to keep dependencies lightweight, we can use requests directly.
        import requests
        
        url = "https://api.openai.com/v1/audio/transcriptions"
        headers = {
            "Authorization": f"Bearer {self.api_key}"
        }
        files = {
            "file": ("audio.wav", audio_bytes, "audio/wav"),
            "model": (None, "whisper-1")
        }
        
        response = requests.post(url, headers=headers, files=files)
        if response.status_code != 200:
            raise RuntimeError(f"OpenAI transcription failed: {response.text}")
            
        return response.json().get("text", "")

def get_stt_provider(provider_type: str = "local", api_key: str = None) -> STTProvider:
    if provider_type == "openai":
        return OpenAISTTProvider(api_key=api_key)
    else:
        return LocalGoogleSTTProvider()
