<template>
    <div class="flex justify-center items-center h-screen">
        <main class="border-white h-96 w-80 p-4 flex flex-col justify-between shadow-2xl rounded">
            <header>
                <button v-if="!stepper.success" @click="onClickBackMove">
                    <ArrowBack></ArrowBack>
                </button>
                <div v-if="stepper.inputEmail">
                    <h1 class="text-3xl">안녕하세요!</h1>
                    <h2>회원 가입에는 이메일이 필요해요</h2>
                </div>
                <div v-else-if="stepper.emailAuth">
                    <h1 class="text-3xl">인증 번호 발송!</h1>
                    <h2>해당 이메일로 인증 번호를 보냈어요!</h2>
                </div>
                <div v-else-if="stepper.inputPassword">
                    <h1 class="text-3xl">이제 끝나가요!</h1>
                    <h2>비밀 번호를 입력해주세요!</h2>
                </div>
                <div v-else-if="stepper.passwordRecomfirm">
                    <h1 class="text-3xl">마지막이에요!</h1>
                    <h2>비밀 번호를 다시 한번 입력해주세요!</h2>
                </div>
                <div v-else-if="stepper.success">
                    <h1 class="text-3xl">가입 완료!</h1>
                    <h2>이제 로그인을 할 수 있어요!</h2>
                </div>
            </header>
                <div>
                    <ErrorMessageComp :message="errorStore.errorMsg" :is-error=errorStore.isError></ErrorMessageComp>
                    <form @submit.prevent="onClickNext">
                        <InputComp v-if="stepper.inputEmail"
                            v-model="userInfo.email" 
                            type="email" 
                            place-holder="이메일을 입력하세요." 
                            underline width="full"
                            :class="{'border-red-500': errorStore.isError}"
                        ></InputComp>
                        <InputComp v-else-if="stepper.emailAuth" 
                            v-model="userInfo.otp"
                            type="text" 
                            place-holder="인증 번호를 입력하세요." 
                            underline width="full"
                            :class="{'border-red-500': errorStore.isError}"
                        ></InputComp>
                        <InputComp v-else-if="stepper.inputPassword" 
                            type="password" 
                            place-holder="6자리 이상의 문자를 입력하세요." 
                            underline width="full"
                            :class="{'border-red-500': errorStore.isError}"
                        ></InputComp>
                        <InputComp v-else-if="stepper.passwordRecomfirm" 
                            type="password" 
                            place-holder="6자리 이상의 문자를 입력하세요." 
                            underline width="full"
                            :class="{'border-red-500': errorStore.isError}"
                        ></InputComp>
                    </form>
                    <div class="text-xs flex justify-between mt-2" v-show="stepper.emailAuth">
                        <button class="border-b" @click="sendEmail">
                            인증 번호 재전송
                        </button> 
                        <div>
                            남은 시간: {{ expriationTimerStore.minute }}분 {{ expriationTimerStore.second }}초
                        </div>
                    </div>
                </div>
                <div class="w-full text-right">
                    <PrimaryButtonComp v-if="stepper.success" 
                        text="로그인 하러 가기" 
                        width="full" 
                        @click="onClickNext"
                    ></PrimaryButtonComp>
                    <PrimaryButtonComp v-else 
                        text="다음" 
                        @click="onClickNext"
                        class="w-16"
                    ></PrimaryButtonComp>
                </div>
        </main>
    </div>
</template>
<script setup>
import ArrowBack from '@/components/icons/arrow_back.vue'
import InputComp from '@/components/InputComp.vue';
import PrimaryButtonComp from '@/components/PrimaryButtonComp.vue';
import ErrorMessageComp from '@/components/ErrorMessageComp.vue'
import router from '@/router';
import { reactive, ref } from 'vue';
import axios from 'axios'

import { useErrorStore } from '@/stores/Error.js'
import { useExpiationTimerStore } from '@/stores/ExpirationTimer.js'

const errorStore = useErrorStore()
const expriationTimerStore = useExpiationTimerStore()


const stepper = reactive({
    inputEmail: true,
    emailAuth: false,
    inputPassword: false,
    passwordRecomfirm: false,
    success: false
})

const userInfo = reactive({
    email: undefined,
    password: undefined,
    passwordRecomfirm: undefined,
    otp: undefined
})

// onCLick

const onClickBackMove = () => {
    if (stepper.inputEmail) {
        router.push('/login')
        errorStore.$reset()
    } else if (stepper.emailAuth) {
        stepper.emailAuth = false
        stepper.inputEmail = true
    } else if (stepper.inputPassword) {
        stepper.inputPassword = false
        stepper.emailAuth = true
    } else if (stepper.passwordRecomfirm) {
        stepper.passwordRecomfirm = false
        stepper.inputPassword = true
    }
}

const onClickNext = () => {
    if (stepper.inputEmail) {
        // 이메일 서버 전송 후 인증 화면으로 넘어가기
        sendEmail()
    } else if (stepper.emailAuth) {
        // 이메일 인증 후 비밀 번호 입력 화면으로 넘어가기

        reqCertifyOtp()
        
    } else if (stepper.inputPassword) {
        // 비밀 번호 재입력 화면으로 넘어가기
        stepper.inputPassword = false
        stepper.passwordRecomfirm = true
    } else if (stepper.passwordRecomfirm) {
        // 가입 완료 화면으로 넘어가기
        stepper.passwordRecomfirm = false
        stepper.success = true
    } else if (stepper.success) {
        router.push("/login")
    }
}

// Function


// REST API

// 이메일 서버로 전송
const sendEmail = () => {
    errorStore.$reset()

    axios.post('/api/v1/auth/locals/email', {
        email: userInfo.email
    }).then(function (response) {
        // 페이지 이동
        stepper.inputEmail = false
        stepper.emailAuth = true

        // 유효 시간 서버에서 가져오기
        reqExpirationTime()
    }).catch(function (error) {
        console.log(error)
        errorStore.isError = true;
        // isError.value = true;
    })
}

// 유효 시간 서버에 요청
const reqExpirationTime = () => {
    axios.get('/api/v1/auth/locals/email/expiration', {
        params: {
            email: userInfo.email
        }
    }).then(function (response) {
        expriationTimerStore.realTime = response.data.data

        // 유효 시간 감소
        expriationTimerStore.reduceExpiration()
    }).catch(function (error) {
        console.log(error)
    })
}

// 인증 번호 인증
const reqCertifyOtp = () => {
    errorStore.$reset()
    axios.post("/api/v1/auth/locals/email/otp", {
        email: userInfo.email,
        otp: userInfo.otp
    }).then(function(response) {
        stepper.emailAuth = false
        stepper.inputPassword = true
    }).catch(function(error) {
        const errorCodes = error.response.data.errorCodes
        if (errorCodes.includes(70) || errorCodes.includes(1) || errorCodes.includes(2)) {
            errorStore.createError("인증 번호가 일치하지 않습니다.")
            return
        } 
        
        if (errorCodes.includes(71)) {
            errorStore.createError("인증 번호가 만료되었습니다.")
            return
        }
    })
}
</script>
<style lang="">

</style>