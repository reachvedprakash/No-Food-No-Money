import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Environment, GoogleMapOptions, GoogleMaps, MyLocation, GoogleMap, ILatLng, Spherical, Marker, GoogleMapsAnimation, GoogleMapsEvent, Circle } from '@ionic-native/google-maps';
import { firestore } from 'firebase/app';
import * as moment from 'moment';
import * as geofirex from 'geofirex';
import { get } from 'geofirex';
import * as firebaseApp from 'firebase/app';


@Component({
  selector: 'app-location-results',
  templateUrl: './location-results.page.html',
  styleUrls: ['./location-results.page.scss'],
})
export class LocationResultsPage implements OnInit {

  geo = geofirex.init(firebaseApp);
  map: GoogleMap;
  loading: any;
  radius = 2000;
  point:ILatLng ;
  points: ILatLng[] = [] ;
  oldPoints:any = [];
  activeIntlLangIndex:number = 0;
  isModalOpen:boolean = false;
  isLocModalOpen: boolean = false;
  timestamp:Date = new Date();
  needFoodLangs = ["खाना चाहिए","খাবার দরকার","ఆహారం కావాలి","अन्न आवश्यक आहे","உணவு தேவை","کھانے کی ضرورت ہے","ಆಹಾರ ಬೇಕು","ખોરાકની જરૂર છે","ଖାଦ୍ୟ ଦରକାର |","ഭക്ഷണം വേണം","ਭੋਜਨ ਚਾਹੀਦਾ ਹੈ","खाना चाहिन्छ","خوراڪ جي ضرورت آهي","Necesita comida","Besoin de nourriture","يحتاجون الى الغذاء","Ho bisogno di cibo","食べ物が必要","Нужна еда","Precisa de comida","需要食物","需要食物","Butuh makanan","Brauche Essen","음식이 필요하다","Cần thức ăn","Kos nodig","Keni nevojë për Ushqim","Trebate hranu","Potřebujete jídlo","Brug for mad","Voedsel nodig","Vaja toitu","გვჭირდება საკვები","Χρειάζεστε φαγητό","Pono i ka meaʻai","צריך אוכל","Szüksége van ételre","Bia de dhíth","indigebat cibis","Nepieciešams ēdiens","Reikia maisto","Хоол хүнс хэрэгтэй","نیاز به غذا","Требате храну","ต้องการอาหาร","Yiyecek Gerekiyor"];
  userMarkerUrl = {
    url: "assets/img/user-marker.png",
    scaledSize: {
      width: 30,
      height: 30
    }
  };
  needMarkerUrl = {
    url: "assets/img/need-marker.png",
    scaledSize: {
      width: 30,
      height: 30
    }
  }
  currentLng: any = 0;
  currentLat: any = 0;
  currentLoc:ILatLng = {
    lat:0,
    lng:0
  };
  todaysDate:string;


  constructor(
    private platform: Platform,
    private route: ActivatedRoute,
    private router: Router,
    ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        //this.choice = this.router.getCurrentNavigation().extras.state.choice;
        this.currentLoc = this.router.getCurrentNavigation().extras.state.currentLoc;
        this.todaysDate = this.router.getCurrentNavigation().extras.state.todaysDate;
      }
    });

    setInterval( () => this.setIntlActiveLang(), 2000 );
   }


   setIntlActiveLang(){
    if (this.activeIntlLangIndex == (this.needFoodLangs.length - 1)) {
      this.activeIntlLangIndex = 0;
    } else {
      this.activeIntlLangIndex++;
    }
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
  

  console.log(this.currentLoc);
  if(this.currentLoc && this.currentLoc.lat && this.currentLoc.lng){
      this.loadPoints();
  }

}

async getOldPoints(){
  this.oldPoints = [];
  const center = this.geo.point(this.currentLoc.lat, this.currentLoc.lng);
  const field = 'position';
  let oldDate = moment().subtract(1, 'days').toDate();
  let todaysDate = oldDate.getDate()+'-'+oldDate.getMonth()+'-'+oldDate.getFullYear();
  console.log(todaysDate);
  const firestoreRef =  firestore().collection('needHelp').doc(todaysDate).collection('users');


  firestoreRef.onSnapshot(docSnapshot => {
    console.log(`Received doc snapshot OLD: ${docSnapshot}`);
    docSnapshot.forEach( res => {
      console.log(res.data().position.geopoint);
      this.point  = { 
        lat: res.data().position.geopoint.latitude  ,
        lng: res.data().position.geopoint.longitude
      };

      console.log(this.point);
      let a = Spherical.computeDistanceBetween(this.currentLoc,this.point);
      if( a<= this.radius && this.point.lat !== this.currentLoc.lat && this.point.lng !== this.currentLoc.lng)
      {
        this.oldPoints.push(this.point);
        console.log("In Radius OLD : " + a);
        console.log(this.points);
        let marker: Marker = this.map.addMarkerSync({
          title: 'NEED FOOD!! ' + res.data().phone,
          snippet: 'Please Donate Some',
          position: this.point,
          animation: GoogleMapsAnimation.BOUNCE
        });
      }
    } )
  }, err => {
    console.log(`Encountered error: ${err}`);
  });

  // const geoPoints = this.geo.query(firestoreRef).within(center, this.radius, field);
  // const points = await get(geoPoints);
  // for (let index = 0; index < points.length; index++) {
  //   if(points[index].position.geopoint.latitude !== this.currentLat) {
  //     this.oldPoints.push(points[index]);
  //     console.log("In Radius Old : " );
  //       console.log(points[index]);
  //       this.point  = { 
  //               lat: points[index].position.geopoint.latitude  ,
  //               lng: points[index].position.geopoint.longitude
  //             };
  //       console.log(this.point);
  //       let marker: Marker = this.map.addMarkerSync({
  //         title: 'NEED FOOD!! ' + points[index].phone,
  //         snippet: 'Please Donate Some',
  //         position: this.point,
  //         animation: GoogleMapsAnimation.BOUNCE
  //       });
  //   }
  // }
  console.log(this.oldPoints);
}

async loadPoints(){
  this.points = [] ;
  const center = this.geo.point(this.currentLoc.lat, this.currentLoc.lng);
  const field = 'position';
  
  let todaysDate = this.timestamp.getDate()+'-'+this.timestamp.getMonth()+'-'+this.timestamp.getFullYear();
  console.log(todaysDate);
  const firestoreRef =  firestore().collection('needHelp').doc(todaysDate).collection('users');

  await firestoreRef.onSnapshot(docSnapshot => {
    console.log(`Received doc snapshot New: ${docSnapshot}`);
    docSnapshot.forEach( res => {
      console.log(res.data().position.geopoint);
      this.point  = { 
        lat: res.data().position.geopoint.latitude  ,
        lng: res.data().position.geopoint.longitude
      };

      console.log(this.point);
      let a = Spherical.computeDistanceBetween(this.currentLoc,this.point);
      if( a<= this.radius && this.point.lat !== this.currentLoc.lat && this.point.lng !== this.currentLoc.lng)
      {
        this.points.push(this.point);
        console.log("In Radius New: " + a);
        console.log(this.points);
        let marker: Marker = this.map.addMarkerSync({
          title: 'NEED FOOD!! ' + res.data().phone,
          snippet: 'Please Donate Some',
          position: this.point,
          animation: GoogleMapsAnimation.BOUNCE
        });
        
      }
    } )
  }, err => {
    console.log(`Encountered error: ${err}`);
  });
  // const geoPoints = this.geo.query(firestoreRef).within(center, this.radius, field);
  // geoPoints.subscribe((res: any) => {
  //   for (let index = 0; index < res.length; index++) {
  //     if(res[index].position.geopoint.latitude !== this.currentLat) {
  //       this.points.push(res[index]);
  //       console.log("In Radius NEW : " );
        
  //       this.point  = { 
  //         lat: res[index].position.geopoint.latitude  ,
  //         lng: res[index].position.geopoint.longitude
  //       };
  //       console.log(this.point);
  //       let marker: Marker = this.map.addMarkerSync({
  //         title: 'NEED FOOD!! ' + res[index].phone,
  //         snippet: 'Please Donate Some',
  //         position: this.point,
  //         animation: GoogleMapsAnimation.BOUNCE
  //       });
  //     }
  //   }
  // });
  console.log(this.points);
  
  await this.getOldPoints();
}


getTotalPoints(){
  let count = '';
  let total = this.points.length + this.oldPoints.length;
  if(total > 999){
    count = (total / 1000 ).toFixed(1) +'K';
  }
  else{
    count = total.toString();
  }
  return count;
}
onClickNavigate(lat, lng) {
  var url = 'http://www.google.com/maps/place/' + lat + ',' + lng;
  window.open(url, '_blank', 'location=yes');
}

closeModal(){
  this.isModalOpen = false;
}

openModal(){
  this.isModalOpen = true;
}

openLocationModal(){
  this.isLocModalOpen = true;
}

closeLocationModal(){
  this.isLocModalOpen = false;
}


 async loadMap() {

    try{
      Environment.setEnv({
        'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyD7qAe5k7PbdVi0hKDxrfSdaPrsUlM0Jm4',
        'API_KEY_FOR_BROWSER_DEBUG' : 'AIzaSyD7qAe5k7PbdVi0hKDxrfSdaPrsUlM0Jm4'
      });

      let mapOptions: GoogleMapOptions =  {
        camera: {
          target: this.currentLoc,
          zoom: 14,
          // tilt: 30
        },
      }
      this.map = GoogleMaps.create('map', mapOptions);


      let circle: Circle = this.map.addCircleSync({
        'center': this.currentLoc,
        'radius': this.radius,
        'strokeColor' : '#AA00FF',
        'strokeWidth': 5,
        'fillColor' : '#00880055'
      });


      this.map.animateCamera({
        target: this.currentLoc,
        zoom: 14,
        // tilt: 30
      });


      // let marker: Marker = this.map.addMarkerSync({
      //   title: '@ionic-native/google-maps plugin!',
      //   snippet: 'This plugin is awesome!',
      //   position: this.currentLoc,
      //   icon: 'blue',
      //   animation: GoogleMapsAnimation.BOUNCE
      // });

      // marker.showInfoWindow();
    } catch(error) {
       alert("Map Error .. " + error);
    }
  }

}
