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
          <input type="password" v-model="loginForm.password" placeholder="密码" name="password">
        </div>

        <p  class="errorMsg" ref="loginErrorMsg"></p>
        <p>没有帐户 ？<span class="toRegister" @click="toRegister">创建一个！</span></p>

        <div class="footer">
          <span @click="onCancel">取消</span>

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
          <input type="password" v-model="registerForm.confirmPassword" placeholder="确认密码" name="confirmPassword"
                 @change="checkRegisterForm">
        </div>
        <p class="errorMsg" ref="regErrorMsg"></p>
        <p>已有帐户 ？<span class="toRegister" @click="toLogin">登录</span></p>

        <div class="footer">
          <span @click="onCancel">取消</span>

          <VPButton type="small" @click="register">
            注册
          </VPButton>
        </div>
      </form>
      <!--</transition>-->
    </div>
  </Modal>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator"
  import Modal from "@/components/Modal.vue"
  import schema from "async-validator"
  import mainApi from "@/api/mainApi"
  import {AxiosError} from "axios"

  const loginDescriptor = {
    username: {type: "string", required: true, trigger: "blur", message: "请输入用户名"},
    password: {type: "string", required: true, trigger: "blur", message: "请输入密码"}
  }


  const registerDescriptor = {
    username: {type: "string", require: true},
    password: {type: "string", require: true},
    confirmPassword: {
      validator(rule, value, cb, s) {
        console.log(rule, value, s, this)
        if (value === "") {
          cb(new Error("请再次输入密码"))
        } else if (value !== s.password) {
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
        type: Function,
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
    @Prop() onOk: () => void

    checkRegisterForm() {
      this.regValidator.validate(this.registerForm, this.checkError())
    }

    checkLoginForm() {
      this.loginValidator.validate(this.loginForm, this.checkError())
    }

    regValidator = new schema(registerDescriptor)
    loginValidator = new schema(loginDescriptor)

    checkError = (cb?: () => void) => {
      return errs => {
        console.log(errs)
        if (errs) {
          for (let i = 0; i < errs.length; i++) {
            const field = document.getElementsByName(errs[i].field)[0].parentElement as HTMLElement
            if (field.querySelector("p")) {
              field.removeChild(field.querySelector("p"))
            }
            const errMsg = document.createElement("p")
            errMsg.style.color = "red"
            errMsg.classList.add("form-error-msg")
            errMsg.innerText = errs[i].message
            field.appendChild(errMsg)
          }
          console.log(errs)
          return false
        } else {
          document.querySelectorAll(".form-error-msg").forEach((o: HTMLElement) => {
            o.style.display = "none"
          })
          if (cb) {
            cb()
          }
          return true
        }
      }
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
      const that = this
      this.loginValidator.validate(this.loginForm, this.checkError(() => {
        mainApi.login(this.loginForm).then(o => {
          that.onOk()
          that.$store.commit("home/setData", {key: "isLogin", val: true})
        }).catch((e: AxiosError) => {
          console.log(e.response.data["ErrorMsg"])
          const errorMsg = (this.$refs.loginErrorMsg as HTMLElement)
          errorMsg.innerText = e.response.data["ErrorMsg"]
        })
      }))
    }

    register() {
      const that = this
      this.regValidator.validate(this.registerForm, this.checkError(() => {

        mainApi.register(this.registerForm).then(o => {
          that.onOk()
          that.$store.commit("home/setData", {key: "isLogin", val: true})
        }).catch((e: AxiosError) => {
          console.log(e.response.data["ErrorMsg"])
          const errorMsg = (this.$refs.regErrorMsg as HTMLElement)
          errorMsg.innerText = e.response.data["ErrorMsg"]
        })
      }))
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

      & > h3 {
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
        align-items: center;

        & > span {
          color: rgb(0, 90, 158);
          margin: 0 1rem;

        }
      }

      & > p {
        font-size: .8rem;

        & > span {
          color: rgb(0, 90, 158);
          cursor: pointer;
        }
      }
    }

    .errorMsg {
      color: red;
    }

  }
</style>
