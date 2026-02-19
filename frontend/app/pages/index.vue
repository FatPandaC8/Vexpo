<script>
import Footer from '~/components/Footer.vue';
import Header from '~/components/Header.vue';

</script>

<template>
    <Header/>
    <main>
        <!--Intro-->
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

            </div>
            <!--Intro info-->

            <!--Intro Image-->
            <div class="p-30">
                <img src="~/assets/images/expo_info_home.jpg" class="rounded-xl border-[#3d52d5] border-20 shadow-2xl w-150">
            </div>
            <!--Intro Image-->
        </div>
        <!--Intro-->

        <!--Trending-->
        <div>

        </div>
        <!--Trending-->

        <!--Why-->
        <div>

        </div>
        <!--Why-->

        <!--Motto-->
        <div>

        </div>
        <!--Motto-->
    </main>
    <Footer/>
</template>