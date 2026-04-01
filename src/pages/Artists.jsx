import { useEffect } from 'react';
import './Artists.css';

const Artists = () => {

    useEffect(() => {
        // --- 1. Toast Notification System ---
        function showToast(message) {
            const container = document.getElementById('toast-container');
            if (!container) return;
            
            const toast = document.createElement('div');
            toast.className = `flex items-center gap-3 px-6 py-4 rounded shadow-2xl toast-animate pointer-events-auto bg-surface-container-highest border border-white/10`;
            toast.innerHTML = `
                <span class="material-symbols-outlined text-primary">info</span>
                <span class="text-xs font-headline font-bold uppercase tracking-widest text-white">${message}</span>
            `;
            
            container.appendChild(toast);
            
            // Auto remove after 3s
            setTimeout(() => {
                if(toast) {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateY(10px)';
                    toast.style.transition = 'all 0.3s ease';
                    setTimeout(() => toast.remove(), 300);
                }
            }, 3000);
        }

        // Bind Toasts to generic action buttons
        const actionBtns = document.querySelectorAll('.js-action-btn');
        actionBtns.forEach(btn => {
            // Remove previous event listeners in React strict mode by replacing cloned node if necessary, 
            // but for simplicity we'll just add it.
            btn.onclick = (e) => {
                e.preventDefault();
                const action = btn.getAttribute('data-action');
                if(action) showToast(action);
            };
        });

        // --- 2. Filtering & Search Logic ---
        const filterBtns = document.querySelectorAll('.js-filter-btn');
        const cards = document.querySelectorAll('.js-artist-card');
        const searchInput = document.getElementById('search-input');
        const noResults = document.getElementById('no-results');
        
        let currentFilter = 'all';
        let currentSearch = '';

        function updateGallery() {
            let visibleCount = 0;

            cards.forEach(card => {
                const styles = card.getAttribute('data-styles').toLowerCase();
                const name = card.querySelector('.js-artist-name').textContent.toLowerCase();
                
                const matchesFilter = (currentFilter === 'all') || styles.includes(currentFilter);
                const matchesSearch = name.includes(currentSearch) || styles.includes(currentSearch);

                if (matchesFilter && matchesSearch) {
                    card.style.display = 'block';
                    visibleCount++;
                    
                    // Re-trigger animation
                    card.classList.remove('animate-fade');
                    void card.offsetWidth; // force reflow
                    card.classList.add('animate-fade');
                } else {
                    card.style.display = 'none';
                }
            });

            // Handle No Results message
            if (noResults) {
                if(visibleCount === 0) {
                    noResults.classList.remove('hidden');
                } else {
                    noResults.classList.add('hidden');
                }
            }
        }

        // Filter Button Click
        filterBtns.forEach(btn => {
            btn.onclick = (e) => {
                // Reset all button styles
                filterBtns.forEach(b => {
                    b.className = "js-filter-btn bg-surface-container-low text-on-surface-variant px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-surface-container-high transition-all border border-white/5";
                });
                
                // Set active button style
                e.target.className = "js-filter-btn bg-primary text-black px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border border-transparent";
                
                currentFilter = e.target.getAttribute('data-filter');
                updateGallery();
            };
        });

        // Search Input
        if(searchInput) {
            searchInput.oninput = (e) => {
                currentSearch = e.target.value.toLowerCase().trim();
                updateGallery();
            };
        }

        // Prevent default link behavior for demo
        const links = document.querySelectorAll('a[href="#"]');
        links.forEach(link => {
            link.onclick = e => e.preventDefault();
        });

    }, []);

    return (
        <div className="dark bg-surface text-on-surface font-body overflow-x-hidden w-full min-h-screen">
            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
                {/* Gallery Header */}
                <section className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <span className="text-xs uppercase tracking-[0.3em] text-primary mb-4 block font-bold">Curated Masters</span>
                            <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                                Explore the <br/><span className="text-on-surface-variant/40">Collective</span>
                            </h1>
                        </div>
                        <div className="flex gap-4 border-l border-white/5 pl-8 hidden lg:flex">
                            <div className="text-right flex flex-col justify-end">
                                <span className="text-[0.65rem] uppercase tracking-widest text-on-surface-variant mb-0.9">Availability</span>
                                <span className="font-headline font-bold text-lg m-0">Next 48h</span>
                            </div>
                            <div className="text-right flex flex-col justify-end">
                                <span className="text-[0.65rem] uppercase tracking-widest text-on-surface-variant mb-0.9">Total Residencies</span>
                                <span className="font-headline font-bold text-lg m-0">24 Masters</span>
                            </div>
                        </div>
                    </div>

                    {/* Search Input was on header, let's put it here so it's usable without the old navbar */}
                    <div className="mt-6 flex items-center justify-start">
                        <div className="relative group w-full sm:w-80">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                            <input id="search-input" className="bg-surface-container-highest border border-white/5 text-xs py-3 pl-10 pr-4 w-full focus:ring-1 focus:ring-primary/50 rounded-lg text-white outline-none placeholder-on-surface-variant transition-all hover:bg-surface-container" placeholder="Search talent..." type="text"/>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mt-8 flex flex-wrap gap-3 overflow-x-auto no-scrollbar pb-2" id="filters-container">
                        <button className="js-filter-btn bg-primary text-black px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border border-transparent" data-filter="all">All Styles</button>
                        <button className="js-filter-btn bg-surface-container-low text-on-surface-variant px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-surface-container-high transition-all border border-white/5" data-filter="blackwork">Blackwork</button>
                        <button className="js-filter-btn bg-surface-container-low text-on-surface-variant px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-surface-container-high transition-all border border-white/5" data-filter="fine line">Fine Line</button>
                        <button className="js-filter-btn bg-surface-container-low text-on-surface-variant px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-surface-container-high transition-all border border-white/5" data-filter="realism">Realism</button>
                        <button className="js-filter-btn bg-surface-container-low text-on-surface-variant px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-surface-container-high transition-all border border-white/5" data-filter="cyber-sigilism">Cyber-Sigilism</button>
                        <button className="js-filter-btn bg-surface-container-low text-on-surface-variant px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-surface-container-high transition-all border border-white/5" data-filter="traditional">Traditional</button>
                    </div>
                </section>

                {/* Artist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" id="artist-grid">
                    
                    {/* Artist Card 1 */}
                    <div className="js-artist-card group relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-container-low border border-white/5" data-styles="geometric blackwork">
                        <img className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3H3y9GeTW4OAoue3nlCZFFMWIslcgn03150j39WSB3w3Uxywk4qMZBDChio8rnVQ_u9oHs62kXeG7tlujZsnMH_Nf1d0shewFsTbJ1xfnZ-pwZcm2tHZZmQ5117paQ9vMg2dbywvmcg7VYcBaVlqZSViZB2a9ha-4P74SOG3nlTqFfse9VMU5X8G5VxjqejFUa5rT2Q1ZGhfW49D3NxNTDcx2CdNdG91ZqNmLhHk6IQDAB8J0lALfhEBWwzJbzM9E1Hr6Qj0Gs4Y" alt="cover"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
                        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden p-0.5 bg-black">
                                    <img className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0RWChJ3ZezIjmamuir6-G9JIn9jV2x5TXnDudza71VtxkA-48xN8hNQWsmZWDpDXu3nFmQXiqN1lLAu769k_MW9jy2LWbSnXaPp9JODp5pgn65NABKG0gqOpqbetZD9PcXKjCj8PnvViPhCGt41Zo70QGjf1_HOXAEcyDf2bDDzyQ2NJooe7xmE8Y9byL97nNf4CJkRBu7yucA51RBZLwYap-qdpluJDzf5Bl4mzDwZQpIOSNOSQcyXs6Pw19O207Kx-L30V7DoI" alt="avatar"/>
                                </div>
                                <div>
                                    <h3 className="js-artist-name font-headline font-bold text-xl tracking-tight text-white shadow-black">Kaelen Voss</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">4.9 • 120 Sessions</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex flex-wrap gap-1.5 mb-6 justify-start items-center">
                                <span className="text-[9px] uppercase tracking-widest bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-on-surface-variant">Geometric</span>
                                <span className="text-[9px] uppercase tracking-widest bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-on-surface-variant">Blackwork</span>
                            </div>
                            <button className="js-action-btn noir-gradient-btn w-full py-4 text-black font-headline font-black uppercase tracking-widest text-xs rounded-lg shadow-lg active:scale-[0.98] transition-all" data-action="Loading Profile: Kaelen Voss">
                                Ver Perfil e Agendar
                            </button>
                        </div>
                    </div>

                    {/* Artist Card 2 */}
                    <div className="js-artist-card group relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-container-low border border-white/5" data-styles="micro-realism anatomy realism">
                        <img className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAANqXKIPGMmhSmTd9VcclGAFnXntx7NP9tDXv8CELfGjDLXieb0YXgF6Xz4DJ-2kYblJtPXz2DHW9qdiyRvpogM9SrVqc22J9BhS4DOrtiCRCsYyocRf0uRRBJ6kO4nIaBARBHAjV4gvY8E7Ld6rdHivTGQPW98t27zMzhvcFVqezauXqxd_NcQJwsSScC7UhbCpERNUaEpGYKH0qSRx0UeGKKTikwNKov5C71fmKLqaOwVh6VQZ_qfL9UBGC6RGtX4wbgqsxFh8M" alt="cover"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
                        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden p-0.5 bg-black">
                                    <img className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkJvRdd9MAGTQxXs49GHVdyfjSYZPX7BcJHW9p5LDROFUeW-Mte2Gy8vRA8rkBUi42k8YXOWMuDfFem527ZdgU2RgaB5BG3iq8z2x2gFZpXC9aRevJHnocIXkinO6fioD130lHnkXhgmVmLxYlQoGMoZPRjfc1DKvvfUSnJ8vrjuVicJpJQ-eAffej1KosrMbmGArjKd82yLJZ0koJMytGfSYy2iRLC8sY2YYQ2ip0Q3hRQknT4aBI8Xo0XlIl2BRyilxvn7kmTBg" alt="avatar"/>
                                </div>
                                <div>
                                    <h3 className="js-artist-name font-headline font-bold text-xl tracking-tight text-white">Marcus Thorne</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">5.0 • 85 Sessions</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex flex-wrap gap-1.5 mb-6 justify-start items-center">
                                <span className="text-[9px] uppercase tracking-widest bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-on-surface-variant">Micro-Realism</span>
                                <span className="text-[9px] uppercase tracking-widest bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-on-surface-variant">Anatomy</span>
                            </div>
                            <button className="js-action-btn noir-gradient-btn w-full py-4 text-black font-headline font-black uppercase tracking-widest text-xs rounded-lg shadow-lg active:scale-[0.98] transition-all" data-action="Loading Profile: Marcus Thorne">
                                Ver Perfil e Agendar
                            </button>
                        </div>
                    </div>

                    {/* Artist Card 3 */}
                    <div className="js-artist-card group relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-container-low border border-white/5" data-styles="fine line botanical">
                        <img className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnohC7qZ06xxzdjgZ064omWIIw1CHcuAf5DHpU9Adg-44wwZrqME0eqnLaQGklP2MFnXvCM0YEt5CiKVoaf0uhkQMrnXnxShKhsreF2OMHl7y1UI9TWLSafwxUz5R-jN53dh7teDaDYvxtHUbe5VADuyFicwUWR-o5XqrKz_R_dnXYWJkT-W4UfWbhnRWiyWlpNypSije8CP1l6gg_vula0gRuWgYOlNdKvnkzcHGDdz9gZ_ydJYrXE023k2L5aDZE-OVfhYBUqp4" alt="cover"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
                        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden p-0.5 bg-black">
                                    <img className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBuB1-4mAh5HDYbszVqX7BNT8pAcsL80jKnU2LR3UgJVaoZy2Y9PfVn_2NIVCf2lLPk6qIQ-UG2yyQMky_LaOT2Zwea3_Ww2t1d_xY9IqpSZxxeWNIL0Q8ANardISDtHvMp8xsCVC0zGEhmRD0DRtAmP5OP3uaRjK-Ulht3ffeXn2TshysEbcENDkQGv4Q28NJYpjBDFW7PmZsZL_MXPCEwhPzql7Ric8T2pS7i_9BJ424y7bYbC6PvBs7ed6qVpMAZgoYmLz65GA" alt="avatar"/>
                                </div>
                                <div>
                                    <h3 className="js-artist-name font-headline font-bold text-xl tracking-tight text-white">Elena Moretti</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">4.8 • 210 Sessions</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex flex-wrap gap-1.5 mb-6 justify-start items-center">
                                <span className="text-[9px] uppercase tracking-widest bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-on-surface-variant">Fine Line</span>
                                <span className="text-[9px] uppercase tracking-widest bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-on-surface-variant">Botanical</span>
                            </div>
                            <button className="js-action-btn noir-gradient-btn w-full py-4 text-black font-headline font-black uppercase tracking-widest text-xs rounded-lg shadow-lg active:scale-[0.98] transition-all" data-action="Loading Profile: Elena Moretti">
                                Ver Perfil e Agendar
                            </button>
                        </div>
                    </div>

                    {/* Artist Card 4 */}
                    <div className="js-artist-card group relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-container-low border border-white/5" data-styles="cyber-sigilism neo-goth">
                        <img className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjr-tzFQbfGN81NbsyF5GASVzI_uUlIRLw5YwLtnB9AHBXNBY-dIJ9dLNPyW1991FougHtJ00xYteuYl3_6cXWe88Axfvrq3h6CyYny_NK0V7S1315ZHSztsu1sSLd-gn0MZL1AUlI7tukmSGgEzESWW_7O2lyBok1mtPW3-lHI2rAlyeA4LXbowI9aapS3GYfOz-oLON4sMs1aYTHK4HtmzC6j-Bnd-qok_BC-YZ1ofxlHU9eSB7OTfCMg3e3uki45xJS7fZGCP8" alt="cover"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
                        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden p-0.5 bg-black">
                                    <img className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhnu3fbGpjUhr3g3rF2hgkJBCBFFidOLOCLyJ2UvaQudL110WJf9V18IOGMitm1gHWmPc2b-gXezvJAbn3IrGglabAvlKqV-9Tfs-h4v6-qbhSFv_CaTgJ6pU-1zdC-T_CUAyHW4p0eAOyQ3rFoXVsB_rViI5Xl4C6C2h-iI5p0lQU8bzwJrIOKpm1Ydux6LyoOMtL4As6hHsjI2wkJDe0OXutkJG5Aa52_WOWRO_XxmV-IP9pN72QQVuZuRAjjEWVdplzHg-aeYw" alt="avatar"/>
                                </div>
                                <div>
                                    <h3 className="js-artist-name font-headline font-bold text-xl tracking-tight text-white">Xavi Noir</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">4.9 • 54 Sessions</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex flex-wrap gap-1.5 mb-6 justify-start items-center">
                                <span className="text-[9px] uppercase tracking-widest bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-on-surface-variant">Cyber-Sigilism</span>
                                <span className="text-[9px] uppercase tracking-widest bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-on-surface-variant">Neo-Goth</span>
                            </div>
                            <button className="js-action-btn noir-gradient-btn w-full py-4 text-black font-headline font-black uppercase tracking-widest text-xs rounded-lg shadow-lg active:scale-[0.98] transition-all" data-action="Loading Profile: Xavi Noir">
                                Ver Perfil e Agendar
                            </button>
                        </div>
                    </div>

                    {/* Artist Card 5 */}
                    <div className="js-artist-card group relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-container-low border border-white/5" data-styles="irezumi traditional">
                        <img className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZqlE4HkUpo7RbFgOTRfukEH_uFL4m1F0qNA2zZNj0Q9kYCa8HU_y9zywivTtPiZRaLNW93Ad4MlqAIHE_ugb_zmRgz6vEErAHv8RGVv2POnDBqfNDKw4JnZSK4NAaWHCqnR16kqTlfJ5dmzpcNXEknXDRcWgaYuCGizVEbsrnlC_Tya2LNbV1pBlxLB3KFAiuNdC2_FyCf4Lw2Pmm5jIi3SQK4fiDKYqsYBNXgcN_u0oRD2p-eJyZwO3kVE2tscUyCrH2-rLcKE0" alt="cover"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
                        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden p-0.5 bg-black">
                                    <img className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBImotENGIjgKKVZoXmt-GF9vFU_ZeBRS325oX6i-bwKmhGYTWHl55KWwssUcB-p66G5lKbeuSUJQfHwQOuNjwU_n6xsyFCe-ghMP2wUynRvh5bmRUWTE38ex8wJZyElOg4QahBmvwwLoOVMnpngwVmhq4Rd8NwhIuIP0cIXnqeT9EnKQ9bJ4DRPue5Q3AAHvjoe5VZB6a_arDU9QX9FQVPMvoRtSSwv6SAYYLcnRmps-CmY7cum0b3xWt9d1BxMTCbQA7QKSGBPCY" alt="avatar"/>
                                </div>
                                <div>
                                    <h3 className="js-artist-name font-headline font-bold text-xl tracking-tight text-white">Miko Sato</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">5.0 • 312 Sessions</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex flex-wrap gap-1.5 mb-6 justify-start items-center">
                                <span className="text-[9px] uppercase tracking-widest bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-on-surface-variant">Irezumi</span>
                                <span className="text-[9px] uppercase tracking-widest bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-on-surface-variant">Traditional</span>
                            </div>
                            <button className="js-action-btn noir-gradient-btn w-full py-4 text-black font-headline font-black uppercase tracking-widest text-xs rounded-lg shadow-lg active:scale-[0.98] transition-all" data-action="Loading Profile: Miko Sato">
                                Ver Perfil e Agendar
                            </button>
                        </div>
                    </div>

                    {/* Artist Card 6 */}
                    <div className="js-artist-card group relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-container-low border border-white/5" data-styles="abstract minimalist blackwork">
                        <img className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOflRY2K-4AycJjwbP0NmpEr-MEJeJuE3QGnN7d4Nt0wY7bdLV5qvQmvsRpDSihRlVqEf31_gUhueVvaYL3Koa6iRIWcUgpMXyvYjVGou827i7VvHNuiZ0-c-DM4HsY83MOFkDXuf6szy2u_qla6f2Y-5neO1tNwgYIfpp-ocLPsFI3XZ9AXtpXsyu7fD9zxO8aYKd_zjFVqNjiJf6QCyHrFbnFEl2IsNwGkaeKHxVltU3CshYp1aRMULoSsP2tYVhDf4z4P9cdC4" alt="cover"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
                        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden p-0.5 bg-black">
                                    <img className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYOoXhRQR6TYWTt0XA3fHLNd69RNJKrVQ1WG7RN4vAQ0BAUiESe3MerfCxrlf1lMrJliaATWQ7lCmHDFyzkd1OyJ1s7qo3TC6Sq4hZffeEQE3ZqWF6t2qzyMQGs0xSfNzwoBbtfbe1b8zWZa78507bhi3ZgaaERQoY5UiQ-zP5XdBvB1XzzVI7hl6lCyn_f8Ymh8KjaCGCAYdgxDlQobIKGHaT3I984sNjmbx5vEHgaScvr-EMSlpRinRMqFpbMJHYbwJb9-tPH8o" alt="avatar"/>
                                </div>
                                <div>
                                    <h3 className="js-artist-name font-headline font-bold text-xl tracking-tight text-white">Julian Graves</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">4.7 • 142 Sessions</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex flex-wrap gap-1.5 mb-6 justify-start items-center">
                                <span className="text-[9px] uppercase tracking-widest bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-on-surface-variant">Abstract</span>
                                <span className="text-[9px] uppercase tracking-widest bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-on-surface-variant">Minimalist</span>
                            </div>
                            <button className="js-action-btn noir-gradient-btn w-full py-4 text-black font-headline font-black uppercase tracking-widest text-xs rounded-lg shadow-lg active:scale-[0.98] transition-all" data-action="Loading Profile: Julian Graves">
                                Ver Perfil e Agendar
                            </button>
                        </div>
                    </div>
                </div>

                {/* No Results Message */}
                <div id="no-results" className="hidden text-center py-20">
                    <span className="material-symbols-outlined text-4xl text-surface-container-highest mb-4">search_off</span>
                    <h3 className="text-xl font-headline font-bold text-on-surface-variant uppercase tracking-widest">No artists found</h3>
                    <p className="text-sm text-outline mt-2">Try adjusting your search or filters.</p>
                </div>

                {/* Pagination / Load More */}
                <div className="mt-20 flex flex-col items-center">
                    <button className="js-action-btn group flex items-center gap-4 text-on-surface-variant hover:text-primary transition-colors" data-action="Loading More Masters...">
                        <span className="text-xs uppercase font-bold tracking-[0.4em]">Curate More Talent</span>
                        <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">expand_more</span>
                    </button>
                    <div className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                </div>

            </main>

            {/* Toast Container for dynamic injection */}
            <div id="toast-container" className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none"></div>
        </div>
    );
}

export default Artists;
