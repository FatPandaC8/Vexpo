import {
  Controller, Post, UploadedFile,
  UseGuards, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  @Post('model')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), '..', 'frontend', 'public'),
        filename: (_req, file, cb) => {
          cb(null, file.originalname)
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (extname(file.originalname).toLowerCase() !== '.glb')
          return cb(new BadRequestException('Only .glb files allowed'), false)
        cb(null, true)
      },
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  uploadModel(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded')
    return { filename: file.originalname } 
  }
}