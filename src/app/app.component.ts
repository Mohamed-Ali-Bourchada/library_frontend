import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet],  // Add RouterModule here

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Note the typo correction from 'styleUrl' to 'styleUrls'
})
export class AppComponent {
  title = 'library_frontend';
}
