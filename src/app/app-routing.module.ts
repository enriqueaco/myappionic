import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule) },
  {
    path: 'lists',
    loadChildren: () => import('./pages/lists/lists.module').then(m => m.ListsPageModule)
  },
  {
    path: 'playlist',
    loadChildren: () => import('./pages/playlist/playlist.module').then(m => m.PlaylistPageModule)
  },
  {
    path: 'play-song',
    loadChildren: () => import('./pages/play-song/play-song.module').then(m => m.PlaySongPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactPageModule)
  },
  {
    path: 'about-us',
    loadChildren: () => import('./pages/about-us/about-us.module').then(m => m.AboutUsPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then(m => m.SearchPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  {
    path: 'preload',
    loadChildren: () => import('./pages/preload/preload.module').then(m => m.PreloadPageModule)
  },
  {
    path: 'plan',
    loadChildren: () => import('./pages/plan/plan.module').then(m => m.PlanPageModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./pages/history/history.module').then(m => m.HistoryPageModule)
  },
  {
    path: 'own-lists',
    loadChildren: () => import('./pages/own-lists/own-lists.module').then(m => m.OwnListsPageModule)
  },
  {
    path: 'downloads',
    loadChildren: () => import('./pages/downloads/downloads.module').then(m => m.DownloadsPageModule)
  },
  {
    path: 'music-sheet',
    loadChildren: () => import('./pages/music-sheet/music-sheet.module').then(m => m.MusicSheetPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'confirm-email',
    loadChildren: () => import('./pages/confirm-email/confirm-email.module').then(m => m.ConfirmEmailPageModule)
  },
  {
    path: 'add-ownlist',
    loadChildren: () => import('./pages/add-ownlist/add-ownlist.module').then(m => m.AddOwnlistPageModule)
  },
  {
    path: 'add-songs/:id',
    loadChildren: () => import('./pages/add-songs/add-songs.module').then(m => m.AddSongsPageModule)
  },  {
    path: 'buy-plan',
    loadChildren: () => import('./pages/buy-plan/buy-plan.module').then( m => m.BuyPlanPageModule)
  },
  {
    path: 'gift-request',
    loadChildren: () => import('./pages/gift-request/gift-request.module').then( m => m.GiftRequestPageModule)
  },
  {
    path: 'gift-pay',
    loadChildren: () => import('./pages/gift-pay/gift-pay.module').then( m => m.GiftPayPageModule)
  },
  {
    path: 'gift-confirm',
    loadChildren: () => import('./pages/gift-confirm/gift-confirm.module').then( m => m.GiftConfirmPageModule)
  },
  {
    path: 'preload-list',
    loadChildren: () => import('./pages/preload-list/preload-list.module').then( m => m.PreloadListPageModule)
  },
  {
    path: 'preload-song',
    loadChildren: () => import('./pages/preload-song/preload-song.module').then( m => m.PreloadSongPageModule)
  },
  {
    path: 'upgrade-plan',
    loadChildren: () => import('./pages/upgrade-plan/upgrade-plan.module').then( m => m.UpgradePlanPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
