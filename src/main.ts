import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // Import your defined routes
import { ConfigService } from './app/config.service';

// Initialize the ConfigService with the base URL
const configService = new ConfigService();
configService.setBaseUrl('http://localhost:8081'); // Set your Spring Boot API base URL

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Provide the HTTP client
    provideRouter(routes), // Provide the router with defined routes
    { provide: ConfigService, useValue: configService }, // Provide your ConfigService
  ],
}).catch((err) => console.error(err));
