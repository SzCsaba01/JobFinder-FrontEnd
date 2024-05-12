import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorMessageComponent } from './shared-components/error-message/error-message.component';
import { LoaderComponent } from './shared-components/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ErrorMessageComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'JobFinder-FrontEnd';
}
