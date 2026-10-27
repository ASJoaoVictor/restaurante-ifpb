import { Injectable, NestMiddleware } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { NextFunction, Request, Response } from 'express'
import { CampiService } from '../resources/campi/campi.service'
import { MyCampus } from '../resources/campi/entities/campus.entity'

@Injectable()
export class CampusMiddleware implements NestMiddleware {
  constructor(private campiService: CampiService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    req.campus = await this.getCampus(req)
    next()
  }

  private async getCampus(req: Request): Promise<MyCampus | null> {
    const user = req.authUser
    if (!user) return null
    if (!user.campusId) return null
    const campus = await this.validateCampus(user.campusId)
    if (!campus) return null
    return plainToInstance(MyCampus, campus)
  }

  private async validateCampus(id: string): Promise<MyCampus | null> {
    // TODO: cache
    const campus = await this.campiService.getMyCampus(id)
    return campus
  }
}
