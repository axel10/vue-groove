<template>
  <transition name="like-group">
    <div class="like-group" v-if="playingFile&&playingFile.title">
      <div class="group" :class="{'active':liked}">
        <div class="round-btn svg no-border" @click="like('like')">
          <!--<img src="../assets/like.svg" alt="" >-->
          <svg ref="like" t="1546226736126" class="icon" style="" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg"
               p-id="9852" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
            <path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4-20.5-21.5-48.1-33.4-77.9-33.4-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-0.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81z m636.4-353l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5c5.2-18.9 22.5-32.2 42.2-32.3 7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"
                  p-id="9853" fill="#ffffff"/>
          </svg>
        </div>
        <span>{{likeCount}}</span>
      </div>
      <div class="group" :class="{'active':disliked}">
        <div class="round-btn svg no-border" style="padding: 8px 7px 6px;" @click="like('dislike')">
          <svg t="1546226758727" ref="dislike" class="icon" style="" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg"
               p-id="10000" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
            <path d="M885.9 490.3c3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-51.6-30.7-98.1-78.3-118.4-8.3-3.6-17.2-5.4-26.5-5.4H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h129.3l85.8 310.8C372.9 889 418.9 924 470.9 924c29.7 0 57.4-11.8 77.9-33.4 20.5-21.5 31-49.7 29.5-79.4l-6-122.9h239.9c12.1 0 23.9-3.2 34.3-9.3 40.4-23.5 65.5-66.1 65.5-111 0-28.3-9.3-55.5-26.1-77.7zM184 456V172h81v284h-81z m627.2 160.4H496.8l9.6 198.4c0.6 11.9-4.7 23.1-14.6 30.5-6.1 4.5-13.6 6.8-21.1 6.7-19.6-0.1-36.9-13.4-42.2-32.3L329 459.2V172h415.4c20.4 9.2 33.6 29.4 33.6 51.8 0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19c12.5 10.8 19.6 26.5 19.6 43 0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19c12.5 10.8 19.6 26.5 19.6 43 0 9.7-2.3 18.9-6.9 27.3l-14 25.5 21.9 19c12.5 10.8 19.6 26.5 19.6 43 0 19.1-11 37.5-28.8 48.4z"
                  p-id="10001" fill="#ffffff"></path>
          </svg>
        </div>
        <span>{{disliked?1:0}}</span>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator"
  import {namespace} from "vuex-class"
  import {getOffsetLeft, getOffsetTop, showLoginModal} from "@/utils/utils"

  const homeModule = namespace("home")
  import {fire, shake} from "@/utils/animatie"

  @Component({
    name: "LikeBtnGrout.vue"
  })
  export default class LikeBtnGrout extends Vue {
    @homeModule.State isLogin!: boolean
    @homeModule.State liked!: boolean
    @homeModule.State disliked!: boolean
    @homeModule.State likeCount!: number
    @homeModule.State playingFile!: number

    async like(action: string) {
      if ((this.disliked && action === "like") || (this.liked && action === "dislike")) {
        return
      }
      let target
      if (action === "like") {
        target = this.$refs.like
      } else {
        target = this.$refs.dislike
      }
      const parent = target.parentElement
      const left = getOffsetLeft(parent) + parent.offsetWidth / 2
      const top = getOffsetTop(parent) + parent.offsetHeight / 2
      const callLike = action === "like" ?
        () => {
          if (!this.liked) {
            fire(left, top)
            shake(target)
          }
          // this.$store.dispatch("home/like", {action: "like"}).finally(() => {
          //   this.$store.dispatch("home/getLikeRecord", {file: this.playingFile})
          // })
        } :
        () => {
          // this.$store.dispatch("home/like", {action: "dislike"}).finally(() => {
          //   this.$store.dispatch("home/getLikeRecord", {file: this.playingFile})
          // })
        }

      callLike()
      /*      if (!this.isLogin) {
               showLoginModal().then(()=>{
                 callLike()
               })

              // await showLoginModal()
              // callLike()
            } else {
              callLike()
            }*/
    }
  }
</script>

<style scoped lang="scss">
  @import "../var";

  .like-group-enter, .like-group-leave-to {
    transform: translateX(10rem);
  }

  .like-group {
    transition: transform .3s;
    position: absolute;
    right: 4rem;
    bottom: 8rem;
    display: flex;
    flex-direction: column;

    .group {
      margin-top: 1rem;
      position: relative;
      border-radius: 10rem;
      $size: 2.8rem;
      width: $size;
      height: $size;
      @include flexCenter;
      background-color: #fff;
      box-shadow: 0 .3rem 6px rgba(0, 0, 0, .2);

      &.active {
        path {
          fill: $mainBlue
        }
      }

      span {
        @include flexCenter;
        color: #999;
        height: 1.2rem;
        font-size: .8rem;
        padding: 0 .3rem;
        border: 1px solid #eeeeee;
        border-radius: 2rem;
        position: absolute;
        right: -.8rem;
        top: -.8rem;
        background-color: #fff;
      }

      path {
        fill: #999;
      }
    }
  }
</style>
