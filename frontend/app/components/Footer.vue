<template>
    <!--Most pages has footers [REMINDER]-->
    <!--Footer vs Div: Use footer for more semantics, and it's better for screen reader & SEO-->
    <div>
        <footer class=" text-white py-12 mt-20 bg-slate-800">
            <div class="px-6 max-w-7xl mx-auto">
                <!--UPPER FOOTER-->
                <div class="grid md:grid-cols-4 gap-8 mb-8"> <!--This means: the break point like md: to only apply the utitlity at a medium screen sizes and above;
                    And grid-cols-4 is for making equally size columns in a grid-->
                    <div class="">
                        <h4 class="font-bold mb-4">ExpoVerse</h4>
                        <p class="text-slate-300">
                            The future of virtual exhibitions and networking
                        </p>
                    </div>
                    <div>
                        <h4 class="font-bold mb-4">
                            Platform
                        </h4>
                        <ul class="text-slate-300 space-y-2">
                            <li><a href="#" class="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">For Exhibitors</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">For Organizers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-bold mb-4">
                            Resources
                        </h4>
                        <ul class="text-slate-300 space-y-2">
                            <li><a href="#" class="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">Documentation</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">API</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-bold mb-4">
                            Company
                        </h4>
                        <ul class="text-slate-300 space-y-2">
                            <li><a href="#" class="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
                            <li><a href="#" class="hover:text-white transition-colors">Privacy</a></li>
                        </ul>
                    </div>
                </div>
                <!--UPPER FOOTER-->
        
                <!--BOTTOM FOOTER-->
                <div class="text-slate-400 pt-8 border-t border-slate-700 text-center text-sm">
                    &copy; 2026 ExpoVerse. All rights reserved.
                </div>
                <!--BOTTOM FOOTER-->
            </div>
        </footer>
    </div>
</template>