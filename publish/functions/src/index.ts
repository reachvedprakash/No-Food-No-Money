import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as moment from 'moment';
const Distance = require('geo-distance');
admin.initializeApp();
const db = admin.firestore();
const messagingAdmin = admin.messaging();

exports.onTriggerNeedHelp = functions.firestore.document("needHelp/{todayDate}/users/{userId}").onCreate( async (snap,context) => {
    const uid = context.params.userId;
    const timestamp:Date = new Date();
    const todaysDate = timestamp.getDate()+'-'+timestamp.getMonth()+'-'+timestamp.getFullYear();
    const oldDate = moment().subtract(1, 'days').toDate();
    const oldDateKey = oldDate.getDate()+'-'+oldDate.getMonth()+'-'+oldDate.getFullYear();
    let CurPostion = {
        lat: 0,
        lon: 0
      };

    let GivenPostion = {
        lat: 0,
        lon: 0
      };


    const fcm : any[] = [];


    // let fcmArray: any[];
    await db.collection('needHelp').doc(todaysDate).collection('users').doc(uid).get().then ( async res => {
       console.log(res.data());
       if( res.data() )
       {
            CurPostion =  {
                lat: res.data()!.position.geopoint._latitude,
                lon: res.data()!.position.geopoint._longitude
              };
       }
       console.log(CurPostion);
    });

    await db.collection('help').doc(todaysDate).collection('users').get().then( async res => {
        if( res )
        {
            res.forEach( async p => {
                console.log(p.data());
                if( p.data() )
                {
                    GivenPostion =  {
                        lat: p.data().position.geopoint._latitude,
                        lon: p.data().position.geopoint._longitude
                      };
    
                    const dis = Distance.between(CurPostion, GivenPostion);
                    console.log(dis);
                    if(dis < Distance('2 km'))
                    {
                        fcm.push(p.data().fcm);
                        console.log("Yes");
                        
                    }
                    console.log(GivenPostion);
                    console.log(fcm);
                }
            });
        }
        
    }); 


    await db.collection('help').doc(oldDateKey).collection('users').get().then( async res => {
        if( res )
        {
            res.forEach( async p => {
                console.log(p.data());
                if( p.data() )
                {
                    GivenPostion =  {
                        lat: p.data().position.geopoint.Latitude,
                        lon: p.data().position.geopoint.Longitude
                      };
                    const dis = Distance.between(CurPostion, GivenPostion);
                    console.log(dis);
                    if(dis < Distance('2 km'))
                    {
                        fcm.push(p.data().fcm);
                        
                    }
                    console.log(GivenPostion);
                    console.log(fcm);
                }
            });
        }
        
    }); 


    const payload = {
                    token:'',
                    notification:{
                        title:'Some One Need Food ',
                        body:'Pls Donate Some'
                    },
                    "android": {
                        "notification": {
                            "sound": "default"
                        }
                    },
                    "apns": {
                        "payload": {
                            "aps": {
                                "sound": "default"
                            }
                        }
                    },
                }
    fcm.forEach( async token => {
        payload.token = token;
        console.log(token);
        console.log(payload);
        await messagingAdmin.send(payload);
    } )
})
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
