import { AppRoutingModule } from './app-routing.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'

// Components
import { AppComponent } from './app.component'
import { FooterComponent } from './shared/components/footer/footer.component'
import { HeaderComponent } from './shared/components/header/header.component'
import { HomeComponent } from './modules/pages/home/home.component'
import { SidebarComponent } from './shared/components/sidebar/sidebar.component'
import { TasksModule } from './tasks/tasks.module'

@NgModule({
  declarations: [AppComponent, HeaderComponent, SidebarComponent, FooterComponent, HomeComponent],
  imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, TasksModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
