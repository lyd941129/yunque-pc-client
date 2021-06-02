export let countDownFn = {
    methods:{
    // 剩余时间计算
      countDownFn(number){
        let days = parseInt(number / 1000 / 60 / 60 / 24 , 10),
            hours = parseInt(number / 1000 / 60 / 60 % 24 , 10),
            minutes = parseInt(number / 1000 / 60 % 60 , 10),
            seconds = parseInt(number / 1000 % 60 , 10);
        hours = hours && hours < 10 ? "0" + hours : hours
        minutes = minutes && minutes < 10 ? "0" + minutes : minutes
        seconds = seconds && seconds < 10 ? "0" + seconds : seconds
        return days + "天" + hours + "时" + minutes + "分" + seconds + "秒"
      },
    }
}
