<script setup lang="ts">
import Footer from '~/components/Footer.vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const activeTab = ref('signin')
const rememberMe = ref(true)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreeTerms = ref(false)

const items = [
  { label: 'Sign In', value: 'signin', slot: 'signin' },
  { label: 'Sign Up', value: 'signup', slot: 'signup' }
]

const roles = ['Visitor', 'Exhibitor', 'Organizer']

// Separate form states
const signInState = reactive({
  email: '',
  password: ''
})

const signUpState = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: ''
})

const signInSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

const signUpSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password does not match'),
  role: z.string().min(1, 'Please select a role.')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword']
})

function onSignIn(event: FormSubmitEvent<typeof signInState>) {
  console.log('Sign In:', event.data)
}

function onSignUp(event: FormSubmitEvent<typeof signUpState>) {
  console.log('Sign Up:', event.data)
}
</script>

<template>
    <!--The design has 2 parts: the footer & auth part-->
    <div class="bg-linear-to-r from-blue-50 to-blue-500">
        <div class="p-50">
            <!--Breadcrumb-->
            <div class="flex flex-1 mb-10 items-center">
                <UIcon name="i-lucide-arrow-left"/>
                <NuxtLink to="#" class="text-gray-500 ml-2 hover:text-gray-400">
                    Back to Home
                </NuxtLink>
            </div>
            <!--Breadcrumb-->
    
            <div class="grid grid-cols-2">
                <!--Info-->
                <div class="mr-5">
                    <div class="mb-8 gap-3">
                        <h1 class="text-3xl font-bold text-blue-600">ExpoVerse</h1>
                        <p class="text-sm text-muted-foreground">Virtual Expo Platform</p>
                    </div>
    
                    <p class="font-bold text-4xl mb-4">Welcome to the Future of Virtual Event</p>
    
                    <p class="text-lg text-muted-foreground mb-8">
                        Connect with thousands of exhibitors, explore interactive booths, and network 
                        with professionals from around the world.
                    </p>
                    <ul class="space-y-4">
                        <li class="flex items-start gap-3">
                            <UIcon name="i-lucide-globe" class="text-blue-600 mt-1" />
                            <span>Access 500+ virtual exhibitors</span>
                        </li>
    
                        <li class="flex items-start gap-3">
                            <UIcon name="i-lucide-users" class="text-blue-600 mt-1" />
                            <span>Connect with 50K+ exhibitors</span>
                        </li>
    
                        <li class="flex items-start gap-3">
                            <UIcon name="i-lucide-network" class="text-blue-600 mt-1" />
                            <span>Join 1M+ professionals community</span>
                        </li>
    
                        <li class="flex items-start gap-3">
                            <UIcon name="i-lucide-box" class="text-blue-600 mt-1" />
                            <span>Interactive 3D booths experience</span>
                        </li>
                    </ul>
    
                </div>
                <!--Info-->
        
                <!--Auth-->
                <UCard class="w-full max-w-lg border-blue-100 bg-white/90 backdrop-blur-sm shadow-2xl shadow-blue-500/10 p-9 rounded-2xl flex flex-col">
                    <UTabs 
                    v-model="activeTab"
                    :items="items" 
                    variant="pill"
                    :ui="{
                        list: 'flex justify-between bg-blue-100/60 p-1 rounded-full',
                        trigger: `
                                flex-1 text-center rounded-full py-2 text-sm font-semibold
                                transition-all duration-300 ease-in-out
                                text-blue-700
                                data-[state=active]:bg-blue-600
                                data-[state=active]:text-white
                                `,
                        indicator: 'rounded-full bg-white shadow-md'
                    }">
                        <template #signin>
                            <div class="space-y-6">
                                <div class="text-center mb-6 mt-8">
                                    <h3 class="text-2xl font-bold mb-2">Welcome Back!</h3>
                                    <p class="text-sm text-gray-500">Sign in to continue to your account</p>
                                </div>
    
                                <UForm class="space-y-4" :state="signInState" :schema="signInSchema" @submit="onSignIn">
                                    <UFormField name="email" label="Email" :ui="{
                                        error: 'text-red-500 italic bg-red-500/15 text-center rounded h-6 p-1',
                                    }">
                                        <UInput 
                                            v-model="signInState.email"
                                            type="email"
                                            placeholder="example@example.com"
                                            :ui="{
                                                base: 'border border-blue-300 focus:border-blue-600 px-2 h-10 rounded',
                                            }"
                                            
                                        />
                                    </UFormField>
    
                                    <UFormField name="password" label="Password" :ui="{
                                        error: 'text-red-500 italic bg-red-500/15 text-center rounded h-6 p-1',
                                    }">
                                        <UInput
                                            v-model="signInState.password"
                                            type="password"
                                            placeholder="example123"
                                            :ui="{
                                                base: 'border border-blue-300 focus:border-blue-600 px-2 h-10 rounded'
                                            }"
                                        />
                                    </UFormField>
    
                                    <div class="flex items-center justify-between">
                                        <label class="flex items-center cursor-pointer">
                                            <UCheckbox
                                                v-model="rememberMe"
                                                class="w-4 h-4 shrink-0 border border-blue-500 rounded mr-2 justify-center"
                                            />
                                            <span class="text-sm">Remember me</span>
                                        </label>

                                        <NuxtLink
                                            to="#"
                                            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Forgot password?
                                        </NuxtLink>
                                    </div>
    
                                    <UButton 
                                        type="submit"
                                        block 
                                        class="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 text-white cursor-pointer h-8 rounded-xl"
                                        size="lg">
                                        Sign In
                                    </UButton>
    
                                    <div class="relative my-6">
                                        <div class="absolute inset-0 flex items-center">
                                            <div class="w-full border-t border-blue-100" />
                                        </div>
                                        <div class="relative flex justify-center text-sm">
                                            <span class="px-4 bg-blue-50 text-muted-foreground">Or continue with</span>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center justify-center">
                                        <UButton
                                        variant="outline"
                                        block 
                                        class="border border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-500 hover:cursor-pointer h-8 rounded-xl"
                                        icon="i-logos-google-icon"
                                        >
                                            Google
                                        </UButton>
                                    </div>
                                </UForm>
                            </div>
                        </template>
    
                        <template #signup>
                            <div class="space-y-6">
                                <div class="text-center mb-6 mt-8">
                                    <h3 class="text-2xl font-bold mb-2">Create Account</h3>
                                    <p class="text-sm text-gray-500">
                                        Join thousands of professionals on ExpoVerse
                                    </p>
                                </div>
    
                                <UForm :schema="signUpSchema" :state="signUpState" @submit="onSignUp" class="space-y-4">
                                    <UFormField name="name" label="Full Name" :ui="{
                                        error: 'text-red-500 italic bg-red-500/15 text-center rounded h-6 p-1',
                                    }">
                                        <UInput
                                            v-model="signUpState.name"
                                            placeholder="John Doe"
                                            :ui="{
                                                base: 'border border-blue-300 focus:border-blue-600 px-2 h-10 rounded'
                                            }"
                                        />
                                    </UFormField>
    
                                    <UFormField name="email" label="Email" :ui="{
                                        error: 'text-red-500 italic bg-red-500/15 text-center rounded h-6 p-1',
                                    }">
                                        <UInput
                                            v-model="signUpState.email"
                                            type="email"
                                            placeholder="your.email@example.com"
                                            :ui="{
                                                base: 'border border-blue-300 focus:border-blue-600 px-2 h-10 rounded'
                                            }"
                                        />
                                    </UFormField>
    
                                    <UFormField name="password" label="Password" :ui="{
                                        error: 'text-red-500 italic bg-red-500/15 text-center rounded h-6 p-1',
                                    }">
                                        <UInput
                                            v-model="signUpState.password"
                                            :type="showPassword ? 'text' : 'password'"
                                            placeholder="Create a strong password"
                                            :ui="{
                                                base: 'border border-blue-300 focus:border-blue-600 px-2 h-10 rounded'
                                            }"
                                        />
                                    </UFormField>
    
                                    <UFormField name="confirmPassword" label="Confirm Password" :ui="{
                                        error: 'text-red-500 italic bg-red-500/15 text-center rounded h-6 p-1',
                                    }">
                                        <UInput
                                            v-model="signUpState.confirmPassword"
                                            :type="showConfirmPassword ? 'text' : 'password'"
                                            placeholder="Re-enter your password"
                                            :ui="{
                                                base: 'border border-blue-300 focus:border-blue-600 px-2 h-10 rounded'
                                            }"
                                        >
                                        </UInput>
                                    </UFormField>
    
                                    <UFormField name="role" label="Role" :ui="{
                                        error: 'text-red-500 italic bg-red-500/15 text-center rounded h-6 p-1',
                                    }">
                                        <USelect
                                            v-model="signUpState.role"
                                            variant="soft"
                                            :items="roles"
                                            placeholder="Select your role"
                                            :content="{
                                                align: 'center',
                                                side: 'bottom',
                                            }"
                                            :ui="{
                                                base: 'w-full border border-blue-300 h-10 rounded bg-blue-50 ',
                                                content: 'bg-white rounded-xl shadow-lg border border-blue-100',
                                                item: 'px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer w-100 rounded-xl',
                                                itemLabel: 'text-gray-700',
                                                itemTrailingIcon: 'text-blue-500',
                                            }"
                                            trailing-icon="null"
                                            
                                        />
                                    </UFormField>
    
                                    <div class="flex items-start gap-2">
                                        <p class="text-sm text-gray-600">
                                            <label class="flex items-center cursor-pointer">
                                                <UCheckbox
                                                    v-model="agreeTerms"
                                                    class="w-4 h-4 shrink-0 border border-blue-500 rounded mr-2 justify-center"
                                                    required
                                                />
                                                <span class="text-sm">I agree to the
                                                    <NuxtLink
                                                        to="#"
                                                        class="text-blue-600 font-medium"
                                                    >
                                                    Terms of Service
                                                    </NuxtLink>
                                                </span>
                                            </label>
                                        </p>
                                    </div>
    
                                    <UButton 
                                        type="submit"
                                        block 
                                        class="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 text-white cursor-pointer h-8 rounded-xl"
                                        size="lg">
                                        Sign Up
                                    </UButton>
    
                                    <div class="relative my-6">
                                        <div class="absolute inset-0 flex items-center">
                                            <div class="w-full border-t border-blue-100" />
                                        </div>
                                        <div class="relative flex justify-center text-sm">
                                            <span class="px-4 bg-blue-50 text-muted-foreground">Or continue with</span>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center justify-center">
                                        <UButton
                                        variant="outline"
                                        block 
                                        class="border border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-500 hover:cursor-pointer h-8 rounded-xl"
                                        icon="i-logos-google-icon"
                                        >
                                            Google
                                        </UButton>
                                    </div>
                                    
                                </UForm>
                            </div>
                        </template>
                    </UTabs>
                </UCard>
                <!--Auth-->
            </div>
        </div>
        <Footer/>
    </div>
</template>

