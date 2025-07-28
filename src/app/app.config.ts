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
        radius: 60,
        space: -10,
        outerStrokeGradient: true,
        outerStrokeWidth: 15,
        outerStrokeColor: '#fff',
        outerStrokeGradientStopColor: '#bc31df',
        innerStrokeColor: '#d7c9f9',
        innerStrokeWidth: 10,
        animateTitle: false,
        animationDuration: 1000,
        showUnits: true,
        showBackground: false,
        clockwise: false,
        startFromZero: true,
        lazy: true,
      })
    ),
  ],
};
