import moment from 'moment'

const oneDay = moment.duration('1', 'day')
const oneHour = moment.duration('1', 'hour')

export function humanize(duration: number) {
  if (duration >= oneDay.asMilliseconds()) {
    return moment.duration(duration).humanize()
  } else if (duration >= oneHour.asMilliseconds()) {
    return moment.utc(duration).format('HH:mm:ss')
  } else {
    return moment.utc(duration).format('mm:ss')
  }
}