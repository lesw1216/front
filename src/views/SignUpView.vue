<template>
    <div class="flex justify-center items-center h-screen">
        <main class="border-white h-96 w-80 p-4 flex flex-col justify-between shadow-2xl rounded">
            <header>
                <button v-if="!signUpStepper.success" @click="onClickMoveLogin">
                    <ArrowBack></ArrowBack>
                </button>
                <div v-if="signUpStepper.inputEmail">
                    <h1 class="text-3xl">안녕하세요!</h1>
                    <h2>회원 가입에는 이메일이 필요해요</h2>
                </div>
                <div v-else-if="signUpStepper.emailAuth">
                    <h1 class="text-3xl">인증 번호 발송!</h1>
                    <h2>해당 이메일로 인증 번호를 보냈어요!</h2>
                </div>
                <div v-else-if="signUpStepper.inputPassword">
                    <h1 class="text-3xl">이제 끝나가요!</h1>
                    <h2>비밀 번호를 입력해주세요!</h2>
                </div>
                <div v-else-if="signUpStepper.passwordRecomfirm">
                    <h1 class="text-3xl">마지막이에요!</h1>
                    <h2>비밀 번호를 다시 한번 입력해주세요!</h2>
                </div>
                <div v-else-if="signUpStepper.success">
                    <h1 class="text-3xl">가입 완료!</h1>
                    <h2>이제 로그인을 할 수 있어요!</h2>
                </div>
            </header>
                <div>
                    <form @submit.prevent="onClickNext">
                        <InputComp v-if="signUpStepper.inputEmail"
                            v-model="signUpUserInfo.email" 
                            type="email" 
                            place-holder="이메일을 입력하세요." 
                            underline width="full"
                        ></InputComp>
                        <InputComp v-else-if="signUpStepper.emailAuth" 
                            type="email" 
                            place-holder="인증 번호를 입력하세요." 
                            underline width="full"
                        ></InputComp>
                        <InputComp v-else-if="signUpStepper.inputPassword" 
                            type="email" 
                            place-holder="6자리 이상의 문자를 입력하세요." 
                            underline width="full"></InputComp>
                        <InputComp v-else-if="signUpStepper.passwordRecomfirm" 
                            type="email" 
                            place-holder="6자리 이상의 문자를 입력하세요." 
                            underline width="full"
                        ></InputComp>
                    </form>
                </div>
                <div class="w-full text-right">
                    <PrimaryButtonComp v-if="signUpStepper.success" 
                        text="로그인 하러 가기" 
                        width="full" 
                        @click="onClickNext"
                    ></PrimaryButtonComp>
                    <PrimaryButtonComp v-else 
                        text="다음" 
                        @click="onClickNext"
                        width="16"
                    ></PrimaryButtonComp>
                </div>

        </main>
    </div>
</template>
<script setup>
import ArrowBack from '@/components/icons/arrow_back.vue'
import InputComp from '@/components/InputComp.vue';
import PrimaryButtonComp from '@/components/PrimaryButtonComp.vue';
import router from '@/router';
import { reactive } from 'vue';

import axios from 'axios'

const onClickMoveLogin = () => {
    if (signUpStepper.inputEmail) {
        router.push('/login')
    } else if (signUpStepper.emailAuth) {
        signUpStepper.emailAuth = false
        signUpStepper.inputEmail = true
    } else if (signUpStepper.inputPassword) {
        signUpStepper.inputPassword = false
        signUpStepper.emailAuth = true
    } else if (signUpStepper.passwordRecomfirm) {
        signUpStepper.passwordRecomfirm = false
        signUpStepper.inputPassword = true
    }
}

const signUpStepper = reactive({
    inputEmail: true,
    emailAuth: false,
    inputPassword: false,
    passwordRecomfirm: false,
    success: false
})

const signUpUserInfo = reactive({
    email: undefined,
    password: undefined,
    passwordRecomfirm: undefined
})

const onClickNext = () => {
    if (signUpStepper.inputEmail) {
        // 이메일 서버 전송 후 인증 화면으로 넘어가기
        emailSend()
    } else if (signUpStepper.emailAuth) {
        // 이메일 인증 후 비밀 번호 입력 화면으로 넘어가기
        signUpStepper.emailAuth = false
        signUpStepper.inputPassword = true
    } else if (signUpStepper.inputPassword) {
        // 비밀 번호 재입력 화면으로 넘어가기
        signUpStepper.inputPassword = false
        signUpStepper.passwordRecomfirm = true
    } else if (signUpStepper.passwordRecomfirm) {
        // 가입 완료 화면으로 넘어가기
        signUpStepper.passwordRecomfirm = false
        signUpStepper.success = true
    } else if (signUpStepper.success) {
        router.push("/login")
    }
}

const emailSend = () => {
    axios.post('/api/v1/auth/locals/email', {
        email: signUpUserInfo.email
    }).then(function (response) {
        console.log(response)
        signUpStepper.inputEmail = false
        signUpStepper.emailAuth = true
    }).catch(function (error) {
        console.log(error)
    })
}

</script>
<style lang="">

</style>