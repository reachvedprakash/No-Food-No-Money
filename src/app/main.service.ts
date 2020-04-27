import { Injectable } from "@angular/core";
import { FCM } from "@ionic-native/fcm/ngx";
import * as moment from 'moment';
import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';


@Injectable({
  providedIn: "root",
})
export class MainService {

  timestamp:Date = new Date();
  fcmToken : string;
  todaysDate = this.timestamp.getDate()+'-'+this.timestamp.getMonth()+'-'+this.timestamp.getFullYear();
  oldDate = moment().subtract(1, 'days').toDate();
  oldDateKey = this.oldDate.getDate()+'-'+this.oldDate.getMonth()+'-'+this.oldDate.getFullYear();
  geo:any = geofirex.init(firebaseApp);
  position:any;
  currentLoc:any;
  userId: string;
  phoneNo: any;

  constructor(
    private fcm: FCM,
    private afs: AngularFirestore,
    private platform: Platform,
    private fireAuth: AngularFireAuth,
    ) {
    this.Login();
  }


  async Login() {
    await this.platform.ready();
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        if(user.uid){
           this.userId = user.uid;
        }
      } else {
        this.signIn();
      }
    });
  }


  signIn() {
    this.fireAuth.auth.signInAnonymously();
  }

  async getToken() {
    await this.fcm.getToken().then((token) => {
      this.fcmToken = token;
      console.log(token);
    });
    console.log(this.fcmToken);
    return this.fcmToken;
  }


  RefreshToken() {
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log(token);
    });
  }


  subscribe() {
    this.fcm.subscribeToTopic('marketing');
  }


  unsubcribe() {
    this.fcm.unsubscribeFromTopic('marketing');
  }


  willingToHelp(position : any  ) {
    this.position = position;

    this.afs.collection('help').doc(this.todaysDate).collection('users').doc(this.userId).set({position: this.position, timestamp: this.timestamp, fcm: this.fcmToken}).then(
      res => {
        console.log(res);
      }
    );
  }

  needHelp( position : any , phone : any ) {
    this.phoneNo = phone;
    this.position = position;
    this.afs.collection('needHelp').doc(this.todaysDate).collection('users').doc(this.userId).set({position: this.position, timestamp: this.timestamp, phone:this.phoneNo});
    this.afs.collection('needHelp').doc(this.oldDateKey).collection('users').doc(this.userId).delete();

  }






}
