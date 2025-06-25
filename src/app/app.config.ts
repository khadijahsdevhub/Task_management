import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/env';
import { NgCircleProgressModule } from 'ng-circle-progress';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    importProvidersFrom(
      NgCircleProgressModule.forRoot({
        // Optional: Global default options
        radius: 100,
        outerStrokeWidth: 16,
        innerStrokeWidth: 5,
        outerStrokeColor: '#fff',
        innerStrokeColor: '#d7c9f9',
        animationDuration: 300,
      })
    ),
  ],
};
