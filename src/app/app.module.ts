import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module'

// Components
import { AppComponent } from './app.component'
import { HeaderComponent } from './shared/components/header/header.component'
import { SidebarComponent } from './shared/components/sidebar/sidebar.component'
import { FooterComponent } from './shared/components/footer/footer.component'
import { HomeComponent } from './modules/pages/home/home.component'
import { TasksModule } from './tasks/tasks.module'

@NgModule({
  declarations: [AppComponent, HeaderComponent, SidebarComponent, FooterComponent, HomeComponent],
  imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, TasksModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
