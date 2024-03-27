<template>
  <div><!--style="width:100%; height:500px; display: inline-block;"-->
    <div ref="barChart" v-bind:style="barChartStyle" ></div>
  </div>
</template>
<script>
  var barChart;
  //图表随窗口大小自适应.el-tree-node__label
  window.addEventListener("resize", () => {
    this.barChartResize();
  });
  export default {
    name: 'base-bar-chart',
    data() {
      return {
        // title: this.$route.query.languageName
      }
    },
    props: {
      xAxisData: { //X轴分类
        type: Array,
        required: true
      },
      data: {
        type: Array,
        required: true
      },
      barChartStyle: {
        type: Object,
        default: {
          width: '100%',
          height: '600px'
        }
      },
      url: {    //点击柱状图跳转地址
        type: String
      },
      title: {
        type: String
      },
      subtitle: {
        type: String
      }
    },
    mounted() {
      // 在生命周期中加载图表
      // this.xAxisData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      // this.data = [120, 200, 150, 80, 70, 110, 130],
      this.loadChart();
    },
    methods: {
      loadChart() {
        barChart = this.$echarts.init(this.$refs.barChart);
        var option;
        option = {
          title: {
            show: true,
            text: this.title,
            subtext: this.subtitle,
            left: 'center',
            //top: 'bottom'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: this.xAxisData/*['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']*/,
            axisLabel: {
              fontSize: 12,
              interval: 0,
              rotate: 20
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.data,
            type: 'bar'
          }]
        };
        option && barChart.setOption(option);
      },
      barChartResize() {
        if(barChart != null && barChart != "" && barChart != undefined){
          barChart.resize();
        }
      }
    },
    watch: {
      "$store.state.app.sidebar.opened"() {
        setTimeout(() => {
          this.barChartResize();
        }, 400)
      }
    },

  }
</script>
