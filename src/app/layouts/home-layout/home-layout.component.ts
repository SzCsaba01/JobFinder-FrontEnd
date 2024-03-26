import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from '../../shared-components/navigation-bar/navigation-bar.component';


@Component({
    selector: 'app-home-layout',
    standalone: true,
    templateUrl: './home-layout.component.html',
    styleUrl: './home-layout.component.scss',
    imports: [RouterOutlet, NavigationBarComponent]
})
export class HomeLayoutComponent {

}
