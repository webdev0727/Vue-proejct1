<template>
  <span>
      {{timeLeft}}
  </span>
</template>

<script>

const humanizeDuration = require('humanize-duration')

export default {
name: 'Timer',
    props:[
        'exitTime'
    ],
    data () {
        return {
            timeLeft: '',
            polling: null
        }
    },
    created() {
        const endStamp = this.exitTime
        this.polling = setInterval(() => {
            const now = new Date().getTime();
            const distance = endStamp - now;
            this.timeLeft= humanizeDuration(distance, {                
                language: 'zh_CN',
                round: true,                
                units: ['d', 'h', 'm', 's']
                
            })            
            if (distance < 0) {
                clearInterval(this.polling);
                this.timeLeft = "EXPIRED"
            }
        }, 1000);
    },
    beforeDestroy () {
        clearInterval(this.polling)
    }
}
</script>
