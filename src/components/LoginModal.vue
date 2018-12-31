<template>
  <Modal :show="show">
    <div class="wrap">
      <!--<transition name="fade">-->
      <form id="login" v-if="current==='login'">
        <h3 class="title">
          登录
        </h3>
        <div class="field">
          <input type="text" v-model="loginForm.username" placeholder="用户名" name="username">
        </div>

        <div class="field">
          <input type="text" v-model="loginForm.password" placeholder="密码" name="password">
        </div>

        <p>没有帐户 ？<span class="toRegister" @click="toRegister">创建一个！</span></p>

        <div class="footer">
          <VPButton type="small" @click="login">
            登录
          </VPButton>
        </div>
      </form>

      <form id="register" v-if="current==='register'">
        <h3 class="title">
          注册
        </h3>
        <div class="field">
          <input type="text" v-model="registerForm.username" placeholder="用户名" name="username">
        </div>

        <div class="field">
          <input type="password" v-model="registerForm.password" placeholder="密码" name="password"
                 @change="checkRegisterForm">
        </div>
        <div class="field">
          <input type="password" v-model="registerForm.confirmPassword" placeholder="确认密码" name="password"
                 @change="checkRegisterForm">
        </div>

        <p>已有帐户 ？<span class="toRegister" @click="toLogin">登录</span></p>

        <div class="footer">
          <VPButton @click="register">
            注册
          </VPButton>
        </div>
      </form>
      <!--</transition>-->
    </div>
  </Modal>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator"
  import Modal from "@/components/Modal.vue"
  import schema from "async-validator"

  const loginDescriptor = {
    username: {type: "string", require: true},
    password: {type: "string", require: true}
  }


  const registerDescriptor = {
    username: {type: "string", require: true},
    password: {type: "string", require: true},
    confirmPassword: {
      validator(rule, value, cb) {
        if (value === "") {
          cb(new Error("请再次输入密码"))
        } else if (value !== this.registerForm.password) {
          cb(new Error("两次输入的密码不一致"))
        } else {
          cb()
        }
      },
      trigger: "blur"
    }
  }

  @Component({
    name: "LoginModal",
    components: {Modal},
    props: {
      show: {
        require: true
      },
      onOk: {
        require: true
      },
      onCancel: {
        require: true
      },
      animateTime: {
        default: 200,
      }
    }
  })
  export default class LoginModal extends Vue {

    checkRegisterForm() {
      const validator = new schema(registerDescriptor)
      validator.validate(this.registerForm, (errs) => {
        if (errs) {
          console.log(errs)
          return
        }
      })
    }

    registerForm = {
      username: "",
      password: "",
      confirmPassword: ""
    }
    loginForm = {
      username: "",
      password: "",
    }
    current = "login"

    login() {
    }

    register() {
    }

    toRegister() {
      this.current = "register"
    }

    toLogin() {
      this.current = "login"
    }

  }
</script>

<style scoped lang="scss">
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }

  .wrap {
    width: 100%;

    & > form {
      width: 100%;

      &>h3{
        font-size: 1.8rem;
        margin-bottom: 1rem;
      }

      .field {
        width: 100%;
        margin-bottom: 1rem;

        input {
          font-size: 1rem;
          background-color: transparent;
          width: 100%;
          height: 1.5rem;
          display: flex;
          align-items: center;
          border: none;
          border-bottom: 1px solid rgb(0, 90, 158);
          box-sizing: border-box;
        }
      }

      .footer {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin-top: 2rem;
      }

      & > p {
        font-size: .8rem;

        & > span {
          color: rgb(0, 90, 158);
          cursor: pointer;
        }
      }
    }

  }
</style>
