<script>
import Footer from '~/components/Footer.vue';
import Header from '~/components/Header.vue';

</script>

<template>
    <Header/>
    <main class="bg-white">
        <!--Intro-->
        <section class="min-h-screen flex items-center">
            <div class="grid grid-cols-2 items-center gap-12">
                <!--Intro info-->
                <div class="p-40">
                    <div>
                        <h1 class="text-5xl text-[#3d52d5] font-bold mb-6">Experience Virtual Expos Like Never Before</h1>
                        <p class="text-gray-500 mb-8">Connect with global exhibitors, explore interactive booths, and network with 
                            thousands of professionals from the comfort of your screen.
                        </p>
                    </div>
    
                    <div class="flex gap-5">
                        <UButton 
                            block 
                            class="bg-linear-to-r from-[#3d52d5] to-[#090c9b] hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 text-white cursor-pointer h-10 w-40 rounded-xl"
                            size="lg">
                            Explore Expo
                        </UButton>
        
                        <UButton 
                            block 
                            class="border border-blue-100 hover:bg-blue-50 cursor-pointer h-10 w-40 rounded-xl"
                            size="lg">
                            Watch Demo
                        </UButton>
                    </div>
                    <USeparator class="mt-12 max-w-sm"/>
                </div>
                <!--Intro info-->
    
                <!--Intro Image-->
                <div class="p-30">
                    <img src="~/assets/images/expo_info_home.jpg" class="rounded-xl border-[#3d52d5] border-20 shadow-2xl w-200">
                </div>
                <!--Intro Image-->
            </div>
        </section>
        <!--Intro-->

        <!--Trending-->
        <div>

        </div>
        <!--Trending-->

        <!--Why-->
        <section class="mb-40">
            <div class="flex flex-col items-center text-center mb-12">
                <h1 class="text-4xl font-bold mb-4">
                    Why Choose ExpoVerse?
                </h1>
                <p class="text-gray-500 text-lg max-w-2xl mx-auto">
                    Powerful features designed to make virtual exhibitions engaging and productive.
                </p>
            </div>

            <div class="grid grid-cols-4 gap-6 pl-30 pr-30 mb-20">
                <UCard class="p-8 text-center border rounded-2xl border-blue-200 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <UIcon name="i-lucide-map-pin" class="w-8 h-8 text-white"/>
                    </div>
                    <h1 class="text-lg font-bold mb-2">Interactive 2D Maps</h1>
                    <p class="text-sm text-gray-500">Navigate expo halls with ease using out intuitive floor plans</p>
                </UCard>

                <UCard class="p-8 text-center border rounded-2xl border-blue-200 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <UIcon name="i-lucide-zap" class="w-8 h-8 text-white"/>
                    </div>
                    <h1 class="text-lg font-bold mb-2">Live Booth Experience</h1>
                    <p class="text-sm text-gray-500">Immersive 3D booths</p>
                </UCard>

                <UCard class="p-8 text-center border rounded-2xl border-blue-200 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <UIcon name="i-lucide-users" class="w-8 h-8 text-white"/>
                    </div>
                    <h1 class="text-lg font-bold mb-2">Networking Hub</h1>
                    <p class="text-sm text-gray-500">Connect with exhibitors and organizers throughout the expo</p>
                </UCard>

                <UCard class="p-8 text-center border rounded-2xl border-blue-200 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <UIcon name="i-lucide-calendar-1" class="w-8 h-8 text-white"/>
                    </div>
                    <h1 class="text-lg font-bold mb-2">Event Scheduling</h1>
                    <p class="text-sm text-gray-500">Book meeting and never miss upcoming events</p>
                </UCard>
            </div>
        </section>
        <!--Why-->

        <!--Motto-->
        <section class="max-w-4xl mx-auto">
            <UCard class="flex justify-center text-center border-blue-200 bg-linear-to-br from-blue-600 to-blue-500 text-white shadow-2xl shadow-blue-500/40 rounded-2xl h-70">
                <div class="mb-8">
                    <h1 class="text-4xl mt-8">Ready to Transform Your Events?</h1>
                    <p class="text-lg text-blue-200 mt-6 pl-30 pr-30">Join leading organizations using ExpoVerse to host world-class virtual exhibitions</p>
                </div>
                <div class="flex gap-5 justify-center">
                    <UButton 
                        block 
                        class="bg-white hover:bg-blue-100 shadow-lg shadow-blue-500/30 text-blue-500 cursor-pointer h-10 w-40 rounded-xl"
                        size="lg">
                        Get Started Now
                    </UButton>
    
                    <UButton 
                        block 
                        class="bg-white hover:bg-blue-100 shadow-lg shadow-blue-500/30 text-blue-500 cursor-pointer h-10 w-40 rounded-xl"
                        size="lg">
                        Shedule Demo
                    </UButton>
                </div>
            </UCard>
        </section>
        <!--Motto-->
    </main>
    <Footer/>
</template>