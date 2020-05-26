import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

// Material theme components
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';

import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TorrentsTableComponent } from './torrents-table/torrents-table.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { environment } from 'src/environments/environment';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressBarModule } from "angular-progress-bar"
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddTorrentDialogComponent } from './modals/add-torrent-dialog/add-torrent-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { DeleteTorrentDialogComponent } from './modals/delete-torrent-dialog/delete-torrent-dialog.component'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SearchTorrentsComponent } from './home/search-torrents/search-torrents.component';
import { MatCardModule } from '@angular/material/card';
import { GlobalTransferInfoComponent } from './torrents-table/global-transfer-info/global-transfer-info.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTreeModule } from '@angular/material/tree';
import { MatRippleModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BulkUpdateTorrentsComponent } from './torrents-table/bulk-update-torrents/bulk-update-torrents.component';
import { TorrentInfoDialogComponent } from './modals/torrent-info-dialog/torrent-info-dialog.component';
import { FileSystemDialogComponent } from './modals/file-system-dialog/file-system-dialog.component';
import { FileSystemTreeExplorerComponent } from './file-system-tree-explorer/file-system-tree-explorer.component';
import { MoveTorrentsDialogComponent } from './modals/move-torrents-dialog/move-torrents-dialog.component';
import { SettingsComponent } from './modals/settings/settings.component';
import { WebUiSettingsComponent } from './modals/settings/web-ui-settings/web-ui-settings.component';
import { DownloadSettingsComponent } from './modals/settings/download-settings/download-settings.component';
import { SpeedSettingsComponent } from './modals/settings/speed-settings/speed-settings.component';
import { AboutSettingsComponent } from './modals/settings/about-settings/about-settings.component';

var appRoutes: Routes;

// Login page is only needed during development/testing
if(!environment.production){
  appRoutes = [
    { path: '', component: LoginComponent},
    { path: 'home', component: HomeComponent}
  ]
} else {
  appRoutes = [
    { path: '', component: HomeComponent}
  ]
}

@NgModule({
  declarations: [
    AppComponent,
    TorrentsTableComponent,
    LoginComponent,
    HomeComponent,
    AddTorrentDialogComponent,
    DeleteTorrentDialogComponent,
    SearchTorrentsComponent,
    GlobalTransferInfoComponent,
    BulkUpdateTorrentsComponent,
    TorrentInfoDialogComponent,
    FileSystemDialogComponent,
    FileSystemTreeExplorerComponent,
    MoveTorrentsDialogComponent,
    SettingsComponent,
    WebUiSettingsComponent,
    DownloadSettingsComponent,
    SpeedSettingsComponent,
    AboutSettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatButtonModule,
    ProgressBarModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTabsModule,
    MatChipsModule,
    MatSidenavModule,
    MatListModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatBadgeModule,
    MatTreeModule,
    MatRippleModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
