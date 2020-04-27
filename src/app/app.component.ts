import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { FCM } from "@ionic-native/fcm/ngx";
import { MainService } from "./main.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public fcm: FCM,
    public main: MainService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async (res) => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.platform.is("android") || this.platform.is("ios")) {
        console.log("InSide Platform");
        await this.main.getToken();
        this.main.RefreshToken();

        this.fcm.onNotification().subscribe((data) => {
          if (data.wasTapped) {
            console.log("Received in background");
          } else {
            console.log("Received in foreground");
          }
        });
      }
    });
  }
}
