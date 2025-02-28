import { Module } from '@nestjs/common';
import { HttpModule } from './infra/http/http.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './infra/env';
import { EnvModule } from './infra/env/env.module';
import { AuthModule } from './infra/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true
    }),
    HttpModule,
    EnvModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
