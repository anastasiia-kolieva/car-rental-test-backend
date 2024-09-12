import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileUploadDocument = FileUpload & Document;

@Schema()
export class FileUpload {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  uploadedBy: string;

  @Prop({ default: Date.now })
  uploadedAt: Date;
}

export const FileUploadSchema = SchemaFactory.createForClass(FileUpload);
