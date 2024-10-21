import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api";

interface ChatResponse {
  emotion: "joy" | "sadness" | "anger" | "fear" | "neutral";
  response: string;
  chat_id: string;
  emotion_scores?: any;
}

// Define types for Web Speech API
interface IWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

type SpeechRecognition = {
  continuous: boolean;
  lang: string;
  onstart: () => void;
  onend: () => void;
  onresult: (event: any) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionErrorEvent = {
  error: string;
  message: string;
};

class ApiService {
  private static instance: ApiService;
  private recognition: SpeechRecognition | null = null;
  public isRecording = false;
  private recognitionAttempts = 0;
  private readonly MAX_ATTEMPTS = 3;
  private speechResultCallback: ((transcript: string) => void) | null = null;

  private constructor() {
    this.initializeSpeechRecognition();
    this.initializeVoices();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public async sendMessage(
    message: string,
    chatId?: string
  ): Promise<ChatResponse> {
    try {
      const response = await axios.post<ChatResponse>(`${API_BASE_URL}/chat`, {
        message,
        chat_id: chatId,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw this.handleApiError(error);
    }
  }

  public async getChatMessages(chatId: string): Promise<
    Array<{
      emotion_score: any;
      user_input: string;
      bot_response: string;
      emotion: string;
      timestamp: string;
    }>
  > {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/chat/${chatId}/messages`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting chat messages:", error);
      throw this.handleApiError(error);
    }
  }

  public async getChats(): Promise<
    Array<{ id: string; last_updated: string }>
  > {
    try {
      const response = await axios.get(`${API_BASE_URL}/chats`);
      return response.data;
    } catch (error) {
      console.error("Error getting chats:", error);
      throw this.handleApiError(error);
    }
  }

  public async deleteChat(chatId: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/chat/${chatId}`);
    } catch (error) {
      console.error("Error deleting chat:", error);
      throw this.handleApiError(error);
    }
  }

  private handleApiError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return new Error(
          `Server error: ${error.response.status} - ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else if (error.request) {
        return new Error(
          "No response received from server. Please check your internet connection."
        );
      }
    }
    return new Error("An unexpected error occurred. Please try again later.");
  }

  public initializeSpeechRecognition(): void {
    const windowWithSpeech = window as IWindow;
    const SpeechRecognition =
      windowWithSpeech.SpeechRecognition ||
      windowWithSpeech.webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.lang = "en-US";

      this.recognition.onstart = () => {
        this.isRecording = true;
        this.updateMicButtonState();
      };

      this.recognition.onend = () => {
        this.isRecording = false;
        this.updateMicButtonState();
      };

      this.recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");

        if (event.results[0].isFinal) {
          this.handleSpeechResult(transcript);
        }
      };

      this.recognition.onerror = this.handleRecognitionError.bind(this);
    } else {
      console.log("Speech recognition not supported");
      this.disableSpeechRecognition();
    }
  }

  private handleRecognitionError(event: SpeechRecognitionErrorEvent): void {
    console.error("Speech recognition error:", event.error);
    this.isRecording = false;
    this.updateMicButtonState();

    if (
      event.error === "network" &&
      this.recognitionAttempts < this.MAX_ATTEMPTS
    ) {
      this.recognitionAttempts++;
      console.log(
        `Retrying speech recognition (attempt ${this.recognitionAttempts})...`
      );
      setTimeout(() => {
        this.startListening();
      }, 1000);
    } else {
      this.disableSpeechRecognition();
    }
  }

  public startListening(): void {
    if (this.recognition && !this.isRecording) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        this.disableSpeechRecognition();
      }
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
      this.updateMicButtonState();
    }
  }

  private updateMicButtonState(): void {
    const micButton = document.getElementById("mic-button");
    if (micButton) {
      if (this.isRecording) {
        micButton.classList.add("recording");
        micButton.textContent = "🔴";
      } else {
        micButton.classList.remove("recording");
        micButton.textContent = "🎤";
      }
    }
  }

  private disableSpeechRecognition(): void {
    const micButton = document.getElementById(
      "mic-button"
    ) as HTMLButtonElement;
    if (micButton) {
      micButton.disabled = true;
      micButton.style.opacity = "0.5";
      micButton.title = "Speech recognition unavailable";
    }

    alert(
      "Speech recognition is currently unavailable. Please type your message instead."
    );
  }

  private handleFinalTranscript(transcript: string): void {
    const userInput = document.getElementById("user-input") as HTMLInputElement;
    if (userInput) {
      userInput.value = transcript;
    }
  }

  public speakAIResponse(text: string, onSpeechEnd: () => void): void {
    // Remove emojis from the text
    const textWithoutEmojis = text.replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu,
      ""
    );

    const speech = new SpeechSynthesisUtterance(textWithoutEmojis);

    // Get available voices
    const voices = window.speechSynthesis.getVoices();

    // Select a voice (preferably a female English voice)
    const selectedVoice =
      voices.find(
        (voice) => voice.lang.includes("en") && voice.name.includes("Female")
      ) ||
      voices.find((voice) => voice.lang.includes("en")) ||
      voices[0];

    speech.voice = selectedVoice;
    speech.lang = "en-US";
    speech.rate = 1.1; // Slightly faster than default
    speech.pitch = 1.0; // Normal pitch
    speech.volume = 1.0; // Full volume

    const aiSpeakingIndicator = document.querySelector(
      ".ai-speaking-indicator"
    );

    speech.onstart = () => {
      aiSpeakingIndicator?.classList.remove("hidden");
    };

    speech.onend = () => {
      aiSpeakingIndicator?.classList.add("hidden");
      onSpeechEnd();
    };

    window.speechSynthesis.speak(speech);
  }

  public stopSpeech(): void {
    window.speechSynthesis.cancel();
    document.querySelector(".ai-speaking-indicator")?.classList.add("hidden");
  }

  public setSpeechResultCallback(callback: (transcript: string) => void): void {
    this.speechResultCallback = callback;
  }

  public removeSpeechResultCallback(): void {
    this.speechResultCallback = null;
  }

  private handleSpeechResult(transcript: string): void {
    if (this.speechResultCallback) {
      this.speechResultCallback(transcript);
    }
  }

  private initializeVoices(): Promise<void> {
    return new Promise((resolve) => {
      if (speechSynthesis.getVoices().length) {
        resolve();
      } else {
        speechSynthesis.onvoiceschanged = () => {
          resolve();
        };
      }
    });
  }
}

export default ApiService.getInstance();
