'use client';

import { useEffect, useState } from 'react';
import { adminApi, productsApi } from '@/lib/api';
import type { Product, ProductAdminRequest } from '@/types';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/components/Toast';
import { Spinner, PageLoader } from '@/components/Spinner';
import { Modal } from '@/components/ui/Modal';
import {
    Plus, Edit2, Package, Check, X, Search,
    Trash2, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState<ProductAdminRequest>({
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        category: 'ELECTRONICS',
        active: true,
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await productsApi.list({ size: 100, active: undefined }); // Fetch all for admin
            setProducts(data.content);
        } catch {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: 0,
            stockQuantity: 0,
            category: 'ELECTRONICS',
            active: true,
        });
        setModalOpen(true);
    };

    const handleOpenEdit = (p: Product) => {
        setEditingProduct(p);
        setFormData({
            name: p.name,
            description: p.description,
            price: p.price,
            stockQuantity: p.stockQuantity,
            category: p.category,
            active: p.active,
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (editingProduct) {
                await adminApi.updateProduct(editingProduct.id, formData);
                toast.success('Product updated');
            } else {
                await adminApi.createProduct(formData);
                toast.success('Product created');
            }
            setModalOpen(false);
            fetchData();
        } catch {
            toast.error('Operation failed');
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">Product Inventory</h1>
                    <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest">Administrator Control Panel</p>
                </div>
                <button onClick={handleOpenCreate} className="btn-primary gap-2 h-14 px-8 shadow-violet-500/20">
                    <Plus className="h-5 w-5" />
                    Create New Product
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-wider">Product</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-wider">Category</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-wider text-right">Price</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-wider text-center">Stock</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] uppercase font-black text-slate-500 tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map((p) => (
                                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 group-hover:text-violet-400 group-hover:border-violet-500/30 transition-all">
                                                <Package className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm truncate max-w-[200px]">{p.name}</p>
                                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{p.id.split('-')[0]}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[10px] uppercase font-black px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-400">
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right font-bold text-slate-300">
                                        {formatPrice(p.price)}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`text-sm font-bold ${p.stockQuantity <= 5 ? 'text-orange-400 animate-pulse' : 'text-slate-400'}`}>
                                            {p.stockQuantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex justify-center">
                                            {p.active ? (
                                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                                                    <Check className="h-3 w-3" /> Active
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20">
                                                    <X className="h-3 w-3" /> Inactive
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => handleOpenEdit(p)}
                                            className="h-10 w-10 inline-flex items-center justify-center rounded-xl text-slate-500 hover:text-violet-400 hover:bg-violet-400/10 transition-all"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && (
                        <div className="p-20 text-center">
                            <p className="text-slate-500">No products found in the nexus.</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingProduct ? 'Modify Product' : 'Initialize New Product'}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">Name</label>
                            <input
                                required
                                className="input-field"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">Category</label>
                            <select
                                className="input-field"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="ELECTRONICS">Electronics</option>
                                <option value="CLOTHING">Clothing</option>
                                <option value="FOOD">Food</option>
                                <option value="BOOKS">Books</option>
                                <option value="SPORTS">Sports</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">Description</label>
                        <textarea
                            className="input-field min-h-[100px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="input-field"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">Stock</label>
                            <input
                                type="number"
                                required
                                className="input-field"
                                value={formData.stockQuantity}
                                onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1">Status</label>
                            <div className="flex h-[50px] items-center gap-4 px-4 rounded-xl bg-white/5 border border-white/10">
                                <span className="text-sm text-slate-400">Active</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, active: !formData.active })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.active ? 'bg-violet-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.active ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <button disabled={formLoading} className="btn-primary w-full h-14 mt-4">
                        {formLoading ? <Spinner className="text-white" /> : (editingProduct ? 'Commit Changes' : 'Create Product')}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
