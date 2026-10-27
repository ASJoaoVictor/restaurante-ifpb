import { Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Res, StreamableFile } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { Readable } from 'stream'
import { FileStorage } from './base.storage'
import { FileParamDto } from './dto/params.dto'

@ApiTags('storage')
@Controller()
export class StorageController {
  constructor(private readonly fileStorage: FileStorage) {}

  @Get('/public/uploads/:fileName')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ content: { 'application/octet-stream': {} } })
  async getUploadedFile(
    @Param() { fileName }: FileParamDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<StreamableFile> {
    const file = await this.fileStorage.getFile(fileName)

    if (!file?.stream) {
      throw new NotFoundException('File not found')
    }

    if (file.size) {
      res.setHeader('Content-Length', file.size)
    }

    res.setHeader('Content-Type', file.mimeType || 'application/octet-stream')
    res.setHeader('Content-Disposition', 'inline')

    const readable = Readable.from(file.stream)
    return new StreamableFile(readable)
  }
}
