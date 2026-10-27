import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import calendar from 'dayjs/plugin/calendar'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('pt-br')
dayjs.extend(calendar)
dayjs.extend(isSameOrBefore)
dayjs.extend(relativeTime)
