import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopComponent } from './shop/shop.component';
import { LoginComponent } from './login/login.component';
import { GameInfoComponent } from './gameInfo/gameInfo.component';
import { RegisterComponent } from './register/register.component';
import { BibComponent } from './bib/bib.component';
import { FriendsComponent } from './friends/friends.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {path: '', component: ShopComponent},
  {path: 'home', component: ShopComponent},
  {path: 'shop', component: ShopComponent, canActivate:[AuthGuard]},
  {path: 'gameInfo', component: GameInfoComponent},
  {path: 'login', component:LoginComponent},
  {path: 'loginAfterReg', component:LoginComponent, canActivate:[AuthGuard]},
  {path: 'registieren', component: RegisterComponent},
  {path: 'bibliothek', component: BibComponent},
  {path: 'freunde', component: FriendsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
