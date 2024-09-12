import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { extname } from 'path';
import { FileUpload, FileUploadDocument } from './file-upload.schema';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(FileUpload.name)
    private fileUploadModel: Model<FileUploadDocument>,
  ) {}

  async uploadFile(file: Express.Multer.File, email: string) {
    const allowedMimeTypes = ['application/pdf', 'image/jpeg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only PDF and JPEG files are allowed');
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = extname(file.originalname);
    const generatedFileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;

    const newFile = new this.fileUploadModel({
      filename: generatedFileName,
      uploadedBy: email,
    });

    await newFile.save();

    return {
      originalname: file.originalname,
      filename: generatedFileName,
    };
  }
}
