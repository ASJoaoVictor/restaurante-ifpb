import { ThrottlerModuleOptions } from '@nestjs/throttler'

export const throttlerConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      name: 'byIP',
      ttl: 0,
      limit: 0
    },
    {
      name: 'byUserId',
      ttl: 0,
      limit: 0,
      getTracker: (req) => req.authUser?.id
    }
  ]
}
