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
import { ReportsModule } from './reports/reports.module';
import { CompaniesModule } from './companies/companies.module';
import { VisitsModule } from './visits/visits.module';
import { SystemModule } from './system/system.module';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/userrole.entity';
import { Expo } from './entities/expo.entity';
import { Registration } from './entities/registration.entity';
import { Report } from './entities/report.entity';
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
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'vexpo',
      entities: [
        User,
        Role,
        UserRole,
        Expo,
        Registration,
        Report,
        Booth,
        Company,
      ],
      autoLoadEntities: true,
      synchronize: true, // for dev only, not for production
    }),
    ExposModule,
    BoothsModule,
    ReportsModule,
    CompaniesModule,
    VisitsModule,
    SystemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
