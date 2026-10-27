import { MyCampus } from './resources/campi/entities/campus.entity'
import { MyUser } from './resources/users/entities/user.entity'

declare global {
  namespace Express {
    export interface Request {
      authUser?: MyUser | null
      campus?: MyCampus | null
    }
  }
}
