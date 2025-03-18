import { Component } from '@angular/core';
import { faCoffee, faFolder, faUser, faChartBar, faCog } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Case Management';
  
  // Font Awesome icons
  faCoffee = faCoffee;
  faFolder = faFolder;
  faUser = faUser;
  faChartBar = faChartBar;
  faCog = faCog;
}
