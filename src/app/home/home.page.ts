import { Component } from '@angular/core';
import {
  ToastController,
  Platform,
  LoadingController
} from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
  GoogleMapOptions
} from '@ionic-native/google-maps';
import { Environment } from '@ionic-native/google-maps/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router,NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';
import { MainService } from '../main.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map: GoogleMap;
  loading: any;


  geo:any = geofirex.init(firebaseApp);

  timestamp:Date = new Date();
  userId:string;
  isModalOpen = true;
  position:any;
  currentLoc:any;
  phoneNo:number;
  activeIndianLangIndex:number = 0;
  activeIntlLangIndex:number = 0;
  indianNeedLangs:Array<string> = ['मुझे भोजन की जरूरत है','আমার খাদ্য দরকার','నాకు ఆహారం కావాలి','मला अन्नाची गरज आहे','எனக்கு உணவு தேவை','مجھے کھانے کی ضرورت ہے','ನನಗೆ ಆಹಾರ ಬೇಕು','મને ખોરાકની જરૂર છે','ମୋର ଖାଦ୍ୟ ଦରକାର','എനിക്ക് ഭക്ഷണം വേണം','ਮੈਨੂੰ ਭੋਜਨ ਚਾਹੀਦਾ ਹੈ','मलाई खाना चाहियो','مون کي خوراڪ گهرجي'];
  intlNeedLangs:Array<string> = ["necesito comida","j'ai besoin de nourriture","احتاج طعاما","ho bisogno di cibo","食べたい","я нуждаются в пище","Eu preciso de comida","我需要食物","我需要食物","saya membutuhkan makanan","Ich brauche Nahrung","나는 음식이 필요해","tôi cần thức ăn","Ek het kos nodig","kam nevojë për ushqim","ja trebam hranu","potřebuji jídlo","jeg har brug for mad","ik heb eten nodig","ma vajan toitu","მე მჭირდება საჭმელი","χρειάζομαι φαγητό","pono au i ka meaʻai","אני צריך אוכל","kajára van szükségem","teastaíonn bia uaim","ego cibo opus","Man vajag ēdienu","man reikia maisto","надад хоол хэрэгтэй байна","من به غذا احتیاج دارم","Треба ми храна","ฉันต้องการอาหาร","yiyeceğe ihtiyacım var"];
  indianHelpLanguages:Array<string> = ["मैं मदद कर सकता हूँ","আমি সাহায্য করতে পারি","నేను సహాయం చేయగలను","मी मदद करू शकतो","என்னால் உதவ முடியும்","میں مدد کر سکتا ہوں","ನಾನು ಸಹಾಯ ಮಾಡಬಹುದು","હું મદદ કરી શકું છું","ମୁଁ ସାହାଯ୍ୟ କରିପାରିବି","എനിക്ക് സഹായിക്കാനാകും","ਮੈਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ","म सहयोग गर्न सक्छु","مان مدد ڪري سگهان ٿو"];
  intlHelpLangauges:Array<string> = ["puedo ayudar","je peux aider","يمكنني المساعدة","posso aiutare","私は助けることができる","я могу помочь","eu posso ajudar","我可以搭把手","我可以搭把手","saya dapat membantu","ich kann helfen","내가 도움이 될 수 있습니다","tôi có thể giúp","ek kan help","mund te ndihmoj","ja mogu pomoći","můžu pomoct","jeg kan hjælpe","ik kan helpen","Ma võin aidata","მე შემიძლია დახმარება","μπορώ να βοηθήσω","Hiki iaʻu ke kōkua","אני יכול לעזור","tudok segíteni","Is féidir liom cabhrú","ego potest auxilium","ES varu palīdzēt","aš galiu padėti","би тусалж чадна","من می توانم کمک کنم","ја могу помоћи","ฉันสามารถช่วยได้","yardım edebilirim"];
  fcmToken : String = "";

  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private afs: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private route: Router,
    private http: HttpClient,
    private main: MainService
    ) {
      setInterval( () => this.setIndianActiveLang(), 3000 );
      setInterval( () => this.setIntlActiveLang(), 2000 );
    }

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
    const lat = JSON.parse(localStorage.getItem('lat'));
    const lng = JSON.parse(localStorage.getItem('lng'));
    if(lat && lng){
      // this.position = {lat:lat,lng:lng};
      this.position = this.geo.point(lat, lng);
      this.currentLoc = {lat:lat,lng:lng};
    }
  }

  async loadMap() {

    try{
      Environment.setEnv({
        'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyD7qAe5k7PbdVi0hKDxrfSdaPrsUlM0Jm4',
        'API_KEY_FOR_BROWSER_DEBUG' : 'AIzaSyD7qAe5k7PbdVi0hKDxrfSdaPrsUlM0Jm4'
      });

      let mapOptions: GoogleMapOptions =  {
        controls: {
          'compass': true,
          'myLocationButton': true,
          'myLocation': true,   // (blue dot)
          'indoorPicker': true,
          'zoom': true,          // android only
          'mapToolbar': true     // android only
        },
        camera: {
          target: {
            lat: 43.0741704,
            lng: -89.3809802
          },
          zoom: 10,
          // tilt: 30
        }
      }
      this.map = GoogleMaps.create('map_canvas', mapOptions);
    } catch(error) {
       alert("Map Error .. " + error);
    }
    this.map.clear();
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
   await this.map.getMyLocation().then((location: MyLocation) => {
    this.loading.dismiss();
      console.log(JSON.stringify(location, null ,2));
      this.currentLoc = {lat:location.latLng.lat,lng:location.latLng.lng};
      console.log(this.currentLoc);
      this.position = this.geo.point(location.latLng.lat, location.latLng.lng);

    })
    .catch(err => {
      this.showToast(err.error_message);
    });
  }

  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });

    toast.present();
  }


  setIndianActiveLang(){
    if (this.activeIndianLangIndex == (this.indianNeedLangs.length - 1)) {
      this.activeIndianLangIndex = 0;
    } else {
      this.activeIndianLangIndex++;
    }
   
  }

  setIntlActiveLang(){
    if (this.activeIntlLangIndex == (this.intlNeedLangs.length - 1)) {
      this.activeIntlLangIndex = 0;
    } else {
      this.activeIntlLangIndex++;
    }
  }


  closeModal(){
    this.isModalOpen = false;
  }

  openModal(){
    this.isModalOpen = true;
  }


  async goToResults(choice) {
    console.log(this.position);
    // await this.main.getToken();
    // console.log("TokenRecieved");
    if(this.position && (choice != 'need' || choice === 'need' && this.phoneNo)){

      let todaysDate = this.timestamp.getDate()+'-'+this.timestamp.getMonth()+'-'+this.timestamp.getFullYear();
      let oldDate = moment().subtract(1, 'days').toDate();
      let oldDateKey = oldDate.getDate()+'-'+oldDate.getMonth()+'-'+oldDate.getFullYear();
    
      const navigationExtras: NavigationExtras = {
          state: {
            currentLoc:this.currentLoc,
            todaysDate:todaysDate
          }
        }

          if (choice === 'help' && this.position ) { 
            this.main.willingToHelp( this.position );
            this.route.navigate(['/location-results'], navigationExtras)
          }
          if (choice === 'need' && this.position) {
            this.main.needHelp(this.position, this.phoneNo);
            this.route.navigate(['/thank']);
          }
      }
      else{
        console.log("error");
       this.openModal();
      }
  }




}
