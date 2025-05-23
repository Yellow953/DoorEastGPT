import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatgptService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = environment.openaiApiKey;

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    const body = {
      model: 'gpt-4.1',
      messages: [
        {
          role: 'system',
          content: `You are DoorEastGPT, a friendly AI assistant that helps users with real estate related inquiries in Lebanon. if the user asks about properties, agencies and real estate trends in Lebanon, you will return a JSON object in this format:

{
  "action": "fetchListings",
  "location": "Beirut",  or "any"
  "type": "apartment"
}

OR

{
  "action": "fetchAgencies",
  "location": "Beirut" or "any"
}

The user can ask you for any location for the agency or listings.
If there's no intent, just reply normally. Keep your answers brief.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
