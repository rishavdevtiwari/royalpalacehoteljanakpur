
import { useMutation, useQuery } from '@tanstack/react-query';

// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Contact form data interface
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Send contact form
export const useSendContactForm = () => {
  return useMutation({
    mutationFn: async (contactData: ContactFormData): Promise<{ message: string; contactId: string }> => {
      console.log('Sending contact form to:', `${API_URL}/contact`);
      
      try {
        const response = await fetch(`${API_URL}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contactData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Contact form submission failed:', errorData);
          throw new Error(errorData.message || 'Failed to send contact form');
        }
        
        const result = await response.json();
        console.log('Contact form submission successful:', result);
        return result;
      } catch (error) {
        console.error('Contact form submission error:', error);
        throw error;
      }
    }
  });
};

// Get all contact messages (admin only)
export const useGetContactMessages = () => {
  return useQuery({
    queryKey: ['contactMessages'],
    queryFn: async (): Promise<any[]> => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      try {
        const response = await fetch(`${API_URL}/contact`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Fetching contact messages failed:', errorData);
          throw new Error(errorData.message || 'Failed to fetch contact messages');
        }
        
        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Error fetching contact messages:', error);
        throw error;
      }
    },
    enabled: !!localStorage.getItem('token'), // Only run if user is logged in
  });
};
