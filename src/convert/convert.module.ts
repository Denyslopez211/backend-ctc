import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConvertController } from './controllers/convert.controller';
import { ConvertService } from './services/convert.service';
import { AuthModule } from '../auth/auth.module';
import { ClientService } from './client/client.services';
import { Convert } from './entities/convert.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Convert]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    AuthModule,
  ],

  controllers: [ConvertController],
  providers: [ConvertService, ClientService],
  exports: [TypeOrmModule],
})
export class ConvertModule {}
