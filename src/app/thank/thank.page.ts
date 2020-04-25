import { Component, OnInit } from '@angular/core';
import * as firebaseApp from 'firebase/app';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-thank',
  templateUrl: './thank.page.html',
  styleUrls: ['./thank.page.scss'],
})
export class ThankPage implements OnInit {

  timestamp:Date = new Date();
  userId:string;
  isModalOpen = false;
  position:any;
  currentLoc:any;
  activeIndianLangIndex:number = 0;
  activeIntlLangIndex:number = 0;
  indianNeedLangs:Array<string> = ['मुझे भोजन की जरूरत है','আমার খাদ্য দরকার','నాకు ఆహారం కావాలి','मला अन्नाची गरज आहे','எனக்கு உணவு தேவை','مجھے کھانے کی ضرورت ہے','ನನಗೆ ಆಹಾರ ಬೇಕು','મને ખોરાકની જરૂર છે','ମୋର ଖାଦ୍ୟ ଦରକାର','എനിക്ക് ഭക്ഷണം വേണം','ਮੈਨੂੰ ਭੋਜਨ ਚਾਹੀਦਾ ਹੈ','मलाई खाना चाहियो','مون کي خوراڪ گهرجي'];
  intlNeedLangs:Array<string> = ["necesito comida","j'ai besoin de nourriture","احتاج طعاما","ho bisogno di cibo","食べたい","я нуждаются в пище","Eu preciso de comida","我需要食物","我需要食物","saya membutuhkan makanan","Ich brauche Nahrung","나는 음식이 필요해","tôi cần thức ăn","Ek het kos nodig","kam nevojë për ushqim","ja trebam hranu","potřebuji jídlo","jeg har brug for mad","ik heb eten nodig","ma vajan toitu","მე მჭირდება საჭმელი","χρειάζομαι φαγητό","pono au i ka meaʻai","אני צריך אוכל","kajára van szükségem","teastaíonn bia uaim","ego cibo opus","Man vajag ēdienu","man reikia maisto","надад хоол хэрэгтэй байна","من به غذا احتیاج دارم","Треба ми храна","ฉันต้องการอาหาร","yiyeceğe ihtiyacım var"];
  indianHelpLanguages:Array<string> = ["मैं मदद कर सकता हूँ","আমি সাহায্য করতে পারি","నేను సహాయం చేయగలను","मी मदद करू शकतो","என்னால் உதவ முடியும்","میں مدد کر سکتا ہوں","ನಾನು ಸಹಾಯ ಮಾಡಬಹುದು","હું મદદ કરી શકું છું","ମୁଁ ସାହାଯ୍ୟ କରିପାରିବି","എനിക്ക് സഹായിക്കാനാകും","ਮੈਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ","म सहयोग गर्न सक्छु","مان مدد ڪري سگهان ٿو"];
  intlHelpLangauges:Array<string> = ["puedo ayudar","je peux aider","يمكنني المساعدة","posso aiutare","私は助けることができる","я могу помочь","eu posso ajudar","我可以搭把手","我可以搭把手","saya dapat membantu","ich kann helfen","내가 도움이 될 수 있습니다","tôi có thể giúp","ek kan help","mund te ndihmoj","ja mogu pomoći","můžu pomoct","jeg kan hjælpe","ik kan helpen","Ma võin aidata","მე შემიძლია დახმარება","μπορώ να βοηθήσω","Hiki iaʻu ke kōkua","אני יכול לעזור","tudok segíteni","Is féidir liom cabhrú","ego potest auxilium","ES varu palīdzēt","aš galiu padėti","би тусалж чадна","من می توانم کمک کنم","ја могу помоћи","ฉันสามารถช่วยได้","yardım edebilirim"];
  constructor(private afs: AngularFirestore, private fireAuth: AngularFireAuth, private route: Router,private http: HttpClient) { 

    setInterval( () => this.setIndianActiveLang(), 3000 );
    setInterval( () => this.setIntlActiveLang(), 2000 );

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

  back(){
    this.route.navigate(['/home']);
  }

  ngOnInit() {
  }

}
