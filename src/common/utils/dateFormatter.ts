function dateFormatter(createdAt: Date): string {
  const currentTime = new Date();
  // console.log(currentTime.getTime(), createdAt.getTime());
  const diffTime = currentTime.getTime() - createdAt.getTime();

  if (diffTime / (1000 * 60 * 60 * 24) >= 7) {
    const year = createdAt.getFullYear();
    const month = createdAt.getMonth() + 1;
    const day = createdAt.getDate();

    return year + '년 ' + month + '월 ' + day + '일';
  } else if (diffTime / (1000 * 60 * 60 * 24) > 1) {
    const currentDate = currentTime.getDate();
    const createdDate = createdAt.getDate();
    const beforeDay = currentDate - createdDate;

    return beforeDay + '일 전';
  } else if (diffTime / (1000 * 60 * 60) > 1) {
    const beforeHour = diffTime / (1000 * 60 * 60);

    return Math.round(beforeHour) + '시간 전';
  } else if (diffTime / (1000 * 60) > 1) {
    const beforeMinute = diffTime / (1000 * 60);

    return Math.floor(beforeMinute) + '분 전';
  } else {
    return '방금';
  }
}

export default dateFormatter;
