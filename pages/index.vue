<template>
    <div class="min-h-screen bg-gray-900">
        <Navbar />
        
        <!-- Hero Section -->
        <section class="py-16 md:py-24 px-6">
            <div class="max-w-7xl mx-auto">
                <div class="flex flex-col md:flex-row items-center gap-12">
                    <div class="md:w-1/2">
                        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            <span class="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                                Advanced Fraud Detection
                            </span> 
                            for Modern Businesses
                        </h1>
                        <p class="text-gray-300 text-lg mb-8">
                            Protect your business with our AI-powered fraud detection system. Real-time monitoring, 
                            advanced analytics, and comprehensive reporting to keep your transactions secure.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4">
                            <button class="bg-gradient-to-r from-green-500 to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition">
                                Get Started
                            </button>
                            <button class="border border-green-500 text-green-400 font-semibold px-6 py-3 rounded-lg hover:bg-green-500/10 transition">
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div class="md:w-1/2">
                        <div class="relative">
                            <div class="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-600 rounded-lg blur opacity-75"></div>
                            <div class="relative bg-gray-800 p-6 rounded-lg shadow-xl">
                                <img src="/front.jpg" alt="Fraud Detection Dashboard" class="rounded w-full">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-16 px-6 bg-gray-800/50">
            <div class="max-w-7xl mx-auto">
                <h2 class="text-3xl font-bold text-center mb-12 text-white">
                    Comprehensive <span class="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">Fraud Protection</span>
                </h2>
                
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-300">
                        <div class="bg-gradient-to-br from-green-500 to-emerald-700 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-2">AI-Powered Detection</h3>
                        <p class="text-gray-400">Advanced machine learning algorithms that adapt to new fraud patterns in real-time.</p>
                    </div>
                    
                    <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-300">
                        <div class="bg-gradient-to-br from-green-500 to-emerald-700 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-2">Comprehensive Reports</h3>
                        <p class="text-gray-400">Detailed analytics and insights to understand fraud attempts and protect your business.</p>
                    </div>
                    
                    <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-300">
                        <div class="bg-gradient-to-br from-green-500 to-emerald-700 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-2">API Integration</h3>
                        <p class="text-gray-400">Seamless integration with your existing systems via our robust API endpoints.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-16 px-6">
            <div class="max-w-4xl mx-auto text-center">
                <div class="bg-gradient-to-r from-gray-800 to-gray-900 p-8 md:p-12 rounded-xl border border-gray-700 relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-700/20"></div>
                    <div class="relative z-10">
                        <h2 class="text-3xl font-bold text-white mb-4">Ready to secure your business?</h2>
                        <p class="text-gray-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of businesses that trust our fraud detection platform to protect their transactions and customers.
                        </p>
                        <button class="bg-gradient-to-r from-green-500 to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition">
                            Start Now
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>