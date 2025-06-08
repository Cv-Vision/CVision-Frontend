import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ChatbotResponse {
  message: string;
  isQuestion: boolean;
  isComplete: boolean;
}

export const chatbotService = {
  async startConversation(): Promise<ChatbotResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/chatbot/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw error;
    }
  },

  async sendMessage(message: string): Promise<ChatbotResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/chatbot/message`, { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async submitEvaluation(answers: string[]): Promise<{ score: number; analysis: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/chatbot/evaluate`, { answers });
      return response.data;
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      throw error;
    }
  }
}; 