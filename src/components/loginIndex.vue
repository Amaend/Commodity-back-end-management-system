<template>
    <div class="login">
        <div class="container">
            <div class="tit">登录</div>
            <form>
                <div class="name">
                    <input type="text" id="name" v-model="loginInfo.username" required />
                    <label for="name">姓名</label>
                </div>
                <div class="password">
                    <input type="password" id="password" v-model="loginInfo.password" ref="pswinput" required />
                    <label for="password">密码</label>
                    <i class="iconfont" @click="changeEye" ref="icon"></i>
                </div>
            </form>
            <button class="custom-btn btn-12">
                <span @click="login">点击</span>
                <span>登录</span>
            </button>
        </div>
    </div>
</template>
<script>
import { reqLogin } from '@/api/index'
export default {
    data() {
        return {
            loginInfo: {
                username: '',
                password: ''
            },
        }
    },
    methods: {
        login() {
            reqLogin(this.loginInfo.username, this.loginInfo.password).then((res) => {
                if (res.meta.status == 200) {
                    this.$message.success(res.meta.msg)
                    window.sessionStorage.setItem('token', res.data.token)
                    window.sessionStorage.setItem('username', res.data.username)
                    this.$router.push('/home')
                } else {
                    this.$message.error(res.meta.msg)
                }
            })
        },
        changeEye() {
            if (this.$refs.icon.classList.contains('icon-yanjing_yincang')) {
                this.$refs.icon.classList.remove('icon-yanjing_yincang')
                this.$refs.icon.classList.add('icon-yanjing')
                this.$refs.pswinput.type = 'text'
            } else {
                this.$refs.icon.classList.remove('icon-yanjing')
                this.$refs.icon.classList.add('icon-yanjing_yincang')
                this.$refs.pswinput.type = 'password'
            }
        }
    },
    created() {
        this.$watch('loginInfo.password', (newvalue, oldvalue) => {
            if (newvalue.length !== 0) {
                if (this.$refs.icon.classList.contains('icon-yanjing')) return
                this.$refs.icon.classList.add('icon-yanjing_yincang')
            } else {
                this.$refs.icon.classList.remove('icon-yanjing_yincang', 'icon-yanjing')
                this.$refs.pswinput.type = 'password'
            }

        })
    },
}
</script>
<style scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 712px;
}

.container {
    position: relative;
    z-index: 1;
    background-color: #fff;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 350px;
    height: 500px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1)
}

.container .tit {
    font-size: 26px;
    margin: 65px auto 70px auto;
}

.container input {
    width: 280px;
    height: 30px;
    text-indent: 8px;
    border: none;
    border-bottom: 1px solid #ddd;
    outline: none;
    margin: 12px auto;
}

.custom-btn {
    width: 130px;
    height: 40px;
    color: #fff;
    border-radius: 5px;
    padding: 10px 25px;
    font-weight: 500;
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: inline-block;
    box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, .5),
        7px 7px 20px 0px rgba(0, 0, 0, .1),
        4px 4px 5px 0px rgba(0, 0, 0, .1);
    outline: none;
    margin-bottom: 10px;
}

.btn-12 {
    position: relative;
    right: 20px;
    bottom: -15px;
    border: none;
    box-shadow: none;
    width: 130px;
    height: 40px;
    line-height: 42px;
    -webkit-perspective: 230px;
    perspective: 230px;
}

.btn-12 span {
    background: rgb(0, 172, 238);
    background: linear-gradient(0deg, rgba(0, 172, 238, 1) 0%, rgba(2, 126, 251, 1) 100%);
    display: block;
    position: absolute;
    width: 130px;
    height: 40px;
    box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, .5),
        7px 7px 20px 0px rgba(0, 0, 0, .1),
        4px 4px 5px 0px rgba(0, 0, 0, .1);
    border-radius: 5px;
    margin: 0;
    text-align: center;
    box-sizing: border-box;
    transition: all .3s;
}

.btn-12 span:nth-child(1) {
    box-shadow:
        -7px -7px 20px 0px #fff9,
        -4px -4px 5px 0px #fff9,
        7px 7px 20px 0px #0002,
        4px 4px 5px 0px #0001;
    transform: rotateX(90deg);
    transform-origin: 50% 50% -20px;
}

.btn-12 span:nth-child(2) {
    transform: rotateX(0deg);
    transform-origin: 50% 50% -20px;
}

.btn-12:hover span:nth-child(1) {
    box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, .5),
        7px 7px 20px 0px rgba(0, 0, 0, .1),
        4px 4px 5px 0px rgba(0, 0, 0, .1);
    transform: rotateX(0deg);
}

.btn-12:hover span:nth-child(2) {
    box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, .5),
        7px 7px 20px 0px rgba(0, 0, 0, .1),
        4px 4px 5px 0px rgba(0, 0, 0, .1);
    color: transparent;
    transform: rotateX(-90deg);
}


.name,
.password {
    position: relative;
}

#name+label,
#password+label {
    position: absolute;
    top: 16px;
    left: 0;
    font-size: 16px;
    transition: .5s;
}

#name:focus+label,
#name:valid+label,
#password:focus+label,
#password:valid+label {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 12px;
}

.iconfont {
    font-size: 20px;
    position: absolute;
    top: 18px;
    right: 0;
}
</style>