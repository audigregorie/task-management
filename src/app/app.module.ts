import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { TableModule } from 'primeng/table'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HeaderComponent } from './shared/components/header/header.component'
import { SidebarComponent } from './shared/components/sidebar/sidebar.component'
import { FooterComponent } from './shared/components/footer/footer.component'
import { HomeComponent } from './modules/pages/home/home.component'
import { ManageTasksComponent } from './modules/tasks/manage-tasks/manage-tasks.component'
import { TaskListComponent } from './modules/tasks/task-list/task-list.component'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    HomeComponent,
    ManageTasksComponent,
    TaskListComponent,
  ],
  imports: [BrowserModule, TableModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
