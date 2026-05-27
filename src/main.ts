import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
<<<<<<< HEAD
import 'swiper/element/bundle';
=======
import { Amplify } from 'aws-amplify';

//inicia cognito antes de que arranque la app
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_U9YcJzcmJ', 
      userPoolClientId: '2e6jc5pmo15cnqki9p3rq573bp', 
    }
  }
});
>>>>>>> 4ac83a2 (Se finalizó implementación de Login con AWS Cognito)

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));