import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import 'swiper/element/bundle';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));