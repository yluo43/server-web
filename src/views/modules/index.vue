<template>
  <div style="height: 100%;">
    <el-container style="height: 100%; border: 1px solid #eee">
        <h1 style="margin:  0 auto">欢迎访问 《物联网项目结算平台》  <span>现在是北京时间: {{newTime}} </span></h1>
      <div></div>
    </el-container>

  </div>
</template>
<script>

  export default {
    data() {
      return {
        newTime: ""
      }
    },
    mounted(){
      this.getNowTime();//进入页面调用该方法获取当前时间
      clearInterval(myTimeDisplay );//销毁之前定时器
      var myTimeDisplay = setInterval(() => {
        this.getNowTime(); //每秒更新一次时间
      }, 1000);
    },
    methods: {
      getNowTime() {
        var date = new Date();
        var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        this.newTime = time;
      },
      //根据自己的需求，看要不要在时间不大于10的时候在前面补0，如果需要直接this.addZero(date.getMinutes()),其它与之相同，如果不需要删掉addZero（）方法即可。
      //小于10的拼接上0字符串
      addZero(s) {
        return s < 10 ? ('0' + s) : s;
      },

    }
  }
</script>
