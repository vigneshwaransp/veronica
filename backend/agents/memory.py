from typing import List, Dict

class ConversationMemory:
    """
    Session memory class tracking conversation logs.
    Keep context window bounded to prevent infinite token accumulation.
    """
    def __init__(self, limit: int = 20):
        self.limit = limit
        self.messages: List[Dict[str, str]] = []

    def add_user_message(self, text: str):
        self.messages.append({"role": "user", "content": text})
        self._truncate()

    def add_assistant_message(self, text: str):
        self.messages.append({"role": "assistant", "content": text})
        self._truncate()

    def get_history(self) -> List[Dict[str, str]]:
        return self.messages

    def clear(self):
        self.messages = []

    def _truncate(self):
        # Keep within the limit of last N turns to conserve context window
        if len(self.messages) > self.limit:
            self.messages = self.messages[-self.limit:]

# Global session memory dictionary keyed by session ID (defaulting to single session for local assistant)
sessions: Dict[str, ConversationMemory] = {}

def get_session_memory(session_id: str = "default") -> ConversationMemory:
    if session_id not in sessions:
        sessions[session_id] = ConversationMemory()
    return sessions[session_id]
