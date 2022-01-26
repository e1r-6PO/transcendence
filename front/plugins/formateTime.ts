function formateTime(time: Date): string {
  var newTime: Date = new Date(time)
  return newTime.getHours() + ':' + (newTime.getMinutes() < 10 ? '0' + newTime.getMinutes() : newTime.getMinutes())
}

export default formateTime