import Link from 'next/link';
import { Package, Facebook, Twitter, Instagram, Linkedin, Globe, ShieldCheck } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-slate-900/50 backdrop-blur-xl pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-2 group w-fit">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg group-hover:shadow-violet-500/30 transition-shadow">
                                <Package className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tight">
                                Shopify<span className="text-violet-400">Pro</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 max-w-sm leading-relaxed">
                            Experience the future of premium e-commerce. We curate the finest 
                            products globally and deliver them with unparalleled speed and care.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialIcon Icon={Facebook} />
                            <SocialIcon Icon={Twitter} />
                            <SocialIcon Icon={Instagram} />
                            <SocialIcon Icon={Linkedin} />
                        </div>
                    </div>

                    {/* Links - Shop */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Shop</h4>
                        <ul className="space-y-4 text-sm">
                            <FooterLink href="/products">All Products</FooterLink>
                            <FooterLink href="/products?category=ELECTRONICS">Electronics</FooterLink>
                            <FooterLink href="/products?category=FASHION">Fashion</FooterLink>
                            <FooterLink href="/products?category=ACCESSORIES">New Arrivals</FooterLink>
                        </ul>
                    </div>

                    {/* Links - Company */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm">
                            <FooterLink href="#">About Us</FooterLink>
                            <FooterLink href="#">Careers</FooterLink>
                            <FooterLink href="#">Privacy Policy</FooterLink>
                            <FooterLink href="#">Terms of Service</FooterLink>
                        </ul>
                    </div>

                    {/* Links - Support */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Support</h4>
                        <ul className="space-y-4 text-sm">
                            <FooterLink href="#">Help Center</FooterLink>
                            <FooterLink href="#">Shipping Info</FooterLink>
                            <FooterLink href="#">Returns</FooterLink>
                            <FooterLink href="#">Contact Us</FooterLink>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-xs font-medium uppercase tracking-widest">
                    <p>© 2026 ShopifyPro Inc. All rights reserved.</p>
                    
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <Globe className="h-3.5 w-3.5" />
                            <span>English (US)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>Payment Verified</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ Icon }: { Icon: any }) {
    return (
        <a href="#" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-violet-600 transition-all">
            <Icon className="h-5 w-5" />
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="text-slate-400 hover:text-violet-400 transition-colors">
                {children}
            </Link>
        </li>
    );
}
