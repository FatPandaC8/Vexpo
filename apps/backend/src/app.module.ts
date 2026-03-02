import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { ExposModule } from './expos/expos.module';
import { BoothsModule } from './booths/booths.module';
import { CompaniesModule } from './companies/companies.module';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/userrole.entity';
import { Expo } from './entities/expo.entity';
import { Booth } from './entities/booth.entity';
import { Company } from './entities/company.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: (process.env.TYPEORM_type as "postgres") || "postgres",
      host: (process.env.TYPEORM_host),
      port: Number(process.env.TYPEORM_port),
      username: (process.env.TYPEORM_username),
      password: (process.env.TYPEORM_password),
      database: (process.env.TYPEORM_database_name),
      entities: [User, Role, UserRole, Expo, Booth, Company],
      autoLoadEntities: true,
      synchronize: Boolean(process.env.IN_DEVELOPEMENT), // for dev only, not for production
    }),
    ExposModule,
    BoothsModule,
    CompaniesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
