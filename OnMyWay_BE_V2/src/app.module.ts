import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { MapModule } from './modules/map/map.module';

//TODO: add malicious attack protection with guard?helmet? with middlewares or interceptors
//TODO: CORS, CSRF, and other security measures
//TODO: In general, fine tune parameters for performance (parameters for driving routes, search results, etc.)
@Module({
  imports: [ConfigModule.forRoot(), MapModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
